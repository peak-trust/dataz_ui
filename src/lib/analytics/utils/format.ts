// Formatting utilities for analytics data

/**
 * Format a number as AED currency
 */
export function formatCurrency(value: number, compact: boolean = false): string {
  if (compact) {
    if (value >= 1_000_000_000) {
      return `AED ${(value / 1_000_000_000).toFixed(1)}B`
    }
    if (value >= 1_000_000) {
      return `AED ${(value / 1_000_000).toFixed(1)}M`
    }
    if (value >= 1_000) {
      return `AED ${(value / 1_000).toFixed(0)}K`
    }
  }

  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format a number with commas
 */
export function formatNumber(value: number, compact: boolean = false): string {
  if (compact) {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(1)}B`
    }
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`
    }
    if (value >= 1_000) {
      return `${(value / 1_000).toFixed(1)}K`
    }
  }

  return new Intl.NumberFormat('en-AE').format(value)
}

/**
 * Format price per square foot
 */
export function formatPricePerSqft(value: number): string {
  return `AED ${formatNumber(Math.round(value))}/sqft`
}

/**
 * Format percentage change with sign
 */
export function formatPercentChange(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'N/A'
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

/**
 * Format area in square meters
 */
export function formatArea(sqm: number): string {
  return `${formatNumber(Math.round(sqm))} sqm`
}

/**
 * Format area in square feet
 */
export function formatAreaSqft(sqm: number): string {
  const sqft = sqm * 10.764
  return `${formatNumber(Math.round(sqft))} sqft`
}

/**
 * Format date in user-friendly format
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-AE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

/**
 * Format date as relative time (e.g., "2 days ago")
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

/**
 * Format quarter string (e.g., "2024-Q1" -> "Q1 2024")
 */
export function formatQuarter(quarterString: string): string {
  const [year, quarter] = quarterString.split('-')
  return `${quarter} ${year}`
}

/**
 * Get trend color class based on value
 */
export function getTrendColor(value: number | null | undefined): string {
  if (value === null || value === undefined) return 'text-muted-foreground'
  if (value > 0) return 'text-emerald-500'
  if (value < 0) return 'text-red-500'
  return 'text-muted-foreground'
}

/**
 * Get trend arrow based on value
 */
export function getTrendArrow(value: number | null | undefined): string {
  if (value === null || value === undefined) return ''
  if (value > 0) return '↑'
  if (value < 0) return '↓'
  return '→'
}

/**
 * Format transaction count with label
 */
export function formatTransactionCount(count: number): string {
  if (count === 1) return '1 transaction'
  return `${formatNumber(count, true)} transactions`
}

/**
 * Format project count with label
 */
export function formatProjectCount(count: number): string {
  if (count === 1) return '1 project'
  return `${count} projects`
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 3)}...`
}
