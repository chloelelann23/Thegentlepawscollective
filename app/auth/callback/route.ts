import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { awardNewSproutBadge, awardMatchmakerBadge } from '@/lib/badges'
import { createServiceClient } from '@/lib/supabase/server'
import { awardPoints } from '@/lib/points'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const refCode = searchParams.get('ref')
  const redirect = searchParams.get('redirect') ?? '/'

  if (code) {
    const supabase = createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const service = createServiceClient()

      // Check if this is first time (user just created)
      const { data: existingBadge } = await service
        .from('user_badges')
        .select('id')
        .eq('user_id', data.user.id)
        .limit(1)
        .single()

      if (!existingBadge) {
        // New user — award New Sprout badge and initial points
        await awardNewSproutBadge(data.user.id)
        await service
          .from('users')
          .update({ points: 50 })
          .eq('id', data.user.id)

        // Process referral if present
        if (refCode) {
          const { data: referrer } = await service
            .from('users')
            .select('id')
            .eq('referral_code', refCode)
            .single()

          if (referrer && referrer.id !== data.user.id) {
            await service.from('referrals').insert({
              referrer_id: referrer.id,
              referred_id: data.user.id,
            }).then(() => {})

            await service
              .from('users')
              .update({ referred_by: referrer.id })
              .eq('id', data.user.id)

            // Referrer gets 100 pts + Matchmaker badge
            await awardPoints(service, referrer.id, 'REFERRAL_AWARD')
            await awardMatchmakerBadge(referrer.id)

            // New member gets 25 bonus pts for being referred (on top of 50 from JOIN)
            await awardPoints(service, data.user.id, 'REFERRED_JOIN')
          }
        }
      }
    }
  }

  return NextResponse.redirect(`${origin}${redirect}`)
}
