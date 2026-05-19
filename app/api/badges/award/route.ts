import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { targetUserId, badgeId } = await request.json()

  if (!targetUserId || !badgeId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const service = createServiceClient()
  const { error } = await service
    .from('user_badges')
    .insert({ user_id: targetUserId, badge_id: badgeId })

  if (error && !error.message.includes('unique')) {
    return NextResponse.json({ error: 'Failed to award badge' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
