import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'
export const revalidate = 3600

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const videoUrl = searchParams.get('url')

  if (!videoUrl) {
    return NextResponse.json({ embeds: getMockEmbeds() })
  }

  try {
    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(videoUrl)}`
    const res = await fetch(oembedUrl, { next: { revalidate: 3600 } })

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch embed' }, { status: 200 })
    }

    const data = await res.json()
    return NextResponse.json({ embed: data }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
      },
    })
  } catch {
    return NextResponse.json({ embed: null })
  }
}

function getMockEmbeds() {
  return [
    {
      html: '<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@thegentlepawscollective" data-video-id="1"><section></section></blockquote>',
      title: 'Watch us rescue 3 kittens from a storm drain 🐱',
      thumbnail_url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400',
      author_name: 'thegentlepawscollective',
      permalink: 'https://tiktok.com/@thegentlepawscollective',
    },
    {
      html: '<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@thegentlepawscollective" data-video-id="2"><section></section></blockquote>',
      title: 'GRWM: Going to an animal rescue event ✨',
      thumbnail_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400',
      author_name: 'thegentlepawscollective',
      permalink: 'https://tiktok.com/@thegentlepawscollective',
    },
    {
      html: '<blockquote class="tiktok-embed" cite="https://www.tiktok.com/@thegentlepawscollective" data-video-id="3"><section></section></blockquote>',
      title: 'Adoption event recap — 12 animals found homes!!',
      thumbnail_url: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400',
      author_name: 'thegentlepawscollective',
      permalink: 'https://tiktok.com/@thegentlepawscollective',
    },
  ]
}
