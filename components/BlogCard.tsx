'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { BlogPost } from '@/lib/types'
import DriveImage from './DriveImage'

interface BlogCardProps {
  post: BlogPost
  index?: number
}

export default function BlogCard({ post, index = 0 }: BlogCardProps) {
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : ''

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="card group hover:shadow-soft-lg transition-all duration-300 border-t-4 border-t-[var(--pink)]"
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative h-56 overflow-hidden">
          <DriveImage
            drivePath={post.cover_image_drive_path}
            alt={post.title}
            fill
            fallbackSrc={`https://picsum.photos/seed/blog-${post.id}/700/460`}
            className="group-hover:scale-105 transition-transform duration-500"
          />
          {post.tag && (
            <div className="absolute top-3 left-3">
              <span className="text-xs font-body font-medium px-2.5 py-1 rounded-full bg-[var(--white)]/90 text-[var(--charcoal)]">
                {post.tag}
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2 text-xs font-body text-[#B0A090]">
          <span>{publishedDate}</span>
          {post.read_time && (
            <>
              <span>·</span>
              <span>{post.read_time} min read</span>
            </>
          )}
          {post.author?.full_name && (
            <>
              <span>·</span>
              <span>by {post.author.full_name}</span>
            </>
          )}
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-display text-xl text-[var(--charcoal)] mb-2 group-hover:text-[var(--pink)] transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {post.excerpt && (
          <p className="text-sm font-body text-[#6B5B52] leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        )}

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-sm font-body font-medium text-[var(--charcoal)] hover:text-[var(--pink)] transition-colors mt-4"
        >
          Read more
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </motion.article>
  )
}
