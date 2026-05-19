'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import BadgeCard from '@/components/BadgeCard'
import BadgeShareModal from '@/components/BadgeShareModal'
import type { User, UserBadge, Event, Donation, AmbassadorApplication, Subscription, Badge } from '@/lib/types'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [badges, setBadges] = useState<UserBadge[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [donations, setDonations] = useState<Donation[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [application, setApplication] = useState<AmbassadorApplication | null>(null)
  const [rank, setRank] = useState<number | null>(null)
  const [referralCode, setReferralCode] = useState<string | null>(null)
  const [referralCount, setReferralCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showAmbassadorForm, setShowAmbassadorForm] = useState(false)
  const [ambassadorForm, setAmbassadorForm] = useState({ why: '', experience: '' })
  const [submitting, setSubmitting] = useState(false)
  const [shareBadge, setShareBadge] = useState<Badge | null>(null)
  const [referralCopied, setReferralCopied] = useState(false)
  const [cancellingSubId, setCancellingSubId] = useState<string | null>(null)
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'done'>('idle')

  useEffect(() => {
    const supabase = createClient()

    async function load() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) { router.push('/auth/login'); return }

      const [
        { data: profile },
        { data: userBadges },
        { data: rsvps },
        { data: userDonations },
        { data: userSubs },
        { data: app },
        { data: allUsers },
        { data: referrals },
      ] = await Promise.all([
        supabase.from('users').select('*, referral_code').eq('id', authUser.id).single(),
        supabase.from('user_badges').select('*, badge:badges(*)').eq('user_id', authUser.id).order('earned_at', { ascending: false }),
        supabase.from('event_rsvps').select('*, event:events(*)').eq('user_id', authUser.id).order('created_at', { ascending: false }),
        supabase.from('donations').select('*, charity:charities(name, emoji)').eq('user_id', authUser.id).order('created_at', { ascending: false }),
        supabase.from('subscriptions').select('*, charity:charities(name, emoji)').eq('user_id', authUser.id).eq('status', 'active').order('created_at', { ascending: false }),
        supabase.from('ambassador_applications').select('*').eq('user_id', authUser.id).single(),
        supabase.from('users').select('id, points').order('points', { ascending: false }),
        supabase.from('referrals').select('id').eq('referrer_id', authUser.id),
      ])

      const profileData = profile as (User & { referral_code?: string })
      setUser(profileData as User)
      setReferralCode(profileData?.referral_code ?? null)
      setBadges(userBadges as UserBadge[] ?? [])
      setEvents(rsvps?.map((r: any) => r.event).filter(Boolean) as Event[] ?? [])
      setDonations(userDonations as Donation[] ?? [])
      setSubscriptions(userSubs as Subscription[] ?? [])
      setApplication(app as AmbassadorApplication | null)
      setReferralCount(referrals?.length ?? 0)

      if (allUsers && profileData) {
        const userRank = allUsers.findIndex((u) => u.id === authUser.id) + 1
        setRank(userRank > 0 ? userRank : null)
      }

      setLoading(false)
    }

    load()
  }, [router])

  async function handleAmbassadorApply() {
    if (!user || !ambassadorForm.why) return
    setSubmitting(true)
    const supabase = createClient()

    const { error } = await supabase.from('ambassador_applications').insert({
      user_id: user.id,
      why_ambassador: ambassadorForm.why,
      experience: ambassadorForm.experience || null,
    })

    if (!error) {
      const { data: app } = await supabase
        .from('ambassador_applications').select('*').eq('user_id', user.id).single()
      setApplication(app as AmbassadorApplication)
      setShowAmbassadorForm(false)
    }

    setSubmitting(false)
  }

  async function cancelSubscription(subId: string) {
    setCancellingSubId(subId)
    const res = await fetch('/api/subscriptions/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptionId: subId }),
    })
    if (res.ok) {
      setSubscriptions((prev) => prev.filter((s) => s.id !== subId))
    }
    setCancellingSubId(null)
  }

  async function handleNewsletterUnsubscribe() {
    if (!user) return
    setNewsletterStatus('loading')
    await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, unsubscribe: true }),
    })
    setNewsletterStatus('done')
  }

  function copyReferralLink() {
    if (!referralCode) return
    const link = `${window.location.origin}/auth/signup?ref=${referralCode}`
    navigator.clipboard.writeText(link)
    setReferralCopied(true)
    setTimeout(() => setReferralCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--pink)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const roleConfig = {
    member: { label: 'Member', class: 'bg-[var(--cream)] text-[var(--charcoal)]' },
    ambassador: { label: '🎀 Ambassador', class: 'bg-[var(--pink)]/20 text-[var(--charcoal)]' },
    admin: { label: '⚡ Admin', class: 'bg-[var(--charcoal)] text-white' },
  }

  return (
    <div className="pt-16 min-h-screen">
      {shareBadge && (
        <BadgeShareModal
          badge={shareBadge}
          userName={user.full_name ?? user.email.split('@')[0]}
          onClose={() => setShareBadge(null)}
        />
      )}

      {/* Hero/Profile header */}
      <div className="bg-gradient-to-b from-[var(--cream)] to-[var(--white)] py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center md:items-start gap-6"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--pink)] to-[#E88EA8] flex items-center justify-center text-white font-display text-4xl shrink-0">
              {(user.full_name ?? user.email)[0].toUpperCase()}
            </div>
            <div className="text-center md:text-left">
              <h1 className="font-display text-4xl text-[var(--charcoal)] mb-2">
                {user.full_name ?? user.email.split('@')[0]}
              </h1>
              <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                <span className={`text-xs font-body font-medium px-3 py-1 rounded-full ${roleConfig[user.role].class}`}>
                  {roleConfig[user.role].label}
                </span>
                {rank && (
                  <span className="text-xs font-body text-[#8B7B72]">
                    Rank #{rank} in the Collective
                  </span>
                )}
              </div>
              <p className="font-display text-3xl text-[var(--pink)] mt-3">
                {user.points.toLocaleString()} pts
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-12 -mt-6">
          {[
            { label: 'Badges', value: badges.length, icon: '🏅' },
            { label: 'Events', value: events.length, icon: '✨' },
            { label: 'Donations', value: donations.length, icon: '💝' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card p-4 text-center"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="font-display text-2xl text-[var(--charcoal)]">{stat.value}</div>
              <p className="text-xs font-body text-[#8B7B72]">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-2xl text-[var(--charcoal)] mb-6">My Badges</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {badges.map((ub, i) => (
                <div key={ub.id} className="relative group">
                  <BadgeCard
                    badge={ub.badge as any}
                    earned
                    earnedAt={ub.earned_at}
                    index={i}
                  />
                  <button
                    onClick={() => setShareBadge(ub.badge as any)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-1.5 text-xs shadow-sm hover:bg-[var(--pink)] hover:text-white"
                    title="Share badge"
                  >
                    ↗
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Referral section */}
        {referralCode && (
          <section className="card-cream p-8 mb-12">
            <div className="flex items-start gap-4">
              <div className="text-3xl">🤝</div>
              <div className="flex-1">
                <h2 className="font-display text-2xl text-[var(--charcoal)] mb-1">Invite Your Babes</h2>
                <p className="font-body text-sm text-[#6B5B52] mb-4">
                  Share your link and earn <strong>100 points</strong> + the <strong>Matchmaker 🤝</strong> badge for every friend who joins.
                  You&apos;ve already referred <strong>{referralCount}</strong> {referralCount === 1 ? 'person' : 'people'}.
                </p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/signup?ref=${referralCode}`}
                    className="input flex-1 text-sm bg-white"
                  />
                  <button
                    onClick={copyReferralLink}
                    className="btn-primary shrink-0 text-sm"
                  >
                    {referralCopied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Monthly Giving (active subscriptions) */}
        {subscriptions.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-2xl text-[var(--charcoal)] mb-6">Monthly Giving 🌿</h2>
            <div className="space-y-3">
              {subscriptions.map((sub: any) => (
                <motion.div
                  key={sub.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card p-4 flex items-center gap-4"
                >
                  <div className="text-2xl">{sub.charity?.emoji ?? '🌿'}</div>
                  <div className="flex-1">
                    <h4 className="font-display text-base text-[var(--charcoal)]">
                      {sub.charity?.name ?? 'Charity'}
                    </h4>
                    <p className="text-xs font-body text-[#B0A090]">Active monthly giving</p>
                  </div>
                  <span className="font-display text-lg text-[var(--charcoal)]">
                    ${Number(sub.amount).toFixed(0)}/mo
                  </span>
                  <button
                    onClick={() => cancelSubscription(sub.id)}
                    disabled={cancellingSubId === sub.id}
                    className="text-xs font-body text-[#B0A090] hover:text-[var(--red)] transition-colors shrink-0"
                  >
                    {cancellingSubId === sub.id ? 'Cancelling…' : 'Cancel'}
                  </button>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Events attended */}
        {events.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-2xl text-[var(--charcoal)] mb-6">Events I&apos;m Attending</h2>
            <div className="space-y-3">
              {events.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="card p-4 flex items-center gap-4"
                >
                  <div className="text-2xl">
                    {event.type === 'virtual' ? '💻' : '📍'}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-display text-base text-[var(--charcoal)]">{event.title}</h4>
                    <p className="text-xs font-body text-[#B0A090]">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <span className={`text-xs font-body font-medium px-2.5 py-1 rounded-full ${
                    event.status === 'upcoming' ? 'bg-green-100 text-green-700' : 'bg-[var(--cream)] text-[#8B7B72]'
                  }`}>
                    {event.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Donations */}
        {donations.length > 0 && (
          <section className="mb-12">
            <h2 className="font-display text-2xl text-[var(--charcoal)] mb-6">Donation History</h2>
            <div className="space-y-3">
              {donations.map((donation: any, i) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="card p-4 flex items-center gap-4"
                >
                  <div className="text-2xl">{donation.charity?.emoji ?? '💝'}</div>
                  <div className="flex-1">
                    <h4 className="font-display text-base text-[var(--charcoal)]">
                      {donation.charity?.name ?? 'Charity'}
                    </h4>
                    <p className="text-xs font-body text-[#B0A090]">
                      {new Date(donation.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <span className="font-display text-lg text-[var(--charcoal)]">
                    ${Number(donation.amount).toFixed(0)}
                  </span>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Ambassador section */}
        <section className="card-cream p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="font-display text-2xl text-[var(--charcoal)] mb-1">Ambassador Program 🎀</h2>
              <p className="font-body text-sm text-[#6B5B52]">
                Ambassadors are the heart of our community — leading events, spreading the word, and inspiring others.
              </p>
            </div>
          </div>

          {application ? (
            <div className={`rounded-2xl p-4 ${
              application.approved === true ? 'bg-green-50 border border-green-200' :
              application.approved === false ? 'bg-red-50 border border-red-200' :
              'bg-[var(--white)] border border-[var(--pink)]/30'
            }`}>
              <p className="font-body text-sm font-medium text-[var(--charcoal)]">
                {application.approved === true ? '🎉 Application Approved! You\'re an Ambassador!' :
                 application.approved === false ? '😢 Application not approved this time' :
                 '⏳ Application under review'}
              </p>
              <p className="text-xs font-body text-[#8B7B72] mt-1">
                Applied {new Date(application.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </p>
            </div>
          ) : showAmbassadorForm ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-body font-medium text-[var(--charcoal)] block mb-1.5">
                  Why do you want to be an ambassador? *
                </label>
                <textarea
                  rows={4}
                  className="input resize-none"
                  placeholder="Tell us what drives you and why you'd make a great ambassador for the Collective..."
                  value={ambassadorForm.why}
                  onChange={(e) => setAmbassadorForm(p => ({ ...p, why: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-body font-medium text-[var(--charcoal)] block mb-1.5">
                  Relevant experience (optional)
                </label>
                <textarea
                  rows={3}
                  className="input resize-none"
                  placeholder="Any animal rescue experience, community organizing, social media, etc..."
                  value={ambassadorForm.experience}
                  onChange={(e) => setAmbassadorForm(p => ({ ...p, experience: e.target.value }))}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAmbassadorApply}
                  disabled={submitting || !ambassadorForm.why}
                  className="btn-primary"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
                <button
                  onClick={() => setShowAmbassadorForm(false)}
                  className="btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAmbassadorForm(true)}
              className="btn-pink"
            >
              Apply to be an Ambassador 🎀
            </button>
          )}
        </section>

        {/* Newsletter unsubscribe */}
        <section className="text-center">
          {newsletterStatus === 'done' ? (
            <p className="text-sm font-body text-[#8B7B72]">You&apos;ve been unsubscribed from our newsletter.</p>
          ) : (
            <button
              onClick={handleNewsletterUnsubscribe}
              disabled={newsletterStatus === 'loading'}
              className="text-xs font-body text-[#B0A090] hover:text-[var(--charcoal)] transition-colors"
            >
              {newsletterStatus === 'loading' ? 'Unsubscribing…' : 'Unsubscribe from newsletter'}
            </button>
          )}
        </section>
      </div>
    </div>
  )
}
