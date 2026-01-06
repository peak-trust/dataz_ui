"use client"

import { useCallback, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { create } from 'zustand'
import {
  type FilterState,
  type DataMode,
  type Timeframe,
  DEFAULT_FILTER_STATE,
  FILTER_URL_KEYS,
  parseArrayParam,
  serializeArrayParam,
  countActiveFilters,
  hasActiveFilters,
} from './filters'

// ============ ZUSTAND STORE (for UI state like panel open/close) ============

interface FilterUIState {
  isPanelOpen: boolean
  togglePanel: () => void
  openPanel: () => void
  closePanel: () => void
}

export const useFilterUIStore = create<FilterUIState>((set) => ({
  isPanelOpen: false,
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false }),
}))

// ============ URL-BASED FILTER HOOK ============

/**
 * Hook to manage filter state via URL search params
 * URL is the single source of truth
 */
export function useFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Parse current filter state from URL
  const filters: FilterState = useMemo(() => {
    const mode = (searchParams.get(FILTER_URL_KEYS.mode) as DataMode) || DEFAULT_FILTER_STATE.mode
    const timeframe = (searchParams.get(FILTER_URL_KEYS.timeframe) as Timeframe) || DEFAULT_FILTER_STATE.timeframe

    return {
      mode: mode === 'sales' || mode === 'rental' ? mode : DEFAULT_FILTER_STATE.mode,
      timeframe: ['1M', '3M', '6M', '1Y', '2Y', '3Y', '5Y', 'ALL'].includes(timeframe) ? timeframe : DEFAULT_FILTER_STATE.timeframe,
      regTypes: parseArrayParam(searchParams.get(FILTER_URL_KEYS.regTypes)),
      propertyTypes: parseArrayParam(searchParams.get(FILTER_URL_KEYS.propertyTypes)),
      bedrooms: parseArrayParam(searchParams.get(FILTER_URL_KEYS.bedrooms)),
      usageTypes: parseArrayParam(searchParams.get(FILTER_URL_KEYS.usageTypes)),
      priceRanges: parseArrayParam(searchParams.get(FILTER_URL_KEYS.priceRanges)),
      sizeRanges: parseArrayParam(searchParams.get(FILTER_URL_KEYS.sizeRanges)),
      freeholdOnly: searchParams.get(FILTER_URL_KEYS.freeholdOnly) === 'true',
    }
  }, [searchParams])

  // Update URL with new params (debounced via router)
  const updateURL = useCallback(
    (updates: Partial<FilterState>) => {
      const params = new URLSearchParams(searchParams.toString())

      // Apply updates
      Object.entries(updates).forEach(([key, value]) => {
        const urlKey = FILTER_URL_KEYS[key as keyof typeof FILTER_URL_KEYS]
        if (!urlKey) return

        if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
          params.delete(urlKey)
        } else if (Array.isArray(value)) {
          const serialized = serializeArrayParam(value)
          if (serialized) {
            params.set(urlKey, serialized)
          } else {
            params.delete(urlKey)
          }
        } else if (typeof value === 'boolean') {
          if (value) {
            params.set(urlKey, 'true')
          } else {
            params.delete(urlKey)
          }
        } else {
          // Check if it's the default value
          const defaultValue = DEFAULT_FILTER_STATE[key as keyof FilterState]
          if (value === defaultValue) {
            params.delete(urlKey)
          } else {
            params.set(urlKey, String(value))
          }
        }
      })

      const queryString = params.toString()
      const newPath = queryString ? `${pathname}?${queryString}` : pathname
      router.replace(newPath, { scroll: false })
    },
    [searchParams, pathname, router]
  )

  // Individual setters with debouncing
  const setMode = useCallback((mode: DataMode) => updateURL({ mode }), [updateURL])
  const setTimeframe = useCallback((timeframe: Timeframe) => updateURL({ timeframe }), [updateURL])

  // Multi-select toggle helpers
  // Read directly from searchParams to avoid stale closure issues
  const toggleRegType = useCallback(
    (value: string) => {
      const current = parseArrayParam(searchParams.get(FILTER_URL_KEYS.regTypes))
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      updateURL({ regTypes: updated })
    },
    [searchParams, updateURL]
  )

  const togglePropertyType = useCallback(
    (value: string) => {
      const current = parseArrayParam(searchParams.get(FILTER_URL_KEYS.propertyTypes))
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      updateURL({ propertyTypes: updated })
    },
    [searchParams, updateURL]
  )

  const toggleBedroom = useCallback(
    (value: string) => {
      const current = parseArrayParam(searchParams.get(FILTER_URL_KEYS.bedrooms))
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      updateURL({ bedrooms: updated })
    },
    [searchParams, updateURL]
  )

  const toggleUsageType = useCallback(
    (value: string) => {
      const current = parseArrayParam(searchParams.get(FILTER_URL_KEYS.usageTypes))
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      updateURL({ usageTypes: updated })
    },
    [searchParams, updateURL]
  )

  // Multi-select toggle for price ranges
  const togglePriceRange = useCallback(
    (value: string) => {
      const current = parseArrayParam(searchParams.get(FILTER_URL_KEYS.priceRanges))
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      updateURL({ priceRanges: updated })
    },
    [searchParams, updateURL]
  )

  // Multi-select toggle for size ranges
  const toggleSizeRange = useCallback(
    (value: string) => {
      const current = parseArrayParam(searchParams.get(FILTER_URL_KEYS.sizeRanges))
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value]
      updateURL({ sizeRanges: updated })
    },
    [searchParams, updateURL]
  )

  const setFreeholdOnly = useCallback(
    (value: boolean) => updateURL({ freeholdOnly: value }),
    [updateURL]
  )

  // Bulk operations
  const setFilters = useCallback(
    (updates: Partial<FilterState>) => updateURL(updates),
    [updateURL]
  )

  const clearFilters = useCallback(() => {
    updateURL({
      regTypes: [],
      propertyTypes: [],
      bedrooms: [],
      usageTypes: [],
      priceRanges: [],
      sizeRanges: [],
      freeholdOnly: false,
    })
  }, [updateURL])

  const resetAll = useCallback(() => {
    router.replace(pathname, { scroll: false })
  }, [pathname, router])

  // Computed values
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters])
  const hasFilters = useMemo(() => hasActiveFilters(filters), [filters])

  return {
    // Current state
    filters,
    activeFilterCount,
    hasFilters,

    // Core setters
    setMode,
    setTimeframe,

    // Multi-select toggles
    toggleRegType,
    togglePropertyType,
    toggleBedroom,
    toggleUsageType,
    togglePriceRange,
    toggleSizeRange,

    // Single toggles
    setFreeholdOnly,

    // Bulk operations
    setFilters,
    clearFilters,
    resetAll,
  }
}

// ============ TYPE EXPORT ============
export type { FilterState }
