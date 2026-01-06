"use client"

import * as React from 'react'
import { ResponsiveBar } from '@nivo/bar'
import { cn } from '@/lib/utils/cn'
import type { RoomDistribution } from '@/lib/analytics/types'
import { formatNumber, formatCurrency } from '@/lib/analytics/utils/format'

interface BedroomDistributionProps {
  data: RoomDistribution[]
  title?: string
  className?: string
  height?: number
  variant?: 'bar' | 'horizontal'
}

// Room colors
const roomColors: Record<string, string> = {
  'Studio': '#8B5CF6',
  '1BR': '#3B82F6',
  '2BR': '#10B981',
  '3BR': '#F59E0B',
  '4BR': '#EF4444',
  '5BR+': '#EC4899',
  'Penthouse': '#6366F1',
}

export function BedroomDistribution({
  data,
  title = 'Bedroom Distribution',
  className,
  height = 200,
  variant = 'horizontal',
}: BedroomDistributionProps) {
  if (!data || data.length === 0) {
    return (
      <div className={cn('rounded-2xl border border-white/10 bg-white/5 p-6', className)}>
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div
          className="flex items-center justify-center text-muted-foreground"
          style={{ height }}
        >
          No bedroom data available
        </div>
      </div>
    )
  }

  // Transform data for Nivo
  const chartData = data.map((room) => ({
    room: room.rooms,
    count: room.count,
    percentage: room.percentage,
    avgPrice: room.avgPrice,
    avgSize: room.avgSize,
    color: roomColors[room.rooms] || '#5B93FF',
  }))

  if (variant === 'horizontal') {
    return (
      <div className={cn('rounded-2xl border border-white/10 bg-white/5 p-6', className)}>
        <h3 className="text-lg font-semibold mb-4">{title}</h3>

        <div className="space-y-3">
          {data.map((room) => (
            <div key={room.rooms} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: roomColors[room.rooms] || '#5B93FF' }}
                  />
                  <span className="text-sm font-medium">{room.rooms}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    {room.count.toLocaleString()} units
                  </span>
                  <span className="font-medium w-12 text-right">{room.percentage}%</span>
                </div>
              </div>
              <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${room.percentage}%`,
                    backgroundColor: roomColors[room.rooms] || '#5B93FF',
                  }}
                />
              </div>
              {/* Hover details */}
              <div className="grid grid-cols-2 gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-xs text-muted-foreground">
                  Avg Price: <span className="text-foreground">{formatCurrency(room.avgPrice, true)}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Avg Size: <span className="text-foreground">{room.avgSize} sqm</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Units</span>
          <span className="font-semibold">
            {data.reduce((sum, r) => sum + r.count, 0).toLocaleString()}
          </span>
        </div>
      </div>
    )
  }

  // Bar chart variant
  return (
    <div className={cn('rounded-2xl border border-white/10 bg-white/5 p-6', className)}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div style={{ height }}>
        <ResponsiveBar
          data={chartData}
          keys={['count']}
          indexBy="room"
          margin={{ top: 10, right: 10, bottom: 40, left: 50 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          colors={({ data }) => data.color as string}
          borderRadius={4}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 0,
            tickPadding: 12,
          }}
          axisLeft={{
            tickSize: 0,
            tickPadding: 12,
            tickValues: 5,
            format: (value) => formatNumber(value as number, true),
          }}
          enableGridY={true}
          gridYValues={5}
          enableLabel={false}
          tooltip={({ data }) => (
            <div className="bg-background border border-white/10 rounded-lg px-3 py-2 shadow-xl">
              <div className="font-medium mb-1">{data.room}</div>
              <div className="text-sm text-muted-foreground space-y-0.5">
                <div>Units: {(data.count as number).toLocaleString()}</div>
                <div>Share: {data.percentage}%</div>
                <div>Avg Price: {formatCurrency(data.avgPrice as number, true)}</div>
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
          }}
        />
      </div>
    </div>
  )
}
