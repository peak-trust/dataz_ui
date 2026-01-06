"use client"

import * as React from 'react'
import type { SearchResult, RecentSearch, EntityType } from '../types'
import { unifiedSearch } from '../mock-data'

const RECENT_SEARCHES_KEY = 'dataz-recent-searches'
const MAX_RECENT_SEARCHES = 5

interface SearchState {
  query: string
  isOpen: boolean
  isLoading: boolean
  results: {
    areas: SearchResult[]
    projects: SearchResult[]
    developers: SearchResult[]
    buildings: SearchResult[]
    total: number
  }
  recentSearches: RecentSearch[]
  selectedIndex: number
}

interface UseSearchOptions {
  debounceMs?: number
  minQueryLength?: number
  maxResults?: number
}

export function useSearch(options: UseSearchOptions = {}) {
  const {
    debounceMs = 150,
    minQueryLength = 2,
    maxResults = 5,
  } = options

  const [state, setState] = React.useState<SearchState>({
    query: '',
    isOpen: false,
    isLoading: false,
    results: { areas: [], projects: [], developers: [], buildings: [], total: 0 },
    recentSearches: [],
    selectedIndex: -1,
  })

  const inputRef = React.useRef<HTMLInputElement>(null)
  const debounceRef = React.useRef<NodeJS.Timeout | null>(null)

  // Load recent searches from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as RecentSearch[]
        setState(s => ({ ...s, recentSearches: parsed }))
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  // Debounced search
  React.useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (state.query.length < minQueryLength) {
      setState(s => ({
        ...s,
        results: { areas: [], projects: [], developers: [], buildings: [], total: 0 },
        isLoading: false,
      }))
      return
    }

    setState(s => ({ ...s, isLoading: true }))

    debounceRef.current = setTimeout(() => {
      const results = unifiedSearch(state.query, maxResults)
      setState(s => ({
        ...s,
        results,
        isLoading: false,
        selectedIndex: -1,
      }))
    }, debounceMs)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [state.query, debounceMs, minQueryLength, maxResults])

  // Get all results as flat array for keyboard navigation
  const flatResults = React.useMemo(() => {
    const all: SearchResult[] = []
    if (state.results.areas.length) all.push(...state.results.areas)
    if (state.results.projects.length) all.push(...state.results.projects)
    if (state.results.developers.length) all.push(...state.results.developers)
    if (state.results.buildings.length) all.push(...state.results.buildings)
    return all
  }, [state.results])

  const setQuery = React.useCallback((query: string) => {
    setState(s => ({ ...s, query, selectedIndex: -1 }))
  }, [])

  const open = React.useCallback(() => {
    setState(s => ({ ...s, isOpen: true }))
    // Focus input after opening
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [])

  const close = React.useCallback(() => {
    setState(s => ({ ...s, isOpen: false, selectedIndex: -1 }))
  }, [])

  const toggle = React.useCallback(() => {
    setState(s => {
      const willOpen = !s.isOpen
      if (willOpen) {
        setTimeout(() => inputRef.current?.focus(), 50)
      }
      return { ...s, isOpen: willOpen }
    })
  }, [])

  const clear = React.useCallback(() => {
    setState(s => ({
      ...s,
      query: '',
      results: { areas: [], projects: [], developers: [], buildings: [], total: 0 },
      selectedIndex: -1,
    }))
    inputRef.current?.focus()
  }, [])

  const addToRecentSearches = React.useCallback((result: SearchResult) => {
    const newRecent: RecentSearch = {
      id: result.id,
      type: result.type,
      name: result.name,
      searchedAt: new Date().toISOString(),
    }

    setState(s => {
      // Remove duplicates and add new one at the start
      const filtered = s.recentSearches.filter(r => !(r.id === result.id && r.type === result.type))
      const updated = [newRecent, ...filtered].slice(0, MAX_RECENT_SEARCHES)

      // Persist to localStorage
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
      } catch {
        // Ignore localStorage errors
      }

      return { ...s, recentSearches: updated }
    })
  }, [])

  const clearRecentSearches = React.useCallback(() => {
    setState(s => ({ ...s, recentSearches: [] }))
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY)
    } catch {
      // Ignore
    }
  }, [])

  // Keyboard navigation
  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (!state.isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        open()
        e.preventDefault()
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setState(s => ({
          ...s,
          selectedIndex: Math.min(s.selectedIndex + 1, flatResults.length - 1),
        }))
        break

      case 'ArrowUp':
        e.preventDefault()
        setState(s => ({
          ...s,
          selectedIndex: Math.max(s.selectedIndex - 1, -1),
        }))
        break

      case 'Enter':
        e.preventDefault()
        if (state.selectedIndex >= 0 && flatResults[state.selectedIndex]) {
          const selected = flatResults[state.selectedIndex]
          addToRecentSearches(selected)
          // Return the selected item - parent component handles navigation
          return selected
        }
        break

      case 'Escape':
        e.preventDefault()
        close()
        break
    }

    return null
  }, [state.isOpen, state.selectedIndex, flatResults, open, close, addToRecentSearches])

  // Global keyboard shortcut (Cmd+K / Ctrl+K)
  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggle()
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [toggle])

  return {
    // State
    query: state.query,
    isOpen: state.isOpen,
    isLoading: state.isLoading,
    results: state.results,
    recentSearches: state.recentSearches,
    selectedIndex: state.selectedIndex,
    flatResults,

    // Refs
    inputRef,

    // Actions
    setQuery,
    open,
    close,
    toggle,
    clear,
    addToRecentSearches,
    clearRecentSearches,
    handleKeyDown,
  }
}

export type UseSearchReturn = ReturnType<typeof useSearch>
