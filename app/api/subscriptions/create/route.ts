import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createMonthlyGivingCheckout } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  try {
    const { charityId, amount } = await request.json()

    if (!charityId || !amount || amount < 1) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: charity } = await supabase
      .from('charities')
      .select('name')
      .eq('id', charityId)
      .single()

    if (!charity) {
      return NextResponse.json({ error: 'Charity not found' }, { status: 404 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

    const session = await createMonthlyGivingCheckout({
      charityId,
      charityName: charity.name,
      amount: Number(amount),
      userId: user?.id,
      userEmail: user?.email,
      successUrl: `${appUrl}/donate/thank-you?session_id={CHECKOUT_SESSION_ID}&monthly=true`,
      cancelUrl: `${appUrl}/charities`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Monthly giving checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}
