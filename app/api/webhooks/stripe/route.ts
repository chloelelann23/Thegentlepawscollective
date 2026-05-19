import { NextRequest, NextResponse } from 'next/server'
import { constructWebhookEvent } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { awardPoints } from '@/lib/points'
import { checkAndAwardBadges } from '@/lib/badges'

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
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const raw = event.data.object as unknown as {
      metadata: { charityId: string; userId: string; amount: string }
      payment_intent: string
    }
    const session = raw

    const { charityId, userId, amount } = session.metadata
    const supabase = createServiceClient()

    // Record donation
    await supabase.from('donations').insert({
      user_id: userId || null,
      charity_id: charityId,
      amount: Number(amount),
      stripe_payment_intent_id: session.payment_intent as string,
    })

    // Update charity raised amount
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

    // Award points and check badges for authenticated donors
    if (userId) {
      await awardPoints(supabase, userId, 'DONATE')
      await checkAndAwardBadges(userId)
    }
  }

  return NextResponse.json({ received: true })
}
