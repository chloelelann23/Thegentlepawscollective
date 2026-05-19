'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface TikTokVideo {
  html?: string
  title: string
  thumbnail_url: string
  author_name: string
  permalink: string
}

interface TikTokEmbedProps {
  initialVideos?: TikTokVideo[]
}

export default function TikTokEmbed({ initialVideos }: TikTokEmbedProps) {
  const [videos, setVideos] = useState<TikTokVideo[]>(initialVideos ?? [])

  useEffect(() => {
    if (videos.length === 0) {
      fetch('/api/tiktok')
        .then((r) => r.json())
        .then((data) => setVideos(data.embeds ?? []))
        .catch(() => {})
    }
  }, [videos.length])

  if (videos.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="aspect-[9/16] rounded-3xl bg-[var(--cream)] animate-pulse max-h-80" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {videos.slice(0, 3).map((video, i) => (
        <motion.a
          key={i}
          href={video.permalink}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="card group overflow-hidden hover:shadow-soft-lg transition-all duration-300"
        >
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={video.thumbnail_url}
              alt={video.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--charcoal)">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            <div className="absolute top-3 right-3 bg-black/70 rounded-full p-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.94a8.27 8.27 0 004.83 1.54V7.03a4.84 4.84 0 01-1.06-.34z"/>
              </svg>
            </div>
          </div>

          <div className="p-4">
            <p className="text-xs font-body text-[var(--pink)] font-medium mb-1">@{video.author_name}</p>
            <h4 className="font-display text-base text-[var(--charcoal)] line-clamp-2">{video.title}</h4>
          </div>
        </motion.a>
      ))}
    </div>
  )
}
