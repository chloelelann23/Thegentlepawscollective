'use client'

import { useState } from 'react'
import BlogCard from '@/components/BlogCard'
import type { BlogPost } from '@/lib/types'

interface BlogFilterClientProps {
  posts: BlogPost[]
  tags: string[]
}

export default function BlogFilterClient({ posts, tags }: BlogFilterClientProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filtered = activeTag ? posts.filter((p) => p.tag === activeTag) : posts

  return (
    <>
      {/* Tag filter */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 py-8">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 ${
              !activeTag
                ? 'bg-[var(--charcoal)] text-white'
                : 'bg-[var(--cream)] text-[var(--charcoal)] hover:bg-[var(--pink)]/20'
            }`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 ${
                activeTag === tag
                  ? 'bg-[var(--charcoal)] text-white'
                  : 'bg-[var(--cream)] text-[var(--charcoal)] hover:bg-[var(--pink)]/20'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20 card">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="font-display text-2xl text-[var(--charcoal)] mb-2">No posts yet</h3>
          <p className="font-body text-sm text-[#8B7B72]">Stories from our community will appear here soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <BlogCard key={post.id} post={post} index={i} />
          ))}
        </div>
      )}
    </>
  )
}
