"use client"

import * as React from "react"
import { motion, useInView } from "framer-motion"
import { cn } from "@/lib/utils/cn"
import { TrendBadge } from "@/components/ui/trend-badge"
import { AnimatedNumber } from "@/components/ui/animated-number"

interface KPIItem {
  label: string
  value: string | number
  format?: "number" | "currency" | "currency-compact" | "percent" | "raw"
  change?: number | null
  sparklineData?: number[]
  subtitle?: string // Secondary text line (e.g., "67% complete")
  valueColor?: "default" | "positive" | "negative" | "warning" // Custom value color
}

interface KPIBarProps {
  items: KPIItem[]
  className?: string
}

// Enhanced sparkline with gradient fill and glow
function GradientSparkline({
  data,
  className,
  animate = true,
}: {
  data: number[]
  className?: string
  animate?: boolean
}) {
  const ref = React.useRef<SVGSVGElement>(null)
  const isInView = useInView(ref, { once: true })

  if (!data || data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const width = 48
  const height = 20
  const padding = 2

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2)
    const y = height - padding - ((value - min) / range) * (height - padding * 2)
    return { x, y }
  })

  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`

  const isPositive = data[data.length - 1] >= data[0]
  const strokeColor = isPositive ? "#10B981" : "#EF4444"
  const gradientId = React.useId()

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("w-12 h-5", className)}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`${gradientId}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
        <filter id={`${gradientId}-glow`}>
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Area fill */}
      <motion.path
        d={areaD}
        fill={`url(#${gradientId}-fill)`}
        initial={animate ? { opacity: 0 } : undefined}
        animate={isInView ? { opacity: 1 } : undefined}
        transition={{ duration: 0.5, delay: 0.3 }}
      />

      {/* Line with glow */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${gradientId}-glow)`}
        initial={animate ? { pathLength: 0, opacity: 0 } : undefined}
        animate={isInView ? { pathLength: 1, opacity: 1 } : undefined}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* End dot */}
      <motion.circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r="2"
        fill={strokeColor}
        initial={animate ? { scale: 0, opacity: 0 } : undefined}
        animate={isInView ? { scale: 1, opacity: 1 } : undefined}
        transition={{ duration: 0.3, delay: 0.7 }}
      />
    </svg>
  )
}

function formatKPIValue(value: string | number, format?: KPIItem["format"]): string {
  if (typeof value === "string") return value

  switch (format) {
    case "currency":
      return `AED ${value.toLocaleString()}`
    case "currency-compact":
      if (value >= 1_000_000_000) return `AED ${(value / 1_000_000_000).toFixed(1)}B`
      if (value >= 1_000_000) return `AED ${(value / 1_000_000).toFixed(1)}M`
      if (value >= 1_000) return `AED ${(value / 1_000).toFixed(0)}K`
      return `AED ${value.toLocaleString()}`
    case "percent":
      return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`
    case "number":
      return value.toLocaleString()
    default:
      return typeof value === "number" ? value.toLocaleString() : value
  }
}

// Get numeric value for animation
function getNumericValue(value: string | number, format?: KPIItem["format"]): number | null {
  if (typeof value === "number") return value
  // Try to parse string values
  const cleaned = value.replace(/[^0-9.-]/g, "")
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? null : parsed
}

export function KPIBar({ items, className }: KPIBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "rounded-xl overflow-hidden",
        "bg-gradient-to-r from-white/[0.04] to-white/[0.02]",
        "border border-white/10",
        // Mobile: 2-col grid, Tablet: 3-col, Desktop: single row
        "grid grid-cols-2 sm:grid-cols-3 md:flex md:items-stretch",
        className
      )}
    >
      {items.map((item, index) => {
        const isPrimary = index === 0
        const numericValue = getNumericValue(item.value, item.format)
        const canAnimate = numericValue !== null && item.format !== "raw"

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
            className={cn(
              "px-3 py-2.5 md:px-4 md:py-3 md:flex-1 min-w-0 transition-all duration-200",
              "flex flex-col justify-center",
              // Border logic for grid vs flex layout
              "border-b border-r border-white/5 md:border-b-0 md:border-r-0",
              "md:border-l md:first:border-l-0",
              // Remove right border on even items (end of row) on mobile
              "even:border-r-0 sm:even:border-r sm:[&:nth-child(3n)]:border-r-0",
              // Remove bottom border on last row
              items.length <= 2 && "border-b-0",
              items.length > 2 && items.length <= 4 && index >= 2 && "border-b-0",
              items.length > 4 && index >= 4 && "border-b-0",
              isPrimary && [
                "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent",
                "shadow-[inset_0_1px_0_0_rgba(91,147,255,0.1)]",
              ]
            )}
            style={
              isPrimary
                ? { boxShadow: "0 0 30px rgba(91,147,255,0.08)" }
                : undefined
            }
          >
            {/* Header: Label + Sparkline */}
            <div className="flex items-center justify-between gap-1 mb-1">
              <span
                className={cn(
                  "text-[10px] md:text-xs font-medium uppercase tracking-wide",
                  isPrimary ? "text-primary/80" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
              {item.sparklineData && item.sparklineData.length > 1 && (
                <GradientSparkline data={item.sparklineData} className="hidden sm:block" />
              )}
            </div>

            {/* Value + Trend */}
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span
                className={cn(
                  "text-base md:text-lg font-bold tracking-tight",
                  isPrimary && "text-primary",
                  item.valueColor === "positive" && "text-emerald-400",
                  item.valueColor === "negative" && "text-red-400",
                  item.valueColor === "warning" && "text-amber-400"
                )}
              >
                {canAnimate ? (
                  <AnimatedNumber
                    value={numericValue}
                    format={item.format as "number" | "currency" | "currency-compact" | "percent"}
                    duration={1}
                    delay={index * 0.15}
                  />
                ) : (
                  formatKPIValue(item.value, item.format)
                )}
              </span>

              {item.change !== undefined && item.change !== null && (
                <TrendBadge value={item.change} size="sm" showGlow={isPrimary} />
              )}
            </div>

            {/* Subtitle */}
            {item.subtitle && (
              <div className="text-[10px] md:text-xs text-muted-foreground mt-0.5">
                {item.subtitle}
              </div>
            )}
          </motion.div>
        )
      })}
    </motion.div>
  )
}
