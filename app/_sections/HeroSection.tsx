'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #C4607A 0%, #E08090 30%, #F2A0B4 65%, #F5EDE6 100%)' }}
    >
      {/* Background blobs */}
      <div className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full bg-white/[0.07] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-white/[0.09] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="min-h-screen grid lg:grid-cols-[1.15fr_0.85fr] items-center gap-10 py-28 lg:py-0">

          {/* Left: Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="inline-flex items-center gap-2 bg-white/25 backdrop-blur-sm rounded-full px-4 py-1.5 mb-8 border border-white/40"
            >
              <span className="text-sm">🐾</span>
              <span className="font-body text-xs font-semibold text-white uppercase tracking-[0.15em]">
                Community · Rescue · Love
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="font-display font-light text-white leading-[0.92] mb-6"
              style={{ fontSize: 'clamp(3.5rem, 8.5vw, 7.5rem)' }}
            >
              The Gentle<br />
              <em>Paws</em><br />
              Collective
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="font-display italic text-white/90 mb-8"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
            >
              Hot Girls Rescue Animals
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="font-body text-white/75 text-lg max-w-md mb-10 leading-relaxed"
            >
              A community of girls who show up for animals in need — rescuing, fostering, advocating, and fundraising together.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/auth/signup"
                className="bg-[var(--charcoal)] text-white font-body font-semibold text-base px-8 py-4 rounded-full hover:bg-[#404040] active:scale-95 transition-all duration-200 shadow-2xl"
              >
                Join the Collective 🐾
              </Link>
              <Link
                href="/events"
                className="bg-white/20 backdrop-blur text-white font-body font-semibold text-base px-8 py-4 rounded-full border border-white/40 hover:bg-white/30 active:scale-95 transition-all duration-200"
              >
                See Events →
              </Link>
            </motion.div>
          </div>

          {/* Right: Photo collage */}
          <div className="relative h-[460px] lg:h-[600px] hidden md:block">
            {/* Primary photo - tilted right */}
            <motion.div
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.3 }}
              className="absolute top-0 right-0 w-[74%] h-[68%] rounded-3xl overflow-hidden shadow-2xl"
              style={{ transform: 'rotate(3deg)' }}
            >
              <Image
                src="https://picsum.photos/seed/hero-rescue-dog/620/500"
                alt="Animal rescue volunteers"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
              <div className="absolute inset-0 bg-[#C4607A]/10" />
            </motion.div>

            {/* Secondary photo - tilted left */}
            <motion.div
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.55 }}
              className="absolute bottom-0 left-0 w-[60%] h-[55%] rounded-3xl overflow-hidden shadow-2xl border-[5px] border-white/80"
              style={{ transform: 'rotate(-4deg)' }}
            >
              <Image
                src="https://picsum.photos/seed/hero-cat-cozy/500/400"
                alt="Adoption day"
                fill
                style={{ objectFit: 'cover' }}
              />
            </motion.div>

            {/* Badge: animals rescued */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8, type: 'spring', stiffness: 150 }}
              className="absolute bottom-24 right-2 lg:right-6 bg-white rounded-2xl p-4 shadow-2xl z-20"
            >
              <div className="text-3xl mb-1.5">🐾</div>
              <p className="font-display text-3xl text-[var(--charcoal)] leading-none">50+</p>
              <p className="font-body text-xs text-[#8B7B72] font-medium mt-0.5">animals rescued</p>
            </motion.div>

            {/* Badge: members */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.0, type: 'spring', stiffness: 150 }}
              className="absolute top-10 left-4 lg:left-0 bg-[var(--charcoal)] rounded-2xl px-4 py-3 shadow-2xl z-20"
            >
              <p className="font-body text-[10px] text-[var(--pink)] font-bold uppercase tracking-wider mb-1">Members</p>
              <p className="font-display text-3xl text-white leading-none">200+</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.4, repeat: Infinity }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" opacity="0.65">
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </motion.div>
    </section>
  )
}
