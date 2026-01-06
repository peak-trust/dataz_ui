"use client"

import * as React from "react"
import { cn } from "@/lib/utils/cn"

interface ResaleBadgeProps {
  /** Number of resales (0 = not resale, 1 = first resale, 2+ = multiple resales) */
  resaleCount: number
  /** Price change percentage from previous sale */
  priceChangePct?: number | null
  /** Size variant */
  size?: "sm" | "md"
  /** Additional class names */
  className?: string
}

/**
 * Badge showing resale status and price change
 * - Shows "RESALE" for first resale
 * - Shows "RESALE 2", "RESALE 3" etc for subsequent resales
 * - Shows price change with color (green positive, red negative)
 */
export function ResaleBadge({
  resaleCount,
  priceChangePct,
  size = "sm",
  className,
}: ResaleBadgeProps) {
  if (resaleCount <= 0) return null

  const sizeClasses = {
    sm: "h-5 px-1.5 text-[10px]",
    md: "h-6 px-2 text-xs",
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {/* Resale badge */}
      <span
        className={cn(
          "inline-flex items-center font-semibold rounded uppercase tracking-wide",
          "bg-violet-500/20 text-violet-400 border border-violet-500/30",
          sizeClasses[size]
        )}
      >
        RESALE{resaleCount > 1 ? ` ${resaleCount}` : ""}
      </span>

      {/* Price change percentage */}
      {priceChangePct != null && (
        <PriceChangeBadge value={priceChangePct} size={size} />
      )}
    </div>
  )
}

interface PriceChangeBadgeProps {
  /** Price change percentage */
  value: number
  /** Size variant */
  size?: "sm" | "md"
  /** Additional class names */
  className?: string
}

/**
 * Standalone price change badge
 * Shows percentage with color coding:
 * - Green for positive
 * - Red for negative
 * - Muted for zero/near-zero
 */
export function PriceChangeBadge({
  value,
  size = "sm",
  className,
}: PriceChangeBadgeProps) {
  const isPositive = value > 0.5
  const isNegative = value < -0.5
  const isNeutral = !isPositive && !isNegative

  const sizeClasses = {
    sm: "h-5 px-1.5 text-[10px]",
    md: "h-6 px-2 text-xs",
  }

  // Format the percentage
  const formatted = `${value >= 0 ? "+" : ""}${value.toFixed(1)}%`

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded tracking-wide",
        sizeClasses[size],
        isPositive && "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
        isNegative && "bg-red-500/20 text-red-400 border border-red-500/30",
        isNeutral && "bg-white/10 text-muted-foreground border border-white/10",
        className
      )}
    >
      {formatted}
    </span>
  )
}

interface RegistrationBadgeProps {
  /** Registration type */
  type: "offplan" | "ready" | "resale"
  /** Size variant */
  size?: "sm" | "md"
  /** Additional class names */
  className?: string
}

/**
 * Badge showing registration type (Off Plan, Ready)
 */
export function RegistrationBadge({
  type,
  size = "sm",
  className,
}: RegistrationBadgeProps) {
  const sizeClasses = {
    sm: "h-5 px-1.5 text-[10px]",
    md: "h-6 px-2 text-xs",
  }

  const typeStyles = {
    offplan: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    ready: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    resale: "bg-violet-500/20 text-violet-400 border border-violet-500/30",
  }

  const typeLabels = {
    offplan: "OFF PLAN",
    ready: "READY",
    resale: "RESALE",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center font-semibold rounded uppercase tracking-wide",
        sizeClasses[size],
        typeStyles[type],
        className
      )}
    >
      {typeLabels[type]}
    </span>
  )
}
