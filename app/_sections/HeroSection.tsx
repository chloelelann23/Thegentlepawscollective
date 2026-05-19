'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

function CatEarsSVG() {
  return (
    <svg width="120" height="80" viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[var(--pink)] opacity-30">
      <path d="M20 70 L20 20 L50 50 Z"/>
      <path d="M100 70 L100 20 L70 50 Z"/>
    </svg>
  )
}

function DogSnoutSVG() {
  return (
    <svg width="100" height="80" viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[var(--pink)] opacity-20">
      <ellipse cx="50" cy="45" rx="30" ry="22"/>
      <ellipse cx="50" cy="38" rx="16" ry="10"/>
      <circle cx="50" cy="36" r="3" fill="currentColor"/>
      <path d="M50 39 C45 43 38 44 35 42"/>
      <path d="M50 39 C55 43 62 44 65 42"/>
      <circle cx="34" cy="26" r="6"/>
      <circle cx="66" cy="26" r="6"/>
    </svg>
  )
}

function HorseSVG() {
  return (
    <svg width="80" height="100" viewBox="0 0 80 100" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-[var(--pink)] opacity-20">
      <path d="M20 80 C20 60 30 50 40 40 C50 30 60 25 65 20"/>
      <path d="M65 20 C62 14 58 10 60 5"/>
      <path d="M60 5 C55 8 52 15 55 22"/>
      <ellipse cx="40" cy="42" rx="15" ry="10" transform="rotate(-20 40 42)"/>
      <path d="M25 78 L22 100"/>
      <path d="M35 82 L33 100"/>
    </svg>
  )
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--white)]">
      {/* Background texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--cream)] via-[var(--white)] to-[#FFF0F5] pointer-events-none" />

      {/* Decorative illustrations */}
      <div className="absolute top-24 left-8 md:left-16 animate-float pointer-events-none">
        <CatEarsSVG />
      </div>
      <div className="absolute bottom-32 right-8 md:right-20 animate-float pointer-events-none" style={{ animationDelay: '2s' }}>
        <DogSnoutSVG />
      </div>
      <div className="absolute top-1/2 right-4 md:right-10 -translate-y-1/2 animate-float pointer-events-none" style={{ animationDelay: '4s' }}>
        <HorseSVG />
      </div>

      {/* Subtle paw prints */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{
            left: `${[15, 25, 70, 80, 45, 60][i]}%`,
            top: `${[20, 75, 15, 65, 45, 85][i]}%`,
            opacity: 0.06,
          }}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6 + i, repeat: Infinity, delay: i * 1.2 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--pink)">
            <circle cx="7" cy="4" r="2"/>
            <circle cx="17" cy="4" r="2"/>
            <circle cx="4" cy="10" r="2"/>
            <circle cx="20" cy="10" r="2"/>
            <path d="M12 22c-4 0-7-3-7-6s2-4 4-4h6c2 0 4 1 4 4s-3 6-7 6z"/>
          </svg>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[var(--pink)]/15 rounded-full px-4 py-1.5 mb-8">
            <span className="text-sm">🐾</span>
            <span className="text-xs font-body font-medium text-[var(--charcoal)] uppercase tracking-widest">
              Community · Rescue · Love
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-display font-light text-6xl md:text-8xl text-[var(--charcoal)] mb-4 leading-[1.05]"
        >
          The Gentle Paws
          <br />
          <span className="text-[var(--pink)]">Collective</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="slogan text-2xl md:text-3xl text-[var(--charcoal)] mb-10"
        >
          Hot Girls Rescue Animals
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="font-body text-base md:text-lg text-[#6B5B52] max-w-lg mx-auto mb-10 leading-relaxed"
        >
          Hey babes! We&apos;re a community of girls who show up for animals in need —
          rescuing, fostering, advocating, and fundraising together.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/auth/signup" className="btn-primary text-base !px-8 !py-4 shadow-soft-lg">
            Join the Collective 🐾
          </Link>
          <Link href="/events" className="btn-secondary text-base !px-8 !py-4">
            See Upcoming Events
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--pink)" strokeWidth="2">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
        </svg>
      </motion.div>
    </section>
  )
}
