"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SlidersHorizontal, X, RotateCcw, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { Button } from "@/components/ui/button"
import { FilterChip, FilterChipGroup, RangeChipGroup, ActiveFilterPill } from "@/components/ui/filter-chip"
import { useFilters, useFilterUIStore } from "@/lib/analytics/use-filters"
import {
  TIMEFRAME_OPTIONS,
  REGISTRATION_TYPE_OPTIONS,
  PROPERTY_TYPE_OPTIONS,
  BEDROOM_OPTIONS,
  USAGE_TYPE_OPTIONS,
  PRICE_RANGE_OPTIONS,
  SIZE_RANGE_OPTIONS,
  type DataMode,
  type Timeframe,
} from "@/lib/analytics/filters"
import type { EntityType } from "@/lib/analytics/types"

interface FilterBarProps {
  entityType: EntityType
  className?: string
}

export function FilterBar({ entityType, className }: FilterBarProps) {
  const {
    filters,
    activeFilterCount,
    hasFilters,
    setMode,
    setTimeframe,
    toggleRegType,
    togglePropertyType,
    toggleBedroom,
    toggleUsageType,
    togglePriceRange,
    toggleSizeRange,
    setFreeholdOnly,
    clearFilters,
  } = useFilters()

  const { isPanelOpen, togglePanel, closePanel } = useFilterUIStore()

  // Determine which filters to show based on entity type
  const showPropertyTypeFilter = entityType === 'area' || entityType === 'developer'
  const showUsageFilter = entityType === 'area'

  return (
    <div className={cn("space-y-3", className)}>
      {/* Main Filter Bar - Always Visible */}
      <div
        className={cn(
          "flex items-center gap-2 p-2 rounded-xl",
          "bg-white/[0.02] border border-white/[0.06]"
        )}
      >
        {/* Data Mode Toggle */}
        <div className="flex items-center bg-white/[0.04] rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setMode('sales')}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
              filters.mode === 'sales'
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Sales
          </button>
          <button
            type="button"
            onClick={() => setMode('rental')}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
              filters.mode === 'rental'
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Rental
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10 hidden sm:block" />

        {/* Timeframe Chips */}
        <div className="hidden sm:flex items-center gap-1">
          {TIMEFRAME_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTimeframe(option.value)}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                filters.timeframe === option.value
                  ? "bg-white/10 text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
              )}
            >
              {option.shortLabel}
            </button>
          ))}
        </div>

        {/* Mobile Timeframe Dropdown */}
        <select
          value={filters.timeframe}
          onChange={(e) => setTimeframe(e.target.value as Timeframe)}
          className={cn(
            "sm:hidden h-8 px-2 text-sm bg-white/[0.04] border border-white/10 rounded-md",
            "text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          )}
        >
          {TIMEFRAME_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.shortLabel}
            </option>
          ))}
        </select>

        {/* Spacer */}
        <div className="flex-1" />

        {/* More Filters Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={togglePanel}
          className={cn(
            "gap-1.5",
            hasFilters && "border-primary/40 text-primary"
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center w-5 h-5 text-xs font-bold bg-primary text-white rounded-full">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 transition-transform",
              isPanelOpen && "rotate-180"
            )}
          />
        </Button>
      </div>

      {/* Expanded Filter Panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className={cn(
                "p-4 rounded-xl space-y-4",
                "bg-white/[0.02] border border-white/[0.06]"
              )}
            >
              {/* Registration Type */}
              <FilterChipGroup
                label="Registration Type"
                options={REGISTRATION_TYPE_OPTIONS}
                selected={filters.regTypes}
                onToggle={toggleRegType}
              />

              {/* Property Type - Only for Area and Developer */}
              {showPropertyTypeFilter && (
                <FilterChipGroup
                  label="Property Type"
                  options={PROPERTY_TYPE_OPTIONS}
                  selected={filters.propertyTypes}
                  onToggle={togglePropertyType}
                />
              )}

              {/* Bedrooms */}
              <FilterChipGroup
                label="Bedrooms"
                options={BEDROOM_OPTIONS}
                selected={filters.bedrooms}
                onToggle={toggleBedroom}
              />

              {/* Usage Type - Only for Area */}
              {showUsageFilter && (
                <FilterChipGroup
                  label="Usage"
                  options={USAGE_TYPE_OPTIONS}
                  selected={filters.usageTypes}
                  onToggle={toggleUsageType}
                />
              )}

              {/* Price Range */}
              <RangeChipGroup
                label="Price Range (AED)"
                options={PRICE_RANGE_OPTIONS}
                selected={filters.priceRanges}
                onToggle={togglePriceRange}
              />

              {/* Size Range */}
              <RangeChipGroup
                label="Size (sqft)"
                options={SIZE_RANGE_OPTIONS}
                selected={filters.sizeRanges}
                onToggle={toggleSizeRange}
              />

              {/* Freehold Toggle */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Freehold Only
                </label>
                <button
                  type="button"
                  onClick={() => setFreeholdOnly(!filters.freeholdOnly)}
                  className={cn(
                    "relative w-10 h-5 rounded-full transition-colors",
                    filters.freeholdOnly
                      ? "bg-primary"
                      : "bg-white/10"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                      filters.freeholdOnly && "translate-x-5"
                    )}
                  />
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  disabled={!hasFilters}
                  className="text-muted-foreground"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                  Clear All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closePanel}
                  className="text-muted-foreground"
                >
                  Done
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters Pills (when panel is closed) */}
      <AnimatePresence>
        {!isPanelOpen && hasFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap items-center gap-2"
          >
            {filters.regTypes.map((value) => {
              const option = REGISTRATION_TYPE_OPTIONS.find((o) => o.value === value)
              return option ? (
                <ActiveFilterPill
                  key={`reg-${value}`}
                  label={option.label}
                  onRemove={() => toggleRegType(value)}
                />
              ) : null
            })}

            {filters.propertyTypes.map((value) => {
              const option = PROPERTY_TYPE_OPTIONS.find((o) => o.value === value)
              return option ? (
                <ActiveFilterPill
                  key={`prop-${value}`}
                  label={option.label}
                  onRemove={() => togglePropertyType(value)}
                />
              ) : null
            })}

            {filters.bedrooms.map((value) => {
              const option = BEDROOM_OPTIONS.find((o) => o.value === value)
              return option ? (
                <ActiveFilterPill
                  key={`bed-${value}`}
                  label={option.label}
                  onRemove={() => toggleBedroom(value)}
                />
              ) : null
            })}

            {filters.usageTypes.map((value) => {
              const option = USAGE_TYPE_OPTIONS.find((o) => o.value === value)
              return option ? (
                <ActiveFilterPill
                  key={`use-${value}`}
                  label={option.label}
                  onRemove={() => toggleUsageType(value)}
                />
              ) : null
            })}

            {filters.priceRanges.map((value) => {
              const option = PRICE_RANGE_OPTIONS.find((o) => o.value === value)
              return option ? (
                <ActiveFilterPill
                  key={`price-${value}`}
                  label={option.label}
                  onRemove={() => togglePriceRange(value)}
                />
              ) : null
            })}

            {filters.sizeRanges.map((value) => {
              const option = SIZE_RANGE_OPTIONS.find((o) => o.value === value)
              return option ? (
                <ActiveFilterPill
                  key={`size-${value}`}
                  label={option.label}
                  onRemove={() => toggleSizeRange(value)}
                />
              ) : null
            })}

            {filters.freeholdOnly && (
              <ActiveFilterPill
                label="Freehold"
                onRemove={() => setFreeholdOnly(false)}
              />
            )}

            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear all
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
