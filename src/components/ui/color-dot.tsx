"use client"

import * as React from "react"
import { cn } from "@/lib/utils/cn"

// Room type color mapping
export const roomColors: Record<string, string> = {
  Studio: "#8B5CF6", // violet
  "1BR": "#3B82F6", // blue
  "2BR": "#10B981", // emerald
  "3BR": "#F59E0B", // amber
  "4BR": "#EF4444", // red
  "5BR+": "#EC4899", // pink
  Penthouse: "#6366F1", // indigo
}

// Entity type colors
export const entityColors: Record<string, string> = {
  area: "#3B82F6", // blue
  project: "#A855F7", // purple
  developer: "#F59E0B", // amber
  building: "#06B6D4", // cyan
}

interface ColorDotProps {
  color?: string
  roomType?: string
  entityType?: string
  size?: "xs" | "sm" | "md" | "lg"
  pulse?: boolean
  glow?: boolean
  className?: string
}

const sizeStyles = {
  xs: "h-1.5 w-1.5",
  sm: "h-2 w-2",
  md: "h-2.5 w-2.5",
  lg: "h-3 w-3",
}

export function ColorDot({
  color,
  roomType,
  entityType,
  size = "md",
  pulse = false,
  glow = false,
  className,
}: ColorDotProps) {
  // Determine color from props
  const dotColor =
    color || (roomType && roomColors[roomType]) || (entityType && entityColors[entityType]) || "#5B93FF"

  const glowStyle = glow
    ? { boxShadow: `0 0 8px ${dotColor}40, 0 0 4px ${dotColor}60` }
    : undefined

  return (
    <span
      className={cn(
        "inline-block rounded-full shrink-0",
        sizeStyles[size],
        pulse && "animate-pulse",
        className
      )}
      style={{
        backgroundColor: dotColor,
        ...glowStyle,
      }}
    />
  )
}

// Room type badge with dot
interface RoomBadgeProps {
  roomType: string
  showDot?: boolean
  variant?: "default" | "minimal"
  className?: string
}

export function RoomBadge({
  roomType,
  showDot = true,
  variant = "default",
  className,
}: RoomBadgeProps) {
  const color = roomColors[roomType] || "#5B93FF"

  if (variant === "minimal") {
    return (
      <span className={cn("inline-flex items-center gap-1.5", className)}>
        {showDot && <ColorDot color={color} size="sm" />}
        <span className="text-sm">{roomType}</span>
      </span>
    )
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium",
        className
      )}
      style={{
        backgroundColor: `${color}15`,
        borderColor: `${color}30`,
        color: color,
        borderWidth: 1,
      }}
    >
      {showDot && <ColorDot color={color} size="xs" />}
      {roomType}
    </span>
  )
}
