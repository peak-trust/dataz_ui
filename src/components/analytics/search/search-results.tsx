"use client"

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, SearchX } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import type { SearchResult, RecentSearch, EntityType } from '@/lib/analytics/types'
import { SearchResultItem, RecentSearchItem } from './search-result-item'

interface SearchResultsGroupProps {
  title: string
  results: SearchResult[]
  selectedIndex: number
  baseIndex: number
  onSelect: (result: SearchResult) => void
}

function SearchResultsGroup({
  title,
  results,
  selectedIndex,
  baseIndex,
  onSelect,
}: SearchResultsGroupProps) {
  if (results.length === 0) return null

  return (
    <div>
      <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-white/[0.02]">
        {title}
        <span className="ml-2 text-muted-foreground/60">{results.length}</span>
      </div>
      {results.map((result, index) => (
        <SearchResultItem
          key={`${result.type}-${result.id}`}
          result={result}
          isSelected={selectedIndex === baseIndex + index}
          onClick={() => onSelect(result)}
        />
      ))}
    </div>
  )
}

interface SearchResultsProps {
  isOpen: boolean
  isLoading: boolean
  query: string
  results: {
    areas: SearchResult[]
    projects: SearchResult[]
    developers: SearchResult[]
    buildings: SearchResult[]
    total: number
  }
  recentSearches: RecentSearch[]
  selectedIndex: number
  onSelect: (result: SearchResult) => void
  onRecentSelect: (search: RecentSearch) => void
  onClearRecent: () => void
}

export function SearchResults({
  isOpen,
  isLoading,
  query,
  results,
  recentSearches,
  selectedIndex,
  onSelect,
  onRecentSelect,
  onClearRecent,
}: SearchResultsProps) {
  const hasQuery = query.length >= 2
  const hasResults = results.total > 0
  const hasRecent = recentSearches.length > 0

  // Calculate base indices for each group for keyboard navigation
  const areaBaseIndex = 0
  const projectBaseIndex = results.areas.length
  const developerBaseIndex = projectBaseIndex + results.projects.length
  const buildingBaseIndex = developerBaseIndex + results.developers.length

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className={cn(
            'absolute top-full left-0 right-0 mt-2 z-50',
            'rounded-2xl border border-white/10 bg-background/95 backdrop-blur-xl',
            'shadow-2xl shadow-black/20 overflow-hidden'
          )}
        >
          <div className="max-h-[min(60vh,480px)] overflow-y-auto custom-scrollbar">
            {/* Loading state */}
            {isLoading && hasQuery && (
              <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Searching...</span>
              </div>
            )}

            {/* No query - show recent searches */}
            {!hasQuery && !isLoading && (
              <>
                {hasRecent ? (
                  <div>
                    <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02]">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Recent Searches
                      </span>
                      <button
                        onClick={onClearRecent}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Clear all
                      </button>
                    </div>
                    {recentSearches.map((search) => (
                      <RecentSearchItem
                        key={`${search.type}-${search.id}`}
                        search={search}
                        onClick={() => onRecentSelect(search)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    <p className="text-sm">Start typing to search areas, projects, developers...</p>
                  </div>
                )}
              </>
            )}

            {/* Has query but no results */}
            {hasQuery && !isLoading && !hasResults && (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
                <SearchX className="h-8 w-8 opacity-50" />
                <div className="text-center">
                  <p className="text-sm font-medium">No results found</p>
                  <p className="text-xs mt-1">
                    Try searching for a different area, project, or developer
                  </p>
                </div>
              </div>
            )}

            {/* Results */}
            {hasQuery && !isLoading && hasResults && (
              <>
                <SearchResultsGroup
                  title="Areas"
                  results={results.areas}
                  selectedIndex={selectedIndex}
                  baseIndex={areaBaseIndex}
                  onSelect={onSelect}
                />
                <SearchResultsGroup
                  title="Projects"
                  results={results.projects}
                  selectedIndex={selectedIndex}
                  baseIndex={projectBaseIndex}
                  onSelect={onSelect}
                />
                <SearchResultsGroup
                  title="Developers"
                  results={results.developers}
                  selectedIndex={selectedIndex}
                  baseIndex={developerBaseIndex}
                  onSelect={onSelect}
                />
                <SearchResultsGroup
                  title="Buildings"
                  results={results.buildings}
                  selectedIndex={selectedIndex}
                  baseIndex={buildingBaseIndex}
                  onSelect={onSelect}
                />
              </>
            )}
          </div>

          {/* Footer hint */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">↑↓</kbd>
                navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">↵</kbd>
                select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px]">esc</kbd>
                close
              </span>
            </div>
            {hasResults && (
              <span className="text-xs text-muted-foreground">
                {results.total} results
              </span>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
