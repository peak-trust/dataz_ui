"use client"

import * as React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, Building2, Home, DollarSign, BarChart3, Users, Calendar } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatCurrency, formatNumber, formatPercentChange } from '@/lib/analytics/utils/format'

interface StatItem {
  label: string
  value: string | number
  subValue?: string
  change?: number | null
  icon?: LucideIcon
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
}

interface StatsGridProps {
  stats: StatItem[]
  title?: string
  className?: string
  columns?: 2 | 3 | 4
  animate?: boolean
}

const variantStyles = {
  default: 'bg-white/5',
  primary: 'bg-primary/10 border-primary/20',
  success: 'bg-emerald-500/10 border-emerald-500/20',
  warning: 'bg-amber-500/10 border-amber-500/20',
  danger: 'bg-red-500/10 border-red-500/20',
}

const variantIconStyles = {
  default: 'bg-white/10 text-muted-foreground',
  primary: 'bg-primary/20 text-primary',
  success: 'bg-emerald-500/20 text-emerald-500',
  warning: 'bg-amber-500/20 text-amber-500',
  danger: 'bg-red-500/20 text-red-500',
}

export function StatsGrid({
  stats,
  title,
  className,
  columns = 4,
  animate = true,
}: StatsGridProps) {
  const columnClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const renderChange = (change: number | null | undefined) => {
    if (change === null || change === undefined) return null

    const isPositive = change > 0
    const isNegative = change < 0
    const Icon = isPositive ? TrendingUp : isNegative ? TrendingDown : Minus

    return (
      <div
        className={cn(
          'flex items-center gap-1 text-xs font-medium',
          isPositive && 'text-emerald-500',
          isNegative && 'text-red-500',
          !isPositive && !isNegative && 'text-muted-foreground'
        )}
      >
        <Icon className="h-3 w-3" />
        {formatPercentChange(change)}
      </div>
    )
  }

  const formatValue = (value: string | number): string => {
    if (typeof value === 'string') return value
    if (value >= 1_000_000_000) {
      return `AED ${(value / 1_000_000_000).toFixed(1)}B`
    }
    if (value >= 1_000_000) {
      return `AED ${(value / 1_000_000).toFixed(1)}M`
    }
    return value.toLocaleString()
  }

  const content = (
    <div className={cn('grid gap-4', columnClasses[columns])}>
      {stats.map((stat, index) => {
        const variant = stat.variant || 'default'
        const Icon = stat.icon

        const StatCard = (
          <div
            key={index}
            className={cn(
              'p-4 rounded-xl border border-white/10 transition-colors hover:border-white/20',
              variantStyles[variant]
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              {Icon && (
                <div className={cn('p-1.5 rounded-lg', variantIconStyles[variant])}>
                  <Icon className="h-4 w-4" />
                </div>
              )}
            </div>
            <div className="text-2xl font-bold tracking-tight">
              {formatValue(stat.value)}
            </div>
            <div className="flex items-center justify-between mt-1">
              {stat.subValue && (
                <div className="text-xs text-muted-foreground">{stat.subValue}</div>
              )}
              {renderChange(stat.change)}
            </div>
          </div>
        )

        if (animate) {
          return (
            <motion.div key={index} variants={itemVariants}>
              {StatCard}
            </motion.div>
          )
        }

        return StatCard
      })}
    </div>
  )

  if (title) {
    return (
      <div className={cn('rounded-2xl border border-white/10 bg-white/5 p-6', className)}>
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        {animate ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {content}
          </motion.div>
        ) : (
          content
        )}
      </div>
    )
  }

  if (animate) {
    return (
      <motion.div
        className={className}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {content}
      </motion.div>
    )
  }

  return <div className={className}>{content}</div>
}

// Pre-built stat configurations for common use cases
export function createAreaStats(stats: {
  avgPricePerSqft: number
  transactionCount: number
  totalValue: number
  yoyPriceChange: number | null
  avgSize?: number
}): StatItem[] {
  return [
    {
      label: 'Avg. Price/sqft',
      value: `AED ${formatNumber(stats.avgPricePerSqft)}`,
      change: stats.yoyPriceChange,
      icon: DollarSign,
      variant: 'primary',
    },
    {
      label: 'Transactions',
      value: stats.transactionCount,
      icon: BarChart3,
    },
    {
      label: 'Total Volume',
      value: stats.totalValue,
      icon: Building2,
    },
    ...(stats.avgSize
      ? [
          {
            label: 'Avg. Size',
            value: `${formatNumber(stats.avgSize)} sqm`,
            subValue: `${formatNumber(Math.round(stats.avgSize * 10.764))} sqft`,
            icon: Home,
          },
        ]
      : []),
  ]
}

export function createDeveloperStats(stats: {
  totalProjects: number
  totalSales: number
  totalVolume: number
  marketShare: number
  tier: string
}): StatItem[] {
  return [
    {
      label: 'Total Projects',
      value: stats.totalProjects,
      icon: Building2,
      variant: 'primary',
    },
    {
      label: 'Total Sales',
      value: stats.totalSales,
      icon: BarChart3,
    },
    {
      label: 'Total Volume',
      value: stats.totalVolume,
      icon: DollarSign,
    },
    {
      label: 'Market Share',
      value: `${stats.marketShare.toFixed(1)}%`,
      subValue: stats.tier.replace('_', ' '),
      icon: Users,
    },
  ]
}

export function createProjectStats(stats: {
  avgPricePerSqft: number
  transactionCount: number
  totalValue: number
  yoyPriceChange: number | null
  completionYear?: number
}): StatItem[] {
  return [
    {
      label: 'Avg. Price/sqft',
      value: `AED ${formatNumber(stats.avgPricePerSqft)}`,
      change: stats.yoyPriceChange,
      icon: DollarSign,
      variant: 'primary',
    },
    {
      label: 'Transactions',
      value: stats.transactionCount,
      icon: BarChart3,
    },
    {
      label: 'Total Volume',
      value: stats.totalValue,
      icon: Building2,
    },
    ...(stats.completionYear
      ? [
          {
            label: 'Completion',
            value: stats.completionYear.toString(),
            icon: Calendar,
          },
        ]
      : []),
  ]
}
