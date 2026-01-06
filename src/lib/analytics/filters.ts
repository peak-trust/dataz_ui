// Filter Configuration - Dubai Real Estate Analytics
// Pre-configured ranges based on Dubai market research

import type { DataMode, Timeframe, RegistrationType, PropertyType, RoomType, UsageType } from './types'

// Re-export types for convenience
export type { DataMode, Timeframe }

// ============ FILTER OPTION TYPES ============

export interface FilterOption<T = string> {
  value: T
  label: string
  shortLabel?: string // For compact display
}

export interface RangeOption {
  value: string // e.g., "1m-2m"
  label: string
  min: number
  max: number | null // null = no upper limit
}

// ============ TIMEFRAME OPTIONS ============

export const TIMEFRAME_OPTIONS: FilterOption<Timeframe>[] = [
  { value: '1M', label: '1 Month', shortLabel: '1M' },
  { value: '3M', label: '3 Months', shortLabel: '3M' },
  { value: '6M', label: '6 Months', shortLabel: '6M' },
  { value: '1Y', label: '1 Year', shortLabel: '1Y' },
  { value: '2Y', label: '2 Years', shortLabel: '2Y' },
  { value: '3Y', label: '3 Years', shortLabel: '3Y' },
  { value: '5Y', label: '5 Years', shortLabel: '5Y' },
  { value: 'ALL', label: 'All Time', shortLabel: 'All' },
]

// ============ REGISTRATION TYPE OPTIONS ============

export const REGISTRATION_TYPE_OPTIONS: FilterOption<string>[] = [
  { value: 'offplan', label: 'Off-plan', shortLabel: 'Off-plan' },
  { value: 'ready', label: 'Ready/Existing', shortLabel: 'Ready' },
]

// Map URL values to display values
export const REG_TYPE_MAP: Record<string, RegistrationType> = {
  'offplan': 'Off Plan',
  'ready': 'Ready',
}

// ============ PROPERTY TYPE OPTIONS ============

export const PROPERTY_TYPE_OPTIONS: FilterOption<string>[] = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'land', label: 'Land' },
  { value: 'office', label: 'Office' },
  { value: 'retail', label: 'Retail' },
]

export const PROPERTY_TYPE_MAP: Record<string, PropertyType> = {
  'apartment': 'Apartment',
  'villa': 'Villa',
  'townhouse': 'Townhouse',
  'penthouse': 'Penthouse',
  'land': 'Land',
  'office': 'Office',
  'retail': 'Retail',
}

// ============ BEDROOM OPTIONS ============

export const BEDROOM_OPTIONS: FilterOption<string>[] = [
  { value: 'studio', label: 'Studio' },
  { value: '1br', label: '1 BR', shortLabel: '1' },
  { value: '2br', label: '2 BR', shortLabel: '2' },
  { value: '3br', label: '3 BR', shortLabel: '3' },
  { value: '4br', label: '4 BR', shortLabel: '4' },
  { value: '5br+', label: '5+ BR', shortLabel: '5+' },
]

export const BEDROOM_MAP: Record<string, RoomType> = {
  'studio': 'Studio',
  '1br': '1BR',
  '2br': '2BR',
  '3br': '3BR',
  '4br': '4BR',
  '5br+': '5BR+',
}

// ============ USAGE TYPE OPTIONS ============

export const USAGE_TYPE_OPTIONS: FilterOption<string>[] = [
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
]

export const USAGE_TYPE_MAP: Record<string, UsageType> = {
  'residential': 'Residential',
  'commercial': 'Commercial',
  'industrial': 'Industrial',
}

// ============ PRICE RANGE OPTIONS (AED) ============

export const PRICE_RANGE_OPTIONS: RangeOption[] = [
  { value: '0-500k', label: 'Under 500K', min: 0, max: 500000 },
  { value: '500k-1m', label: '500K - 1M', min: 500000, max: 1000000 },
  { value: '1m-2m', label: '1M - 2M', min: 1000000, max: 2000000 },
  { value: '2m-5m', label: '2M - 5M', min: 2000000, max: 5000000 },
  { value: '5m-10m', label: '5M - 10M', min: 5000000, max: 10000000 },
  { value: '10m-20m', label: '10M - 20M', min: 10000000, max: 20000000 },
  { value: '20m+', label: '20M+', min: 20000000, max: null },
]

// ============ SIZE RANGE OPTIONS (sqft) ============

export const SIZE_RANGE_OPTIONS: RangeOption[] = [
  { value: '0-500', label: 'Under 500', min: 0, max: 500 },
  { value: '500-1000', label: '500 - 1K', min: 500, max: 1000 },
  { value: '1000-1500', label: '1K - 1.5K', min: 1000, max: 1500 },
  { value: '1500-2500', label: '1.5K - 2.5K', min: 1500, max: 2500 },
  { value: '2500-4000', label: '2.5K - 4K', min: 2500, max: 4000 },
  { value: '4000+', label: '4K+', min: 4000, max: null },
]

// ============ FILTER STATE TYPE ============

export interface FilterState {
  // Core filters
  mode: DataMode
  timeframe: Timeframe

  // Transaction filters (multi-select, stored as comma-separated in URL)
  regTypes: string[] // ['offplan', 'ready']
  propertyTypes: string[] // ['apartment', 'villa']
  bedrooms: string[] // ['1br', '2br']
  usageTypes: string[] // ['residential']

  // Range filters (multi-select for flexibility)
  priceRanges: string[] // ['1m-2m', '2m-5m']
  sizeRanges: string[] // ['1000-1500', '1500-2500']

  // Freehold toggle
  freeholdOnly: boolean
}

export const DEFAULT_FILTER_STATE: FilterState = {
  mode: 'sales',
  timeframe: '1Y',
  regTypes: [],
  propertyTypes: [],
  bedrooms: [],
  usageTypes: [],
  priceRanges: [],
  sizeRanges: [],
  freeholdOnly: false,
}

// ============ URL PARAM KEYS ============

export const FILTER_URL_KEYS = {
  mode: 'mode',
  timeframe: 'time',
  regTypes: 'reg',
  propertyTypes: 'prop',
  bedrooms: 'beds',
  usageTypes: 'use',
  priceRanges: 'price',
  sizeRanges: 'size',
  freeholdOnly: 'freehold',
} as const

// ============ HELPER FUNCTIONS ============

/**
 * Parse comma-separated URL param to array
 */
export function parseArrayParam(value: string | null): string[] {
  if (!value) return []
  return value.split(',').filter(Boolean)
}

/**
 * Serialize array to comma-separated URL param
 */
export function serializeArrayParam(values: string[]): string | null {
  if (values.length === 0) return null
  return values.join(',')
}

/**
 * Get price range bounds from value
 */
export function getPriceRangeBounds(value: string): { min: number; max: number | null } | null {
  const option = PRICE_RANGE_OPTIONS.find(o => o.value === value)
  return option ? { min: option.min, max: option.max } : null
}

/**
 * Get all price range bounds from array of values
 */
export function getAllPriceRangeBounds(values: string[]): Array<{ min: number; max: number | null }> {
  return values
    .map(v => getPriceRangeBounds(v))
    .filter((b): b is { min: number; max: number | null } => b !== null)
}

/**
 * Get size range bounds from value (returns sqm, input is sqft)
 */
export function getSizeRangeBounds(value: string): { min: number; max: number | null } | null {
  const option = SIZE_RANGE_OPTIONS.find(o => o.value === value)
  if (!option) return null
  // Convert sqft to sqm for filtering (1 sqft = 0.0929 sqm)
  return {
    min: option.min * 0.0929,
    max: option.max ? option.max * 0.0929 : null,
  }
}

/**
 * Get all size range bounds from array of values
 */
export function getAllSizeRangeBounds(values: string[]): Array<{ min: number; max: number | null }> {
  return values
    .map(v => getSizeRangeBounds(v))
    .filter((b): b is { min: number; max: number | null } => b !== null)
}

/**
 * Count active filters (excluding mode and timeframe)
 */
export function countActiveFilters(state: FilterState): number {
  let count = 0
  if (state.regTypes.length > 0) count++
  if (state.propertyTypes.length > 0) count++
  if (state.bedrooms.length > 0) count++
  if (state.usageTypes.length > 0) count++
  if (state.priceRanges.length > 0) count++
  if (state.sizeRanges.length > 0) count++
  if (state.freeholdOnly) count++
  return count
}

/**
 * Check if any filters are active (excluding mode and timeframe)
 */
export function hasActiveFilters(state: FilterState): boolean {
  return countActiveFilters(state) > 0
}
