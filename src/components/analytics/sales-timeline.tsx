"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils/cn"
import type { SaleHistoryEntry } from "@/lib/analytics/types"

interface SalesTimelineProps {
  /** Array of sale history entries, ordered by date ascending */
  history: SaleHistoryEntry[]
  /** Current transaction price for highlighting */
  currentPrice?: number
  /** Show confidence indicator */
  showConfidence?: boolean
  /** Additional class names */
  className?: string
}

/**
 * Vertical timeline showing sale history for a property
 * Most recent sale at top, oldest at bottom
 */
export function SalesTimeline({
  history,
  currentPrice,
  className,
}: SalesTimelineProps) {
  if (!history || history.length === 0) {
    return (
      <div className={cn("text-sm text-muted-foreground py-8 text-center", className)}>
        No sale history available
      </div>
    )
  }

  // Reverse to show most recent first
  const sortedHistory = [...history].reverse()

  return (
    <div className={cn("relative", className)}>
      {/* Timeline line */}
      <div className="absolute left-[7px] top-4 bottom-4 w-px bg-white/10" />

      {/* Timeline entries */}
      <div className="space-y-0">
        {sortedHistory.map((entry, index) => {
          const isLatest = index === 0
          const isFirst = entry.isFirstSale

          return (
            <motion.div
              key={entry.saleSequence}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative pl-6 py-3"
            >
              {/* Timeline dot */}
              <div
                className={cn(
                  "absolute left-0 top-4 w-[15px] h-[15px] rounded-full border-2",
                  isLatest
                    ? "bg-primary border-primary shadow-[0_0_8px_rgba(91,147,255,0.5)]"
                    : isFirst
                    ? "bg-emerald-500 border-emerald-500"
                    : "bg-white/20 border-white/30"
                )}
              />

              {/* Content */}
              <div className="flex items-start justify-between gap-4">
                {/* Left side - Price and tags */}
                <div className="space-y-1">
                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span
                      className={cn(
                        "font-semibold",
                        isLatest ? "text-lg text-foreground" : "text-base text-muted-foreground"
                      )}
                    >
                      AED {formatPrice(entry.price)}
                    </span>
                    {isLatest && (
                      <span className="text-[10px] font-medium text-primary uppercase tracking-wide">
                        Current
                      </span>
                    )}
                    {isFirst && (
                      <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-wide">
                        Developer
                      </span>
                    )}
                  </div>

                  {/* Price per sqft */}
                  {entry.pricePerSqft && (
                    <div className="text-xs text-muted-foreground">
                      {formatNumber(entry.pricePerSqft)} /sqft
                    </div>
                  )}
                </div>

                {/* Right side - Date and change */}
                <div className="text-right space-y-1">
                  {/* Date */}
                  <div className={cn(
                    "text-sm",
                    isLatest ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {formatDate(entry.date)}
                  </div>

                  {/* Price change from previous */}
                  {entry.priceChangePct != null && !entry.isFirstSale && (
                    <div
                      className={cn(
                        "text-xs font-medium",
                        entry.priceChangePct > 0 ? "text-emerald-400" : "text-red-400"
                      )}
                    >
                      {entry.priceChangePct >= 0 ? "+" : ""}
                      {entry.priceChangePct.toFixed(1)}%
                    </div>
                  )}

                  {/* Days held */}
                  {entry.daysSincePrevSale != null && entry.daysSincePrevSale > 0 && (
                    <div className="text-[10px] text-muted-foreground/60">
                      held {formatDaysHeld(entry.daysSincePrevSale)}
                    </div>
                  )}
                </div>
              </div>

              {/* Connection line to next entry */}
              {index < sortedHistory.length - 1 && entry.priceChangePct != null && (
                <div className="absolute left-[7px] top-[30px] bottom-0 flex items-center">
                  <div
                    className={cn(
                      "w-px h-full",
                      entry.priceChangePct > 0 ? "bg-emerald-500/30" : "bg-red-500/30"
                    )}
                  />
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ============ HELPER FUNCTIONS ============

function formatPrice(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`
  }
  return value.toLocaleString()
}

function formatNumber(value: number): string {
  return value.toLocaleString(undefined, { maximumFractionDigits: 0 })
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function formatDaysHeld(days: number): string {
  if (days >= 365) {
    const years = Math.floor(days / 365)
    const months = Math.floor((days % 365) / 30)
    if (months > 0) {
      return `${years}y ${months}m`
    }
    return `${years}y`
  }
  if (days >= 30) {
    return `${Math.floor(days / 30)}m`
  }
  return `${days}d`
}
