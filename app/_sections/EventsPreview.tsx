'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import EventCard from '@/components/EventCard'
import type { Event } from '@/lib/types'

export default function EventsPreview({ events }: { events: Event[] }) {
  if (events.length === 0) return null

  return (
    <section className="py-20 bg-[var(--white)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-body text-sm text-[var(--pink)] uppercase tracking-widest mb-2 font-medium"
            >
              What&apos;s Coming Up
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-title"
            >
              Upcoming Events
            </motion.h2>
          </div>
          <Link href="/events" className="hidden md:flex items-center gap-2 text-sm font-body font-medium text-[var(--charcoal)] hover:text-[var(--pink)] transition-colors">
            See all events
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link href="/events" className="btn-secondary">
            See all events
          </Link>
        </div>
      </div>
    </section>
  )
}
