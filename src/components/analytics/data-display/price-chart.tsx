"use client"

import * as React from 'react'
import { ResponsiveLine } from '@nivo/line'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { PricePoint, Timeframe } from '@/lib/analytics/types'
import { TimeframeSelector } from './timeframe-selector'
import { formatNumber, formatQuarter } from '@/lib/analytics/utils/format'

interface PriceChartProps {
  data: PricePoint[]
  title?: string
  className?: string
  height?: number
  showTimeframeSelector?: boolean
  defaultTimeframe?: Timeframe
}

// Filter data based on timeframe
function filterByTimeframe(data: PricePoint[], timeframe: Timeframe): PricePoint[] {
  if (timeframe === 'ALL') return data

  const now = new Date()
  const years = timeframe === '1Y' ? 1 : timeframe === '2Y' ? 2 : 3
  const cutoff = new Date(now.getFullYear() - years, now.getMonth(), 1)

  return data.filter((point) => {
    // Parse date like "2024-Q1" or "2024-01"
    const [yearStr] = point.date.split('-')
    const year = parseInt(yearStr, 10)
    const pointDate = new Date(year, 0, 1)
    return pointDate >= cutoff
  })
}

// Calculate trend from data
function calculateTrend(data: PricePoint[]): { value: number; direction: 'up' | 'down' | 'stable' } {
  if (data.length < 2) return { value: 0, direction: 'stable' }

  const first = data[0].avgPricePerSqft
  const last = data[data.length - 1].avgPricePerSqft
  const change = ((last - first) / first) * 100

  return {
    value: Math.abs(change),
    direction: change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'stable',
  }
}

export function PriceChart({
  data,
  title = 'Price Trend',
  className,
  height = 300,
  showTimeframeSelector = true,
  defaultTimeframe = '1Y',
}: PriceChartProps) {
  const [timeframe, setTimeframe] = React.useState<Timeframe>(defaultTimeframe)

  const filteredData = React.useMemo(
    () => filterByTimeframe(data, timeframe),
    [data, timeframe]
  )

  const trend = React.useMemo(() => calculateTrend(filteredData), [filteredData])

  // Transform data for Nivo
  const chartData = React.useMemo(() => {
    if (filteredData.length === 0) return []

    return [
      {
        id: 'price',
        data: filteredData.map((point) => ({
          x: point.date,
          y: point.avgPricePerSqft,
        })),
      },
    ]
  }, [filteredData])

  // Calculate min/max for better axis scaling
  const { minY, maxY } = React.useMemo(() => {
    if (filteredData.length === 0) return { minY: 0, maxY: 100 }
    const values = filteredData.map((d) => d.avgPricePerSqft)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const padding = (max - min) * 0.1
    return {
      minY: Math.max(0, Math.floor((min - padding) / 100) * 100),
      maxY: Math.ceil((max + padding) / 100) * 100,
    }
  }, [filteredData])

  if (data.length === 0) {
    return (
      <div className={cn('rounded-2xl border border-white/10 bg-white/5 p-6', className)}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <div
          className="flex items-center justify-center text-muted-foreground"
          style={{ height }}
        >
          No price data available
        </div>
      </div>
    )
  }

  return (
    <div className={cn('rounded-2xl border border-white/10 bg-white/5 p-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          {trend.direction !== 'stable' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium',
                trend.direction === 'up'
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'bg-red-500/10 text-red-500'
              )}
            >
              {trend.direction === 'up' ? (
                <TrendingUp className="h-3.5 w-3.5" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5" />
              )}
              {trend.value.toFixed(1)}%
            </motion.div>
          )}
        </div>
        {showTimeframeSelector && (
          <TimeframeSelector value={timeframe} onChange={setTimeframe} />
        )}
      </div>

      {/* Chart */}
      <div style={{ height }}>
        <ResponsiveLine
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: minY,
            max: maxY,
            stacked: false,
          }}
          curve="monotoneX"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 12,
            tickRotation: -45,
            format: (value) => {
              // Format "2024-Q1" to "Q1'24"
              if (typeof value === 'string' && value.includes('Q')) {
                const [year, quarter] = value.split('-')
                return `${quarter}'${year.slice(2)}`
              }
              return value
            },
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 12,
            tickValues: 5,
            format: (value) => formatNumber(value as number, true),
          }}
          enableGridX={false}
          gridYValues={5}
          colors={['#5B93FF']}
          lineWidth={2}
          enablePoints={true}
          pointSize={6}
          pointColor={{ from: 'color' }}
          pointBorderWidth={2}
          pointBorderColor="#121212"
          enableArea={true}
          areaOpacity={0.1}
          useMesh={true}
          crosshairType="cross"
          tooltip={({ point }) => (
            <div className="bg-background border border-white/10 rounded-lg px-3 py-2 shadow-xl">
              <div className="text-xs text-muted-foreground mb-1">
                {formatQuarter(point.data.x as string)}
              </div>
              <div className="text-sm font-semibold">
                AED {formatNumber(point.data.y as number)}/sqft
              </div>
            </div>
          )}
          theme={{
            background: 'transparent',
            text: {
              fill: '#888888',
              fontSize: 11,
            },
            axis: {
              ticks: {
                text: {
                  fill: '#666666',
                },
              },
            },
            grid: {
              line: {
                stroke: 'rgba(255,255,255,0.05)',
              },
            },
            crosshair: {
              line: {
                stroke: '#5B93FF',
                strokeWidth: 1,
                strokeOpacity: 0.5,
              },
            },
          }}
        />
      </div>

      {/* Summary stats */}
      <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-sm font-medium">
            AED {formatNumber(filteredData[filteredData.length - 1]?.avgPricePerSqft || 0)}
          </div>
          <div className="text-xs text-muted-foreground">Current</div>
        </div>
        <div>
          <div className="text-sm font-medium">
            AED {formatNumber(Math.max(...filteredData.map((d) => d.avgPricePerSqft)))}
          </div>
          <div className="text-xs text-muted-foreground">High</div>
        </div>
        <div>
          <div className="text-sm font-medium">
            AED {formatNumber(Math.min(...filteredData.map((d) => d.avgPricePerSqft)))}
          </div>
          <div className="text-xs text-muted-foreground">Low</div>
        </div>
      </div>
    </div>
  )
}
