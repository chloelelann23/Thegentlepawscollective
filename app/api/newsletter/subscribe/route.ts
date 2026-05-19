import { NextRequest, NextResponse } from 'next/server'
import { subscribeToNewsletter, unsubscribeFromNewsletter } from '@/lib/brevo'

export async function POST(request: NextRequest) {
  const { email, name, unsubscribe } = await request.json()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  if (unsubscribe) {
    await unsubscribeFromNewsletter(email)
    return NextResponse.json({ success: true })
  }

  const ok = await subscribeToNewsletter(email, name)
  if (!ok) {
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
