'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { InstagramPost } from '@/lib/types'

interface InstagramStripProps {
  initialPosts?: InstagramPost[]
}

export default function InstagramStrip({ initialPosts }: InstagramStripProps) {
  const [posts, setPosts] = useState<InstagramPost[]>(initialPosts ?? [])

  useEffect(() => {
    if (posts.length === 0) {
      fetch('/api/instagram')
        .then((r) => r.json())
        .then((data) => setPosts(data.posts ?? []))
        .catch(() => {})
    }
  }, [posts.length])

  if (posts.length === 0) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-2xl bg-[var(--cream)] animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
      {posts.slice(0, 6).map((post, i) => (
        <motion.a
          key={post.id}
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          className="relative aspect-square rounded-2xl overflow-hidden group"
        >
          <Image
            src={post.media_type === 'VIDEO' ? (post.thumbnail_url ?? post.media_url) : post.media_url}
            alt={post.caption?.slice(0, 60) ?? 'Instagram post'}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 33vw, 16vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-[var(--charcoal)]/0 group-hover:bg-[var(--charcoal)]/50 transition-all duration-300 flex items-end p-2">
            <p className="text-white text-xs font-body leading-tight line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {post.caption?.slice(0, 80)}
            </p>
          </div>
          {post.media_type === 'VIDEO' && (
            <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
          )}
        </motion.a>
      ))}
    </div>
  )
}
