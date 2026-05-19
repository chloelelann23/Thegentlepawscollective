'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'

const ANIMAL_TYPES = ['Dog', 'Cat', 'Rabbit', 'Bird', 'Hamster', 'Guinea Pig', 'Horse', 'Other']

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80)
}

export default function SubmitStoryPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [form, setForm] = useState({
    animal_name: '',
    animal_type: '',
    story_title: '',
    story_content: '',
    outcome: '',
    author_name: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
      if (data.user?.user_metadata?.full_name) {
        setForm((f) => ({ ...f, author_name: data.user!.user_metadata.full_name }))
      }
    })
  }, [])

  function set(key: string, val: string) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.animal_name || !form.animal_type || !form.story_title || !form.story_content) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const slug = `${slugify(form.story_title)}-${Date.now()}`

    const { error: insertError } = await supabase.from('rescue_stories').insert({
      author_id: userId ?? null,
      animal_name: form.animal_name,
      animal_type: form.animal_type,
      story_title: form.story_title,
      slug,
      story_content: form.story_content,
      outcome: form.outcome || null,
      author_name: form.author_name || null,
      status: 'pending',
    })

    if (insertError) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    // Award points if authenticated
    if (userId) {
      await fetch('/api/badges/award', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SUBMIT_STORY', userId }),
      }).catch(() => {})
    }

    setDone(true)
  }

  if (done) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--cream)] to-[var(--white)] px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card w-full max-w-md p-10 text-center"
        >
          <div className="text-5xl mb-4">📖</div>
          <h2 className="font-display text-3xl text-[var(--charcoal)] mb-3">Story submitted!</h2>
          <p className="font-body text-sm text-[#6B5B52] mb-6">
            Your story is under review. Once approved, it&apos;ll appear on the Rescue Stories page.
            {userId && ' You earned 30 points for sharing!'}
          </p>
          <button onClick={() => router.push('/community/rescue-stories')} className="btn-primary">
            Back to stories
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-[var(--cream)] to-[var(--white)]">
      <div className="max-w-2xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-4xl text-[var(--charcoal)] mb-2">Share your story</h1>
          <p className="font-body text-sm text-[#8B7B72] mb-8">
            Tell the Collective about an animal you helped rescue, rehabilitate, or rehome.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 card p-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-body font-medium text-[var(--charcoal)] mb-1.5">
                  Animal&apos;s name *
                </label>
                <input
                  className="input"
                  placeholder="e.g. Biscuit"
                  value={form.animal_name}
                  onChange={(e) => set('animal_name', e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-body font-medium text-[var(--charcoal)] mb-1.5">
                  Animal type *
                </label>
                <select
                  className="input bg-white"
                  value={form.animal_type}
                  onChange={(e) => set('animal_type', e.target.value)}
                  required
                >
                  <option value="">Select…</option>
                  {ANIMAL_TYPES.map((t) => (
                    <option key={t} value={t.toLowerCase()}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-[var(--charcoal)] mb-1.5">
                Story title *
              </label>
              <input
                className="input"
                placeholder="e.g. How I saved Biscuit from the shelter"
                value={form.story_title}
                onChange={(e) => set('story_title', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-[var(--charcoal)] mb-1.5">
                Your story *
              </label>
              <textarea
                className="input resize-none"
                rows={8}
                placeholder="Tell us what happened — how you found them, what you did, the journey you went on together…"
                value={form.story_content}
                onChange={(e) => set('story_content', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-[var(--charcoal)] mb-1.5">
                Outcome / happy ending
              </label>
              <textarea
                className="input resize-none"
                rows={3}
                placeholder="Where are they now? Did they find their forever home?"
                value={form.outcome}
                onChange={(e) => set('outcome', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-body font-medium text-[var(--charcoal)] mb-1.5">
                Your name {userId ? '(auto-filled from profile)' : ''}
              </label>
              <input
                className="input"
                placeholder="How would you like to be credited?"
                value={form.author_name}
                onChange={(e) => set('author_name', e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm font-body text-[var(--red)]">{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Submitting…' : 'Submit my story 📖'}
            </button>

            <p className="text-center text-xs font-body text-[#B0A090]">
              Stories are reviewed before publishing. Authenticated members earn 30 points.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
