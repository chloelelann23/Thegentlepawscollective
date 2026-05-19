import { createClient } from '@/lib/supabase/server'
import HeroSection from './_sections/HeroSection'
import StatsBar from './_sections/StatsBar'
import EventsPreview from './_sections/EventsPreview'
import BlogPreview from './_sections/BlogPreview'
import CharitiesPreview from './_sections/CharitiesPreview'
import BadgesPreview from './_sections/BadgesPreview'
import RescueStoriesPreview from './_sections/RescueStoriesPreview'
import SocialSection from './_sections/SocialSection'

export const revalidate = 3600

export default async function HomePage() {
  const supabase = createClient()

  const [
    { data: events },
    { data: posts },
    { data: charities },
    { data: badges },
    { count: memberCount },
    { data: recentBadges },
    { data: rescueStories },
  ] = await Promise.all([
    supabase.from('events').select('*').eq('status', 'upcoming').order('date').limit(3),
    supabase.from('blog_posts').select('*, author:users(full_name)').order('published_at', { ascending: false }).limit(3),
    supabase.from('charities').select('*').order('raised_amount', { ascending: false }).limit(3),
    supabase.from('badges').select('*').limit(6),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('user_badges').select('*, badge:badges(*), user:users(full_name)').order('earned_at', { ascending: false }).limit(8),
    supabase.from('rescue_stories').select('*, author:users(full_name)').eq('status', 'approved').order('published_at', { ascending: false }).limit(3),
  ])

  const totalRaised = charities?.reduce((sum, c) => sum + Number(c.raised_amount), 0) ?? 0
  const { count: eventsCount } = await supabase.from('events').select('*', { count: 'exact', head: true })

  return (
    <>
      <HeroSection />
      <StatsBar
        totalRaised={totalRaised}
        totalMembers={memberCount ?? 0}
        totalCharities={charities?.length ?? 0}
        totalEvents={eventsCount ?? 0}
      />
      <EventsPreview events={events ?? []} />
      <CharitiesPreview charities={charities ?? []} />
      <RescueStoriesPreview stories={rescueStories as any ?? []} />
      <BlogPreview posts={posts ?? []} />
      <BadgesPreview badges={badges ?? []} recentBadges={recentBadges ?? []} />
      <SocialSection />
    </>
  )
}
