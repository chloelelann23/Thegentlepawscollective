'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Event, BlogPost, Charity, AmbassadorApplication, Badge, User, Donation } from '@/lib/types'

type AdminTab = 'events' | 'blog' | 'charities' | 'ambassadors' | 'badges' | 'donations'

export default function AdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<AdminTab>('events')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  // Data states
  const [events, setEvents] = useState<Event[]>([])
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [charities, setCharities] = useState<Charity[]>([])
  const [applications, setApplications] = useState<AmbassadorApplication[]>([])
  const [allBadges, setAllBadges] = useState<Badge[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [donations, setDonations] = useState<Donation[]>([])

  // Form states
  const [showEventForm, setShowEventForm] = useState(false)
  const [showBlogForm, setShowBlogForm] = useState(false)
  const [showCharityForm, setShowCharityForm] = useState(false)
  const [eventForm, setEventForm] = useState({ title: '', slug: '', description: '', date: '', time: '', location: '', type: 'in-person', spots_total: '', cover_image_drive_path: '' })
  const [blogForm, setBlogForm] = useState({ title: '', slug: '', excerpt: '', content: '', tag: '', read_time: '5', cover_image_drive_path: '' })
  const [charityForm, setCharityForm] = useState({ name: '', description: '', animal_type: '', emoji: '🐾', goal_amount: '', raised_amount: '0' })
  const [badgeAward, setBadgeAward] = useState({ userId: '', badgeId: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    async function checkAdmin() {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) { router.push('/auth/login'); return }
      const { data: profile } = await supabase.from('users').select('*').eq('id', authUser.id).single()
      if (profile?.role !== 'admin') { router.push('/'); return }
      setUser(profile as User)
      await loadAll(supabase)
      setLoading(false)
    }
    checkAdmin()
  }, [router])

  async function loadAll(supabase: any) {
    const [
      { data: evts }, { data: psts }, { data: chrs }, { data: apps },
      { data: bdgs }, { data: usrs }, { data: dnts },
    ] = await Promise.all([
      supabase.from('events').select('*').order('date', { ascending: false }),
      supabase.from('blog_posts').select('*').order('published_at', { ascending: false }),
      supabase.from('charities').select('*'),
      supabase.from('ambassador_applications').select('*, user:users(full_name, email)').order('created_at', { ascending: false }),
      supabase.from('badges').select('*'),
      supabase.from('users').select('*').order('created_at', { ascending: false }),
      supabase.from('donations').select('*, user:users(email), charity:charities(name)').order('created_at', { ascending: false }),
    ])
    setEvents(evts ?? [])
    setPosts(psts ?? [])
    setCharities(chrs ?? [])
    setApplications(apps ?? [])
    setAllBadges(bdgs ?? [])
    setAllUsers(usrs ?? [])
    setDonations(dnts ?? [])
  }

  async function createEvent() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('events').insert({
      ...eventForm,
      spots_total: eventForm.spots_total ? Number(eventForm.spots_total) : null,
    })
    await loadAll(supabase)
    setShowEventForm(false)
    setEventForm({ title: '', slug: '', description: '', date: '', time: '', location: '', type: 'in-person', spots_total: '', cover_image_drive_path: '' })
    setSaving(false)
  }

  async function createPost() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('blog_posts').insert({
      ...blogForm,
      author_id: user?.id,
      read_time: Number(blogForm.read_time),
      published_at: new Date().toISOString(),
    })
    await loadAll(supabase)
    setShowBlogForm(false)
    setSaving(false)
  }

  async function createCharity() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('charities').insert({
      ...charityForm,
      goal_amount: Number(charityForm.goal_amount),
      raised_amount: Number(charityForm.raised_amount),
    })
    await loadAll(supabase)
    setShowCharityForm(false)
    setSaving(false)
  }

  async function approveApplication(appId: string, approved: boolean) {
    const supabase = createClient()
    await supabase.from('ambassador_applications').update({ approved, reviewed_at: new Date().toISOString() }).eq('id', appId)
    if (approved) {
      const app = applications.find((a) => a.id === appId)
      if (app) {
        await supabase.from('users').update({ role: 'ambassador' }).eq('id', app.user_id)
      }
    }
    await loadAll(supabase)
  }

  async function awardBadgeToUser() {
    if (!badgeAward.userId || !badgeAward.badgeId) return
    const res = await fetch('/api/badges/award', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId: badgeAward.userId, badgeId: badgeAward.badgeId }),
    })
    if (res.ok) {
      setBadgeAward({ userId: '', badgeId: '' })
      alert('Badge awarded!')
    }
  }

  async function deleteEvent(id: string) {
    if (!confirm('Delete this event?')) return
    const supabase = createClient()
    await supabase.from('events').delete().eq('id', id)
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post?')) return
    const supabase = createClient()
    await supabase.from('blog_posts').delete().eq('id', id)
    setPosts((prev) => prev.filter((p) => p.id !== id))
  }

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--pink)] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const tabs: { key: AdminTab; label: string; emoji: string }[] = [
    { key: 'events', label: 'Events', emoji: '✨' },
    { key: 'blog', label: 'Blog', emoji: '📝' },
    { key: 'charities', label: 'Charities', emoji: '💝' },
    { key: 'ambassadors', label: 'Ambassadors', emoji: '🎀' },
    { key: 'badges', label: 'Badges', emoji: '🏅' },
    { key: 'donations', label: 'Donations', emoji: '💳' },
  ]

  return (
    <div className="pt-16 min-h-screen">
      <div className="bg-[var(--charcoal)] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-4xl text-white mb-1">Admin Panel</h1>
          <p className="font-body text-sm text-[#B0A090]">Manage The Gentle Paws Collective</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-[#F0E8E0] pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-[var(--charcoal)] text-white'
                  : 'bg-[var(--cream)] text-[var(--charcoal)] hover:bg-[var(--pink)]/20'
              }`}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl text-[var(--charcoal)]">Events ({events.length})</h2>
              <button onClick={() => setShowEventForm(true)} className="btn-primary">+ New Event</button>
            </div>

            {showEventForm && (
              <div className="card p-6 mb-6 space-y-4">
                <h3 className="font-display text-xl text-[var(--charcoal)]">Create Event</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="input" placeholder="Title *" value={eventForm.title} onChange={(e) => setEventForm(p => ({ ...p, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') }))} />
                  <input className="input" placeholder="Slug *" value={eventForm.slug} onChange={(e) => setEventForm(p => ({ ...p, slug: e.target.value }))} />
                  <input type="date" className="input" value={eventForm.date} onChange={(e) => setEventForm(p => ({ ...p, date: e.target.value }))} />
                  <input type="time" className="input" value={eventForm.time} onChange={(e) => setEventForm(p => ({ ...p, time: e.target.value }))} />
                  <input className="input" placeholder="Location" value={eventForm.location} onChange={(e) => setEventForm(p => ({ ...p, location: e.target.value }))} />
                  <input type="number" className="input" placeholder="Total spots" value={eventForm.spots_total} onChange={(e) => setEventForm(p => ({ ...p, spots_total: e.target.value }))} />
                  <select className="input" value={eventForm.type} onChange={(e) => setEventForm(p => ({ ...p, type: e.target.value }))}>
                    <option value="in-person">In-Person</option>
                    <option value="virtual">Virtual</option>
                  </select>
                  <input className="input" placeholder="Drive path for cover (e.g. events/upcoming/slug.jpg)" value={eventForm.cover_image_drive_path} onChange={(e) => setEventForm(p => ({ ...p, cover_image_drive_path: e.target.value }))} />
                </div>
                <textarea className="input resize-none" rows={3} placeholder="Description" value={eventForm.description} onChange={(e) => setEventForm(p => ({ ...p, description: e.target.value }))} />
                <div className="flex gap-3">
                  <button onClick={createEvent} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Create Event'}</button>
                  <button onClick={() => setShowEventForm(false)} className="btn-ghost">Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="card p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <h4 className="font-display text-base text-[var(--charcoal)]">{event.title}</h4>
                    <p className="text-xs font-body text-[#B0A090]">
                      {new Date(event.date).toLocaleDateString()} · {event.type} · {event.status}
                    </p>
                  </div>
                  <button onClick={() => deleteEvent(event.id)} className="text-[var(--red)] text-xs font-body hover:underline">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Blog Tab */}
        {activeTab === 'blog' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl text-[var(--charcoal)]">Blog Posts ({posts.length})</h2>
              <button onClick={() => setShowBlogForm(true)} className="btn-primary">+ New Post</button>
            </div>

            {showBlogForm && (
              <div className="card p-6 mb-6 space-y-4">
                <h3 className="font-display text-xl text-[var(--charcoal)]">Create Post</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="input" placeholder="Title *" value={blogForm.title} onChange={(e) => setBlogForm(p => ({ ...p, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-') }))} />
                  <input className="input" placeholder="Slug *" value={blogForm.slug} onChange={(e) => setBlogForm(p => ({ ...p, slug: e.target.value }))} />
                  <input className="input" placeholder="Tag (e.g. Rescue, Event Recap)" value={blogForm.tag} onChange={(e) => setBlogForm(p => ({ ...p, tag: e.target.value }))} />
                  <input type="number" className="input" placeholder="Read time (minutes)" value={blogForm.read_time} onChange={(e) => setBlogForm(p => ({ ...p, read_time: e.target.value }))} />
                  <input className="input md:col-span-2" placeholder="Drive path for cover image" value={blogForm.cover_image_drive_path} onChange={(e) => setBlogForm(p => ({ ...p, cover_image_drive_path: e.target.value }))} />
                </div>
                <textarea className="input resize-none" rows={2} placeholder="Excerpt" value={blogForm.excerpt} onChange={(e) => setBlogForm(p => ({ ...p, excerpt: e.target.value }))} />
                <textarea className="input resize-none" rows={8} placeholder="Content (Markdown supported)" value={blogForm.content} onChange={(e) => setBlogForm(p => ({ ...p, content: e.target.value }))} />
                <div className="flex gap-3">
                  <button onClick={createPost} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Publish Post'}</button>
                  <button onClick={() => setShowBlogForm(false)} className="btn-ghost">Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {posts.map((post) => (
                <div key={post.id} className="card p-4 flex items-center gap-4">
                  <div className="flex-1">
                    <h4 className="font-display text-base text-[var(--charcoal)]">{post.title}</h4>
                    <p className="text-xs font-body text-[#B0A090]">
                      {post.tag && `${post.tag} · `}{post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}
                    </p>
                  </div>
                  <button onClick={() => deletePost(post.id)} className="text-[var(--red)] text-xs font-body hover:underline">Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charities Tab */}
        {activeTab === 'charities' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-display text-2xl text-[var(--charcoal)]">Charities ({charities.length})</h2>
              <button onClick={() => setShowCharityForm(true)} className="btn-primary">+ New Charity</button>
            </div>

            {showCharityForm && (
              <div className="card p-6 mb-6 space-y-4">
                <h3 className="font-display text-xl text-[var(--charcoal)]">Add Charity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="input" placeholder="Name *" value={charityForm.name} onChange={(e) => setCharityForm(p => ({ ...p, name: e.target.value }))} />
                  <input className="input" placeholder="Animal type (e.g. Dogs & Cats)" value={charityForm.animal_type} onChange={(e) => setCharityForm(p => ({ ...p, animal_type: e.target.value }))} />
                  <input className="input" placeholder="Emoji (e.g. 🐕)" value={charityForm.emoji} onChange={(e) => setCharityForm(p => ({ ...p, emoji: e.target.value }))} />
                  <input type="number" className="input" placeholder="Goal amount ($)" value={charityForm.goal_amount} onChange={(e) => setCharityForm(p => ({ ...p, goal_amount: e.target.value }))} />
                  <input type="number" className="input" placeholder="Already raised ($)" value={charityForm.raised_amount} onChange={(e) => setCharityForm(p => ({ ...p, raised_amount: e.target.value }))} />
                </div>
                <textarea className="input resize-none" rows={3} placeholder="Description" value={charityForm.description} onChange={(e) => setCharityForm(p => ({ ...p, description: e.target.value }))} />
                <div className="flex gap-3">
                  <button onClick={createCharity} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Add Charity'}</button>
                  <button onClick={() => setShowCharityForm(false)} className="btn-ghost">Cancel</button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {charities.map((charity) => (
                <div key={charity.id} className="card p-4 flex items-center gap-4">
                  <div className="text-2xl">{charity.emoji}</div>
                  <div className="flex-1">
                    <h4 className="font-display text-base text-[var(--charcoal)]">{charity.name}</h4>
                    <p className="text-xs font-body text-[#8B7B72]">
                      ${Number(charity.raised_amount).toLocaleString()} / ${Number(charity.goal_amount).toLocaleString()} raised
                    </p>
                  </div>
                  <div>
                    <input
                      type="number"
                      className="input w-32 !py-1.5 !text-xs"
                      placeholder="Update raised $"
                      onKeyDown={async (e) => {
                        if (e.key === 'Enter') {
                          const val = Number((e.target as HTMLInputElement).value)
                          const supabase = createClient()
                          await supabase.from('charities').update({ raised_amount: val }).eq('id', charity.id)
                          await loadAll(supabase)
                        }
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ambassadors Tab */}
        {activeTab === 'ambassadors' && (
          <div>
            <h2 className="font-display text-2xl text-[var(--charcoal)] mb-6">
              Ambassador Applications ({applications.length})
            </h2>
            <div className="space-y-4">
              {applications.map((app: any) => (
                <div key={app.id} className="card p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-display text-lg text-[var(--charcoal)]">
                        {app.user?.full_name ?? app.user?.email}
                      </h4>
                      <p className="text-xs font-body text-[#B0A090]">
                        Applied {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`text-xs font-body font-medium px-3 py-1 rounded-full ${
                      app.approved === true ? 'bg-green-100 text-green-700' :
                      app.approved === false ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {app.approved === true ? 'Approved' : app.approved === false ? 'Declined' : 'Pending'}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm font-body text-[#4A3F38]"><strong>Why:</strong> {app.why_ambassador}</p>
                    {app.experience && <p className="text-sm font-body text-[#4A3F38]"><strong>Experience:</strong> {app.experience}</p>}
                  </div>
                  {app.approved === null && (
                    <div className="flex gap-2">
                      <button onClick={() => approveApplication(app.id, true)} className="btn-primary text-xs !py-2 !px-4">Approve</button>
                      <button onClick={() => approveApplication(app.id, false)} className="btn-red text-xs !py-2 !px-4">Decline</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div>
            <h2 className="font-display text-2xl text-[var(--charcoal)] mb-6">Award Badges</h2>
            <div className="card p-6 mb-8">
              <h3 className="font-display text-xl text-[var(--charcoal)] mb-4">Manually Award a Badge</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <select className="input" value={badgeAward.userId} onChange={(e) => setBadgeAward(p => ({ ...p, userId: e.target.value }))}>
                  <option value="">Select member...</option>
                  {allUsers.map((u) => (
                    <option key={u.id} value={u.id}>{u.full_name ?? u.email}</option>
                  ))}
                </select>
                <select className="input" value={badgeAward.badgeId} onChange={(e) => setBadgeAward(p => ({ ...p, badgeId: e.target.value }))}>
                  <option value="">Select badge...</option>
                  {allBadges.map((b) => (
                    <option key={b.id} value={b.id}>{b.emoji} {b.name}</option>
                  ))}
                </select>
              </div>
              <button onClick={awardBadgeToUser} disabled={!badgeAward.userId || !badgeAward.badgeId} className="btn-primary">Award Badge</button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {allBadges.map((badge) => (
                <div key={badge.id} className="card-cream p-4 text-center">
                  <div className="text-3xl mb-2">{badge.emoji}</div>
                  <h4 className="font-display text-base text-[var(--charcoal)]">{badge.name}</h4>
                  <span className={`text-xs font-body ${
                    badge.rarity === 'legendary' ? 'badge-rarity-legendary' :
                    badge.rarity === 'epic' ? 'badge-rarity-epic' :
                    badge.rarity === 'rare' ? 'badge-rarity-rare' :
                    'badge-rarity-common'
                  }`}>{badge.rarity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Donations Tab */}
        {activeTab === 'donations' && (
          <div>
            <h2 className="font-display text-2xl text-[var(--charcoal)] mb-6">
              Donations ({donations.length})
            </h2>
            <div className="card overflow-hidden">
              <table className="w-full text-sm font-body">
                <thead className="bg-[var(--cream)]">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#8B7B72]">User</th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#8B7B72]">Charity</th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#8B7B72]">Amount</th>
                    <th className="text-left px-4 py-3 text-xs uppercase tracking-wider text-[#8B7B72]">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(donations as any[]).map((d, i) => (
                    <tr key={d.id} className={i % 2 === 0 ? '' : 'bg-[var(--cream)]/30'}>
                      <td className="px-4 py-3 text-[var(--charcoal)]">{d.user?.email ?? 'Guest'}</td>
                      <td className="px-4 py-3 text-[#6B5B52]">{d.charity?.name ?? '—'}</td>
                      <td className="px-4 py-3 font-medium text-[var(--charcoal)]">${Number(d.amount).toFixed(2)}</td>
                      <td className="px-4 py-3 text-[#B0A090]">{new Date(d.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
