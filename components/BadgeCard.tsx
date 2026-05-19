'use client'

import { motion } from 'framer-motion'
import type { Badge, UserBadge } from '@/lib/types'

interface BadgeCardProps {
  badge: Badge
  earned?: boolean
  earnedAt?: string
  index?: number
}

const rarityConfig = {
  common: {
    bg: 'bg-[#F5F5F5]',
    border: 'border-[#E0E0E0]',
    label: 'badge-rarity-common',
    glow: '',
  },
  rare: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    label: 'badge-rarity-rare',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]',
  },
  epic: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    label: 'badge-rarity-epic',
    glow: 'shadow-[0_0_20px_rgba(147,51,234,0.15)]',
  },
  legendary: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    label: 'badge-rarity-legendary',
    glow: 'shadow-[0_0_24px_rgba(245,158,11,0.2)]',
  },
}

export default function BadgeCard({ badge, earned = false, earnedAt, index = 0 }: BadgeCardProps) {
  const config = rarityConfig[badge.rarity]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`relative p-5 rounded-2xl border transition-all duration-300 ${config.bg} ${config.border} ${
        earned ? config.glow : 'opacity-50 grayscale'
      }`}
    >
      {!earned && (
        <div className="absolute inset-0 bg-white/40 rounded-2xl flex items-center justify-center backdrop-blur-[1px]">
          <span className="text-2xl">🔒</span>
        </div>
      )}

      <div className="text-center">
        <div className="text-4xl mb-3">{badge.emoji}</div>
        <h4 className="font-display text-lg text-[var(--charcoal)] mb-1">{badge.name}</h4>
        <p className="text-xs font-body text-[#8B7B72] mb-3 leading-relaxed">{badge.description}</p>
        <span className={config.label}>{badge.rarity}</span>
        {earned && earnedAt && (
          <p className="text-xs font-body text-[#B0A090] mt-2">
            Earned {new Date(earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        )}
      </div>
    </motion.div>
  )
}
