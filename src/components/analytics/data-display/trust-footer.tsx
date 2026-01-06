"use client"

import * as React from 'react'
import { ShieldCheck, Clock, Database } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface TrustFooterProps {
  source?: string
  lastUpdated?: string | Date
  className?: string
  variant?: 'inline' | 'block'
}

function formatLastUpdated(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffHours < 1) {
    return 'Updated just now'
  } else if (diffHours < 24) {
    return `Updated ${diffHours}h ago`
  } else if (diffDays < 7) {
    return `Updated ${diffDays}d ago`
  } else {
    return `Updated ${d.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })}`
  }
}

export function TrustFooter({
  source = 'Dubai Land Department',
  lastUpdated,
  className,
  variant = 'inline',
}: TrustFooterProps) {
  if (variant === 'block') {
    return (
      <div
        className={cn(
          'rounded-xl border border-white/10 bg-white/[0.02] p-4',
          className
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Database className="h-4 w-4" />
            <span>
              Source: <span className="text-foreground font-medium">{source}</span>
            </span>
          </div>
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatLastUpdated(lastUpdated)}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Inline variant - compact footer
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-center gap-x-4 gap-y-1 py-3 text-xs text-muted-foreground',
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>Source: {source}</span>
      </div>
      {lastUpdated && (
        <>
          <span className="hidden sm:inline text-white/20">|</span>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatLastUpdated(lastUpdated)}</span>
          </div>
        </>
      )}
    </div>
  )
}
