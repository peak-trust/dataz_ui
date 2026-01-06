"use client"

import * as React from "react"
import { Database } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils/cn"
import { UnifiedSearch } from "./search/unified-search"
import type { DataMode } from "@/lib/analytics/types"

interface AnimatedTabProps {
  label: string
  value: DataMode
  active: DataMode
  onClick: (value: DataMode) => void
}

function AnimatedTab({ label, value, active, onClick }: AnimatedTabProps) {
  const isActive = active === value

  return (
    <button
      onClick={() => onClick(value)}
      className={cn(
        "relative z-10 flex-1 px-4 py-3 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-0 cursor-pointer",
        isActive ? "text-white" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="active-tab-bg-v2"
          className="absolute inset-0 z-[-1] rounded-full bg-primary shadow-lg shadow-primary/25"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      {label}
    </button>
  )
}

interface AnalyticsHeroV2Props {
  dataMode: DataMode
  onDataModeChange: (mode: DataMode) => void
}

export function AnalyticsHeroV2({
  dataMode,
  onDataModeChange,
}: AnalyticsHeroV2Props) {
  return (
    <div className="relative w-full overflow-hidden bg-background py-16 md:py-24 lg:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[500px] md:h-[800px] md:w-[800px] rounded-full bg-primary/10 blur-[120px] opacity-70 mix-blend-screen" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-accent-purple/10 blur-[100px] opacity-50" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 backdrop-blur-sm">
              <span className="flex items-center justify-center mr-2">
                <Database className="h-4 w-4" />
              </span>
              Market Intelligence
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
              Dataz Analytics
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
              The most comprehensive real-time database for Dubai's property market.
              Analyze trends across sales and rental sectors.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 md:mt-12 flex flex-col items-center gap-6"
          >
            {/* Unified Search */}
            <div className="w-full max-w-2xl">
              <UnifiedSearch
                dataMode={dataMode}
                onDataModeChange={onDataModeChange}
                placeholder="Search areas, projects, developers..."
                showShortcut={true}
              />
            </div>

            {/* Tab Switcher */}
            <div className="relative flex w-full max-w-[320px] items-center rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
              <AnimatedTab
                label="Sales"
                value="sales"
                active={dataMode}
                onClick={onDataModeChange}
              />
              <AnimatedTab
                label="Rental"
                value="rental"
                active={dataMode}
                onClick={onDataModeChange}
              />
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-6 mt-4 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>8 Areas</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>12 Projects</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>8 Developers</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
