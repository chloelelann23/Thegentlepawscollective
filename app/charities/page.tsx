import { createClient } from '@/lib/supabase/server'
import CharityCard from '@/components/CharityCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Give',
  description: 'Support our partner animal charities and track our community impact.',
}

export const revalidate = 1800

export default async function CharitiesPage() {
  const supabase = createClient()

  const { data: charities } = await supabase
    .from('charities')
    .select('*')
    .order('raised_amount', { ascending: false })

  const totalRaised = charities?.reduce((sum, c) => sum + Number(c.raised_amount), 0) ?? 0
  const formattedTotal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(totalRaised)

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-b from-[var(--cream)] to-[var(--white)] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-body text-sm text-[var(--pink)] uppercase tracking-widest mb-3 font-medium">
            Make a Difference
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-[var(--charcoal)] mb-4">
            Give
          </h1>
          <p className="font-body text-base text-[#6B5B52] max-w-md mx-auto mb-6">
            Every dollar goes directly to our partner charities helping animals in need.
          </p>
        </div>
      </div>

      {/* Impact banner */}
      <div className="bg-[var(--charcoal)] py-10 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-body text-sm text-[var(--pink)] uppercase tracking-widest mb-2 font-medium">
            Community Total
          </p>
          <p className="font-display text-5xl md:text-6xl text-white mb-2">
            {formattedTotal}
          </p>
          <p className="font-body text-sm text-[#B0A090]">
            raised by our community across {charities?.length ?? 0} partner charities
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {charities && charities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {charities.map((charity, i) => (
              <CharityCard key={charity.id} charity={charity as any} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 card">
            <div className="text-6xl mb-4">💝</div>
            <h3 className="font-display text-2xl text-[var(--charcoal)] mb-2">No charities yet</h3>
            <p className="font-body text-sm text-[#8B7B72]">Our partner charities will appear here soon!</p>
          </div>
        )}

        {/* How it works */}
        <div className="mt-20 bg-[var(--cream)] rounded-3xl p-10">
          <h2 className="font-display text-3xl text-[var(--charcoal)] text-center mb-10">
            How Your Donation Helps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { emoji: '💳', title: 'Secure Checkout', desc: 'Pay securely via Stripe — your info is always protected.' },
              { emoji: '🐾', title: 'Direct Impact', desc: '100% of your donation goes to the charity you choose.' },
              { emoji: '🌟', title: 'Earn Points', desc: 'Every donation earns you 75 points in the Collective.' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="font-display text-xl text-[var(--charcoal)] mb-2">{item.title}</h3>
                <p className="font-body text-sm text-[#6B5B52] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
