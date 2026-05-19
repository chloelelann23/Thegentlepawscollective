'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--cream)] via-[var(--white)] to-[#FFF0F5] px-6 pt-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="card w-full max-w-lg p-12 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="text-7xl mb-6"
        >
          💝
        </motion.div>

        <h1 className="font-display text-4xl text-[var(--charcoal)] mb-4">
          Thank you, babe!
        </h1>

        <p className="font-body text-base text-[#6B5B52] mb-4 leading-relaxed">
          Your donation is going to make a real difference for animals in need.
          You&apos;ve earned <span className="font-medium text-[var(--charcoal)]">75 points</span> and
          your generosity has been logged in your profile.
        </p>

        <p className="slogan text-xl text-[var(--pink)] mb-8">
          Hot Girls Rescue Animals
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/charities" className="btn-primary">
            Give Again
          </Link>
          <Link href="/profile" className="btn-secondary">
            View My Profile
          </Link>
          <Link href="/" className="btn-ghost">
            Go Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
