import { Suspense } from 'react'
import InstagramStrip from '@/components/InstagramStrip'
import TikTokEmbed from '@/components/TikTokEmbed'

async function fetchInstagramPosts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/instagram`, {
      next: { revalidate: 3600 },
    })
    const data = await res.json()
    return data.posts ?? []
  } catch {
    return []
  }
}

async function fetchTikTokEmbeds() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/tiktok`, {
      next: { revalidate: 3600 },
    })
    const data = await res.json()
    return data.embeds ?? []
  } catch {
    return []
  }
}

export default async function SocialSection() {
  const [instagramPosts, tiktokEmbeds] = await Promise.allSettled([
    fetchInstagramPosts(),
    fetchTikTokEmbeds(),
  ])

  const posts = instagramPosts.status === 'fulfilled' ? instagramPosts.value : []
  const embeds = tiktokEmbeds.status === 'fulfilled' ? tiktokEmbeds.value : []

  return (
    <>
      {/* Instagram */}
      <section className="py-20 bg-[var(--white)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="font-body text-sm text-[var(--pink)] uppercase tracking-widest mb-2 font-medium">
                Follow Along
              </p>
              <h2 className="section-title">
                @gentlepawscollective
              </h2>
            </div>
            <a
              href="https://instagram.com/gentlepawscollective"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex btn-secondary items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="2" width="20" height="20" rx="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
              </svg>
              Follow on Instagram
            </a>
          </div>
          <InstagramStrip initialPosts={posts} />
        </div>
      </section>

      {/* TikTok */}
      <section className="py-20 bg-[var(--cream)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="font-body text-sm text-[var(--pink)] uppercase tracking-widest mb-2 font-medium">
                Watch Our Videos
              </p>
              <h2 className="section-title">
                @thegentlepawscollective
              </h2>
            </div>
            <a
              href="https://tiktok.com/@thegentlepawscollective"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex btn-secondary items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.94a8.27 8.27 0 004.83 1.54V7.03a4.84 4.84 0 01-1.06-.34z"/>
              </svg>
              Follow on TikTok
            </a>
          </div>
          <TikTokEmbed initialVideos={embeds} />
        </div>
      </section>
    </>
  )
}
