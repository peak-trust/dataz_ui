"use client"

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Command } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils/cn'
import { useSearch } from '@/lib/analytics/hooks/use-search'
import type { SearchResult, RecentSearch, DataMode } from '@/lib/analytics/types'
import { SearchResults } from './search-results'

interface UnifiedSearchProps {
  dataMode: DataMode
  onDataModeChange?: (mode: DataMode) => void
  className?: string
  placeholder?: string
  autoFocus?: boolean
  showShortcut?: boolean
}

export function UnifiedSearch({
  dataMode,
  onDataModeChange,
  className,
  placeholder = 'Search areas, projects, developers...',
  autoFocus = false,
  showShortcut = true,
}: UnifiedSearchProps) {
  const router = useRouter()
  const containerRef = React.useRef<HTMLDivElement>(null)

  const {
    query,
    isOpen,
    isLoading,
    results,
    recentSearches,
    selectedIndex,
    flatResults,
    inputRef,
    setQuery,
    open,
    close,
    clear,
    addToRecentSearches,
    clearRecentSearches,
    handleKeyDown,
  } = useSearch()

  // Handle click outside to close
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [close])

  // Navigate to entity detail page
  const navigateToEntity = React.useCallback(
    (result: SearchResult) => {
      addToRecentSearches(result)
      close()
      router.push(`/analytics/${result.type}/${result.id}?mode=${dataMode}`)
    },
    [router, dataMode, addToRecentSearches, close]
  )

  // Handle recent search click
  const handleRecentSelect = React.useCallback(
    (search: RecentSearch) => {
      close()
      router.push(`/analytics/${search.type}/${search.id}?mode=${dataMode}`)
    },
    [router, dataMode, close]
  )

  // Handle keyboard navigation
  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      const result = handleKeyDown(e)
      if (result && e.key === 'Enter') {
        navigateToEntity(result as SearchResult)
      }
    },
    [handleKeyDown, navigateToEntity]
  )

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Search Input Container */}
      <div
        className={cn(
          'group relative w-full rounded-2xl border transition-all duration-300',
          'bg-white/5 border-white/10 shadow-2xl backdrop-blur-xl',
          'hover:bg-white/10 hover:border-white/20 hover:shadow-primary/5',
          isOpen && 'bg-white/10 border-white/20 ring-1 ring-primary/20'
        )}
      >
        <div className="relative flex items-center p-2">
          {/* Search Icon */}
          <Search
            className={cn(
              'absolute left-5 h-5 w-5 transition-colors',
              isOpen ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'
            )}
          />

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={open}
            onKeyDown={onKeyDown}
            autoFocus={autoFocus}
            placeholder={placeholder}
            className={cn(
              'h-12 w-full bg-transparent px-12 text-base md:text-lg',
              'placeholder:text-muted-foreground/70',
              'focus:outline-none focus:ring-0'
            )}
          />

          {/* Right side actions */}
          <div className="absolute right-3 flex items-center gap-2">
            {/* Clear button */}
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={clear}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </motion.button>
            )}

            {/* Keyboard shortcut hint */}
            {showShortcut && !query && (
              <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                <Command className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">K</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Results Dropdown */}
      <SearchResults
        isOpen={isOpen}
        isLoading={isLoading}
        query={query}
        results={results}
        recentSearches={recentSearches}
        selectedIndex={selectedIndex}
        onSelect={navigateToEntity}
        onRecentSelect={handleRecentSelect}
        onClearRecent={clearRecentSearches}
      />
    </div>
  )
}

// Compact variant for navbar
interface CompactSearchProps {
  dataMode: DataMode
  className?: string
}

export function CompactSearch({ dataMode, className }: CompactSearchProps) {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  const {
    query,
    isOpen,
    isLoading,
    results,
    recentSearches,
    selectedIndex,
    inputRef,
    setQuery,
    open,
    close,
    clear,
    addToRecentSearches,
    clearRecentSearches,
    handleKeyDown,
  } = useSearch()

  // Handle click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false)
        close()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [close])

  const navigateToEntity = React.useCallback(
    (result: SearchResult) => {
      addToRecentSearches(result)
      setIsExpanded(false)
      close()
      router.push(`/analytics/${result.type}/${result.id}?mode=${dataMode}`)
    },
    [router, dataMode, addToRecentSearches, close]
  )

  const handleRecentSelect = React.useCallback(
    (search: RecentSearch) => {
      setIsExpanded(false)
      close()
      router.push(`/analytics/${search.type}/${search.id}?mode=${dataMode}`)
    },
    [router, dataMode, close]
  )

  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      const result = handleKeyDown(e)
      if (result && e.key === 'Enter') {
        navigateToEntity(result as SearchResult)
      }
    },
    [handleKeyDown, navigateToEntity]
  )

  if (!isExpanded) {
    return (
      <button
        onClick={() => {
          setIsExpanded(true)
          setTimeout(() => {
            inputRef.current?.focus()
            open()
          }, 100)
        }}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl',
          'bg-white/5 border border-white/10 hover:bg-white/10 transition-colors',
          className
        )}
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        <span className="hidden sm:inline text-sm text-muted-foreground">Search</span>
        <div className="hidden sm:flex items-center gap-0.5 ml-2">
          <kbd className="px-1 py-0.5 rounded bg-white/10 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </button>
    )
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <motion.div
        initial={{ width: 160 }}
        animate={{ width: 400 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <div className="relative flex items-center rounded-xl bg-white/10 border border-white/20">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={open}
            onKeyDown={onKeyDown}
            placeholder="Search..."
            className="h-9 w-full bg-transparent pl-9 pr-8 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={clear}
              className="absolute right-2 p-1 hover:bg-white/10 rounded"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          )}
        </div>
      </motion.div>

      <SearchResults
        isOpen={isOpen}
        isLoading={isLoading}
        query={query}
        results={results}
        recentSearches={recentSearches}
        selectedIndex={selectedIndex}
        onSelect={navigateToEntity}
        onRecentSelect={handleRecentSelect}
        onClearRecent={clearRecentSearches}
      />
    </div>
  )
}
