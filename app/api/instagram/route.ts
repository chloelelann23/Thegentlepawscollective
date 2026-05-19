import { NextResponse } from 'next/server'
import type { InstagramPost } from '@/lib/types'

export const runtime = 'edge'
export const revalidate = 3600 // 1 hour

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN
  const userId = process.env.INSTAGRAM_USER_ID

  if (!accessToken || !userId) {
    return NextResponse.json({ posts: getMockPosts() })
  }

  try {
    const fields = 'id,media_url,thumbnail_url,caption,permalink,media_type,timestamp'
    const url = `https://graph.instagram.com/${userId}/media?fields=${fields}&limit=6&access_token=${accessToken}`

    const res = await fetch(url, { next: { revalidate: 3600 } })

    if (!res.ok) {
      return NextResponse.json({ posts: getMockPosts() })
    }

    const data = await res.json()
    const posts: InstagramPost[] = data.data ?? []

    return NextResponse.json({ posts }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      },
    })
  } catch {
    return NextResponse.json({ posts: getMockPosts() })
  }
}

function getMockPosts(): InstagramPost[] {
  return [
    {
      id: '1',
      media_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
      caption: 'Rescue mission complete 🐾 These three found their forever homes this weekend! #GentlePaws #RescueAnimals',
      permalink: 'https://instagram.com/gentlepawscollective',
      media_type: 'IMAGE',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '2',
      media_url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400',
      caption: 'Hot girls rescue animals 💕 Community cleanup day was everything!',
      permalink: 'https://instagram.com/gentlepawscollective',
      media_type: 'IMAGE',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: '3',
      media_url: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400',
      caption: 'Meet Luna 🌙 She just graduated from her foster home to a forever family!',
      permalink: 'https://instagram.com/gentlepawscollective',
      media_type: 'IMAGE',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: '4',
      media_url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
      caption: 'Kitten season is here 🐱 We need fosters! DM us if you can help.',
      permalink: 'https://instagram.com/gentlepawscollective',
      media_type: 'IMAGE',
      timestamp: new Date(Date.now() - 345600000).toISOString(),
    },
    {
      id: '5',
      media_url: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400',
      caption: 'Bake sale raised $847 for our shelter partners 🧁 You babes are incredible!',
      permalink: 'https://instagram.com/gentlepawscollective',
      media_type: 'IMAGE',
      timestamp: new Date(Date.now() - 432000000).toISOString(),
    },
    {
      id: '6',
      media_url: 'https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=400',
      caption: 'Saturday adoption event recap ✨ 12 animals found homes. Tears were shed (happy ones!)',
      permalink: 'https://instagram.com/gentlepawscollective',
      media_type: 'IMAGE',
      timestamp: new Date(Date.now() - 518400000).toISOString(),
    },
  ]
}
