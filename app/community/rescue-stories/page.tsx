import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Metadata } from 'next'
import type { RescueStory } from '@/lib/types'

export const metadata: Metadata = {
  title: 'Rescue Stories',
  description: 'Real rescue stories from our community — one paw at a time.',
}

export const revalidate = 3600

const ANIMAL_EMOJIS: Record<string, string> = {
  dog: '🐶',
  cat: '🐱',
  rabbit: '🐰',
  bird: '🐦',
  hamster: '🐹',
  guinea: '🐾',
  horse: '🐴',
  other: '🐾',
}

function animalEmoji(type: string) {
  const key = Object.keys(ANIMAL_EMOJIS).find((k) => type.toLowerCase().includes(k))
  return key ? ANIMAL_EMOJIS[key] : '🐾'
}

export default async function RescueStoriesPage() {
  const supabase = createClient()

  const { data: stories } = await supabase
    .from('rescue_stories')
    .select('*, author:users(full_name)')
    .eq('status', 'approved')
    .order('published_at', { ascending: false })

  return (
    <div className="pt-16 min-h-screen">
      <div className="bg-gradient-to-b from-[var(--cream)] to-[var(--white)] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-body text-sm text-[var(--pink)] uppercase tracking-widest mb-3 font-medium">
            Community
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-[var(--charcoal)] mb-4">
            Rescue Stories
          </h1>
          <p className="font-body text-base text-[#6B5B52] max-w-md mx-auto mb-8">
            Real stories from real babes who made a difference, one animal at a time.
          </p>
          <Link href="/community/rescue-stories/submit" className="btn-pink">
            Share your story 📖
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {stories && stories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(stories as RescueStory[]).map((story, i) => (
              <Link
                key={story.id}
                href={`/community/rescue-stories/${story.slug ?? story.id}`}
                className="card p-6 flex flex-col gap-3 hover:shadow-lg transition-shadow group"
              >
                <div className="text-4xl">{animalEmoji(story.animal_type)}</div>
                <div>
                  <span className="text-xs font-body font-medium px-2.5 py-1 rounded-full bg-[var(--cream)] text-[#6B5B52] capitalize">
                    {story.animal_type}
                  </span>
                </div>
                <h3 className="font-display text-xl text-[var(--charcoal)] group-hover:text-[var(--pink)] transition-colors leading-tight">
                  {story.story_title}
                </h3>
                <p className="font-body text-sm text-[#6B5B52] line-clamp-3 flex-1">
                  {story.story_content?.slice(0, 200)}…
                </p>
                <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#F0E8E0]">
                  <p className="text-xs font-body text-[#B0A090]">
                    {story.author_name ?? (story.author as any)?.full_name ?? 'Anonymous'}
                  </p>
                  <p className="text-xs font-body text-[#B0A090]">
                    {story.published_at
                      ? new Date(story.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 card">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="font-display text-2xl text-[var(--charcoal)] mb-2">No stories yet</h3>
            <p className="font-body text-sm text-[#8B7B72] mb-6">Be the first to share your rescue story!</p>
            <Link href="/community/rescue-stories/submit" className="btn-primary">
              Share my story
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
