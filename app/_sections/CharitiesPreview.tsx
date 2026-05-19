'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import CharityCard from '@/components/CharityCard'
import type { Charity } from '@/lib/types'

const DEMO_CHARITIES: Charity[] = [
  {
    id: 'demo-1',
    name: 'Best Friends Animal Society',
    description: "The nation's largest no-kill animal sanctuary — saving lives across the country since 1984.",
    animal_type: 'All Animals',
    emoji: '🐾',
    raised_amount: 3250,
    goal_amount: 5000,
    drive_image_path: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-2',
    name: 'ASPCA',
    description: 'Providing leadership in animal care, humane education, and advancing animal protection legislation across the US.',
    animal_type: 'Dogs & Cats',
    emoji: '🐕',
    raised_amount: 1800,
    goal_amount: 3000,
    drive_image_path: null,
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-3',
    name: 'Wild Horse Freedom Federation',
    description: "Defending America's wild horses and burros from slaughter, and working to restore their natural habitats.",
    animal_type: 'Horses',
    emoji: '🐴',
    raised_amount: 920,
    goal_amount: 2000,
    drive_image_path: null,
    created_at: new Date().toISOString(),
  },
]

export default function CharitiesPreview({ charities }: { charities: Charity[] }) {
  const displayCharities = charities.length > 0 ? charities : DEMO_CHARITIES

  return (
    <section className="py-24 bg-[var(--charcoal)]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-body text-xs text-[var(--pink)] uppercase tracking-[0.2em] mb-3 font-bold"
            >
              Making a Difference
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display font-light text-5xl md:text-6xl text-white"
            >
              Charities We Support
            </motion.h2>
          </div>
          <Link
            href="/charities"
            className="hidden md:flex items-center gap-2 font-body text-sm font-bold text-[var(--charcoal)] bg-[var(--pink)] hover:bg-[#E88EA8] px-5 py-2.5 rounded-full transition-all duration-200"
          >
            See all
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Pull quote */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-14 border-l-4 border-[var(--pink)] pl-6"
        >
          <p className="font-display italic text-white/70 text-2xl md:text-3xl">
            &ldquo;Every rescue is a love story.&rdquo;
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCharities.map((charity, i) => (
            <CharityCard key={charity.id} charity={charity} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
