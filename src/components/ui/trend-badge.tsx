"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils/cn"

interface TrendBadgeProps {
  value: number | null | undefined
  size?: "sm" | "md" | "lg"
  showGlow?: boolean
  className?: string
}

const sizeStyles = {
  sm: {
    container: "px-1.5 py-0.5 text-xs gap-0.5",
    icon: "h-3 w-3",
  },
  md: {
    container: "px-2 py-1 text-sm gap-1",
    icon: "h-3.5 w-3.5",
  },
  lg: {
    container: "px-2.5 py-1.5 text-base gap-1.5",
    icon: "h-4 w-4",
  },
}

export function TrendBadge({
  value,
  size = "md",
  showGlow = true,
  className,
}: TrendBadgeProps) {
  if (value === null || value === undefined) return null

  const isPositive = value > 0
  const isNegative = value < 0
  const isStrongPositive = value > 15
  const isStrongNegative = value < -15

  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus
  const styles = sizeStyles[size]

  // Color based on trend
  const colorClasses = isPositive
    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
    : isNegative
    ? "text-red-400 bg-red-500/10 border-red-500/20"
    : "text-muted-foreground bg-white/5 border-white/10"

  // Glow effect for strong trends
  const glowStyle = showGlow
    ? isStrongPositive
      ? { boxShadow: "0 0 12px rgba(16, 185, 129, 0.3)" }
      : isStrongNegative
      ? { boxShadow: "0 0 12px rgba(248, 113, 113, 0.3)" }
      : isPositive
      ? { boxShadow: "0 0 8px rgba(16, 185, 129, 0.15)" }
      : isNegative
      ? { boxShadow: "0 0 8px rgba(248, 113, 113, 0.15)" }
      : undefined
    : undefined

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        styles.container,
        colorClasses,
        className
      )}
      style={glowStyle}
    >
      <Icon className={styles.icon} />
      <span className="tabular-nums">
        {isPositive && "+"}
        {Math.abs(value).toFixed(1)}%
      </span>
    </motion.div>
  )
}

// Inline trend indicator (just icon + text, no badge)
export function TrendIndicator({
  value,
  size = "md",
  className,
}: Omit<TrendBadgeProps, "showGlow">) {
  if (value === null || value === undefined) return null

  const isPositive = value > 0
  const isNegative = value < 0
  const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus
  const styles = sizeStyles[size]

  return (
    <motion.span
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "inline-flex items-center font-medium",
        styles.container,
        isPositive && "text-emerald-500",
        isNegative && "text-red-500",
        !isPositive && !isNegative && "text-muted-foreground",
        className
      )}
    >
      <Icon className={styles.icon} />
      <span className="tabular-nums">
        {isPositive && "+"}
        {Math.abs(value).toFixed(1)}%
      </span>
    </motion.span>
  )
}
