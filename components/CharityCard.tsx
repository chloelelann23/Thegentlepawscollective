'use client'

import { motion } from 'framer-motion'
import type { Charity } from '@/lib/types'
import ProgressBar from './ui/ProgressBar'
import DonateButton from './DonateButton'
import MonthlyGivingButton from './MonthlyGivingButton'
import DriveImage from './DriveImage'

interface CharityCardProps {
  charity: Charity
  index?: number
}

export default function CharityCard({ charity, index = 0 }: CharityCardProps) {
  const percentRaised = Math.min(100, Math.round((charity.raised_amount / charity.goal_amount) * 100))
  const formattedRaised = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(charity.raised_amount)
  const formattedGoal = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(charity.goal_amount)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card hover:shadow-soft-lg transition-all duration-300 overflow-hidden"
    >
      <div className="relative h-52 overflow-hidden bg-[var(--cream)]">
        {charity.drive_image_path ? (
          <DriveImage
            drivePath={charity.drive_image_path}
            alt={charity.name}
            fill
            className="object-cover"
          />
        ) : (
          <>
            <DriveImage
              drivePath={null}
              alt={charity.name}
              fill
              fallbackSrc={`https://picsum.photos/seed/charity-${charity.id}/700/400`}
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--charcoal)]/60 to-transparent" />
            <div className="absolute bottom-3 left-4 text-4xl">{charity.emoji}</div>
          </>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-display text-xl text-[var(--charcoal)]">{charity.name}</h3>
            {charity.animal_type && (
              <span className="text-xs font-body text-[var(--pink)] font-medium">
                {charity.emoji} {charity.animal_type}
              </span>
            )}
          </div>
          {percentRaised >= 100 && (
            <span className="text-xs font-body font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700 shrink-0">
              Goal Reached!
            </span>
          )}
        </div>

        {charity.description && (
          <p className="text-sm font-body text-[#6B5B52] mb-4 leading-relaxed line-clamp-3">
            {charity.description}
          </p>
        )}

        <div className="mb-4">
          <ProgressBar
            value={charity.raised_amount}
            max={charity.goal_amount}
            label={`${formattedRaised} raised`}
            showPercent
          />
          <p className="text-xs font-body text-[#B0A090] mt-1.5">Goal: {formattedGoal}</p>
        </div>

        <DonateButton charityId={charity.id} charityName={charity.name} />
        <MonthlyGivingButton charityId={charity.id} charityName={charity.name} />
      </div>
    </motion.div>
  )
}
