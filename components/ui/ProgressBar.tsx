'use client'

import { useEffect, useRef, useState } from 'react'

interface ProgressBarProps {
  value: number
  max: number
  label?: string
  showPercent?: boolean
  className?: string
}

export default function ProgressBar({ value, max, label, showPercent, className }: ProgressBarProps) {
  const [width, setWidth] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  const percent = Math.min(100, Math.round((value / max) * 100))

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWidth(percent)
        }
      },
      { threshold: 0.2 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [percent])

  return (
    <div ref={ref} className={className}>
      {(label || showPercent) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs font-body text-[#8B7B72]">{label}</span>}
          {showPercent && <span className="text-xs font-body font-medium text-[var(--charcoal)]">{percent}%</span>}
        </div>
      )}
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${width}%`, transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </div>
    </div>
  )
}
