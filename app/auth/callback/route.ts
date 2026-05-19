import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { awardNewSproutBadge } from '@/lib/badges'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
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
      }
    }
  }

  return NextResponse.redirect(`${origin}${redirect}`)
}
