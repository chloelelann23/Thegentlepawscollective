'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import BlogCard from '@/components/BlogCard'
import type { BlogPost } from '@/lib/types'

const DEMO_POSTS: BlogPost[] = [
  {
    id: 'demo-1',
    title: 'How Fostering Changed My Life — And Saved 12 Kittens',
    slug: '#',
    excerpt: "I never expected to become a foster mom to a litter of 12 kittens. But that one text from our rescue coordinator changed everything. Here's what happened next.",
    content: null,
    author_id: null,
    tag: 'Foster Stories',
    cover_image_drive_path: null,
    read_time: 5,
    published_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    author: {
      id: 'demo',
      email: '',
      full_name: 'Sofia Martinez',
      avatar_url: null,
      role: 'member',
      points: 0,
      created_at: '',
    },
  },
  {
    id: 'demo-2',
    title: 'The Ultimate Guide to Your First Adoption Event',
    slug: '#',
    excerpt: "Nervous about attending your first adoption event? We've got you covered with tips on what to bring and how to make the most of the day.",
    content: null,
    author_id: null,
    tag: 'Tips & Guides',
    cover_image_drive_path: null,
    read_time: 4,
    published_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    author: {
      id: 'demo2',
      email: '',
      full_name: 'Chloe Bennett',
      avatar_url: null,
      role: 'member',
      points: 0,
      created_at: '',
    },
  },
  {
    id: 'demo-3',
    title: 'Meet Bella: From the Streets to Her Forever Home',
    slug: '#',
    excerpt: "Three months ago, Bella was found injured on the side of the road. Today, she's living her best life. This is her story.",
    content: null,
    author_id: null,
    tag: 'Rescue Stories',
    cover_image_drive_path: null,
    read_time: 3,
    published_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    author: {
      id: 'demo3',
      email: '',
      full_name: 'Maya Johnson',
      avatar_url: null,
      role: 'member',
      points: 0,
      created_at: '',
    },
  },
]

function FeaturedPost({ post }: { post: BlogPost }) {
  const publishedDate = post.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : ''

  return (
    <Link href={`/blog/${post.slug}`} className="block group h-full">
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        className="grid md:grid-cols-[1.3fr_1fr] rounded-3xl overflow-hidden shadow-xl h-full min-h-[360px]"
      >
        {/* Image side */}
        <div className="relative min-h-[240px]">
          <Image
            src={`https://picsum.photos/seed/featured-blog-${post.id}/700/520`}
            alt={post.title}
            fill
            style={{ objectFit: 'cover' }}
            className="group-hover:scale-105 transition-transform duration-700"
          />
          {post.tag && (
            <div className="absolute top-5 left-5">
              <span className="font-body text-xs font-bold bg-[var(--pink)] text-[var(--charcoal)] px-3 py-1.5 rounded-full shadow">
                {post.tag}
              </span>
            </div>
          )}
        </div>

        {/* Text side */}
        <div className="bg-[var(--charcoal)] p-8 lg:p-10 flex flex-col justify-between">
          <div>
            <p className="font-body text-xs text-[var(--pink)] font-bold uppercase tracking-widest mb-3">
              {publishedDate}
              {post.author?.full_name && ` · ${post.author.full_name}`}
            </p>
            <h3 className="font-display text-2xl lg:text-3xl text-white mb-4 leading-[1.15] group-hover:text-[var(--pink)] transition-colors duration-200">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="font-body text-white/55 text-sm leading-relaxed line-clamp-4">
                {post.excerpt}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 mt-8 font-body text-sm font-bold text-[var(--pink)]">
            Read Story
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </motion.article>
    </Link>
  )
}

export default function BlogPreview({ posts }: { posts: BlogPost[] }) {
  const displayPosts = posts.length > 0 ? posts : DEMO_POSTS
  const [featured, ...rest] = displayPosts

  return (
    <section className="py-24 bg-[var(--cream)]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-body text-xs text-[var(--pink)] uppercase tracking-[0.2em] mb-3 font-bold"
            >
              From the Community
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display font-light text-5xl md:text-6xl text-[var(--charcoal)]"
            >
              Latest Stories
            </motion.h2>
          </div>
          <Link
            href="/blog"
            className="hidden md:flex items-center gap-2 font-body text-sm font-semibold text-[var(--charcoal)] hover:text-[var(--pink)] transition-colors duration-200"
          >
            Read all stories
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Editorial: featured left + stack right */}
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6 items-start">
          <FeaturedPost post={featured} />

          <div className="flex flex-col gap-6">
            {rest.slice(0, 2).map((post, i) => (
              <BlogCard key={post.id} post={post} index={i + 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
