import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { awardPoints } from '@/lib/points'
import { checkAndAwardBadges, awardSustainerBadge } from '@/lib/badges'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event
  try {
    event = constructWebhookEvent(body, signature)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceClient()

  if (event.type === 'checkout.session.completed') {
    const raw = event.data.object as any
    const { charityId, userId, amount, type } = raw.metadata as Record<string, string>

    if (type === 'monthly') {
      await supabase.from('subscriptions').insert({
        user_id: userId || null,
        charity_id: charityId,
        stripe_subscription_id: raw.subscription as string,
        stripe_customer_id: raw.customer as string,
        amount: Number(amount),
        status: 'active',
      })

      if (userId) {
        await awardPoints(supabase, userId, 'MONTHLY_GIVING')
        await awardSustainerBadge(userId)
      }
    } else {
      await supabase.from('donations').insert({
        user_id: userId || null,
        charity_id: charityId,
        amount: Number(amount),
        stripe_payment_intent_id: raw.payment_intent as string,
      })

      const { data: charity } = await supabase
        .from('charities')
        .select('raised_amount')
        .eq('id', charityId)
        .single()

      if (charity) {
        await supabase
          .from('charities')
          .update({ raised_amount: Number(charity.raised_amount) + Number(amount) })
          .eq('id', charityId)
      }

      if (userId) {
        await awardPoints(supabase, userId, 'DONATE')
        await checkAndAwardBadges(userId)
      }
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as any
    await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('stripe_subscription_id', sub.id)
  }

  if (event.type === 'customer.subscription.updated') {
    const sub = event.data.object as any
    const status = sub.status === 'active'
      ? 'active'
      : sub.status === 'past_due'
      ? 'past_due'
      : 'cancelled'
    await supabase
      .from('subscriptions')
      .update({ status })
      .eq('stripe_subscription_id', sub.id)
  }

  return NextResponse.json({ received: true })
}
