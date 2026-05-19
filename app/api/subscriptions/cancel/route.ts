import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { cancelStripeSubscription } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { subscriptionId } = await request.json()
  if (!subscriptionId) {
    return NextResponse.json({ error: 'Missing subscriptionId' }, { status: 400 })
  }

  const service = createServiceClient()

  // Verify ownership
  const { data: sub } = await service
    .from('subscriptions')
    .select('id, stripe_subscription_id')
    .eq('id', subscriptionId)
    .eq('user_id', user.id)
    .single()

  if (!sub) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await cancelStripeSubscription(sub.stripe_subscription_id)

  await service
    .from('subscriptions')
    .update({ status: 'cancelled' })
    .eq('id', subscriptionId)

  return NextResponse.json({ success: true })
}
