"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { MapPin, Building2, Calendar, Ruler, BedDouble, Layers, User } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ResaleBadge, PriceChangeBadge } from "@/components/ui/resale-badge"
import { SalesTimeline } from "@/components/analytics/sales-timeline"
import type { Transaction, SaleHistoryEntry, TransactionHistory } from "@/lib/analytics/types"

interface TransactionDetailSheetProps {
  /** The transaction to display */
  transaction: Transaction | null
  /** Sale history data (if available) */
  history?: TransactionHistory | null
  /** Whether the sheet is open */
  open: boolean
  /** Callback when open state changes */
  onOpenChange: (open: boolean) => void
  /** Additional class names */
  className?: string
}

/**
 * Bottom sheet showing full transaction details including:
 * - Price header with resale info
 * - Property details grid
 * - Location breadcrumb
 * - Sales history timeline (if available)
 * - Rental yield (if available)
 */
export function TransactionDetailSheet({
  transaction,
  history,
  open,
  onOpenChange,
  className,
}: TransactionDetailSheetProps) {
  if (!transaction) return null

  const hasResaleHistory = history && history.salesHistory.length > 1
  const hasRentalYield = transaction.rentalYield != null && transaction.rentalYield > 0

  // Calculate total appreciation from first sale
  const totalAppreciation = history?.priceAppreciation?.fromFirstSale

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className={cn(
          "h-[85vh] max-h-[85vh] rounded-t-2xl",
          "bg-background/95 backdrop-blur-xl border-t border-white/10",
          className
        )}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-2 pb-0">
          <div className="w-12 h-1.5 rounded-full bg-white/20" />
        </div>

        <SheetHeader className="px-4 pt-2 pb-0">
          <SheetTitle className="sr-only">Transaction Details</SheetTitle>
          <SheetDescription className="sr-only">
            Details for transaction on {transaction.date}
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 pb-8">
          {/* Price Header */}
          <div className="text-center py-4 border-b border-white/10">
            {/* Main price */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-foreground"
            >
              AED {formatPrice(transaction.price)}
            </motion.div>

            {/* Price per sqft */}
            <div className="text-sm text-muted-foreground mt-1">
              {formatNumber(transaction.pricePerSqft)} /sqft
            </div>

            {/* Date */}
            <div className="text-sm text-muted-foreground mt-1">
              {formatDate(transaction.date)}
            </div>

            {/* Badges row */}
            <div className="flex items-center justify-center gap-2 mt-3">
              {/* Total appreciation from first sale */}
              {totalAppreciation != null && (
                <PriceChangeBadge value={totalAppreciation} size="md" />
              )}

              {/* Resale indicator */}
              {transaction.isResale && transaction.resaleCount != null && transaction.resaleCount > 0 && (
                <span className="inline-flex items-center h-6 px-2 text-xs font-medium rounded bg-violet-500/20 text-violet-400 border border-violet-500/30">
                  Resale: {transaction.resaleCount} {transaction.resaleCount === 1 ? "Time" : "Times"}
                </span>
              )}
            </div>
          </div>

          {/* Property Details Grid */}
          <div className="py-4 border-b border-white/10">
            <div className="grid grid-cols-2 gap-4">
              <DetailRow
                icon={Ruler}
                label="Property size"
                value={`${formatNumber(transaction.size * 10.764)} sqft | ${formatNumber(transaction.size)} sqm`}
              />
              <DetailRow
                icon={BedDouble}
                label="Category"
                value={`${transaction.rooms} ${transaction.propertyType?.toLowerCase() || ""}`}
              />
              {transaction.floor != null && (
                <DetailRow
                  icon={Layers}
                  label="Floor"
                  value={transaction.floor.toString()}
                />
              )}
              <DetailRow
                icon={Calendar}
                label="Status"
                value={transaction.regType || "Ready"}
              />
              {transaction.sellerType && (
                <DetailRow
                  icon={User}
                  label="Sold by"
                  value={transaction.sellerType}
                />
              )}
              {hasRentalYield && (
                <DetailRow
                  icon={Building2}
                  label="Rental yield"
                  value={`${transaction.rentalYield?.toFixed(2)}%`}
                  highlight
                />
              )}
            </div>
          </div>

          {/* Location */}
          {(transaction.building || transaction.project || transaction.area) && (
            <div className="py-4 border-b border-white/10">
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  {[transaction.building, transaction.project, transaction.area]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            </div>
          )}

          {/* Sales History Section */}
          {hasResaleHistory && (
            <div className="py-4">
              <Tabs defaultValue="sales" className="w-full">
                <TabsList className="w-full bg-white/5">
                  <TabsTrigger value="sales" className="flex-1">
                    Sales history
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="sales" className="mt-4">
                  <SalesTimeline
                    history={history.salesHistory}
                    currentPrice={transaction.price}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* No history message */}
          {!hasResaleHistory && transaction.isFirstSale && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              First sale from developer - no prior history
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

// ============ SUB-COMPONENTS ============

interface DetailRowProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  highlight?: boolean
}

function DetailRow({ icon: Icon, label, value, highlight }: DetailRowProps) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className={cn("text-sm", highlight ? "text-primary font-medium" : "text-foreground")}>
          {value}
        </div>
      </div>
    </div>
  )
}

// ============ HELPER FUNCTIONS ============

function formatPrice(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(value >= 10000000 ? 1 : 2)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`
  }
  return value.toLocaleString()
}

function formatNumber(value: number): string {
  return value.toLocaleString(undefined, { maximumFractionDigits: 0 })
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}
