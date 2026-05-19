'use client'

import { useState } from 'react'

interface Props {
  charityId: string
  charityName: string
}

const AMOUNTS = [5, 10, 25, 50]

export default function MonthlyGivingButton({ charityId, charityName }: Props) {
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(10)
  const [custom, setCustom] = useState('')
  const [loading, setLoading] = useState(false)

  const finalAmount = custom ? Number(custom) : amount

  async function handleSubscribe() {
    if (!finalAmount || finalAmount < 1) return
    setLoading(true)

    const res = await fetch('/api/subscriptions/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ charityId, amount: finalAmount }),
    })

    const { url, error } = await res.json()
    if (error || !url) {
      alert('Something went wrong. Please try again.')
      setLoading(false)
      return
    }
    window.location.href = url
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="btn-ghost w-full text-sm flex items-center justify-center gap-2"
      >
        🌿 Give monthly
      </button>
    )
  }

  return (
    <div className="mt-3 p-4 rounded-2xl border border-[#E8D5C8] bg-[var(--cream)] space-y-3">
      <p className="font-body text-xs font-medium text-[var(--charcoal)] uppercase tracking-wide">
        Monthly amount
      </p>
      <div className="grid grid-cols-4 gap-2">
        {AMOUNTS.map((a) => (
          <button
            key={a}
            onClick={() => { setAmount(a); setCustom('') }}
            className={`py-2 rounded-xl text-sm font-body font-medium transition-all ${
              !custom && amount === a
                ? 'bg-[var(--charcoal)] text-white'
                : 'bg-white text-[var(--charcoal)] border border-[#E8D5C8] hover:border-[var(--charcoal)]'
            }`}
          >
            ${a}
          </button>
        ))}
      </div>
      <input
        type="number"
        min="1"
        placeholder="Custom amount"
        value={custom}
        onChange={(e) => setCustom(e.target.value)}
        className="input text-sm"
      />
      <button
        onClick={handleSubscribe}
        disabled={loading || !finalAmount || finalAmount < 1}
        className="btn-primary w-full text-sm"
      >
        {loading ? 'Redirecting…' : `Give $${finalAmount}/mo to ${charityName} 🌿`}
      </button>
      <button
        onClick={() => setOpen(false)}
        className="w-full text-xs font-body text-[#B0A090] hover:text-[var(--charcoal)] transition-colors"
      >
        Cancel
      </button>
    </div>
  )
}
