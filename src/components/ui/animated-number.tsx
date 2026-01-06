"use client"

import * as React from "react"
import { motion, useSpring, useTransform, useInView } from "framer-motion"
import { cn } from "@/lib/utils/cn"

interface AnimatedNumberProps {
  value: number
  format?: "number" | "currency" | "currency-compact" | "percent"
  duration?: number
  delay?: number
  className?: string
  prefix?: string
  suffix?: string
}

function formatValue(
  value: number,
  format: AnimatedNumberProps["format"] = "number"
): string {
  switch (format) {
    case "currency":
      return `AED ${value.toLocaleString()}`
    case "currency-compact":
      if (value >= 1_000_000_000) {
        return `AED ${(value / 1_000_000_000).toFixed(1)}B`
      }
      if (value >= 1_000_000) {
        return `AED ${(value / 1_000_000).toFixed(1)}M`
      }
      if (value >= 1_000) {
        return `AED ${(value / 1_000).toFixed(0)}K`
      }
      return `AED ${value.toLocaleString()}`
    case "percent":
      return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`
    case "number":
    default:
      return value.toLocaleString()
  }
}

export function AnimatedNumber({
  value,
  format = "number",
  duration = 1.2,
  delay = 0,
  className,
  prefix,
  suffix,
}: AnimatedNumberProps) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })

  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  })

  const display = useTransform(spring, (current) => {
    // For compact formats, we need to handle the formatting dynamically
    if (format === "currency-compact") {
      return formatValue(Math.round(current), format)
    }
    if (format === "percent") {
      const sign = current > 0 ? "+" : ""
      return `${sign}${current.toFixed(1)}%`
    }
    return Math.round(current).toLocaleString()
  })

  React.useEffect(() => {
    if (isInView) {
      const timeout = setTimeout(() => {
        spring.set(value)
      }, delay * 1000)
      return () => clearTimeout(timeout)
    }
  }, [isInView, value, spring, delay])

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {format === "currency" && "AED "}
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  )
}

// Simpler version for static display with entrance animation
export function AnimatedValue({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.span>
  )
}
