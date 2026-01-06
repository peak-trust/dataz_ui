"use client"

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import type { Timeframe } from '@/lib/analytics/types'

interface TimeframeSelectorProps {
  value: Timeframe
  onChange: (timeframe: Timeframe) => void
  className?: string
}

const timeframes: { value: Timeframe; label: string }[] = [
  { value: '1Y', label: '1Y' },
  { value: '2Y', label: '2Y' },
  { value: '3Y', label: '3Y' },
  { value: 'ALL', label: 'All' },
]

export function TimeframeSelector({
  value,
  onChange,
  className,
}: TimeframeSelectorProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg bg-white/5 p-1 gap-1',
        className
      )}
    >
      {timeframes.map((tf) => (
        <button
          key={tf.value}
          onClick={() => onChange(tf.value)}
          className={cn(
            'relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
            value === tf.value
              ? 'text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {value === tf.value && (
            <motion.div
              layoutId="timeframe-indicator"
              className="absolute inset-0 bg-white/10 rounded-md"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative z-10">{tf.label}</span>
        </button>
      ))}
    </div>
  )
}
