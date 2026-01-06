"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { TrendingUp, Building2, MapPin, HardHat } from "lucide-react"
import { AnalyticsHeroV2 } from "@/components/analytics/analytics-hero-v2"
import type { DataMode } from "@/lib/analytics/types"
import { getPopularEntities, getDashboardStats } from "@/lib/analytics/mock-data"
import { formatNumber, formatCurrency } from "@/lib/analytics/utils/format"
import Link from "next/link"

export default function AnalyticsPage() {
  const [dataMode, setDataMode] = React.useState<DataMode>("sales")

  // Get popular entities and stats
  const popular = React.useMemo(() => getPopularEntities(4), [])
  const stats = React.useMemo(() => getDashboardStats(), [])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero with Unified Search */}
      <AnalyticsHeroV2
        dataMode={dataMode}
        onDataModeChange={setDataMode}
      />

      {/* Dashboard Stats */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="text-sm text-muted-foreground">Total Volume</span>
            </div>
            <div className="text-2xl font-bold">
              {formatCurrency(stats.totalValue, true)}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="text-sm text-muted-foreground">Areas</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalAreas}</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-sm text-muted-foreground">Projects</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <HardHat className="h-5 w-5" />
              </div>
              <span className="text-sm text-muted-foreground">Developers</span>
            </div>
            <div className="text-2xl font-bold">{stats.totalDevelopers}</div>
          </div>
        </motion.div>
      </div>

      {/* Popular Areas */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Popular Areas</h2>
            <span className="text-sm text-muted-foreground">
              Click to explore
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popular.areas.map((area) => (
              <Link
                key={area.id}
                href={`/analytics/area/${area.id}?mode=${dataMode}`}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500/20 transition-colors">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{area.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatNumber(area.stats.transactionCount)} transactions
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold">
                      AED {formatNumber(area.stats.avgPricePerSqft)}
                    </div>
                    <div className="text-xs text-muted-foreground">per sqft</div>
                  </div>
                  {area.stats.yoyPriceChange !== null && (
                    <div
                      className={`text-sm font-medium ${
                        area.stats.yoyPriceChange > 0
                          ? "text-emerald-500"
                          : "text-red-500"
                      }`}
                    >
                      {area.stats.yoyPriceChange > 0 ? "+" : ""}
                      {area.stats.yoyPriceChange.toFixed(1)}% YoY
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Popular Projects */}
      <div className="container mx-auto px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Popular Projects</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popular.projects.map((project) => (
              <Link
                key={project.id}
                href={`/analytics/project/${project.id}?mode=${dataMode}`}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 group-hover:bg-purple-500/20 transition-colors">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{project.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {project.areaName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold">
                      AED {formatNumber(project.stats.avgPricePerSqft)}
                    </div>
                    <div className="text-xs text-muted-foreground">per sqft</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {formatNumber(project.stats.transactionCount, true)}
                    </div>
                    <div className="text-xs text-muted-foreground">sales</div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      project.status === "Completed"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : project.status === "Under Construction"
                        ? "bg-amber-500/10 text-amber-500"
                        : "bg-blue-500/10 text-blue-500"
                    }`}
                  >
                    {project.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {project.developerName}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Developers */}
      <div className="container mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Top Developers</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popular.developers.map((developer) => (
              <Link
                key={developer.id}
                href={`/analytics/developer/${developer.id}?mode=${dataMode}`}
                className="group rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 group-hover:bg-amber-500/20 transition-colors">
                    <HardHat className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{developer.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {developer.tier.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Projects</span>
                    <span className="font-medium">
                      {developer.portfolio.totalProjects}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Sales</span>
                    <span className="font-medium">
                      {formatNumber(developer.stats.totalSales, true)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Market Share</span>
                    <span className="font-medium">
                      {developer.stats.marketSharePct.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
