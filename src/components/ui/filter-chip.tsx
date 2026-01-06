"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils/cn"

interface FilterChipProps {
  label: string
  shortLabel?: string
  selected: boolean
  onToggle: () => void
  disabled?: boolean
  showCheck?: boolean
  size?: "sm" | "md"
  className?: string
}

export function FilterChip({
  label,
  shortLabel,
  selected,
  onToggle,
  disabled = false,
  showCheck = true,
  size = "md",
  className,
}: FilterChipProps) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition-all",
        "border outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
        // Size variants
        size === "sm" && "h-7 px-2.5 text-xs",
        size === "md" && "h-8 px-3 text-sm",
        // State variants
        selected
          ? [
              "bg-primary text-white border-primary",
              "shadow-[0_0_12px_rgba(91,147,255,0.4)]",
              "hover:bg-primary/90 hover:shadow-[0_0_16px_rgba(91,147,255,0.5)]",
            ]
          : [
              "bg-white/[0.03] border-white/10 text-muted-foreground",
              "hover:bg-white/[0.06] hover:border-white/20 hover:text-foreground",
            ],
        // Disabled
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      {selected && showCheck && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Check className="w-3 h-3" />
        </motion.span>
      )}
      <span className="sm:hidden">{shortLabel || label}</span>
      <span className="hidden sm:inline">{label}</span>
    </motion.button>
  )
}

interface FilterChipGroupProps {
  label: string
  options: Array<{
    value: string
    label: string
    shortLabel?: string
  }>
  selected: string[]
  onToggle: (value: string) => void
  multiSelect?: boolean
  showHint?: boolean
  className?: string
}

export function FilterChipGroup({
  label,
  options,
  selected,
  onToggle,
  multiSelect = true,
  showHint = true,
  className,
}: FilterChipGroupProps) {
  const selectedCount = selected.length

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </label>
        {multiSelect && showHint && (
          <span className="text-[10px] text-muted-foreground/60">
            {selectedCount > 0 ? `${selectedCount} selected` : "Select multiple"}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.value)
          return (
            <FilterChip
              key={option.value}
              label={option.label}
              shortLabel={option.shortLabel}
              selected={isSelected}
              onToggle={() => onToggle(option.value)}
              showCheck={multiSelect}
            />
          )
        })}
      </div>
    </div>
  )
}

interface RangeChipGroupProps {
  label: string
  options: Array<{
    value: string
    label: string
  }>
  selected: string[]
  onToggle: (value: string) => void
  className?: string
}

export function RangeChipGroup({
  label,
  options,
  selected,
  onToggle,
  className,
}: RangeChipGroupProps) {
  const selectedCount = selected.length

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </label>
        <span className="text-[10px] text-muted-foreground/60">
          {selectedCount > 0 ? `${selectedCount} selected` : "Select multiple"}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.value)
          return (
            <FilterChip
              key={option.value}
              label={option.label}
              selected={isSelected}
              onToggle={() => onToggle(option.value)}
              showCheck={true}
            />
          )
        })}
      </div>
    </div>
  )
}

interface ActiveFilterPillProps {
  label: string
  onRemove: () => void
  className?: string
}

export function ActiveFilterPill({ label, onRemove, className }: ActiveFilterPillProps) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "inline-flex items-center gap-1 h-6 pl-2 pr-1 rounded-full text-xs font-medium",
        "bg-primary/20 text-primary border border-primary/30",
        className
      )}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="p-0.5 rounded-full hover:bg-primary/30 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </motion.span>
  )
}
