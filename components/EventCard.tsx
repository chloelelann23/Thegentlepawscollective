'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Event } from '@/lib/types'
import ProgressBar from './ui/ProgressBar'
import DriveImage from './DriveImage'

interface EventCardProps {
  event: Event
  index?: number
  hasRsvp?: boolean
  onRsvp?: (eventId: string) => void
  loading?: boolean
}

function PawIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="inline-block">
      <circle cx="7" cy="4" r="2"/>
      <circle cx="17" cy="4" r="2"/>
      <circle cx="4" cy="10" r="2"/>
      <circle cx="20" cy="10" r="2"/>
      <path d="M12 22c-4 0-7-3-7-6s2-4 4-4h6c2 0 4 1 4 4s-3 6-7 6z"/>
    </svg>
  )
}

export default function EventCard({ event, index = 0, hasRsvp, onRsvp, loading }: EventCardProps) {
  const spotsLeft = event.spots_total ? event.spots_total - event.spots_filled : null
  const isFull = spotsLeft !== null && spotsLeft <= 0
  const dateObj = new Date(event.date)
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="card group hover:shadow-soft-lg transition-all duration-300"
    >
      <Link href={`/events/${event.slug}`} className="block">
        <div className="relative h-56 overflow-hidden">
          <DriveImage
            drivePath={event.cover_image_drive_path}
            alt={event.title}
            fill
            fallbackSrc={`https://picsum.photos/seed/event-${event.id}/700/420`}
            className="group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`text-xs font-body font-medium px-2.5 py-1 rounded-full ${
              event.type === 'virtual'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-[var(--pink)]/90 text-[var(--charcoal)]'
            }`}>
              {event.type === 'virtual' ? '💻 Virtual' : '📍 In-Person'}
            </span>
            {event.status === 'past' && (
              <span className="text-xs font-body font-medium px-2.5 py-1 rounded-full bg-[var(--charcoal)]/80 text-white">
                Past
              </span>
            )}
          </div>
          {isFull && (
            <div className="absolute top-3 right-3">
              <span className="text-xs font-body font-medium px-2.5 py-1 rounded-full bg-[var(--red)] text-white">
                Full
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <p className="text-xs font-body text-[var(--pink)] font-medium mb-1 uppercase tracking-wider">
          {formattedDate}
          {event.time && ` · ${event.time}`}
        </p>
        <Link href={`/events/${event.slug}`}>
          <h3 className="font-display text-xl text-[var(--charcoal)] mb-2 group-hover:text-[var(--pink)] transition-colors line-clamp-2">
            {event.title}
          </h3>
        </Link>
        {event.location && (
          <p className="text-sm font-body text-[#8B7B72] mb-3 flex items-center gap-1.5">
            <span>📍</span> {event.location}
          </p>
        )}

        {event.spots_total && (
          <div className="mb-4">
            <div className="flex justify-between text-xs font-body text-[#8B7B72] mb-1.5">
              <span className="flex items-center gap-1"><PawIcon /> Spots</span>
              <span className="font-medium text-[var(--charcoal)]">
                {spotsLeft} left of {event.spots_total}
              </span>
            </div>
            <ProgressBar value={event.spots_filled} max={event.spots_total} />
          </div>
        )}

        {event.status === 'upcoming' && (
          <button
            onClick={() => onRsvp?.(event.id)}
            disabled={isFull || loading}
            className={`w-full py-2.5 rounded-xl text-sm font-body font-medium transition-all duration-200 ${
              hasRsvp
                ? 'bg-[var(--cream)] text-[var(--charcoal)] border border-[var(--pink)]'
                : isFull
                ? 'bg-[#F0E8E0] text-[#B0A090] cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Loading...
              </span>
            ) : hasRsvp ? (
              '✓ RSVP&apos;d'
            ) : isFull ? (
              'Fully Booked'
            ) : (
              "I'm In 🐾"
            )}
          </button>
        )}
      </div>
    </motion.div>
  )
}
