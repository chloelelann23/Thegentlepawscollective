import { createClient } from '@/lib/supabase/server'
import BlogCard from '@/components/BlogCard'
import type { Metadata } from 'next'
import BlogFilterClient from './BlogFilterClient'

export const metadata: Metadata = {
  title: 'Stories',
  description: 'Stories, rescues, and updates from The Gentle Paws Collective.',
}

export const revalidate = 3600

export default async function BlogPage() {
  const supabase = createClient()

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*, author:users(full_name)')
    .not('published_at', 'is', null)
    .order('published_at', { ascending: false })

  const tagSet = new Set(posts?.map((p) => p.tag).filter(Boolean) as string[])
  const tags = Array.from(tagSet)

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-b from-[var(--cream)] to-[var(--white)] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-body text-sm text-[var(--pink)] uppercase tracking-widest mb-3 font-medium">
            From the Community
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-[var(--charcoal)] mb-4">
            Stories
          </h1>
          <p className="font-body text-base text-[#6B5B52] max-w-md mx-auto">
            Rescue stories, event recaps, adoption updates, and everything in between.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-20">
        <BlogFilterClient posts={posts as any ?? []} tags={tags} />
      </div>
    </div>
  )
}
