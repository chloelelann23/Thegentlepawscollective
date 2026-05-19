'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import type { User, UserBadge } from '@/lib/types'

interface MemberCardProps {
  user: User & { user_badges?: UserBadge[] }
  rank?: number
  index?: number
}

const roleLabels = {
  member: { label: 'Member', class: 'bg-[var(--cream)] text-[var(--charcoal)]' },
  ambassador: { label: '🎀 Ambassador', class: 'bg-[var(--pink)]/20 text-[var(--charcoal)]' },
  admin: { label: '⚡ Admin', class: 'bg-[var(--charcoal)] text-white' },
}

export default function MemberCard({ user, rank, index = 0 }: MemberCardProps) {
  const role = roleLabels[user.role]
  const badges = user.user_badges?.slice(0, 3) ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="card p-4 flex items-center gap-4 hover:shadow-soft transition-all duration-300"
    >
      {rank !== undefined && (
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-body font-bold ${
          rank === 1 ? 'bg-amber-100 text-amber-700' :
          rank === 2 ? 'bg-slate-100 text-slate-600' :
          rank === 3 ? 'bg-orange-100 text-orange-700' :
          'bg-[var(--cream)] text-[#8B7B72]'
        }`}>
          {rank <= 3 ? ['🥇','🥈','🥉'][rank-1] : rank}
        </div>
      )}

      <div className="relative w-12 h-12 shrink-0">
        {user.avatar_url ? (
          <Image
            src={user.avatar_url}
            alt={user.full_name ?? 'Member'}
            fill
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--pink)] to-[#E88EA8] flex items-center justify-center text-white font-display text-lg">
            {(user.full_name ?? user.email)[0].toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-display text-base text-[var(--charcoal)] truncate">
            {user.full_name ?? user.email.split('@')[0]}
          </h4>
          <span className={`text-xs font-body font-medium px-2 py-0.5 rounded-full shrink-0 ${role.class}`}>
            {role.label}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs font-body text-[var(--pink)] font-medium">
            {user.points.toLocaleString()} pts
          </span>
          {badges.length > 0 && (
            <div className="flex gap-0.5">
              {badges.map((ub) => (
                <span key={ub.id} title={ub.badge?.name} className="text-sm">
                  {ub.badge?.emoji}
                </span>
              ))}
              {(user.user_badges?.length ?? 0) > 3 && (
                <span className="text-xs text-[#B0A090]">+{(user.user_badges?.length ?? 0) - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
