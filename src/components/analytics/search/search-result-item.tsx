"use client"

import * as React from 'react'
import { MapPin, Building2, HardHat, Building, Clock, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { SearchResult, EntityType, RecentSearch } from '@/lib/analytics/types'
import { formatNumber } from '@/lib/analytics/utils/format'

// Icon mapping for entity types
const entityIcons: Record<EntityType, LucideIcon> = {
  area: MapPin,
  project: Building2,
  developer: HardHat,
  building: Building,
}

// Label mapping for entity types
const entityLabels: Record<EntityType, string> = {
  area: 'Area',
  project: 'Project',
  developer: 'Developer',
  building: 'Building',
}

// Color mapping for entity type badges
const entityColors: Record<EntityType, string> = {
  area: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  project: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  developer: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  building: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

interface SearchResultItemProps {
  result: SearchResult
  isSelected?: boolean
  onClick?: () => void
  showStats?: boolean
}

export function SearchResultItem({
  result,
  isSelected = false,
  onClick,
  showStats = true,
}: SearchResultItemProps) {
  const Icon = entityIcons[result.type]

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
        'hover:bg-white/5 focus:bg-white/5 focus:outline-none',
        'border-b border-white/5 last:border-0',
        isSelected && 'bg-white/10'
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex-shrink-0 p-2.5 rounded-xl border',
          entityColors[result.type]
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground truncate">
            {result.name}
          </span>
          <span
            className={cn(
              'flex-shrink-0 text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded border',
              entityColors[result.type]
            )}
          >
            {entityLabels[result.type]}
          </span>
        </div>
        <div className="text-sm text-muted-foreground truncate">
          {result.subtitle}
        </div>
      </div>

      {/* Stats (desktop only) */}
      {showStats && (
        <div className="hidden sm:flex flex-shrink-0 items-center gap-4 text-right">
          <div>
            <div className="text-sm font-medium text-foreground">
              {formatNumber(result.transactionCount, true)}
            </div>
            <div className="text-xs text-muted-foreground">sales</div>
          </div>
          <div>
            <div className="text-sm font-medium text-foreground">
              {formatNumber(result.avgPricePerSqft)}
            </div>
            <div className="text-xs text-muted-foreground">AED/sqft</div>
          </div>
        </div>
      )}
    </button>
  )
}

// Recent search item variant
interface RecentSearchItemProps {
  search: RecentSearch
  onClick?: () => void
  onRemove?: () => void
}

export function RecentSearchItem({
  search,
  onClick,
  onRemove,
}: RecentSearchItemProps) {
  const Icon = entityIcons[search.type]

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors',
        'hover:bg-white/5 focus:bg-white/5 focus:outline-none',
        'group'
      )}
    >
      {/* Clock icon */}
      <div className="flex-shrink-0 p-2 rounded-lg bg-white/5 text-muted-foreground">
        <Clock className="h-3.5 w-3.5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-sm text-foreground truncate">{search.name}</span>
        <span className="text-xs text-muted-foreground">
          {entityLabels[search.type]}
        </span>
      </div>

      {/* Remove button */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="flex-shrink-0 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-opacity"
          aria-label="Remove from recent"
        >
          <span className="text-xs text-muted-foreground">×</span>
        </button>
      )}
    </button>
  )
}
