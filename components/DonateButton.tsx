'use client'

import { useState } from 'react'
import Button from './ui/Button'

interface DonateButtonProps {
  charityId: string
  charityName: string
  className?: string
}

const PRESET_AMOUNTS = [10, 25, 50, 100]

export default function DonateButton({ charityId, charityName, className }: DonateButtonProps) {
  const [showModal, setShowModal] = useState(false)
  const [amount, setAmount] = useState(25)
  const [customAmount, setCustomAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const finalAmount = customAmount ? Number(customAmount) : amount

  async function handleDonate() {
    if (!finalAmount || finalAmount < 1) return
    setLoading(true)

    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ charityId, amount: finalAmount }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`btn-red w-full ${className ?? ''}`}
      >
        💝 Donate Now
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[var(--white)] rounded-3xl p-8 w-full max-w-sm shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-[#B0A090] hover:text-[var(--charcoal)] transition-colors"
            >
              ✕
            </button>

            <div className="text-center mb-6">
              <div className="text-4xl mb-3">💝</div>
              <h3 className="font-display text-2xl text-[var(--charcoal)] mb-1">
                Support {charityName}
              </h3>
              <p className="text-sm font-body text-[#8B7B72]">
                100% of your donation goes directly to {charityName}.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => { setAmount(preset); setCustomAmount('') }}
                  className={`py-2.5 rounded-xl text-sm font-body font-medium transition-all duration-200 border ${
                    amount === preset && !customAmount
                      ? 'bg-[var(--charcoal)] text-white border-[var(--charcoal)]'
                      : 'bg-[var(--cream)] text-[var(--charcoal)] border-[#E0D4CA] hover:border-[var(--charcoal)]'
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>

            <div className="mb-6">
              <input
                type="number"
                placeholder="Custom amount"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setAmount(0) }}
                className="input text-center"
                min="1"
              />
            </div>

            <Button
              variant="red"
              onClick={handleDonate}
              loading={loading}
              className="w-full"
            >
              Donate ${finalAmount || '—'}
            </Button>

            <p className="text-center text-xs font-body text-[#B0A090] mt-4">
              Secure payment via Stripe 🔒
            </p>
          </div>
        </div>
      )}
    </>
  )
}
