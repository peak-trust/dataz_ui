"use client"

import * as React from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ChevronDown, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

// Mini sparkline for preview (collapsed state)
function MiniSparkline({ data, className }: { data?: number[]; className?: string }) {
  if (!data || data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const width = 40
  const height = 16

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  const isPositive = data[data.length - 1] >= data[0]
  const color = isPositive ? '#10B981' : '#EF4444'

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn("w-10 h-4", className)}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Mini progress bar for preview
function MiniProgressBar({
  value,
  max = 100,
  color = '#5B93FF',
  className,
}: {
  value: number
  max?: number
  color?: string
  className?: string
}) {
  const percentage = Math.min(100, (value / max) * 100)

  return (
    <div className={cn("h-1.5 w-12 bg-white/10 rounded-full overflow-hidden", className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5 }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  )
}

interface ExpandableSectionProps {
  title: string
  icon?: LucideIcon
  defaultExpanded?: boolean
  children: React.ReactNode
  className?: string
  badge?: string | number
  preview?: React.ReactNode
  previewSparkline?: number[]
  previewProgress?: { value: number; max?: number; color?: string }
}

export function ExpandableSection({
  title,
  icon: Icon,
  defaultExpanded = false,
  children,
  className,
  badge,
  preview,
  previewSparkline,
  previewProgress,
}: ExpandableSectionProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)
  const ref = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-30px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-xl border overflow-hidden transition-all duration-200',
        isExpanded
          ? 'border-primary/30 bg-gradient-to-br from-primary/5 via-white/[0.02] to-transparent'
          : 'border-white/10 bg-white/[0.02]',
        className
      )}
    >
      {/* Header - clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full px-4 py-3 flex items-center justify-between',
          'hover:bg-white/[0.02] transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
          isExpanded && 'border-b border-primary/20'
        )}
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <motion.div
              animate={{ scale: isExpanded ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "p-1.5 rounded-lg transition-colors duration-200",
                isExpanded ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
            </motion.div>
          )}
          <span className={cn(
            "font-medium text-sm transition-colors duration-200",
            isExpanded && "text-primary"
          )}>
            {title}
          </span>
          {badge !== undefined && (
            <motion.span
              animate={{ scale: isExpanded ? 1.05 : 1 }}
              className={cn(
                "px-2 py-0.5 text-xs rounded-full transition-colors duration-200",
                isExpanded ? "bg-primary/20 text-primary" : "bg-white/10 text-muted-foreground"
              )}
            >
              {badge}
            </motion.span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Preview content when collapsed */}
          <AnimatePresence mode="wait">
            {!isExpanded && (preview || previewSparkline || previewProgress) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                {previewSparkline && <MiniSparkline data={previewSparkline} />}
                {previewProgress && (
                  <MiniProgressBar
                    value={previewProgress.value}
                    max={previewProgress.max}
                    color={previewProgress.color}
                  />
                )}
                {preview}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "p-0.5 rounded transition-colors duration-200",
              isExpanded && "bg-primary/20"
            )}
          >
            <ChevronDown className={cn(
              "h-4 w-4 transition-colors duration-200",
              isExpanded ? "text-primary" : "text-muted-foreground"
            )} />
          </motion.div>
        </div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="px-4 pb-4"
            >
              <div className="pt-4">{children}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Multiple accordions where only one can be open at a time
interface AccordionGroupProps {
  children: React.ReactNode
  className?: string
  allowMultiple?: boolean
}

interface AccordionItemProps {
  id: string
  title: string
  icon?: LucideIcon
  children: React.ReactNode
  badge?: string | number
  preview?: React.ReactNode
  previewSparkline?: number[]
  previewProgress?: { value: number; max?: number; color?: string }
}

const AccordionContext = React.createContext<{
  openItems: string[]
  toggle: (id: string) => void
  allowMultiple: boolean
} | null>(null)

export function AccordionGroup({
  children,
  className,
  allowMultiple = false,
}: AccordionGroupProps) {
  const [openItems, setOpenItems] = React.useState<string[]>([])

  const toggle = React.useCallback(
    (id: string) => {
      setOpenItems((prev) => {
        if (prev.includes(id)) {
          return prev.filter((item) => item !== id)
        }
        if (allowMultiple) {
          return [...prev, id]
        }
        return [id]
      })
    },
    [allowMultiple]
  )

  return (
    <AccordionContext.Provider value={{ openItems, toggle, allowMultiple }}>
      <div className={cn('space-y-2', className)}>{children}</div>
    </AccordionContext.Provider>
  )
}

export function AccordionItem({
  id,
  title,
  icon: Icon,
  children,
  badge,
  preview,
  previewSparkline,
  previewProgress,
}: AccordionItemProps) {
  const context = React.useContext(AccordionContext)

  if (!context) {
    throw new Error('AccordionItem must be used within an AccordionGroup')
  }

  const { openItems, toggle } = context
  const isExpanded = openItems.includes(id)

  return (
    <motion.div
      layout
      className={cn(
        "rounded-xl border overflow-hidden transition-all duration-200",
        isExpanded
          ? "border-primary/30 bg-gradient-to-br from-primary/5 via-white/[0.02] to-transparent"
          : "border-white/10 bg-white/[0.02]"
      )}
    >
      {/* Header */}
      <button
        onClick={() => toggle(id)}
        className={cn(
          'w-full px-4 py-3 flex items-center justify-between',
          'hover:bg-white/[0.02] transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
          isExpanded && 'border-b border-primary/20'
        )}
      >
        <div className="flex items-center gap-3">
          {Icon && (
            <motion.div
              animate={{ scale: isExpanded ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "p-1.5 rounded-lg transition-colors duration-200",
                isExpanded ? "bg-primary/20 text-primary" : "bg-white/5 text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
            </motion.div>
          )}
          <span className={cn(
            "font-medium text-sm transition-colors duration-200",
            isExpanded && "text-primary"
          )}>
            {title}
          </span>
          {badge !== undefined && (
            <motion.span
              animate={{ scale: isExpanded ? 1.05 : 1 }}
              className={cn(
                "px-2 py-0.5 text-xs rounded-full transition-colors duration-200",
                isExpanded ? "bg-primary/20 text-primary" : "bg-white/10 text-muted-foreground"
              )}
            >
              {badge}
            </motion.span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Preview content when collapsed */}
          <AnimatePresence mode="wait">
            {!isExpanded && (preview || previewSparkline || previewProgress) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                {previewSparkline && <MiniSparkline data={previewSparkline} />}
                {previewProgress && (
                  <MiniProgressBar
                    value={previewProgress.value}
                    max={previewProgress.max}
                    color={previewProgress.color}
                  />
                )}
                {preview}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "p-0.5 rounded transition-colors duration-200",
              isExpanded && "bg-primary/20"
            )}
          >
            <ChevronDown className={cn(
              "h-4 w-4 transition-colors duration-200",
              isExpanded ? "text-primary" : "text-muted-foreground"
            )} />
          </motion.div>
        </div>
      </button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="px-4 pb-4"
            >
              <div className="pt-4">{children}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Export the mini components for external use
export { MiniSparkline, MiniProgressBar }
