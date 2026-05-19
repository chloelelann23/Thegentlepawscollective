'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import EventCard from '@/components/EventCard'
import type { Event } from '@/lib/types'

const DEMO_EVENTS: Event[] = [
  {
    id: 'demo-1',
    title: 'Adoption Day at Riverside Park',
    slug: '#',
    description: "Come meet your new best friend! We're partnering with three local shelters to host a large-scale adoption event. Bring the whole family.",
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
    time: '10:00 AM – 3:00 PM',
    location: 'Riverside Park, Downtown',
    type: 'in-person',
    spots_total: 40,
    spots_filled: 24,
    badge_reward: null,
    cover_image_drive_path: null,
    status: 'upcoming',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    title: 'Foster Home 101 Workshop',
    slug: '#',
    description: 'New to fostering? Learn everything you need to know.',
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    time: '2:00 PM',
    location: 'Community Center, Room 4',
    type: 'in-person',
    spots_total: 20,
    spots_filled: 8,
    badge_reward: null,
    cover_image_drive_path: null,
    status: 'upcoming',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    title: 'Virtual Fundraising Kickoff',
    slug: '#',
    description: 'Join us online to kick off our biggest fundraising campaign of the year.',
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    time: '7:00 PM',
    location: 'Online (Zoom link sent on RSVP)',
    type: 'virtual',
    spots_total: null,
    spots_filled: 0,
    badge_reward: null,
    cover_image_drive_path: null,
    status: 'upcoming',
    created_at: new Date().toISOString(),
  },
]

function FeaturedEventCard({ event }: { event: Event }) {
  const dateObj = new Date(event.date)
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
  const spotsLeft = event.spots_total ? event.spots_total - event.spots_filled : null

  return (
    <Link href={`/events/${event.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        className="relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer group"
        style={{ height: '420px' }}
      >
        <Image
          src={`https://picsum.photos/seed/featured-event-${event.id}/900/600`}
          alt={event.title}
          fill
          style={{ objectFit: 'cover' }}
          className="group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

        <div className="absolute top-5 left-5">
          <span className={`font-body text-xs font-bold px-3 py-1.5 rounded-full ${
            event.type === 'virtual'
              ? 'bg-purple-500/90 text-white'
              : 'bg-[var(--pink)] text-[var(--charcoal)]'
          }`}>
            {event.type === 'virtual' ? '💻 Virtual' : '📍 In-Person'}
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10">
          <p className="font-body text-xs text-[var(--pink)] font-bold uppercase tracking-widest mb-2">
            {formattedDate}
            {event.time && ` · ${event.time}`}
          </p>
          <h3 className="font-display text-3xl lg:text-4xl text-white mb-2 leading-tight">
            {event.title}
          </h3>
          {event.location && (
            <p className="font-body text-white/65 text-sm mb-6">📍 {event.location}</p>
          )}
          <div className="flex items-center justify-between">
            <span className="bg-[var(--pink)] text-[var(--charcoal)] font-body font-bold text-sm px-6 py-2.5 rounded-full group-hover:bg-white transition-colors duration-200">
              RSVP Now 🐾
            </span>
            {spotsLeft !== null && (
              <span className="font-body text-xs text-white/65">
                {spotsLeft} spots remaining
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default function EventsPreview({ events }: { events: Event[] }) {
  const displayEvents = events.length > 0 ? events : DEMO_EVENTS
  const [featured, ...rest] = displayEvents

  return (
    <section className="py-24 bg-[var(--pink)]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-body text-xs text-[var(--charcoal)]/55 uppercase tracking-[0.2em] mb-3 font-bold"
            >
              What&apos;s Coming Up
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display font-light text-5xl md:text-6xl text-[var(--charcoal)]"
            >
              Upcoming Events
            </motion.h2>
          </div>
          <Link
            href="/events"
            className="hidden md:flex items-center gap-2 font-body text-sm font-bold text-[var(--charcoal)] bg-white/60 hover:bg-white px-5 py-2.5 rounded-full transition-all duration-200"
          >
            See all
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Magazine layout: featured + smaller stack */}
        <div className="grid lg:grid-cols-[3fr_2fr] gap-6">
          <FeaturedEventCard event={featured} />

          <div className="flex flex-col gap-6">
            {rest.slice(0, 2).map((event, i) => (
              <EventCard key={event.id} event={event} index={i + 1} />
            ))}
          </div>
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link href="/events" className="btn-primary">
            See all events
          </Link>
        </div>
      </div>
    </section>
  )
}
