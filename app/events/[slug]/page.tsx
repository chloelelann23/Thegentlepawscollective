import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import EventDetailClient from './EventDetailClient'
import { getFilesInFolder } from '@/lib/drive'

export const revalidate = 3600

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data: event } = await supabase
    .from('events')
    .select('title, description')
    .eq('slug', params.slug)
    .single()

  return {
    title: event?.title ?? 'Event',
    description: event?.description ?? undefined,
  }
}

export default async function EventDetailPage({ params }: Props) {
  const supabase = createClient()

  const { data: event } = await supabase
    .from('events')
    .select('*, badge:badges(*)')
    .eq('slug', params.slug)
    .single()

  if (!event) notFound()

  // Fetch recap gallery photos from Drive
  let recapPhotos: { id: string; thumbnailUrl: string; downloadUrl: string; name: string }[] = []
  if (event.status === 'past') {
    try {
      const files = await getFilesInFolder(['events', 'recaps', params.slug])
      recapPhotos = files.map((f) => ({
        id: f.id,
        thumbnailUrl: f.thumbnailUrl,
        downloadUrl: f.downloadUrl,
        name: f.name,
      }))
    } catch {}
  }

  // Get submitted photos from Supabase
  const { data: submittedPhotos } = await supabase
    .from('event_photos')
    .select('*, submitter:users(full_name)')
    .eq('event_id', event.id)
    .order('created_at', { ascending: false })

  // Get RSVP count
  const { count: rsvpCount } = await supabase
    .from('event_rsvps')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', event.id)

  return (
    <EventDetailClient
      event={event}
      recapPhotos={recapPhotos}
      submittedPhotos={submittedPhotos ?? []}
      rsvpCount={rsvpCount ?? 0}
    />
  )
}
