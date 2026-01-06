"use client"

import * as React from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { roomColors } from '@/components/ui/color-dot'

interface FilterTab {
  value: string
  label: string
  count?: number
}

interface FilterTabsProps {
  tabs: FilterTab[]
  value: string
  onChange: (value: string) => void
  showAdvancedFilters?: boolean
  onAdvancedFiltersClick?: () => void
  className?: string
  colorCodeTabs?: boolean // Use room type colors for tabs
}

// Animated count badge
function AnimatedCount({
  count,
  isSelected,
  tabValue,
}: {
  count: number
  isSelected: boolean
  tabValue: string
}) {
  const color = roomColors[tabValue] || (isSelected ? '#5B93FF' : undefined)

  return (
    <motion.span
      key={count}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', bounce: 0.4, duration: 0.4 }}
      className={cn(
        'text-xs px-1.5 py-0.5 rounded-full font-medium',
        isSelected
          ? 'text-primary'
          : 'bg-white/10 text-muted-foreground'
      )}
      style={isSelected ? {
        backgroundColor: color ? `${color}20` : 'rgba(91, 147, 255, 0.2)',
        color: color || '#5B93FF',
      } : undefined}
    >
      {count.toLocaleString()}
    </motion.span>
  )
}

export function FilterTabs({
  tabs,
  value,
  onChange,
  showAdvancedFilters = false,
  onAdvancedFiltersClick,
  className,
  colorCodeTabs = false,
}: FilterTabsProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(false)

  // Check scroll state
  const updateScrollState = React.useCallback(() => {
    if (!scrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
    setCanScrollLeft(scrollLeft > 5)
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5)
  }, [])

  React.useEffect(() => {
    updateScrollState()
    const scrollEl = scrollRef.current
    if (scrollEl) {
      scrollEl.addEventListener('scroll', updateScrollState)
      window.addEventListener('resize', updateScrollState)
      return () => {
        scrollEl.removeEventListener('scroll', updateScrollState)
        window.removeEventListener('resize', updateScrollState)
      }
    }
  }, [updateScrollState, tabs])

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const scrollAmount = 150
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    })
  }

  // Get color for tab (if colorCodeTabs is enabled)
  const getTabColor = (tabValue: string) => {
    if (!colorCodeTabs) return undefined
    return roomColors[tabValue]
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Scroll left indicator */}
      <AnimatePresence>
        {canScrollLeft && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scroll('left')}
            className="shrink-0 p-1 rounded-full bg-white/10 text-muted-foreground hover:text-foreground hover:bg-white/20 transition-colors sm:hidden"
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Scrollable tabs with gradient overlays */}
      <div className="flex-1 relative">
        {/* Left gradient fade */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none transition-opacity duration-200",
            canScrollLeft ? "opacity-100" : "opacity-0"
          )}
        />

        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide"
        >
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 w-fit min-w-full sm:min-w-0">
            {tabs.map((tab) => {
              const isSelected = value === tab.value
              const tabColor = getTabColor(tab.value)

              return (
                <motion.button
                  key={tab.value}
                  onClick={() => onChange(tab.value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'relative px-3 py-1.5 text-sm font-medium rounded-lg transition-colors whitespace-nowrap',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    isSelected
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="filter-tab-indicator"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        backgroundColor: tabColor ? `${tabColor}15` : 'rgba(255, 255, 255, 0.1)',
                        boxShadow: `0 0 12px ${tabColor || 'rgba(91, 147, 255, 0.3)'}40`,
                      }}
                      transition={{
                        type: 'spring',
                        bounce: 0.25,
                        duration: 0.5,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {/* Color dot for room types */}
                    {colorCodeTabs && tabColor && (
                      <motion.span
                        animate={{ scale: isSelected ? 1.2 : 1 }}
                        transition={{ duration: 0.2 }}
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: tabColor }}
                      />
                    )}
                    <span style={isSelected && tabColor ? { color: tabColor } : undefined}>
                      {tab.label}
                    </span>
                    {tab.count !== undefined && (
                      <AnimatedCount
                        count={tab.count}
                        isSelected={isSelected}
                        tabValue={tab.value}
                      />
                    )}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Right gradient fade */}
        <div
          className={cn(
            "absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none transition-opacity duration-200",
            canScrollRight ? "opacity-100" : "opacity-0"
          )}
        />
      </div>

      {/* Scroll right indicator */}
      <AnimatePresence>
        {canScrollRight && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scroll('right')}
            className="shrink-0 p-1 rounded-full bg-white/10 text-muted-foreground hover:text-foreground hover:bg-white/20 transition-colors sm:hidden"
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Advanced filters button */}
      {showAdvancedFilters && onAdvancedFiltersClick && (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            size="sm"
            onClick={onAdvancedFiltersClick}
            className="shrink-0 gap-1.5"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </motion.div>
      )}
    </div>
  )
}

// Helper to generate room type tabs from data
export function generateRoomTabs(
  data: { rooms: string; count?: number }[],
  includeAll = true
): FilterTab[] {
  const roomCounts = data.reduce((acc, item) => {
    acc[item.rooms] = (acc[item.rooms] || 0) + (item.count || 1)
    return acc
  }, {} as Record<string, number>)

  const tabs: FilterTab[] = []

  if (includeAll) {
    tabs.push({
      value: 'all',
      label: 'All',
      count: Object.values(roomCounts).reduce((sum, c) => sum + c, 0),
    })
  }

  // Standard room type order
  const roomOrder = ['Studio', '1BR', '2BR', '3BR', '4BR', '5BR+', 'Penthouse']

  roomOrder.forEach((room) => {
    if (roomCounts[room]) {
      tabs.push({
        value: room,
        label: room,
        count: roomCounts[room],
      })
    }
  })

  // Add any remaining room types not in standard order
  Object.entries(roomCounts).forEach(([room, count]) => {
    if (!roomOrder.includes(room)) {
      tabs.push({
        value: room,
        label: room,
        count,
      })
    }
  })

  return tabs
}
