"use client"

import * as React from "react"
import { Suspense } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Star,
  MapPin,
  Building2,
  HardHat,
  Building,
  TrendingUp,
  PieChart,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils/cn"
import { Button } from "@/components/ui/button"
import { entityColors } from "@/components/ui/color-dot"
import type {
  EntityType,
  AreaDetail,
  ProjectDetail,
  DeveloperDetail,
  BuildingDetail,
} from "@/lib/analytics/types"
import { getEntityById } from "@/lib/analytics/mock-data"
import {
  KPIBar,
  TransactionTable,
  PriceChart,
  BedroomDistribution,
  ExpandableSection,
  TrustFooter,
  UnitMix,
} from "@/components/analytics/data-display"
import { FilterBar } from "@/components/analytics/filter-bar"
import { useFilters } from "@/lib/analytics/use-filters"
import { filterTransactions } from "@/lib/analytics/filter-transactions"
import type { RoomDistribution } from "@/lib/analytics/types"

// Type guards
function isAreaDetail(
  entity: AreaDetail | ProjectDetail | DeveloperDetail | BuildingDetail
): entity is AreaDetail {
  return "amenities" in entity
}

function isProjectDetail(
  entity: AreaDetail | ProjectDetail | DeveloperDetail | BuildingDetail
): entity is ProjectDetail {
  return "status" in entity && "areaId" in entity
}

function isDeveloperDetail(
  entity: AreaDetail | ProjectDetail | DeveloperDetail | BuildingDetail
): entity is DeveloperDetail {
  return "portfolio" in entity
}

function isBuildingDetail(
  entity: AreaDetail | ProjectDetail | DeveloperDetail | BuildingDetail
): entity is BuildingDetail {
  return "projectId" in entity && !("status" in entity)
}

// Convert roomDistribution to UnitMix format
function convertToUnitMix(roomDistribution: RoomDistribution[]) {
  return roomDistribution.map((room) => {
    // Estimate min/max from average (±15% for size, ±20% for price)
    const sizeInSqft = Math.round(room.avgSize * 10.764)
    const sizeMin = Math.round(sizeInSqft * 0.85)
    const sizeMax = Math.round(sizeInSqft * 1.15)
    const priceMin = Math.round(room.avgPrice * 0.8)
    const priceMax = Math.round(room.avgPrice * 1.2)

    return {
      type: room.rooms,
      units: room.count,
      sizeMin,
      sizeMax,
      priceMin,
      priceMax,
      avgPricePerSqft: Math.round(room.avgPricePerSqft),
    }
  })
}

// Entity type icons
const entityIcons: Record<EntityType, LucideIcon> = {
  area: MapPin,
  project: Building2,
  developer: HardHat,
  building: Building,
}

// Entity type labels
const entityLabels: Record<EntityType, string> = {
  area: "Area",
  project: "Project",
  developer: "Developer",
  building: "Building",
}

function EntityDetailContent() {
  const params = useParams()
  const router = useRouter()
  const { filters } = useFilters()

  const type = params.type as EntityType
  const id = params.id as string
  const mode = filters.mode

  const [isInWatchlist, setIsInWatchlist] = React.useState(false)

  // Get entity data
  const entity = React.useMemo(() => {
    return getEntityById(type, id)
  }, [type, id])

  // Filter transactions based on current filters
  const filteredTransactions = React.useMemo(() => {
    if (!entity || !("recentTransactions" in entity)) return []
    return filterTransactions(entity.recentTransactions, filters)
  }, [entity, filters])

  // Check if valid entity type
  const isValidType = ["area", "project", "developer", "building"].includes(type)

  // Build KPI items based on entity type
  const getKPIItems = () => {
    if (!entity) return []

    if (isAreaDetail(entity)) {
      return [
        {
          label: "Avg Price/sqft",
          value: entity.stats.avgPricePerSqft,
          format: "currency" as const,
          change: entity.stats.yoyPriceChange,
          sparklineData: entity.priceHistory.slice(-8).map((p) => p.avgPricePerSqft),
        },
        {
          label: "Transactions",
          value: entity.stats.transactionCount,
          format: "number" as const,
        },
        {
          label: "Total Volume",
          value: entity.stats.totalValue,
          format: "currency-compact" as const,
        },
      ]
    }

    if (isDeveloperDetail(entity)) {
      return [
        {
          label: "Total Sales",
          value: entity.stats.totalSales,
          format: "number" as const,
        },
        {
          label: "Total Volume",
          value: entity.stats.totalVolume,
          format: "currency-compact" as const,
        },
        {
          label: "Market Share",
          value: entity.stats.marketSharePct,
          format: "percent" as const,
        },
      ]
    }

    if (isProjectDetail(entity)) {
      // Build status subtitle
      let statusSubtitle = ""
      if (entity.status === "Under Construction" && entity.completionPct !== undefined) {
        statusSubtitle = `${entity.completionPct}% complete`
      } else if (entity.status === "Not Started") {
        statusSubtitle = "Coming soon"
      }

      return [
        {
          label: "Avg Price/sqft",
          value: entity.stats.avgPricePerSqft,
          format: "currency" as const,
          change: entity.stats.yoyPriceChange,
          sparklineData: entity.priceHistory.slice(-8).map((p) => p.avgPricePerSqft),
        },
        {
          label: "Transactions",
          value: entity.stats.transactionCount,
          format: "number" as const,
          change: entity.stats.yoyTransactionChange,
        },
        {
          label: "Total Volume",
          value: entity.stats.totalValue,
          format: "currency-compact" as const,
          change: entity.stats.yoyVolumeChange,
        },
        {
          label: "Status",
          value:
            entity.status === "Under Construction"
              ? "Off Plan"
              : entity.status === "Completed"
              ? "Ready"
              : entity.status,
          format: "raw" as const,
          subtitle: statusSubtitle,
          valueColor:
            entity.status === "Completed"
              ? ("positive" as const)
              : entity.status === "Under Construction"
              ? ("warning" as const)
              : ("default" as const),
        },
        ...(entity.avgRentalYield
          ? [
              {
                label: "Rental Yield",
                value: `${entity.avgRentalYield.toFixed(1)}%`,
                format: "raw" as const,
                change: entity.yoyYieldChange,
                subtitle: "gross annual",
              },
            ]
          : []),
        ...(entity.serviceCharges
          ? [
              {
                label: "Service Charge",
                value: `AED ${entity.serviceCharges.avgPerSqft}`,
                format: "raw" as const,
                subtitle: "per sqft/yr",
              },
            ]
          : []),
      ]
    }

    if (isBuildingDetail(entity)) {
      return [
        {
          label: "Avg Price/sqft",
          value: entity.stats.avgPricePerSqft,
          format: "currency" as const,
          change: entity.stats.yoyPriceChange,
          sparklineData: entity.priceHistory.slice(-8).map((p) => p.avgPricePerSqft),
        },
        {
          label: "Transactions",
          value: entity.stats.transactionCount,
          format: "number" as const,
        },
        {
          label: "Total Volume",
          value: entity.stats.totalValue,
          format: "currency-compact" as const,
        },
      ]
    }

    return []
  }

  if (!isValidType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid Entity Type</h1>
          <p className="text-muted-foreground mb-4">
            The entity type &quot;{type}&quot; is not recognized.
          </p>
          <Button onClick={() => router.push("/analytics")}>Back to Analytics</Button>
        </div>
      </div>
    )
  }

  if (!entity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Entity Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The {type} with ID &quot;{id}&quot; could not be found.
          </p>
          <Button onClick={() => router.push("/analytics")}>Back to Analytics</Button>
        </div>
      </div>
    )
  }

  const Icon = entityIcons[type]
  const entityLabel = entityLabels[type]
  const entityName = "name" in entity ? entity.name : id
  const entityColor = entityColors[type] || '#5B93FF'

  // Staggered animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-40 bg-gradient-to-r from-background/95 via-background/90 to-background/95 backdrop-blur-xl border-b border-white/10"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-3 min-w-0">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => router.back()}
                className="shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2 min-w-0">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="p-1.5 rounded-lg shrink-0"
                  style={{
                    backgroundColor: `${entityColor}20`,
                    color: entityColor,
                    boxShadow: `0 0 12px ${entityColor}30`,
                  }}
                >
                  <Icon className="h-4 w-4" />
                </motion.div>
                <div className="min-w-0">
                  <h1 className="text-base font-semibold truncate">{entityName}</h1>
                  <p className="text-xs text-muted-foreground">{entityLabel}</p>
                </div>
              </div>
            </div>

            {/* Right: Watchlist */}
            <div className="flex items-center gap-2 shrink-0">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setIsInWatchlist(!isInWatchlist)}
                  className={cn(
                    "transition-colors",
                    isInWatchlist && "text-amber-500 hover:text-amber-400"
                  )}
                >
                  <motion.div
                    animate={isInWatchlist ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Star className={cn("h-4 w-4", isInWatchlist && "fill-current")} />
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-4 space-y-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {/* Filter Bar */}
          <motion.div variants={itemVariants}>
            <FilterBar entityType={type} />
          </motion.div>

          {/* KPI Bar */}
          <motion.div variants={itemVariants}>
            <KPIBar items={getKPIItems()} />
          </motion.div>

          {/* Transaction Table */}
          {filteredTransactions.length > 0 && (
            <motion.div variants={itemVariants}>
              <TransactionTable
                data={filteredTransactions}
                pageSize={25}
                showProjectColumn={type === 'area' || type === 'developer'}
              />
            </motion.div>
          )}

          {/* No Results Message */}
          {"recentTransactions" in entity && entity.recentTransactions.length > 0 && filteredTransactions.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center py-8 px-4 rounded-xl border border-white/10 bg-white/[0.02]"
            >
              <p className="text-muted-foreground">No transactions match your current filters.</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Try adjusting your filter criteria.</p>
            </motion.div>
          )}

          {/* Unit Mix (for projects and buildings) */}
          {(isProjectDetail(entity) || isBuildingDetail(entity)) &&
            "roomDistribution" in entity &&
            entity.roomDistribution.length > 0 && (
              <motion.div variants={itemVariants}>
                <UnitMix
                  data={convertToUnitMix(entity.roomDistribution)}
                  title={`Unit Mix - ${entityName}`}
                />
              </motion.div>
            )}

          {/* Expandable Analytics Sections */}
          <motion.div variants={itemVariants} className="space-y-2">
            {"priceHistory" in entity && entity.priceHistory.length > 0 && (
              <ExpandableSection
                title="Price Trend"
                icon={TrendingUp}
                previewSparkline={entity.priceHistory.slice(-8).map(p => p.avgPricePerSqft)}
              >
                <PriceChart
                  data={entity.priceHistory}
                  height={240}
                  showTimeframeSelector={true}
                  defaultTimeframe="1Y"
                />
              </ExpandableSection>
            )}

            {"roomDistribution" in entity && entity.roomDistribution.length > 0 && (
              <ExpandableSection
                title="Unit Distribution"
                icon={PieChart}
                previewProgress={{
                  value: Math.max(...entity.roomDistribution.map(r => r.count)),
                  max: entity.roomDistribution.reduce((sum, r) => sum + r.count, 0),
                  color: '#10B981',
                }}
              >
                <BedroomDistribution
                  data={entity.roomDistribution}
                  variant="horizontal"
                />
              </ExpandableSection>
            )}
          </motion.div>

          {/* Related Entities */}
          <motion.div variants={itemVariants} className="space-y-3">
            {/* Developer Link (for projects/buildings) */}
            {(isProjectDetail(entity) || isBuildingDetail(entity)) &&
              "developerName" in entity && (
                <motion.button
                  whileHover={{ y: -2, boxShadow: "0 4px 20px rgba(245, 158, 11, 0.15)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if ("developerId" in entity) {
                      router.push(`/analytics/developer/${entity.developerId}?mode=${mode}`)
                    }
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-amber-500/30 transition-all"
                >
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      color: '#F59E0B',
                      boxShadow: '0 0 8px rgba(245, 158, 11, 0.2)',
                    }}
                  >
                    <HardHat className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-sm font-medium truncate">{entity.developerName}</div>
                    <div className="text-xs text-muted-foreground">Developer</div>
                  </div>
                </motion.button>
              )}

            {/* Area Link (for projects/buildings) */}
            {(isProjectDetail(entity) || isBuildingDetail(entity)) && (
              <motion.button
                whileHover={{ y: -2, boxShadow: "0 4px 20px rgba(59, 130, 246, 0.15)" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/analytics/area/${entity.areaId}?mode=${mode}`)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-blue-500/30 transition-all"
              >
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    color: '#3B82F6',
                    boxShadow: '0 0 8px rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-medium truncate">{entity.areaName}</div>
                  <div className="text-xs text-muted-foreground">Location</div>
                </div>
              </motion.button>
            )}

            {/* Top Projects (for areas) */}
            {isAreaDetail(entity) && entity.topProjects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-white/5 bg-gradient-to-r from-purple-500/5 to-transparent">
                  <h3 className="text-sm font-medium">Top Projects</h3>
                </div>
                <div className="divide-y divide-white/5">
                  {entity.topProjects.slice(0, 5).map((project, idx) => (
                    <motion.button
                      key={project.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      whileHover={{ backgroundColor: 'rgba(168, 85, 247, 0.05)' }}
                      onClick={() =>
                        router.push(`/analytics/project/${project.id}?mode=${mode}`)
                      }
                      className="w-full flex items-center justify-between p-3 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
                          <Building2 className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm truncate">{project.name}</span>
                      </div>
                      <div className="text-right shrink-0 text-sm text-muted-foreground">
                        {project.transactionCount} sales
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Top Projects (for developers) */}
            {isDeveloperDetail(entity) && entity.topProjects.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-white/5 bg-gradient-to-r from-purple-500/5 to-transparent">
                  <h3 className="text-sm font-medium">
                    Projects ({entity.topProjects.length})
                  </h3>
                </div>
                <div className="divide-y divide-white/5 max-h-64 overflow-y-auto">
                  {entity.topProjects.map((project, idx) => (
                    <motion.button
                      key={project.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: Math.min(idx * 0.03, 0.3) }}
                      whileHover={{ backgroundColor: 'rgba(168, 85, 247, 0.05)' }}
                      onClick={() =>
                        router.push(`/analytics/project/${project.id}?mode=${mode}`)
                      }
                      className="w-full flex items-center justify-between p-3 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500">
                          <Building2 className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm truncate">{project.name}</span>
                      </div>
                      <div className="text-right shrink-0 text-sm text-muted-foreground">
                        {project.transactionCount} sales
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Top Developers (for areas) */}
            {isAreaDetail(entity) && entity.topDevelopers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-white/5 bg-gradient-to-r from-amber-500/5 to-transparent">
                  <h3 className="text-sm font-medium">Active Developers</h3>
                </div>
                <div className="divide-y divide-white/5">
                  {entity.topDevelopers.map((developer, idx) => (
                    <motion.button
                      key={developer.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.05 }}
                      whileHover={{ backgroundColor: 'rgba(245, 158, 11, 0.05)' }}
                      onClick={() =>
                        router.push(`/analytics/developer/${developer.id}?mode=${mode}`)
                      }
                      className="w-full flex items-center justify-between p-3 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                          <HardHat className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-sm truncate">{developer.name}</span>
                      </div>
                      <div className="text-right shrink-0 text-xs text-muted-foreground">
                        {developer.tier.replace("_", " ")}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Trust Footer */}
          <motion.div variants={itemVariants}>
            <TrustFooter
              source="Dubai Land Department"
              lastUpdated={new Date()}
              variant="inline"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

// Main export with Suspense boundary for useSearchParams
export default function EntityDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <EntityDetailContent />
    </Suspense>
  )
}
