'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Badge } from '@/lib/types'

const DEMO_BADGES: Badge[] = [
  { id: '1', name: 'New Sprout', emoji: '🌱', description: 'Joined the collective', rarity: 'common', trigger_type: 'join', created_at: '' },
  { id: '2', name: 'Event Star', emoji: '⭐', description: 'RSVPed to an event', rarity: 'rare', trigger_type: 'event_rsvp', created_at: '' },
  { id: '3', name: 'Top Donor', emoji: '💝', description: 'Made a donation', rarity: 'epic', trigger_type: 'donation', created_at: '' },
  { id: '4', name: 'Recap Hero', emoji: '📸', description: 'Submitted event photos', rarity: 'rare', trigger_type: 'photo_submit', created_at: '' },
  { id: '5', name: 'Ambassador', emoji: '🎀', description: 'Became an ambassador', rarity: 'legendary', trigger_type: 'manual', created_at: '' },
  { id: '6', name: 'Foster Mom', emoji: '🏡', description: 'Fostered an animal', rarity: 'epic', trigger_type: 'manual', created_at: '' },
]

const rarityConfig: Record<string, { bg: string; border: string; label: string }> = {
  common: { bg: 'bg-white', border: 'border-gray-200', label: 'text-gray-500' },
  rare: { bg: 'bg-blue-50', border: 'border-blue-200', label: 'text-blue-600' },
  epic: { bg: 'bg-purple-50', border: 'border-purple-200', label: 'text-purple-600' },
  legendary: { bg: 'bg-amber-50', border: 'border-amber-300', label: 'text-amber-600' },
}

interface BadgesPreviewProps {
  badges: Badge[]
  recentBadges: Array<{
    id: string
    badge: Badge
    user: { full_name: string | null } | null
    earned_at: string
  }>
}

export default function BadgesPreview({ badges, recentBadges }: BadgesPreviewProps) {
  const displayBadges = badges.length > 0 ? badges : DEMO_BADGES

  return (
    <section
      className="py-24"
      style={{ background: 'linear-gradient(135deg, #F5EDE6 0%, #F9F0F2 50%, #F2A0B4 100%)' }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: Badge grid */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-body text-xs text-[var(--charcoal)]/55 uppercase tracking-[0.2em] mb-3 font-bold"
            >
              Earn &amp; Collect
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display font-light text-5xl md:text-6xl text-[var(--charcoal)] mb-10 leading-[0.95]"
            >
              Community<br />Badges
            </motion.h2>

            <div className="grid grid-cols-3 gap-4">
              {displayBadges.slice(0, 6).map((badge, i) => {
                const cfg = rarityConfig[badge.rarity] ?? rarityConfig.common
                return (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.75 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07, type: 'spring', stiffness: 180 }}
                    className={`${cfg.bg} border-2 ${cfg.border} rounded-2xl p-5 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}
                  >
                    <div className="text-4xl mb-3">{badge.emoji}</div>
                    <p className="font-display text-sm text-[var(--charcoal)] leading-tight mb-1">
                      {badge.name}
                    </p>
                    <span className={`font-body text-[10px] font-bold uppercase tracking-wider ${cfg.label}`}>
                      {badge.rarity}
                    </span>
                  </motion.div>
                )
              })}
            </div>

            <Link href="/community" className="btn-primary mt-8 inline-flex shadow-xl">
              View All Badges →
            </Link>
          </div>

          {/* Right: Recent awards or CTA */}
          {recentBadges.length > 0 ? (
            <div>
              <motion.h3
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-display text-3xl text-[var(--charcoal)] mb-8"
              >
                Recent Awards ✨
              </motion.h3>

              <div className="space-y-3">
                {recentBadges.slice(0, 5).map((ub, i) => (
                  <motion.div
                    key={ub.id}
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="text-3xl">{ub.badge?.emoji}</div>
                    <div>
                      <p className="font-body text-sm font-semibold text-[var(--charcoal)]">
                        {ub.user?.full_name ?? 'A member'} earned{' '}
                        <span className="text-[var(--pink)]">{ub.badge?.name}</span>
                      </p>
                      <p className="font-body text-xs text-[#B0A090]">
                        {new Date(ub.earned_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[var(--charcoal)] rounded-3xl p-10 lg:p-12 text-center"
            >
              <div className="text-5xl mb-6">🌟</div>
              <h3 className="font-display text-3xl text-white mb-4">
                Start Earning Today
              </h3>
              <p className="font-body text-white/65 text-base mb-8 leading-relaxed max-w-xs mx-auto">
                Attend events, donate to charities, and share your stories to unlock exclusive badges.
              </p>
              <Link
                href="/auth/signup"
                className="inline-block bg-[var(--pink)] text-[var(--charcoal)] font-body font-bold text-base px-8 py-4 rounded-full hover:bg-[#E88EA8] active:scale-95 transition-all duration-200"
              >
                Join the Collective 🐾
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
