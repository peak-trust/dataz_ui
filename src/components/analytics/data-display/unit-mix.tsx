"use client"

import * as React from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { ColorDot, roomColors } from '@/components/ui/color-dot'
import { formatCurrency } from '@/lib/analytics/utils/format'

interface UnitMixItem {
  type: string // Studio, 1BR, 2BR, etc.
  units: number
  sizeMin: number // in sqft
  sizeMax: number // in sqft
  priceMin: number
  priceMax: number
  avgPricePerSqft: number
}

interface UnitMixProps {
  data: UnitMixItem[]
  title?: string
  totalUnits?: number
  className?: string
}

function formatSize(sqft: number): string {
  return sqft.toLocaleString()
}

function formatPriceCompact(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `${Math.round(value / 1_000)}K`
  }
  return value.toLocaleString()
}

// Progress bar component with animation
function ProgressBar({
  percentage,
  color,
  animate = true,
}: {
  percentage: number
  color: string
  animate?: boolean
}) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
      <motion.div
        initial={animate ? { width: 0 } : undefined}
        animate={isInView ? { width: `${percentage}%` } : undefined}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  )
}

export function UnitMix({
  data,
  title = "Unit Mix",
  totalUnits,
  className,
}: UnitMixProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  // Calculate total units if not provided
  const total = totalUnits ?? data.reduce((sum, item) => sum + item.units, 0)

  // Calculate max units for relative bar sizing
  const maxUnits = Math.max(...data.map(item => item.units))

  if (data.length === 0) {
    return (
      <div className={cn('rounded-xl border border-white/10 bg-white/[0.02] p-6', className)}>
        <h3 className="text-base font-semibold mb-4">{title}</h3>
        <div className="text-center py-8 text-muted-foreground">
          No unit data available
        </div>
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className={cn('rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden', className)}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 bg-gradient-to-r from-white/[0.02] to-transparent">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">{title}</h3>
          <span className="text-sm text-muted-foreground">
            {total.toLocaleString()} units
          </span>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Type
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground w-20">
                Units
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground min-w-[180px]">
                Distribution
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Size Range
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Price Range
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Avg/sqft
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => {
              const color = roomColors[item.type] || '#5B93FF'
              const percentage = (item.units / total) * 100
              const barWidth = (item.units / maxUnits) * 100

              return (
                <tr
                  key={item.type}
                  className={cn(
                    'border-b border-white/5 hover:bg-white/[0.02] transition-colors',
                    idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.01]'
                  )}
                >
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-sm font-medium"
                      style={{
                        backgroundColor: `${color}15`,
                        color: color,
                      }}
                    >
                      <ColorDot color={color} size="sm" />
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-medium">{item.units}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <ProgressBar percentage={barWidth} color={color} />
                      </div>
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm">
                      {formatSize(item.sizeMin)} - {formatSize(item.sizeMax)} sqft
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm">
                      {formatPriceCompact(item.priceMin)} - {formatPriceCompact(item.priceMax)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-medium tabular-nums">
                      {item.avgPricePerSqft.toLocaleString()}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Stacked View */}
      <div className="md:hidden divide-y divide-white/5">
        {data.map((item) => {
          const color = roomColors[item.type] || '#5B93FF'
          const percentage = (item.units / total) * 100
          const barWidth = (item.units / maxUnits) * 100

          return (
            <div key={item.type} className="p-4 space-y-2">
              {/* Header row */}
              <div className="flex items-center justify-between">
                <span
                  className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-sm font-medium"
                  style={{
                    backgroundColor: `${color}15`,
                    color: color,
                  }}
                >
                  <ColorDot color={color} size="sm" />
                  {item.type}
                </span>
                <span className="text-sm font-medium">{item.units} units</span>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <ProgressBar percentage={barWidth} color={color} />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {percentage.toFixed(1)}%
                </span>
              </div>

              {/* Details row */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{formatSize(item.sizeMin)} - {formatSize(item.sizeMax)} sqft</span>
                <span>{formatPriceCompact(item.priceMin)} - {formatPriceCompact(item.priceMax)}</span>
                <span className="font-medium text-foreground">{item.avgPricePerSqft.toLocaleString()}/sqft</span>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
