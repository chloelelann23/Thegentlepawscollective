import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const badgeId = searchParams.get('badgeId')
  const userName = searchParams.get('name') ?? 'A Gentle Paws member'

  if (!badgeId) {
    return new Response('Missing badgeId', { status: 400 })
  }

  // edge runtime can't use createServiceClient directly — fetch badge via REST
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const res = await fetch(
    `${supabaseUrl}/rest/v1/badges?id=eq.${badgeId}&select=*`,
    { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } }
  )
  const [badge] = await res.json()

  if (!badge) return new Response('Badge not found', { status: 404 })

  const rarityColor: Record<string, string> = {
    legendary: '#C8A84B',
    epic: '#9B59B6',
    rare: '#E8A4BE',
    common: '#A8B8A0',
  }

  const color = rarityColor[badge.rarity] ?? '#E8A4BE'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #FFF8F5 0%, #FFF0F5 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          padding: 40,
        }}
      >
        {/* Badge circle */}
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: `${color}22`,
            border: `4px solid ${color}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 96,
            marginBottom: 32,
          }}
        >
          {badge.emoji}
        </div>

        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: '#3D2C2C',
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          {badge.name}
        </div>

        <div
          style={{
            fontSize: 24,
            color: '#8B7B72',
            marginBottom: 32,
            textAlign: 'center',
            maxWidth: 600,
          }}
        >
          {badge.description}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 28, color: '#E8A4BE' }}>🐾</div>
          <div style={{ fontSize: 22, color: '#6B5B52' }}>
            Earned by <strong style={{ color: '#3D2C2C' }}>{userName}</strong>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 28,
            fontSize: 18,
            color: '#B0A090',
          }}
        >
          The Gentle Paws Collective
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
