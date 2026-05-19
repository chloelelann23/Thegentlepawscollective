'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import DriveImage from '@/components/DriveImage'
import type { Event } from '@/lib/types'

interface Props {
  event: Event & { badge?: any }
  recapPhotos: { id: string; thumbnailUrl: string; downloadUrl: string; name: string }[]
  submittedPhotos: any[]
  rsvpCount: number
}

export default function EventDetailClient({ event, recapPhotos, submittedPhotos, rsvpCount }: Props) {
  const [hasRsvp, setHasRsvp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [photoCaption, setPhotoCaption] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const dateObj = new Date(event.date)
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })
  const spotsLeft = event.spots_total ? event.spots_total - event.spots_filled : null

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUser(user)
      if (user) {
        const { data } = await supabase
          .from('event_rsvps')
          .select('id')
          .eq('user_id', user.id)
          .eq('event_id', event.id)
          .single()
        setHasRsvp(!!data)
      }
    })
  }, [event.id])

  async function handleRsvp() {
    if (!user) { window.location.href = `/auth/login?redirect=/events/${event.slug}`; return }
    setLoading(true)
    const supabase = createClient()

    if (hasRsvp) {
      await supabase.from('event_rsvps').delete().eq('user_id', user.id).eq('event_id', event.id)
      setHasRsvp(false)
    } else {
      const { error } = await supabase.from('event_rsvps').insert({ user_id: user.id, event_id: event.id })
      if (!error) {
        setHasRsvp(true)
        const { data: profile } = await supabase.from('users').select('points').eq('id', user.id).single()
        await supabase.from('users').update({ points: (profile?.points ?? 0) + 25 }).eq('id', user.id)
      }
    }
    setLoading(false)
  }

  return (
    <div className="pt-16 min-h-screen">
      {/* Cover image */}
      <div className="relative h-72 md:h-96 bg-[var(--cream)]">
        <DriveImage
          drivePath={event.cover_image_drive_path}
          alt={event.title}
          fill
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--charcoal)]/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 mb-3">
              <span className={`text-xs font-body font-medium px-2.5 py-1 rounded-full ${
                event.type === 'virtual' ? 'bg-purple-100 text-purple-700' : 'bg-[var(--pink)]/90 text-[var(--charcoal)]'
              }`}>
                {event.type === 'virtual' ? '💻 Virtual' : '📍 In-Person'}
              </span>
              <span className={`text-xs font-body font-medium px-2.5 py-1 rounded-full ${
                event.status === 'upcoming' ? 'bg-green-100 text-green-700' : 'bg-white/80 text-[var(--charcoal)]'
              }`}>
                {event.status === 'upcoming' ? 'Upcoming' : 'Past Event'}
              </span>
            </div>
            <h1 className="font-display text-3xl md:text-5xl text-white">{event.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2">
            {event.description && (
              <div className="prose-brand mb-8">
                <p className="text-base leading-7 text-[#4A3F38]">{event.description}</p>
              </div>
            )}

            {event.badge && (
              <div className="card-cream p-6 mb-8 flex items-center gap-4">
                <div className="text-4xl">{event.badge.emoji}</div>
                <div>
                  <p className="font-body text-xs text-[#8B7B72] uppercase tracking-wider mb-1">RSVP Badge</p>
                  <h4 className="font-display text-lg text-[var(--charcoal)]">{event.badge.name}</h4>
                  <p className="font-body text-xs text-[#8B7B72]">Attend this event to earn this badge!</p>
                </div>
              </div>
            )}

            {/* Photo gallery for past events */}
            {event.status === 'past' && recapPhotos.length > 0 && (
              <div className="mb-8">
                <h2 className="font-display text-2xl text-[var(--charcoal)] mb-4">Event Recap 📸</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {recapPhotos.map((photo, i) => (
                    <motion.a
                      key={photo.id}
                      href={photo.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06 }}
                      className="relative aspect-square rounded-2xl overflow-hidden group"
                    >
                      <Image
                        src={photo.thumbnailUrl}
                        alt={photo.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        unoptimized
                      />
                    </motion.a>
                  ))}
                </div>
              </div>
            )}

            {/* Submit photo */}
            {event.status === 'past' && user && (
              <div className="card p-6">
                <h3 className="font-display text-xl text-[var(--charcoal)] mb-4">Share a Photo 📷</h3>
                <input
                  type="text"
                  placeholder="Google Drive file ID (share the image from Drive and paste the file ID)"
                  className="input mb-3"
                  id="drive-file-id"
                />
                <input
                  type="text"
                  placeholder="Add a caption..."
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  className="input mb-4"
                />
                <button
                  className="btn-primary"
                  disabled={submitting}
                  onClick={async () => {
                    const fileIdInput = document.getElementById('drive-file-id') as HTMLInputElement
                    if (!fileIdInput.value) return
                    setSubmitting(true)
                    const supabase = createClient()
                    await supabase.from('event_photos').insert({
                      event_id: event.id,
                      drive_file_id: fileIdInput.value,
                      caption: photoCaption || null,
                      submitted_by: user.id,
                    })
                    const { data: profile } = await supabase.from('users').select('points').eq('id', user.id).single()
                    await supabase.from('users').update({ points: (profile?.points ?? 0) + 30 }).eq('id', user.id)
                    fileIdInput.value = ''
                    setPhotoCaption('')
                    setSubmitting(false)
                    alert('Photo submitted! +30 points earned 🎉')
                  }}
                >
                  Submit Photo (+30pts)
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card p-5 space-y-4">
              <div>
                <p className="text-xs font-body text-[#B0A090] uppercase tracking-wider mb-1">Date</p>
                <p className="font-body text-sm font-medium text-[var(--charcoal)]">{formattedDate}</p>
                {event.time && <p className="font-body text-sm text-[#6B5B52]">{event.time}</p>}
              </div>

              {event.location && (
                <div>
                  <p className="text-xs font-body text-[#B0A090] uppercase tracking-wider mb-1">Location</p>
                  <p className="font-body text-sm font-medium text-[var(--charcoal)] flex items-center gap-1">
                    📍 {event.location}
                  </p>
                </div>
              )}

              {event.spots_total && (
                <div>
                  <p className="text-xs font-body text-[#B0A090] uppercase tracking-wider mb-1">Spots</p>
                  <p className="font-body text-sm font-medium text-[var(--charcoal)]">
                    {spotsLeft !== null ? `${spotsLeft} of ${event.spots_total} available` : `${event.spots_total} total`}
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs font-body text-[#B0A090] uppercase tracking-wider mb-1">RSVPs</p>
                <p className="font-body text-sm font-medium text-[var(--charcoal)]">{rsvpCount} attending</p>
              </div>

              {event.status === 'upcoming' && (
                <button
                  onClick={handleRsvp}
                  disabled={loading || (!hasRsvp && spotsLeft === 0)}
                  className={`w-full py-3 rounded-xl font-body text-sm font-medium transition-all duration-200 ${
                    hasRsvp
                      ? 'bg-[var(--cream)] border border-[var(--pink)] text-[var(--charcoal)]'
                      : spotsLeft === 0
                      ? 'bg-[#F0E8E0] text-[#B0A090] cursor-not-allowed'
                      : 'btn-primary'
                  }`}
                >
                  {loading ? 'Loading...' : hasRsvp ? "✓ You're going!" : spotsLeft === 0 ? 'Fully Booked' : "I'm In! 🐾 (+25pts)"}
                </button>
              )}
            </div>

            <Link href="/events" className="btn-secondary w-full text-center block">
              ← All Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
