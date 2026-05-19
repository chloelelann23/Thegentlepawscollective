'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { RescueStory } from '@/lib/types'

const ANIMAL_EMOJIS: Record<string, string> = {
  dog: '🐶', cat: '🐱', rabbit: '🐰', bird: '🐦',
  hamster: '🐹', guinea: '🐾', horse: '🐴', other: '🐾',
}

function animalEmoji(type: string) {
  const key = Object.keys(ANIMAL_EMOJIS).find((k) => type.toLowerCase().includes(k))
  return key ? ANIMAL_EMOJIS[key] : '🐾'
}

export default function RescueStoriesPreview({ stories }: { stories: RescueStory[] }) {
  if (!stories || stories.length === 0) return null

  return (
    <section className="py-20 bg-[var(--cream)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="font-body text-sm text-[var(--pink)] uppercase tracking-widest mb-2 font-medium">
              Community
            </p>
            <h2 className="font-display text-4xl text-[var(--charcoal)]">Rescue Stories</h2>
          </div>
          <Link href="/community/rescue-stories" className="btn-ghost hidden md:inline-block">
            All stories →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stories.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/community/rescue-stories/${story.slug ?? story.id}`}
                className="card p-6 flex flex-col gap-3 h-full hover:shadow-lg transition-shadow group"
              >
                <div className="text-3xl">{animalEmoji(story.animal_type)}</div>
                <h3 className="font-display text-xl text-[var(--charcoal)] group-hover:text-[var(--pink)] transition-colors leading-snug">
                  {story.story_title}
                </h3>
                <p className="font-body text-sm text-[#6B5B52] line-clamp-3 flex-1">
                  {story.story_content?.slice(0, 150)}…
                </p>
                <p className="text-xs font-body text-[#B0A090] mt-auto">
                  By {story.author_name ?? 'Anonymous'}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link href="/community/rescue-stories" className="btn-ghost">
            See all stories →
          </Link>
        </div>
      </div>
    </section>
  )
}
