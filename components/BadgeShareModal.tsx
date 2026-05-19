'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Badge } from '@/lib/types'

interface Props {
  badge: Badge
  userName: string
  onClose: () => void
}

export default function BadgeShareModal({ badge, userName, onClose }: Props) {
  const [copied, setCopied] = useState(false)

  const appUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const cardUrl = `${appUrl}/api/badges/share-card?badgeId=${badge.id}&name=${encodeURIComponent(userName)}`

  async function copyLink() {
    await navigator.clipboard.writeText(cardUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function shareNative() {
    if (navigator.share) {
      navigator.share({
        title: `I earned the ${badge.name} badge!`,
        text: `${badge.emoji} I just earned the "${badge.name}" badge on The Gentle Paws Collective! ${badge.description ?? ''}`,
        url: appUrl + '/community',
      })
    }
  }

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={(e) => e.stopPropagation()}
          className="card relative w-full max-w-sm p-8 text-center"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#B0A090] hover:text-[var(--charcoal)] transition-colors text-xl leading-none"
          >
            ×
          </button>

          <div className="text-7xl mb-4">{badge.emoji}</div>
          <h3 className="font-display text-2xl text-[var(--charcoal)] mb-1">{badge.name}</h3>
          <p className="font-body text-sm text-[#8B7B72] mb-6">{badge.description}</p>

          <div className="space-y-3">
            <button
              onClick={copyLink}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {copied ? '✓ Copied!' : '🔗 Copy share link'}
            </button>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={shareNative}
                className="btn-secondary w-full"
              >
                Share via…
              </button>
            )}

            <a
              href={cardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost w-full inline-block text-center text-sm"
            >
              View badge card ↗
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
