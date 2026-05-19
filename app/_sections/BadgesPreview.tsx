'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Badge } from '@/lib/types'

interface BadgesPreviewProps {
  badges: Badge[]
  recentBadges: Array<{ id: string; badge: Badge; user: { full_name: string | null } | null; earned_at: string }>
}

export default function BadgesPreview({ badges, recentBadges }: BadgesPreviewProps) {
  return (
    <section className="py-20 bg-[var(--cream)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Badges grid */}
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-body text-sm text-[var(--pink)] uppercase tracking-widest mb-2 font-medium"
            >
              Earn & Collect
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="section-title mb-8"
            >
              Community Badges
            </motion.h2>

            <div className="grid grid-cols-3 gap-4">
              {badges.slice(0, 6).map((badge, i) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="card-cream p-4 text-center"
                >
                  <div className="text-3xl mb-2">{badge.emoji}</div>
                  <p className="font-display text-sm text-[var(--charcoal)]">{badge.name}</p>
                  <span className={`text-xs font-body mt-1 inline-block ${
                    badge.rarity === 'legendary' ? 'badge-rarity-legendary' :
                    badge.rarity === 'epic' ? 'badge-rarity-epic' :
                    badge.rarity === 'rare' ? 'badge-rarity-rare' :
                    'badge-rarity-common'
                  }`}>
                    {badge.rarity}
                  </span>
                </motion.div>
              ))}
            </div>

            <Link href="/community" className="btn-secondary mt-6 inline-flex">
              View All Badges
            </Link>
          </div>

          {/* Recent awards */}
          <div>
            <motion.h3
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-2xl text-[var(--charcoal)] mb-6"
            >
              Recent Awards ✨
            </motion.h3>

            <div className="space-y-3">
              {recentBadges.slice(0, 6).map((ub, i) => (
                <motion.div
                  key={ub.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="flex items-center gap-3 bg-[var(--white)] rounded-2xl p-3 shadow-card"
                >
                  <div className="text-2xl">{ub.badge?.emoji}</div>
                  <div>
                    <p className="text-sm font-body font-medium text-[var(--charcoal)]">
                      {ub.user?.full_name ?? 'A member'} earned{' '}
                      <span className="text-[var(--pink)]">{ub.badge?.name}</span>
                    </p>
                    <p className="text-xs font-body text-[#B0A090]">
                      {new Date(ub.earned_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {recentBadges.length === 0 && (
              <p className="text-sm font-body text-[#8B7B72] italic">
                Be the first to earn a badge! Join the collective to get started.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
