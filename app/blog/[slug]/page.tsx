import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import DriveImage from '@/components/DriveImage'
import Link from 'next/link'

export const revalidate = 3600

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt')
    .eq('slug', params.slug)
    .single()

  return {
    title: post?.title ?? 'Story',
    description: post?.excerpt ?? undefined,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const supabase = createClient()

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*, author:users(full_name, avatar_url)')
    .eq('slug', params.slug)
    .single()

  if (!post || !post.published_at) notFound()

  const publishedDate = new Date(post.published_at).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="pt-16 min-h-screen">
      {/* Cover */}
      {post.cover_image_drive_path && (
        <div className="relative h-72 md:h-[28rem] bg-[var(--cream)]">
          <DriveImage
            drivePath={post.cover_image_drive_path}
            alt={post.title}
            fill
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--white)] via-transparent to-transparent" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-6">
          {post.tag && (
            <span className="text-xs font-body font-medium px-3 py-1 rounded-full bg-[var(--pink)]/20 text-[var(--charcoal)]">
              {post.tag}
            </span>
          )}
          <span className="text-xs font-body text-[#B0A090]">{publishedDate}</span>
          {post.read_time && (
            <span className="text-xs font-body text-[#B0A090]">{post.read_time} min read</span>
          )}
        </div>

        <h1 className="font-display text-4xl md:text-5xl text-[var(--charcoal)] mb-6 leading-tight">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="font-body text-lg text-[#6B5B52] mb-8 leading-relaxed border-l-4 border-[var(--pink)] pl-5">
            {post.excerpt}
          </p>
        )}

        {post.author && (
          <div className="flex items-center gap-3 mb-10 pb-10 border-b border-[#F0E8E0]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--pink)] to-[#E88EA8] flex items-center justify-center text-white font-display">
              {(post.author as any)?.full_name?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div>
              <p className="font-body text-sm font-medium text-[var(--charcoal)]">
                {(post.author as any)?.full_name ?? 'The Collective'}
              </p>
              <p className="text-xs font-body text-[#B0A090]">The Gentle Paws Collective</p>
            </div>
          </div>
        )}

        {/* Content */}
        {post.content && (
          <div className="prose-brand">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-[#F0E8E0]">
          <Link href="/blog" className="btn-secondary inline-flex">
            ← Back to Stories
          </Link>
        </div>
      </div>
    </div>
  )
}
