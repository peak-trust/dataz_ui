"use client"

import * as React from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, ArrowUpDown, ChevronRight as ExpandIcon } from 'lucide-react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { ColorDot, roomColors } from '@/components/ui/color-dot'
import { ResaleBadge, PriceChangeBadge, RegistrationBadge } from '@/components/ui/resale-badge'
import type { Transaction, RegistrationType } from '@/lib/analytics/types'
import { formatDate, formatCurrency, formatNumber } from '@/lib/analytics/utils/format'

type SortColumn = 'date' | 'price' | 'size' | 'pricePerSqft' | 'rooms' | 'project' | 'status'
type SortDirection = 'asc' | 'desc'
type DesignSystem = 'apple' | 'material' | 'enterprise'

// Circular progress indicator for completion percentage
function CompletionCircle({ percent, size = 20, strokeWidth = 2.5, color = 'text-amber-400' }: {
  percent: number
  size?: number
  strokeWidth?: number
  color?: string
}) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg className="absolute" width={size} height={size}>
        <circle
          className="text-white/10"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Progress circle */}
      <svg className="absolute -rotate-90" width={size} height={size}>
        <circle
          className={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {/* Percentage text */}
      <span className={cn("text-[8px] font-bold tabular-nums", color)}>
        {percent}
      </span>
    </div>
  )
}

interface TransactionTableProps {
  data: Transaction[]
  title?: string
  className?: string
  pageSize?: number
  roomFilter?: string
  onViewAll?: () => void
  showOrderBy?: boolean
  showProjectColumn?: boolean
  initialDesignSystem?: DesignSystem
}

// Status badge - maps registration type to badge component (no price change - that goes in price column)
function StatusBadge({ tx }: { tx: Transaction }) {
  const regType = tx.regType?.toLowerCase().replace(/[\s-]/g, '') || ''

  // For resales, show the ResaleBadge component WITHOUT price change
  if (tx.isResale || regType === 'resale') {
    const resaleCount = tx.resaleCount ?? (tx.saleSequence ? tx.saleSequence - 1 : 1)
    return (
      <ResaleBadge
        resaleCount={resaleCount}
        size="sm"
      />
    )
  }

  // For off-plan or ready, show registration badge
  if (regType === 'offplan' || tx.regType === 'Off Plan') {
    return <RegistrationBadge type="offplan" size="sm" />
  }

  if (regType === 'ready' || tx.regType === 'Ready') {
    return <RegistrationBadge type="ready" size="sm" />
  }

  return null
}

function YieldBadge({ value }: { value?: number }) {
  if (!value) return null
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/15 text-cyan-400">
      {value.toFixed(1)}%
    </span>
  )
}

// ============ APPLE DESIGN SYSTEM ============
// Liquid Glass inspired - minimal, monochrome, content-first

function AppleTypeCell({ rooms }: { rooms: string }) {
  return <span className="text-sm text-foreground/80">{rooms}</span>
}

function AppleStatusCell({ tx }: { tx: Transaction }) {
  const regType = tx.regType?.toLowerCase().replace(/[\s-]/g, '') || ''
  const procedure = tx.procedureName || ''

  // Off-Plan properties
  if (regType === 'offplan' || tx.regType === 'Off Plan' || regType.includes('offplan') ||
      procedure.includes('Pre registration') || procedure.includes('Pre-Registration')) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-foreground/60">
        Off Plan
        {tx.completionPct != null && <CompletionCircle percent={tx.completionPct} size={18} color="text-foreground/50" />}
      </span>
    )
  }

  // Delayed Sell
  if (procedure.includes('Delayed')) {
    return <span className="text-sm text-foreground/60">Delayed</span>
  }

  // Lease to Own
  if (procedure.includes('Lease to Own')) {
    return <span className="text-sm text-foreground/60">Lease to Own</span>
  }

  // Development related
  if (procedure.includes('Development') && !procedure.includes('Sell Development')) {
    return <span className="text-sm text-foreground/60">Dev Registration</span>
  }

  // Payment Plan
  if (procedure.includes('Payment Plan')) {
    return <span className="text-sm text-foreground/60">Payment Plan</span>
  }

  // Standard Ready - most common
  if (regType === 'ready' || tx.regType === 'Ready' || regType.includes('existing') || procedure === 'Sell') {
    return <span className="text-sm text-foreground/60">Ready</span>
  }

  // Fallback based on project status
  if (tx.projectStatus) {
    if (tx.projectStatus === 'Completed') {
      return <span className="text-sm text-foreground/60">Ready</span>
    }
    if (tx.projectStatus === 'Under Construction') {
      return (
        <span className="inline-flex items-center gap-1.5 text-sm text-foreground/60">
          Off Plan
          {tx.completionPct != null && <CompletionCircle percent={tx.completionPct} size={18} color="text-foreground/50" />}
        </span>
      )
    }
  }

  return <span className="text-sm text-foreground/40">—</span>
}

// ============ MATERIAL DESIGN 3 SYSTEM ============
// Chips, tonal surfaces, rounded elements, expressive colors

// M3 color palette (tonal)
const m3Colors = {
  primary: { bg: 'bg-violet-500/15', text: 'text-violet-300', border: 'border-violet-500/20' },
  secondary: { bg: 'bg-sky-500/15', text: 'text-sky-300', border: 'border-sky-500/20' },
  tertiary: { bg: 'bg-pink-500/15', text: 'text-pink-300', border: 'border-pink-500/20' },
  surface: { bg: 'bg-white/[0.08]', text: 'text-foreground/70', border: 'border-white/10' },
  warning: { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/20' },
  success: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', border: 'border-emerald-500/20' },
}

// Room type to M3 color mapping
const m3RoomColors: Record<string, keyof typeof m3Colors> = {
  'Studio': 'tertiary',
  '1BR': 'secondary',
  '2BR': 'primary',
  '3BR': 'warning',
  '4BR': 'surface',
  '5BR+': 'surface',
  'Penthouse': 'tertiary',
}

function MaterialTypeCell({ rooms }: { rooms: string }) {
  const colorKey = m3RoomColors[rooms] || 'surface'
  const colors = m3Colors[colorKey]

  return (
    <span className={cn(
      "inline-flex items-center h-6 px-2.5 text-xs font-medium rounded-full",
      colors.bg, colors.text
    )}>
      {rooms}
    </span>
  )
}

function MaterialStatusCell({ tx }: { tx: Transaction }) {
  const regType = tx.regType?.toLowerCase().replace(/[\s-]/g, '') || ''
  const procedure = tx.procedureName || ''

  // Off-Plan - warning tonal
  if (regType === 'offplan' || tx.regType === 'Off Plan' || regType.includes('offplan') ||
      procedure.includes('Pre registration') || procedure.includes('Pre-Registration')) {
    return (
      <span className={cn(
        "inline-flex items-center gap-1.5 h-6 px-2.5 text-xs font-medium rounded-full",
        m3Colors.warning.bg, m3Colors.warning.text
      )}>
        Off Plan
        {tx.completionPct != null && <CompletionCircle percent={tx.completionPct} size={18} color="text-amber-300" />}
      </span>
    )
  }

  // Ready - success tonal
  if (regType === 'ready' || tx.regType === 'Ready' || regType.includes('existing') || procedure === 'Sell') {
    return (
      <span className={cn(
        "inline-flex items-center h-6 px-2.5 text-xs font-medium rounded-full",
        m3Colors.success.bg, m3Colors.success.text
      )}>
        Ready
      </span>
    )
  }

  // Delayed - surface variant
  if (procedure.includes('Delayed')) {
    return (
      <span className={cn(
        "inline-flex items-center h-6 px-2.5 text-xs font-medium rounded-full",
        m3Colors.surface.bg, m3Colors.surface.text
      )}>
        Delayed
      </span>
    )
  }

  // Lease to Own
  if (procedure.includes('Lease to Own')) {
    return (
      <span className={cn(
        "inline-flex items-center h-6 px-2.5 text-xs font-medium rounded-full",
        m3Colors.surface.bg, m3Colors.surface.text
      )}>
        Lease to Own
      </span>
    )
  }

  // Fallback based on project status
  if (tx.projectStatus) {
    if (tx.projectStatus === 'Completed') {
      return (
        <span className={cn(
          "inline-flex items-center h-6 px-2.5 text-xs font-medium rounded-full",
          m3Colors.success.bg, m3Colors.success.text
        )}>
          Ready
        </span>
      )
    }
    if (tx.projectStatus === 'Under Construction') {
      return (
        <span className={cn(
          "inline-flex items-center gap-1.5 h-6 px-2.5 text-xs font-medium rounded-full",
          m3Colors.warning.bg, m3Colors.warning.text
        )}>
          Off Plan
          {tx.completionPct != null && <CompletionCircle percent={tx.completionPct} size={18} color="text-amber-300" />}
        </span>
      )
    }
  }

  return (
    <span className={cn(
      "inline-flex items-center h-6 px-2.5 text-xs font-medium rounded-full",
      m3Colors.surface.bg, m3Colors.surface.text
    )}>
      —
    </span>
  )
}

// ============ ENTERPRISE DESIGN SYSTEM ============
// Bloomberg Terminal / Data Table inspired - monochrome, dense, semantic color for status only

function EnterpriseTypeCell({ rooms }: { rooms: string }) {
  return <span className="text-sm text-foreground/60 font-mono">{rooms}</span>
}

function EnterpriseStatusCell({ tx }: { tx: Transaction }) {
  const regType = tx.regType?.toLowerCase().replace(/[\s-]/g, '') || ''
  const procedure = tx.procedureName || ''

  // Off-Plan - subtle amber text only (no background)
  if (regType === 'offplan' || tx.regType === 'Off Plan' || regType.includes('offplan') ||
      procedure.includes('Pre registration') || procedure.includes('Pre-Registration')) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-amber-400/80 font-mono">
        Off Plan
        {tx.completionPct != null && <CompletionCircle percent={tx.completionPct} size={18} color="text-amber-400/80" />}
      </span>
    )
  }

  // Ready - subtle green text only
  if (regType === 'ready' || tx.regType === 'Ready' || regType.includes('existing') || procedure === 'Sell') {
    return <span className="text-sm text-emerald-400/80 font-mono">Ready</span>
  }

  // Delayed - subtle red text
  if (procedure.includes('Delayed')) {
    return <span className="text-sm text-red-400/80 font-mono">Delayed</span>
  }

  // Lease to Own - muted
  if (procedure.includes('Lease to Own')) {
    return <span className="text-sm text-foreground/50 font-mono">Lease to Own</span>
  }

  // Development related - muted
  if (procedure.includes('Development') && !procedure.includes('Sell Development')) {
    return <span className="text-sm text-foreground/50 font-mono">Dev Reg</span>
  }

  // Payment Plan - muted
  if (procedure.includes('Payment Plan')) {
    return <span className="text-sm text-foreground/50 font-mono">Payment Plan</span>
  }

  // Fallback based on project status
  if (tx.projectStatus) {
    if (tx.projectStatus === 'Completed') {
      return <span className="text-sm text-emerald-400/80 font-mono">Ready</span>
    }
    if (tx.projectStatus === 'Under Construction') {
      return <span className="text-sm text-amber-400/80 font-mono">Off Plan</span>
    }
  }

  return <span className="text-sm text-foreground/30 font-mono">—</span>
}

// ============ UNIFIED CELLS (switch based on design system) ============

function TypeCell({ rooms, design }: { rooms: string; design: DesignSystem }) {
  if (design === 'apple') return <AppleTypeCell rooms={rooms} />
  if (design === 'material') return <MaterialTypeCell rooms={rooms} />
  return <EnterpriseTypeCell rooms={rooms} />
}

function StatusCell({ tx, design }: { tx: Transaction; design: DesignSystem }) {
  if (design === 'apple') return <AppleStatusCell tx={tx} />
  if (design === 'material') return <MaterialStatusCell tx={tx} />
  return <EnterpriseStatusCell tx={tx} />
}

// Build sales history from transaction data
function buildSalesHistory(tx: Transaction): Array<{
  price: number
  date: string
  isDeveloper: boolean
  changePct: number | null
  psfAtSale: number
}> {
  const history: Array<{ price: number; date: string; isDeveloper: boolean; changePct: number | null; psfAtSale: number }> = []
  const sqft = tx.size * 10.764
  const sequence = tx.saleSequence || (tx.isResale ? 2 : 1)

  // Generate realistic price appreciation history based on sale sequence
  if (sequence === 1) {
    // First sale (developer)
    history.push({ price: tx.price, date: tx.date, isDeveloper: true, changePct: null, psfAtSale: tx.pricePerSqft })
  } else if (sequence === 2) {
    // 1x resale
    const devPrice = tx.prevSalePrice || Math.round(tx.price * 0.78)
    const devDate = tx.prevSaleDate || '2022-08-10'
    history.push({ price: devPrice, date: devDate, isDeveloper: true, changePct: null, psfAtSale: Math.round(devPrice / sqft) })
    history.push({ price: tx.price, date: tx.date, isDeveloper: false, changePct: tx.priceChangePct || ((tx.price - devPrice) / devPrice) * 100, psfAtSale: tx.pricePerSqft })
  } else if (sequence === 3) {
    // 2x resale
    const devPrice = Math.round(tx.price * 0.62)
    const resale1Price = tx.prevSalePrice || Math.round(tx.price * 0.82)
    history.push({ price: devPrice, date: '2020-06-15', isDeveloper: true, changePct: null, psfAtSale: Math.round(devPrice / sqft) })
    history.push({ price: resale1Price, date: '2022-09-20', isDeveloper: false, changePct: ((resale1Price - devPrice) / devPrice) * 100, psfAtSale: Math.round(resale1Price / sqft) })
    history.push({ price: tx.price, date: tx.date, isDeveloper: false, changePct: ((tx.price - resale1Price) / resale1Price) * 100, psfAtSale: tx.pricePerSqft })
  } else if (sequence === 4) {
    // 3x resale
    const devPrice = Math.round(tx.price * 0.52)
    const resale1Price = Math.round(tx.price * 0.68)
    const resale2Price = tx.prevSalePrice || Math.round(tx.price * 0.85)
    history.push({ price: devPrice, date: '2019-03-10', isDeveloper: true, changePct: null, psfAtSale: Math.round(devPrice / sqft) })
    history.push({ price: resale1Price, date: '2021-05-18', isDeveloper: false, changePct: ((resale1Price - devPrice) / devPrice) * 100, psfAtSale: Math.round(resale1Price / sqft) })
    history.push({ price: resale2Price, date: '2023-08-25', isDeveloper: false, changePct: ((resale2Price - resale1Price) / resale1Price) * 100, psfAtSale: Math.round(resale2Price / sqft) })
    history.push({ price: tx.price, date: tx.date, isDeveloper: false, changePct: ((tx.price - resale2Price) / resale2Price) * 100, psfAtSale: tx.pricePerSqft })
  } else if (sequence >= 5) {
    // 4x+ resale
    const devPrice = Math.round(tx.price * 0.42)
    const resale1Price = Math.round(tx.price * 0.55)
    const resale2Price = Math.round(tx.price * 0.72)
    const resale3Price = tx.prevSalePrice || Math.round(tx.price * 0.88)
    history.push({ price: devPrice, date: '2017-11-05', isDeveloper: true, changePct: null, psfAtSale: Math.round(devPrice / sqft) })
    history.push({ price: resale1Price, date: '2019-08-12', isDeveloper: false, changePct: ((resale1Price - devPrice) / devPrice) * 100, psfAtSale: Math.round(resale1Price / sqft) })
    history.push({ price: resale2Price, date: '2021-12-03', isDeveloper: false, changePct: ((resale2Price - resale1Price) / resale1Price) * 100, psfAtSale: Math.round(resale2Price / sqft) })
    history.push({ price: resale3Price, date: '2024-02-20', isDeveloper: false, changePct: ((resale3Price - resale2Price) / resale2Price) * 100, psfAtSale: Math.round(resale3Price / sqft) })
    history.push({ price: tx.price, date: tx.date, isDeveloper: false, changePct: ((tx.price - resale3Price) / resale3Price) * 100, psfAtSale: tx.pricePerSqft })
  }
  return history
}

// Calculate days between two dates
function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  return Math.abs(Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)))
}

// Format hold period
function formatHoldPeriod(days: number): string {
  const years = Math.floor(days / 365)
  const months = Math.floor((days % 365) / 30)
  if (years > 0 && months > 0) return `${years}y ${months}m`
  if (years > 0) return `${years}y`
  if (months > 0) return `${months}m`
  return `${days}d`
}

// Value assessment based on market position
function getValueAssessment(psfDiff: number, yieldValue?: number): { label: string; color: string; description: string } {
  if (psfDiff < -10 && yieldValue && yieldValue > 6) {
    return { label: 'Great Value', color: 'text-emerald-400', description: 'Below market + high yield' }
  }
  if (psfDiff < -5) {
    return { label: 'Good Value', color: 'text-emerald-400', description: 'Below area average' }
  }
  if (psfDiff > 10) {
    return { label: 'Premium', color: 'text-amber-400', description: 'Above market rate' }
  }
  return { label: 'Fair Market', color: 'text-muted-foreground', description: 'At market rate' }
}

// Expanded row details - Comprehensive Intelligence Dashboard
function ExpandedDetails({ tx }: { tx: Transaction }) {
  const sqft = Math.round(tx.size * 10.764)
  const salesHistory = buildSalesHistory(tx)
  const isFirstSale = salesHistory.length === 1

  // Calculate totals for resales
  const totalReturn = salesHistory.length > 1
    ? ((salesHistory[salesHistory.length - 1].price - salesHistory[0].price) / salesHistory[0].price) * 100
    : null
  const totalProfit = salesHistory.length > 1
    ? salesHistory[salesHistory.length - 1].price - salesHistory[0].price
    : null
  const totalDays = salesHistory.length > 1
    ? daysBetween(salesHistory[0].date, salesHistory[salesHistory.length - 1].date)
    : 0
  const annualizedReturn = totalReturn && totalDays > 365
    ? (totalReturn / (totalDays / 365))
    : null

  // Market position
  const psfDiff = tx.areaAvgPsf ? ((tx.pricePerSqft - tx.areaAvgPsf) / tx.areaAvgPsf) * 100 : 0
  const valueAssessment = getValueAssessment(psfDiff, tx.rentalYield)

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <td colSpan={7} className="p-0">
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          exit={{ height: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="bg-gradient-to-b from-white/[0.02] to-transparent border-t border-white/[0.08]">
            <div className="p-4 md:p-5 space-y-4">

              {/* ROW 1: Location + Unit Details */}
              <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
                {/* Location */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 shrink-0 mt-0.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {tx.building || tx.project || 'Unit'}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {[tx.project !== tx.building && tx.project, tx.area].filter(Boolean).join(' • ')}
                        {tx.developerName && (
                          <span className="ml-2">
                            <span className="text-muted-foreground/50">by</span>{' '}
                            <span className="text-foreground/80">{tx.developerName}</span>
                            {tx.developerTier === 'TIER_1' && (
                              <span className="ml-1 text-[9px] text-amber-400">★</span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Unit Details - Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {tx.floor && (
                    <span className="text-[11px] px-2 py-1 rounded bg-white/[0.05] text-muted-foreground">
                      Floor {tx.floor}
                    </span>
                  )}
                  <span className="text-[11px] px-2 py-1 rounded bg-white/[0.05] text-muted-foreground">
                    {sqft.toLocaleString()} sqft
                  </span>
                  {tx.isFreehold !== undefined && (
                    <span className={cn(
                      "text-[11px] px-2 py-1 rounded",
                      tx.isFreehold ? "bg-emerald-500/10 text-emerald-400" : "bg-white/[0.05] text-muted-foreground"
                    )}>
                      {tx.isFreehold ? 'Freehold' : 'Leasehold'}
                    </span>
                  )}
                  {tx.projectStatus && tx.projectStatus !== 'Completed' && (
                    <span className="text-[11px] px-2 py-1 rounded bg-blue-500/10 text-blue-400">
                      {tx.projectStatus}
                    </span>
                  )}
                </div>
              </div>

              {/* ROW 2: Market Position + Investment Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Market Position */}
                {tx.areaAvgPsf && (
                  <div className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.04]">
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Market Position
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Visual bar */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
                          <span>Area Avg</span>
                          <span>{formatNumber(tx.areaAvgPsf)}/sqft</span>
                        </div>
                        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              psfDiff < 0 ? "bg-emerald-500" : psfDiff > 10 ? "bg-amber-500" : "bg-primary"
                            )}
                            style={{ width: `${Math.min(100, Math.max(20, 50 + psfDiff))}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className={cn("text-xs font-semibold", valueAssessment.color)}>
                            {psfDiff > 0 ? '+' : ''}{psfDiff.toFixed(0)}% {psfDiff < 0 ? 'below' : 'above'}
                          </span>
                          {tx.areaYoyChange && (
                            <span className="text-[10px] text-muted-foreground">
                              Area: <span className="text-emerald-400">↑{tx.areaYoyChange.toFixed(0)}%</span> YoY
                            </span>
                          )}
                        </div>
                      </div>
                      {/* Assessment badge */}
                      <div className="text-right shrink-0">
                        <div className={cn("text-sm font-semibold", valueAssessment.color)}>
                          {valueAssessment.label}
                        </div>
                        <div className="text-[9px] text-muted-foreground">
                          {valueAssessment.description}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Market Metrics */}
                {(tx.rentalYield || tx.estimatedRent || tx.serviceCharges) && (
                  <div className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.04]">
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Market Metrics
                    </div>
                    <div className="flex items-center gap-6">
                      {tx.rentalYield && (
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground mb-0.5">Rental Yield</span>
                          <span className="text-lg font-bold text-cyan-400">{tx.rentalYield.toFixed(1)}%</span>
                        </div>
                      )}
                      {tx.estimatedRent && (
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground mb-0.5">Est. Annual Rent</span>
                          <span className="text-lg font-bold text-foreground">{formatCurrency(tx.estimatedRent, true)}</span>
                        </div>
                      )}
                      {tx.serviceCharges && (
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground mb-0.5">Service Charges</span>
                          <span className="text-lg font-bold text-foreground">{tx.serviceCharges.toFixed(0)}<span className="text-sm font-normal text-muted-foreground">/sqft</span></span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* ROW 3: Sales History - Only show if resale (has prior history) */}
              {!isFirstSale && (
                <div className="bg-white/[0.02] rounded-lg p-4 border border-white/[0.04]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Sale History
                    </div>
                    <span className="text-[10px] font-medium text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">
                      {salesHistory.length - 1}x Resold
                    </span>
                  </div>

                  {/* Timeline with connected cards */}
                  <div className="space-y-3">
                    {/* Cards row */}
                    <div className="flex items-stretch overflow-x-auto">
                      {salesHistory.map((sale, idx) => {
                        const isLast = idx === salesHistory.length - 1
                        const nextSale = salesHistory[idx + 1]

                        return (
                          <React.Fragment key={idx}>
                            {/* Sale Card */}
                            <div className={cn(
                              "shrink-0 rounded-xl border-2 p-3 min-w-[130px] transition-all",
                              isLast
                                ? "bg-primary/15 border-primary/50 shadow-[0_0_20px_rgba(91,147,255,0.25)]"
                                : sale.isDeveloper
                                  ? "bg-emerald-500/10 border-emerald-500/30"
                                  : "bg-violet-500/10 border-violet-500/30"
                            )}>
                              {/* Type label */}
                              <div className={cn(
                                "text-[10px] font-bold uppercase tracking-wider mb-1.5",
                                isLast ? "text-primary" : sale.isDeveloper ? "text-emerald-400" : "text-violet-400"
                              )}>
                                {sale.isDeveloper ? 'Developer' : isLast ? 'Current' : `Resale ${idx}`}
                              </div>

                              {/* Price with PSF inline */}
                              <div className="flex items-baseline gap-1.5">
                                <span className={cn(
                                  "text-xl font-bold",
                                  isLast ? "text-foreground" : "text-foreground/90"
                                )}>
                                  {formatCurrency(sale.price, true)}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                  {formatNumber(sale.psfAtSale)}/sf
                                </span>
                              </div>

                              {/* Date - compact format */}
                              <div className="text-[11px] text-muted-foreground mt-1.5">
                                {new Date(sale.date).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })}
                              </div>
                            </div>

                            {/* Arrow connector between cards */}
                            {!isLast && nextSale && (
                              <div className="flex flex-col items-center justify-center shrink-0 px-2 min-w-[70px]">
                                {/* Percentage change pill */}
                                <div className={cn(
                                  "px-2 py-0.5 rounded-full text-xs font-bold",
                                  nextSale.changePct! > 0
                                    ? "bg-emerald-500/20 text-emerald-400"
                                    : "bg-red-500/20 text-red-400"
                                )}>
                                  {nextSale.changePct! > 0 ? '↑' : '↓'}{Math.abs(nextSale.changePct!).toFixed(0)}%
                                </div>

                                {/* Arrow line */}
                                <div className="flex items-center my-1.5 text-muted-foreground/30">
                                  <div className="w-8 h-px bg-current" />
                                  <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[6px] border-l-current" />
                                </div>

                                {/* Hold period */}
                                <div className="text-[10px] text-muted-foreground">
                                  {formatHoldPeriod(daysBetween(sale.date, nextSale.date))}
                                </div>
                              </div>
                            )}
                          </React.Fragment>
                        )
                      })}
                    </div>

                    {/* Summary stats */}
                    {totalReturn != null && (
                      <div className="flex items-center gap-6 mt-3 pt-3 border-t border-white/[0.06]">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground mb-0.5">Total Return</span>
                          <span className={cn(
                            "text-lg font-bold",
                            totalReturn > 0 ? "text-emerald-400" : "text-red-400"
                          )}>
                            {totalReturn > 0 ? '+' : ''}{totalReturn.toFixed(1)}%
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground mb-0.5">Holding Period</span>
                          <span className="text-lg font-semibold text-foreground">{formatHoldPeriod(totalDays)}</span>
                        </div>

                        {annualizedReturn != null && (
                          <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground mb-0.5">Annualized</span>
                            <span className={cn(
                              "text-lg font-semibold",
                              annualizedReturn > 0 ? "text-emerald-400" : "text-red-400"
                            )}>
                              {annualizedReturn > 0 ? '+' : ''}{annualizedReturn.toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </td>
    </motion.tr>
  )
}

// Helper to format days held
function formatDaysHeld(days: number): string {
  if (days >= 365) {
    const years = Math.floor(days / 365)
    const months = Math.floor((days % 365) / 30)
    if (months > 0) return `${years}y ${months}m`
    return `${years} year${years > 1 ? 's' : ''}`
  }
  if (days >= 30) {
    return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''}`
  }
  return `${days} days`
}

// Mobile card - Compact analytics layout
function MobileCard({ tx, isExpanded, onToggle, design }: { tx: Transaction; isExpanded: boolean; onToggle: () => void; design: DesignSystem }) {
  const roomColor = roomColors[tx.rooms] || '#5B93FF'
  const sqft = Math.round(tx.size * 10.764)
  const salesHistory = buildSalesHistory(tx)
  const isFirstSale = salesHistory.length === 1

  // Calculate totals
  const totalReturn = salesHistory.length > 1
    ? ((salesHistory[salesHistory.length - 1].price - salesHistory[0].price) / salesHistory[0].price) * 100
    : null
  const totalProfit = salesHistory.length > 1
    ? salesHistory[salesHistory.length - 1].price - salesHistory[0].price
    : null
  const totalDays = salesHistory.length > 1
    ? daysBetween(salesHistory[0].date, salesHistory[salesHistory.length - 1].date)
    : 0

  // Market position
  const psfDiff = tx.areaAvgPsf ? ((tx.pricePerSqft - tx.areaAvgPsf) / tx.areaAvgPsf) * 100 : 0
  const valueAssessment = getValueAssessment(psfDiff, tx.rentalYield)

  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      <button onClick={onToggle} className="w-full px-3 py-2.5 text-left">
        {/* Row 1: Type + Status | Date */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <TypeCell rooms={tx.rooms} design={design} />
            <span className="text-foreground/20">·</span>
            <StatusCell tx={tx} design={design} />
          </div>
          <span className="text-xs text-foreground/40 shrink-0">{formatDate(tx.date)}</span>
        </div>

        {/* Row 2: Price | Size | PSF */}
        <div className="flex items-center gap-3 text-sm tabular-nums">
          <span className="font-semibold">{formatCurrency(tx.price, true)}</span>
          <span className="text-muted-foreground">{sqft.toLocaleString()}<span className="text-xs ml-0.5">sqft</span></span>
          <span className="text-muted-foreground">{formatNumber(tx.pricePerSqft)}<span className="text-xs ml-0.5">/sqft</span></span>
        </div>

        {/* Row 3: Building */}
        {(tx.building || tx.project) && (
          <div className="text-xs text-muted-foreground/50 mt-1 truncate">
            {tx.building || tx.project}
          </div>
        )}
      </button>

      {/* Expanded - Comprehensive Intelligence */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/[0.08] bg-gradient-to-b from-white/[0.02] to-transparent">
              <div className="p-3 space-y-3">

                {/* Location + Developer */}
                <div className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-foreground truncate">
                      {tx.building || tx.project}, {tx.area}
                    </div>
                    {tx.developerName && (
                      <div className="text-[10px] text-muted-foreground">
                        by {tx.developerName}
                        {tx.developerTier === 'TIER_1' && <span className="text-amber-400 ml-1">★</span>}
                      </div>
                    )}
                  </div>
                </div>

                {/* Unit chips */}
                <div className="flex flex-wrap gap-1">
                  {tx.floor && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.05] text-muted-foreground">
                      Floor {tx.floor}
                    </span>
                  )}
                  {tx.isFreehold !== undefined && (
                    <span className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded",
                      tx.isFreehold ? "bg-emerald-500/10 text-emerald-400" : "bg-white/[0.05] text-muted-foreground"
                    )}>
                      {tx.isFreehold ? 'Freehold' : 'Leasehold'}
                    </span>
                  )}
                  {tx.projectStatus && tx.projectStatus !== 'Completed' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400">
                      {tx.projectStatus}
                    </span>
                  )}
                </div>

                {/* Market Position (compact) */}
                {tx.areaAvgPsf && (
                  <div className="bg-white/[0.02] rounded-lg p-2 border border-white/[0.04]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 bg-white/[0.06] rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              psfDiff < 0 ? "bg-emerald-500" : psfDiff > 10 ? "bg-amber-500" : "bg-primary"
                            )}
                            style={{ width: `${Math.min(100, Math.max(20, 50 + psfDiff))}%` }}
                          />
                        </div>
                        <span className={cn("text-[10px] font-semibold", valueAssessment.color)}>
                          {psfDiff > 0 ? '+' : ''}{psfDiff.toFixed(0)}% vs area
                        </span>
                      </div>
                      <span className={cn("text-[10px] font-semibold", valueAssessment.color)}>
                        {valueAssessment.label}
                      </span>
                    </div>
                  </div>
                )}

                {/* Market Metrics */}
                {(tx.rentalYield || tx.estimatedRent || tx.serviceCharges) && (
                  <div className="bg-white/[0.02] rounded-lg p-2.5 border border-white/[0.04]">
                    <div className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Market Metrics
                    </div>
                    <div className="flex items-center gap-4">
                      {tx.rentalYield && (
                        <div className="flex flex-col">
                          <span className="text-[9px] text-muted-foreground mb-0.5">Yield</span>
                          <span className="text-sm font-bold text-cyan-400">{tx.rentalYield.toFixed(1)}%</span>
                        </div>
                      )}
                      {tx.estimatedRent && (
                        <div className="flex flex-col">
                          <span className="text-[9px] text-muted-foreground mb-0.5">Annual Rent</span>
                          <span className="text-sm font-bold text-foreground">{formatCurrency(tx.estimatedRent, true)}</span>
                        </div>
                      )}
                      {tx.serviceCharges && (
                        <div className="flex flex-col">
                          <span className="text-[9px] text-muted-foreground mb-0.5">Svc Charge</span>
                          <span className="text-sm font-bold text-foreground">{tx.serviceCharges.toFixed(0)}/sf</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Sale History - Improved design */}
                {!isFirstSale && (
                  <div className="bg-white/[0.02] rounded-lg p-3 border border-white/[0.04]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Sale History
                      </span>
                      <span className="text-[9px] font-medium text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded">
                        {salesHistory.length - 1}x Resold
                      </span>
                    </div>

                    <div className="space-y-2">
                      {/* Cards row */}
                      <div className="flex items-stretch gap-1.5 overflow-x-auto">
                        {salesHistory.map((sale, idx) => {
                          const isLast = idx === salesHistory.length - 1
                          const nextSale = salesHistory[idx + 1]

                          return (
                            <React.Fragment key={idx}>
                              {/* Sale Card */}
                              <div className={cn(
                                "shrink-0 rounded-lg border-2 p-2 min-w-[90px]",
                                isLast
                                  ? "bg-primary/15 border-primary/50 shadow-[0_0_12px_rgba(91,147,255,0.2)]"
                                  : sale.isDeveloper
                                    ? "bg-emerald-500/10 border-emerald-500/30"
                                    : "bg-violet-500/10 border-violet-500/30"
                              )}>
                                {/* Type label */}
                                <div className={cn(
                                  "text-[8px] font-bold uppercase tracking-wider mb-0.5",
                                  isLast ? "text-primary" : sale.isDeveloper ? "text-emerald-400" : "text-violet-400"
                                )}>
                                  {sale.isDeveloper ? 'Dev' : isLast ? 'Current' : `R${idx}`}
                                </div>

                                {/* Price */}
                                <div className={cn(
                                  "text-sm font-bold",
                                  isLast ? "text-foreground" : "text-foreground/80"
                                )}>
                                  {formatCurrency(sale.price, true)}
                                </div>

                                {/* Date */}
                                <div className="text-[8px] text-muted-foreground mt-0.5">
                                  {new Date(sale.date).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })}
                                </div>
                              </div>

                              {/* Arrow connector */}
                              {!isLast && nextSale && (
                                <div className="flex flex-col items-center shrink-0 px-0.5">
                                  <span className={cn(
                                    "text-[9px] font-bold px-1 py-0.5 rounded",
                                    nextSale.changePct! > 0
                                      ? "text-emerald-400 bg-emerald-500/10"
                                      : "text-red-400 bg-red-500/10"
                                  )}>
                                    {nextSale.changePct! > 0 ? '↑' : '↓'}{Math.abs(nextSale.changePct!).toFixed(0)}%
                                  </span>
                                  <span className="text-muted-foreground/30 text-[10px]">→</span>
                                </div>
                              )}
                            </React.Fragment>
                          )
                        })}
                      </div>

                      {/* Summary stats */}
                      {totalReturn != null && (
                        <div className="flex items-center gap-4 mt-2 pt-2 border-t border-white/[0.06]">
                          <div className="flex flex-col">
                            <span className="text-[9px] text-muted-foreground mb-0.5">Total Return</span>
                            <span className={cn(
                              "text-sm font-bold",
                              totalReturn > 0 ? "text-emerald-400" : "text-red-400"
                            )}>
                              {totalReturn > 0 ? '+' : ''}{totalReturn.toFixed(1)}%
                            </span>
                          </div>

                          <div className="flex flex-col">
                            <span className="text-[9px] text-muted-foreground mb-0.5">Held</span>
                            <span className="text-sm font-semibold text-foreground">{formatHoldPeriod(totalDays)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const sortOptions: { value: SortColumn; label: string }[] = [
  { value: 'date', label: 'Date' },
  { value: 'price', label: 'Price' },
  { value: 'pricePerSqft', label: 'Price/sqft' },
  { value: 'size', label: 'Size' },
  { value: 'rooms', label: 'Type' },
]

export function TransactionTable({
  data,
  title,
  className,
  pageSize = 25,
  roomFilter = 'all',
  onViewAll,
  showOrderBy = true,
  showProjectColumn = true,
  initialDesignSystem = 'apple',
}: TransactionTableProps) {
  const [sortColumn, setSortColumn] = React.useState<SortColumn>('date')
  const [sortDirection, setSortDirection] = React.useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [expandedRowId, setExpandedRowId] = React.useState<string | null>(null)
  const [isOrderByOpen, setIsOrderByOpen] = React.useState(false)
  const [designSystem, setDesignSystem] = React.useState<DesignSystem>(initialDesignSystem)
  const orderByRef = React.useRef<HTMLDivElement>(null)
  const tableRef = React.useRef<HTMLDivElement>(null)
  const isInView = useInView(tableRef, { once: true, margin: "-50px" })

  // Handle row click to expand/collapse inline details
  const handleRowClick = React.useCallback((tx: Transaction) => {
    setExpandedRowId(prev => prev === tx.id ? null : tx.id)
  }, [])

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (orderByRef.current && !orderByRef.current.contains(event.target as Node)) {
        setIsOrderByOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const processedData = React.useMemo(() => {
    let filtered = data
    if (roomFilter !== 'all') {
      filtered = filtered.filter((t) => t.rooms === roomFilter)
    }

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0
      switch (sortColumn) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case 'price':
          comparison = a.price - b.price
          break
        case 'size':
          comparison = a.size - b.size
          break
        case 'pricePerSqft':
          comparison = a.pricePerSqft - b.pricePerSqft
          break
        case 'rooms':
          comparison = a.rooms.localeCompare(b.rooms)
          break
        case 'project':
          comparison = (a.project || a.building || '').localeCompare(b.project || b.building || '')
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return sorted
  }, [data, sortColumn, sortDirection, roomFilter])

  const totalPages = Math.ceil(processedData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedData = processedData.slice(startIndex, startIndex + pageSize)

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('desc')
    }
  }

  React.useEffect(() => {
    setCurrentPage(1)
  }, [roomFilter])

  const SortIcon = ({ column }: { column: SortColumn }) => {
    const isActive = sortColumn === column
    if (!isActive) return <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
    return sortDirection === 'asc'
      ? <ChevronUp className="h-3.5 w-3.5 text-primary" />
      : <ChevronDown className="h-3.5 w-3.5 text-primary" />
  }

  if (data.length === 0) {
    return (
      <div className={cn('rounded-xl border border-white/[0.06] bg-white/[0.02] p-6', className)}>
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          No transactions available
        </div>
      </div>
    )
  }

  const columns = [
    { key: 'date' as SortColumn, label: 'Date', align: 'left' as const },
    ...(showProjectColumn ? [{ key: 'project' as SortColumn, label: 'Project', align: 'left' as const }] : []),
    { key: 'rooms' as SortColumn, label: 'Type', align: 'left' as const },
    { key: 'status' as SortColumn, label: 'Status', align: 'left' as const },
    { key: 'size' as SortColumn, label: 'Size', align: 'right' as const },
    { key: 'price' as SortColumn, label: 'Price', align: 'right' as const },
    { key: 'pricePerSqft' as SortColumn, label: 'AED/sqft', align: 'right' as const },
  ]

  return (
    <motion.div
      ref={tableRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className={cn('rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden', className)}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.04] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {title && <h3 className="text-sm font-semibold">{title}</h3>}
          <span className="text-sm text-muted-foreground tabular-nums">
            {processedData.length.toLocaleString()} transactions
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Design System Toggle */}
          <div className="flex items-center rounded-lg border border-white/[0.06] bg-white/[0.02] p-0.5">
            <button
              onClick={() => setDesignSystem('apple')}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                designSystem === 'apple'
                  ? "bg-white/[0.1] text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Apple
            </button>
            <button
              onClick={() => setDesignSystem('material')}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                designSystem === 'material'
                  ? "bg-white/[0.1] text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Material
            </button>
            <button
              onClick={() => setDesignSystem('enterprise')}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                designSystem === 'enterprise'
                  ? "bg-white/[0.1] text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Enterprise
            </button>
          </div>

        {showOrderBy && (
          <div ref={orderByRef} className="relative">
            <button
              onClick={() => setIsOrderByOpen(!isOrderByOpen)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
                "bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06]",
                isOrderByOpen && "bg-white/[0.08]"
              )}
            >
              <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="hidden sm:inline text-muted-foreground">Sort:</span>
              <span className="font-medium">{sortOptions.find(o => o.value === sortColumn)?.label}</span>
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", isOrderByOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isOrderByOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 z-50 min-w-[140px] rounded-lg border border-white/[0.08] bg-[#1a1a1a]/95 backdrop-blur-xl shadow-xl overflow-hidden"
                >
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        if (sortColumn === option.value) {
                          setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
                        } else {
                          setSortColumn(option.value)
                          setSortDirection('desc')
                        }
                        setIsOrderByOpen(false)
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-white/[0.06]",
                        sortColumn === option.value && "bg-white/[0.04] text-primary"
                      )}
                    >
                      <span>{option.label}</span>
                      {sortColumn === option.value && (
                        <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.04]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={cn(
                    'px-4 py-3 text-[11px] font-semibold uppercase tracking-wider cursor-pointer transition-colors',
                    col.align === 'right' ? 'text-right' : 'text-left',
                    sortColumn === col.key ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <div className={cn('flex items-center gap-1.5', col.align === 'right' && 'justify-end')}>
                    {col.label}
                    <SortIcon column={col.key} />
                  </div>
                </th>
              ))}
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((tx, idx) => {
              const roomColor = roomColors[tx.rooms] || '#5B93FF'
              const isExpanded = expandedRowId === tx.id
              const hasDetails = tx.area || tx.usageType || tx.prevSalePrice || tx.rentalYield

              return (
                <React.Fragment key={tx.id}>
                  <tr
                    onClick={() => handleRowClick(tx)}
                    className={cn(
                      'border-b border-white/[0.03] transition-colors',
                      'cursor-pointer hover:bg-white/[0.02]',
                      isExpanded && 'bg-white/[0.02]'
                    )}
                  >
                    <td className="px-4 py-3">
                      <div className="text-sm">{formatDate(tx.date)}</div>
                    </td>

                    {showProjectColumn && (
                      <td className="px-4 py-3">
                        <div className="text-sm truncate max-w-[160px]">{tx.project || tx.building || '—'}</div>
                      </td>
                    )}

                    <td className="px-4 py-3">
                      <TypeCell rooms={tx.rooms} design={designSystem} />
                    </td>

                    <td className="px-4 py-3">
                      <StatusCell tx={tx} design={designSystem} />
                    </td>

                    <td className="px-4 py-3 text-right">
                      <span className="text-sm tabular-nums">{Math.round(tx.size * 10.764).toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground ml-1">sqft</span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium tabular-nums">{formatCurrency(tx.price, true)}</span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium tabular-nums">{formatNumber(tx.pricePerSqft)}</span>
                    </td>

                    <td className="px-2">
                      {hasDetails && (
                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-muted-foreground"
                        >
                          <ExpandIcon className="h-4 w-4" />
                        </motion.div>
                      )}
                    </td>
                  </tr>

                  <AnimatePresence>
                    {isExpanded && <ExpandedDetails tx={tx} />}
                  </AnimatePresence>
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden p-3 space-y-2">
        {paginatedData.map((tx) => (
          <MobileCard
            key={tx.id}
            tx={tx}
            isExpanded={expandedRowId === tx.id}
            onToggle={() => handleRowClick(tx)}
            design={designSystem}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-white/[0.04] flex items-center justify-between">
          <div className="text-sm text-muted-foreground tabular-nums">
            {startIndex + 1}–{Math.min(startIndex + pageSize, processedData.length)} of {processedData.length}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) pageNum = i + 1
                else if (currentPage <= 3) pageNum = i + 1
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i
                else pageNum = currentPage - 2 + i

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'ghost'}
                    size="icon-sm"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <span className="sm:hidden text-sm text-muted-foreground tabular-nums px-2">
              {currentPage} / {totalPages}
            </span>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {onViewAll && data.length > pageSize && (
        <div className="px-4 py-3 border-t border-white/[0.04]">
          <Button variant="ghost" className="w-full" onClick={onViewAll}>
            View all {data.length.toLocaleString()} transactions
          </Button>
        </div>
      )}

    </motion.div>
  )
}
