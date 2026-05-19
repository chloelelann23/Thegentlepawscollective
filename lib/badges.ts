import { createServiceClient } from './supabase/server'

export const BADGE_NAMES = {
  NEW_SPROUT: 'New Sprout',
  EVENT_STAR: 'Event Star',
  TOP_DONOR: 'Top Donor',
  RECAP_HERO: 'Recap Hero',
  AMBASSADOR: 'Ambassador',
  MATCHMAKER: 'Matchmaker',
  SUSTAINER: 'Sustainer',
  STORYTELLER: 'Storyteller',
} as const

export async function getBadgeByName(name: string) {
  const supabase = createServiceClient()
  const { data } = await supabase
    .from('badges')
    .select('*')
    .eq('name', name)
    .single()
  return data
}

export async function awardBadge(userId: string, badgeName: string): Promise<boolean> {
  const supabase = createServiceClient()

  const badge = await getBadgeByName(badgeName)
  if (!badge) return false

  const { error } = await supabase
    .from('user_badges')
    .insert({ user_id: userId, badge_id: badge.id })

  return !error
}

export async function checkAndAwardBadges(userId: string): Promise<string[]> {
  const supabase = createServiceClient()
  const awarded: string[] = []

  // Check cumulative donations for Top Donor ($500+)
  const { data: donations } = await supabase
    .from('donations')
    .select('amount')
    .eq('user_id', userId)

  const totalDonated = donations?.reduce((sum, d) => sum + Number(d.amount), 0) ?? 0
  if (totalDonated >= 500) {
    const ok = await awardBadge(userId, BADGE_NAMES.TOP_DONOR)
    if (ok) awarded.push(BADGE_NAMES.TOP_DONOR)
  }

  // Check event attendance (5+ events = Event Star)
  const { count: eventsAttended } = await supabase
    .from('event_rsvps')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  if ((eventsAttended ?? 0) >= 5) {
    const ok = await awardBadge(userId, BADGE_NAMES.EVENT_STAR)
    if (ok) awarded.push(BADGE_NAMES.EVENT_STAR)
  }

  // Check photo submissions (10+ = Recap Hero)
  const { count: photoCount } = await supabase
    .from('event_photos')
    .select('*', { count: 'exact', head: true })
    .eq('submitted_by', userId)

  if ((photoCount ?? 0) >= 10) {
    const ok = await awardBadge(userId, BADGE_NAMES.RECAP_HERO)
    if (ok) awarded.push(BADGE_NAMES.RECAP_HERO)
  }

  return awarded
}

export async function awardNewSproutBadge(userId: string): Promise<void> {
  await awardBadge(userId, BADGE_NAMES.NEW_SPROUT)
}

export async function awardAmbassadorBadge(userId: string): Promise<void> {
  await awardBadge(userId, BADGE_NAMES.AMBASSADOR)
}

export async function awardEventBadge(userId: string, eventId: string): Promise<void> {
  const supabase = createServiceClient()

  const { data: event } = await supabase
    .from('events')
    .select('badge_reward, badges(*)')
    .eq('id', eventId)
    .single()

  if (!event?.badge_reward) return

  await supabase
    .from('user_badges')
    .insert({ user_id: userId, badge_id: event.badge_reward })
}

export async function awardMatchmakerBadge(userId: string): Promise<void> {
  await awardBadge(userId, BADGE_NAMES.MATCHMAKER)
}

export async function awardSustainerBadge(userId: string): Promise<void> {
  await awardBadge(userId, BADGE_NAMES.SUSTAINER)
}

export async function awardStorytellerBadge(userId: string): Promise<void> {
  await awardBadge(userId, BADGE_NAMES.STORYTELLER)
}
