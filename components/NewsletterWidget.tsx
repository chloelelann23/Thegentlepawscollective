'use client'

import { useState } from 'react'

export default function NewsletterWidget() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    const res = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    setStatus(res.ok ? 'done' : 'error')
  }

  if (status === 'done') {
    return (
      <div className="text-sm font-body text-[var(--pink)]">
        💌 You&apos;re in! Check your inbox.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <p className="text-xs font-body text-[#B0A090] uppercase tracking-widest">
        Newsletter
      </p>
      <div className="flex gap-2">
        <input
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm font-body text-white placeholder:text-[#6B5B52] focus:outline-none focus:border-[var(--pink)]"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-[var(--pink)] text-white rounded-xl px-4 py-2 text-sm font-body font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {status === 'loading' ? '…' : '→'}
        </button>
      </div>
      {status === 'error' && (
        <p className="text-xs font-body text-red-400">Something went wrong. Try again?</p>
      )}
    </form>
  )
}
