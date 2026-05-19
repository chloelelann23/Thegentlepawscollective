export type UserRole = 'member' | 'ambassador' | 'admin'
export type EventType = 'in-person' | 'virtual'
export type EventStatus = 'upcoming' | 'past'
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary'
export type BadgeTrigger = 'event_rsvp' | 'donation' | 'photo_submit' | 'manual' | 'join'

export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  points: number
  created_at: string
}

export interface Event {
  id: string
  title: string
  slug: string
  description: string | null
  date: string
  time: string | null
  location: string | null
  type: EventType
  spots_total: number | null
  spots_filled: number
  badge_reward: string | null
  cover_image_drive_path: string | null
  status: EventStatus
  created_at: string
}

export interface EventWithBadge extends Event {
  badge?: Badge | null
}

export interface EventRsvp {
  id: string
  user_id: string
  event_id: string
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  author_id: string | null
  tag: string | null
  cover_image_drive_path: string | null
  read_time: number
  published_at: string | null
  author?: User | null
}

export interface Charity {
  id: string
  name: string
  description: string | null
  animal_type: string | null
  emoji: string
  raised_amount: number
  goal_amount: number
  drive_image_path: string | null
  created_at: string
}

export interface Badge {
  id: string
  name: string
  emoji: string
  description: string | null
  rarity: BadgeRarity
  trigger_type: BadgeTrigger
  created_at: string
}

export interface UserBadge {
  id: string
  user_id: string
  badge_id: string
  earned_at: string
  badge?: Badge
}

export interface Donation {
  id: string
  user_id: string | null
  charity_id: string
  amount: number
  stripe_payment_intent_id: string
  created_at: string
  charity?: Charity
}

export interface EventPhoto {
  id: string
  event_id: string
  drive_file_id: string
  caption: string | null
  submitted_by: string | null
  created_at: string
}

export interface AmbassadorApplication {
  id: string
  user_id: string
  why_ambassador: string
  experience: string | null
  approved: boolean | null
  reviewed_at: string | null
  created_at: string
  user?: User
}

export interface InstagramPost {
  id: string
  media_url: string
  thumbnail_url?: string
  caption?: string
  permalink: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  timestamp: string
}

export interface TikTokEmbed {
  html: string
  title: string
  thumbnail_url: string
  author_name: string
}

export interface StatsBar {
  totalRaised: number
  totalMembers: number
  totalCharities: number
  totalEvents: number
}
