import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { RescueStory } from '@/lib/types'

export const revalidate = 3600

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data } = await supabase
    .from('rescue_stories')
    .select('story_title, story_content, animal_name')
    .or(`slug.eq.${params.slug},id.eq.${params.slug}`)
    .eq('status', 'approved')
    .single()

  if (!data) return { title: 'Story not found' }

  return {
    title: data.story_title,
    description: data.story_content?.slice(0, 160),
  }
}

const ANIMAL_EMOJIS: Record<string, string> = {
  dog: '🐶', cat: '🐱', rabbit: '🐰', bird: '🐦',
  hamster: '🐹', guinea: '🐾', horse: '🐴', other: '🐾',
}

function animalEmoji(type: string) {
  const key = Object.keys(ANIMAL_EMOJIS).find((k) => type.toLowerCase().includes(k))
  return key ? ANIMAL_EMOJIS[key] : '🐾'
}

export default async function RescueStoryPage({ params }: Props) {
  const supabase = createClient()

  const { data } = await supabase
    .from('rescue_stories')
    .select('*, author:users(full_name)')
    .or(`slug.eq.${params.slug},id.eq.${params.slug}`)
    .eq('status', 'approved')
    .single()

  if (!data) notFound()

  const story = data as RescueStory

  return (
    <div className="pt-16 min-h-screen">
      <div className="bg-gradient-to-b from-[var(--cream)] to-[var(--white)] py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/community/rescue-stories"
            className="text-sm font-body text-[#8B7B72] hover:text-[var(--charcoal)] transition-colors mb-6 inline-flex items-center gap-1"
          >
            ← Back to stories
          </Link>

          <div className="text-6xl mb-6">{animalEmoji(story.animal_type)}</div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-body font-medium px-2.5 py-1 rounded-full bg-[var(--pink)]/20 text-[var(--charcoal)] capitalize">
              {story.animal_type}
            </span>
            {story.published_at && (
              <span className="text-xs font-body text-[#B0A090]">
                {new Date(story.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-[var(--charcoal)] mb-4 leading-tight">
            {story.story_title}
          </h1>

          <p className="font-body text-sm text-[#8B7B72]">
            By{' '}
            <span className="font-medium text-[var(--charcoal)]">
              {story.author_name ?? (story.author as any)?.full_name ?? 'Anonymous'}
            </span>
            {' '}about{' '}
            <span className="font-medium text-[var(--charcoal)]">{story.animal_name}</span>
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="prose prose-stone max-w-none font-body text-[#3D2C2C] leading-relaxed">
          {story.story_content?.split('\n').map((para, i) =>
            para.trim() ? (
              <p key={i} className="mb-4 text-base text-[#3D2C2C] leading-relaxed">
                {para}
              </p>
            ) : <div key={i} className="mb-4" />
          )}
        </div>

        {story.outcome && (
          <div className="mt-10 card-cream p-6 rounded-2xl">
            <h3 className="font-display text-xl text-[var(--charcoal)] mb-3">
              🌟 Happy Ending
            </h3>
            <p className="font-body text-sm text-[#6B5B52] leading-relaxed">{story.outcome}</p>
          </div>
        )}

        <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-[#F0E8E0] pt-8">
          <Link href="/community/rescue-stories" className="btn-secondary">
            ← More stories
          </Link>
          <Link href="/community/rescue-stories/submit" className="btn-pink">
            Share your own story 📖
          </Link>
        </div>
      </div>
    </div>
  )
}
