'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import EventCard from '@/components/EventCard'
import type { Event } from '@/lib/types'

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [pastEvents, setPastEvents] = useState<Event[]>([])
  const [rsvps, setRsvps] = useState<Set<string>>(new Set())
  const [loadingRsvp, setLoadingRsvp] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const [{ data: upcoming }, { data: past }] = await Promise.all([
        supabase.from('events').select('*').eq('status', 'upcoming').order('date'),
        supabase.from('events').select('*').eq('status', 'past').order('date', { ascending: false }),
      ])

      setEvents(upcoming ?? [])
      setPastEvents(past ?? [])

      if (user) {
        const { data: userRsvps } = await supabase
          .from('event_rsvps')
          .select('event_id')
          .eq('user_id', user.id)
        setRsvps(new Set(userRsvps?.map((r) => r.event_id) ?? []))
      }

      setLoading(false)
    }

    load()
  }, [])

  async function handleRsvp(eventId: string) {
    if (!user) {
      window.location.href = '/auth/login?redirect=/events'
      return
    }

    setLoadingRsvp(eventId)
    const supabase = createClient()

    if (rsvps.has(eventId)) {
      await supabase.from('event_rsvps').delete().eq('user_id', user.id).eq('event_id', eventId)
      setRsvps((prev) => { const next = new Set(prev); next.delete(eventId); return next })

      await supabase
        .from('events')
        .update({ spots_filled: (events.find((e) => e.id === eventId)?.spots_filled ?? 1) - 1 })
        .eq('id', eventId)
    } else {
      const { error } = await supabase.from('event_rsvps').insert({ user_id: user.id, event_id: eventId })
      if (!error) {
        setRsvps((prev) => new Set([...prev, eventId]))

        // Award points
        const currentPoints = (await supabase.from('users').select('points').eq('id', user.id).single()).data?.points ?? 0
        await supabase.from('users').update({ points: currentPoints + 25 }).eq('id', user.id)

        await supabase
          .from('events')
          .update({ spots_filled: (events.find((e) => e.id === eventId)?.spots_filled ?? 0) + 1 })
          .eq('id', eventId)
      }
    }

    setLoadingRsvp(null)
  }

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-b from-[var(--cream)] to-[var(--white)] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-body text-sm text-[var(--pink)] uppercase tracking-widest mb-3 font-medium"
          >
            Get Involved
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-5xl md:text-6xl text-[var(--charcoal)] mb-4"
          >
            Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-body text-base text-[#6B5B52] max-w-md mx-auto"
          >
            Show up, meet your people, and make a difference for animals in need. RSVP and earn points!
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Upcoming */}
        <section className="mb-20">
          <h2 className="font-display text-3xl text-[var(--charcoal)] mb-8 flex items-center gap-3">
            Upcoming Events
            {events.length > 0 && (
              <span className="text-sm font-body font-medium bg-[var(--pink)]/20 text-[var(--charcoal)] px-3 py-1 rounded-full">
                {events.length}
              </span>
            )}
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map((i) => (
                <div key={i} className="card h-80 animate-pulse">
                  <div className="h-48 bg-[var(--cream)]" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-[var(--cream)] rounded w-1/3" />
                    <div className="h-5 bg-[var(--cream)] rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-16 card">
              <div className="text-5xl mb-4">🐾</div>
              <h3 className="font-display text-2xl text-[var(--charcoal)] mb-2">No upcoming events</h3>
              <p className="font-body text-sm text-[#8B7B72]">Check back soon — we&apos;re always planning something!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, i) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={i}
                  hasRsvp={rsvps.has(event.id)}
                  onRsvp={handleRsvp}
                  loading={loadingRsvp === event.id}
                />
              ))}
            </div>
          )}
        </section>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section>
            <h2 className="font-display text-3xl text-[var(--charcoal)] mb-8">
              Past Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
