import { createClient } from '@/lib/supabase/server'
import { motion } from 'framer-motion'
import MemberCard from '@/components/MemberCard'
import BadgeCard from '@/components/BadgeCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Community',
  description: 'Meet the Gentle Paws Collective — our leaderboard, badges, members, and ambassadors.',
}

export const revalidate = 3600

export default async function CommunityPage() {
  const supabase = createClient()

  const [
    { data: members },
    { data: badges },
    { data: ambassadors },
  ] = await Promise.all([
    supabase
      .from('users')
      .select('*, user_badges(*, badge:badges(*))')
      .order('points', { ascending: false })
      .limit(20),
    supabase.from('badges').select('*').order('rarity'),
    supabase
      .from('users')
      .select('*, user_badges(*, badge:badges(*))')
      .eq('role', 'ambassador'),
  ])

  const topMembers = members?.slice(0, 10) ?? []

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-b from-[var(--cream)] to-[var(--white)] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-body text-sm text-[var(--pink)] uppercase tracking-widest mb-3 font-medium">
            Hey Babes
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-[var(--charcoal)] mb-4">
            Our Community
          </h1>
          <p className="font-body text-base text-[#6B5B52] max-w-md mx-auto">
            Girls supporting girls, supporting animals. Meet the members making it all happen.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">

        {/* Leaderboard */}
        <section className="mb-20">
          <h2 className="font-display text-3xl text-[var(--charcoal)] mb-2">
            Top Members 🏆
          </h2>
          <p className="font-body text-sm text-[#8B7B72] mb-8">Ranked by points earned through events, donations, and community contributions.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {topMembers.map((member, i) => (
              <MemberCard key={member.id} user={member as any} rank={i + 1} index={i} />
            ))}
          </div>
        </section>

        {/* Ambassador Spotlight */}
        {ambassadors && ambassadors.length > 0 && (
          <section className="mb-20 bg-[var(--cream)] rounded-3xl p-10">
            <div className="text-center mb-10">
              <p className="font-body text-sm text-[var(--pink)] uppercase tracking-widest mb-2 font-medium">
                Leading the Way
              </p>
              <h2 className="font-display text-3xl text-[var(--charcoal)]">
                Ambassador Spotlight 🎀
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ambassadors.map((ambassador, i) => (
                <div key={ambassador.id} className="card p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--pink)] to-[#E88EA8] flex items-center justify-center text-white font-display text-2xl mx-auto mb-4">
                    {(ambassador.full_name ?? ambassador.email)[0].toUpperCase()}
                  </div>
                  <h3 className="font-display text-xl text-[var(--charcoal)] mb-1">
                    {ambassador.full_name ?? ambassador.email.split('@')[0]}
                  </h3>
                  <span className="text-xs font-body font-medium px-3 py-1 rounded-full bg-[var(--pink)]/20 text-[var(--charcoal)]">
                    🎀 Ambassador
                  </span>
                  <p className="text-sm font-body text-[#8B7B72] mt-3">
                    {ambassador.points.toLocaleString()} points
                  </p>
                  <div className="flex justify-center gap-1 mt-2">
                    {(ambassador as any).user_badges?.slice(0, 4).map((ub: any) => (
                      <span key={ub.id} className="text-lg" title={ub.badge?.name}>
                        {ub.badge?.emoji}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Badge Gallery */}
        <section>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="font-body text-sm text-[var(--pink)] uppercase tracking-widest mb-2 font-medium">
                Collect Them All
              </p>
              <h2 className="font-display text-3xl text-[var(--charcoal)]">
                Badge Gallery
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {(badges ?? []).map((badge, i) => (
              <BadgeCard key={badge.id} badge={badge as any} earned index={i} />
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}
