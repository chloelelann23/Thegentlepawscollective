import Stripe from 'stripe'

function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

export async function createDonationCheckout({
  charityId,
  charityName,
  amount,
  userId,
  userEmail,
  successUrl,
  cancelUrl,
}: {
  charityId: string
  charityName: string
  amount: number
  userId?: string
  userEmail?: string
  successUrl: string
  cancelUrl: string
}) {
  const stripe = getStripe()
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: userEmail,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Donation to ${charityName}`,
            description: `Supporting ${charityName} through The Gentle Paws Collective`,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      charityId,
      userId: userId ?? '',
      amount: amount.toString(),
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  })

  return session
}

export async function createMonthlyGivingCheckout({
  charityId,
  charityName,
  amount,
  userId,
  userEmail,
  successUrl,
  cancelUrl,
}: {
  charityId: string
  charityName: string
  amount: number
  userId?: string
  userEmail?: string
  successUrl: string
  cancelUrl: string
}) {
  const stripe = getStripe()

  const priceData = await stripe.prices.create({
    currency: 'usd',
    unit_amount: Math.round(amount * 100),
    recurring: { interval: 'month' },
    product_data: {
      name: `Monthly giving to ${charityName}`,
      metadata: { charityId },
    },
  })

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: userEmail,
    line_items: [{ price: priceData.id, quantity: 1 }],
    metadata: {
      charityId,
      userId: userId ?? '',
      amount: amount.toString(),
      type: 'monthly',
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  })

  return session
}

export async function cancelStripeSubscription(subscriptionId: string) {
  const stripe = getStripe()
  return stripe.subscriptions.cancel(subscriptionId)
}

export function constructWebhookEvent(payload: string | Buffer, signature: string) {
  const stripe = getStripe()
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET!
  )
}
