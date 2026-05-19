'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

interface StatsBarProps {
  totalRaised: number
  totalMembers: number
  totalCharities: number
  totalEvents: number
}

function CountUp({ end, prefix = '', suffix = '' }: { end: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const duration = 1800
    const steps = 60
    const stepDuration = duration / steps
    const increment = end / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [end, isInView])

  const formatted = end >= 1000
    ? count.toLocaleString()
    : count.toString()

  return <span ref={ref}>{prefix}{formatted}{suffix}</span>
}

const stats = [
  { key: 'raised', label: 'Total Raised', icon: '💝', prefix: '$', suffix: '' },
  { key: 'members', label: 'Members', icon: '🐾', prefix: '', suffix: '+' },
  { key: 'charities', label: 'Charities Supported', icon: '🏥', prefix: '', suffix: '' },
  { key: 'events', label: 'Events Hosted', icon: '✨', prefix: '', suffix: '+' },
]

export default function StatsBar({ totalRaised, totalMembers, totalCharities, totalEvents }: StatsBarProps) {
  const values = {
    raised: totalRaised,
    members: totalMembers,
    charities: totalCharities,
    events: totalEvents,
  }

  return (
    <section className="bg-[var(--charcoal)] py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="text-center"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="font-display text-3xl md:text-4xl text-[var(--white)] font-light">
                <CountUp
                  end={values[stat.key as keyof typeof values]}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>
              <p className="font-body text-xs text-[#B0A090] mt-1 uppercase tracking-wider">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
