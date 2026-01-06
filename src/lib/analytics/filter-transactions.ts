// Filter Transactions - Apply filters to transaction data
import type { Transaction } from './types'
import type { FilterState } from './filters'
import {
  BEDROOM_MAP,
  PROPERTY_TYPE_MAP,
  USAGE_TYPE_MAP,
  getAllPriceRangeBounds,
  getAllSizeRangeBounds,
} from './filters'

/**
 * Apply filters to a list of transactions
 * Returns filtered transactions
 */
export function filterTransactions(
  transactions: Transaction[],
  filters: FilterState
): Transaction[] {
  return transactions.filter((tx) => {
    // Registration Type filter
    if (filters.regTypes.length > 0) {
      const txRegType = tx.regType?.toLowerCase().replace(/\s+/g, '') || ''
      const matchesReg = filters.regTypes.some((regValue) => {
        if (regValue === 'offplan') {
          return txRegType === 'offplan' || tx.regType === 'Off Plan'
        }
        if (regValue === 'ready') {
          return txRegType === 'ready' || tx.regType === 'Ready' || tx.regType === 'Resale'
        }
        return false
      })
      if (!matchesReg) return false
    }

    // Property Type filter
    if (filters.propertyTypes.length > 0) {
      const txPropType = tx.propertyType?.toLowerCase() || ''
      const matchesProp = filters.propertyTypes.some((propValue) => {
        const mapped = PROPERTY_TYPE_MAP[propValue]?.toLowerCase()
        return mapped && txPropType.includes(mapped)
      })
      if (!matchesProp) return false
    }

    // Bedrooms filter
    if (filters.bedrooms.length > 0) {
      const txRooms = tx.rooms?.toString().toLowerCase().replace(/\s+/g, '') || ''
      const matchesBeds = filters.bedrooms.some((bedValue) => {
        const mapped = BEDROOM_MAP[bedValue]?.toLowerCase().replace(/\s+/g, '')
        if (!mapped) return false
        // Handle special cases
        if (bedValue === 'studio') {
          return txRooms === 'studio' || txRooms.includes('studio')
        }
        if (bedValue === '5br+') {
          // Match 5BR, 6BR, 7BR, etc.
          const numMatch = txRooms.match(/(\d+)/)
          if (numMatch) {
            const num = parseInt(numMatch[1], 10)
            return num >= 5
          }
          return txRooms.includes('5') || txRooms.includes('penthouse')
        }
        return txRooms === mapped || txRooms.includes(mapped.replace('br', ''))
      })
      if (!matchesBeds) return false
    }

    // Usage Type filter
    if (filters.usageTypes.length > 0) {
      const txUsage = tx.usageType?.toLowerCase() || ''
      const matchesUsage = filters.usageTypes.some((useValue) => {
        const mapped = USAGE_TYPE_MAP[useValue]?.toLowerCase()
        return mapped && txUsage.includes(mapped)
      })
      if (!matchesUsage) return false
    }

    // Price Range filter (multi-select - match ANY of the selected ranges)
    if (filters.priceRanges.length > 0) {
      const allBounds = getAllPriceRangeBounds(filters.priceRanges)
      const matchesAnyPriceRange = allBounds.some((bounds) => {
        if (tx.price < bounds.min) return false
        if (bounds.max !== null && tx.price > bounds.max) return false
        return true
      })
      if (!matchesAnyPriceRange) return false
    }

    // Size Range filter (multi-select - match ANY of the selected ranges)
    // Size stored in sqft in options, tx.size is in sqm
    if (filters.sizeRanges.length > 0) {
      const allBounds = getAllSizeRangeBounds(filters.sizeRanges)
      const matchesAnySizeRange = allBounds.some((bounds) => {
        if (tx.size < bounds.min) return false
        if (bounds.max !== null && tx.size > bounds.max) return false
        return true
      })
      if (!matchesAnySizeRange) return false
    }

    // Freehold filter
    if (filters.freeholdOnly) {
      if (!tx.isFreehold) return false
    }

    // Timeframe filter
    if (filters.timeframe !== 'ALL') {
      const txDate = new Date(tx.date)
      const now = new Date()
      let cutoffDate: Date

      switch (filters.timeframe) {
        case '1M':
          cutoffDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
          break
        case '3M':
          cutoffDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
          break
        case '6M':
          cutoffDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
          break
        case '1Y':
          cutoffDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
          break
        case '2Y':
          cutoffDate = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate())
          break
        case '3Y':
          cutoffDate = new Date(now.getFullYear() - 3, now.getMonth(), now.getDate())
          break
        case '5Y':
          cutoffDate = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate())
          break
        default:
          cutoffDate = new Date(0)
      }

      if (txDate < cutoffDate) return false
    }

    return true
  })
}

/**
 * Get summary stats for filtered transactions
 */
export function getFilteredStats(transactions: Transaction[]) {
  if (transactions.length === 0) {
    return {
      count: 0,
      totalValue: 0,
      avgPrice: 0,
      avgPricePerSqft: 0,
      avgSize: 0,
    }
  }

  const totalValue = transactions.reduce((sum, tx) => sum + tx.price, 0)
  const avgPrice = totalValue / transactions.length
  const avgPricePerSqft =
    transactions.reduce((sum, tx) => sum + tx.pricePerSqft, 0) / transactions.length
  const avgSize =
    transactions.reduce((sum, tx) => sum + tx.size, 0) / transactions.length

  return {
    count: transactions.length,
    totalValue,
    avgPrice,
    avgPricePerSqft,
    avgSize,
  }
}
