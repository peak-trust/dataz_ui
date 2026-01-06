// Mock Data Exports
// Centralized access to all mock data for the analytics dashboard

export {
  mockAreas,
  searchAreas,
  getAreaById,
} from './areas'

export {
  mockProjects,
  searchProjects,
  getProjectById,
  getProjectsByArea,
  getProjectsByDeveloper,
} from './projects'

export {
  mockDevelopers,
  searchDevelopers,
  getDeveloperById,
  getDevelopersByTier,
} from './developers'

export {
  mockBuildings,
  searchBuildings,
  getBuildingById,
  getBuildingsByProject,
  getBuildingsByArea,
} from './buildings'

// Re-export types for convenience
export type {
  AreaDetail,
  ProjectDetail,
  DeveloperDetail,
  BuildingDetail,
  SearchResult,
  Transaction,
  PricePoint,
  RoomDistribution,
  EntityType,
  DataMode,
} from '../types'

import type { SearchResult, EntityType } from '../types'
import { mockAreas } from './areas'
import { mockProjects } from './projects'
import { mockDevelopers } from './developers'
import { mockBuildings } from './buildings'

/**
 * Unified search across all entity types
 * Returns results grouped by entity type, sorted by relevance (transaction count)
 */
export function unifiedSearch(query: string, limit: number = 5): {
  areas: SearchResult[]
  projects: SearchResult[]
  developers: SearchResult[]
  buildings: SearchResult[]
  total: number
} {
  if (!query || query.length < 2) {
    return { areas: [], projects: [], developers: [], buildings: [], total: 0 }
  }

  const lowerQuery = query.toLowerCase()

  // Search areas
  const areas: SearchResult[] = mockAreas
    .filter(a =>
      a.name.toLowerCase().includes(lowerQuery) ||
      a.nameAr.includes(query)
    )
    .map(a => ({
      id: a.id,
      type: 'area' as EntityType,
      name: a.name,
      nameAr: a.nameAr,
      subtitle: `${a.topProjects.length} projects`,
      transactionCount: a.stats.transactionCount,
      avgPricePerSqft: a.stats.avgPricePerSqft,
      dataAvailable: a.dataAvailable,
    }))
    .sort((a, b) => b.transactionCount - a.transactionCount)
    .slice(0, limit)

  // Search projects
  const projects: SearchResult[] = mockProjects
    .filter(p =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.nameAr.includes(query) ||
      p.areaName.toLowerCase().includes(lowerQuery) ||
      p.developerName.toLowerCase().includes(lowerQuery)
    )
    .map(p => ({
      id: p.id,
      type: 'project' as EntityType,
      name: p.name,
      nameAr: p.nameAr,
      subtitle: p.areaName,
      transactionCount: p.stats.transactionCount,
      avgPricePerSqft: p.stats.avgPricePerSqft,
      dataAvailable: p.dataAvailable,
    }))
    .sort((a, b) => b.transactionCount - a.transactionCount)
    .slice(0, limit)

  // Search developers
  const developers: SearchResult[] = mockDevelopers
    .filter(d =>
      d.name.toLowerCase().includes(lowerQuery) ||
      d.id.toLowerCase().includes(lowerQuery)
    )
    .map(d => ({
      id: d.id,
      type: 'developer' as EntityType,
      name: d.name,
      subtitle: `${d.portfolio.totalProjects} projects · ${d.tier.replace('_', ' ')}`,
      transactionCount: d.stats.totalSales,
      avgPricePerSqft: d.stats.avgPricePerSqft,
      dataAvailable: d.dataAvailable,
    }))
    .sort((a, b) => b.transactionCount - a.transactionCount)
    .slice(0, limit)

  // Search buildings
  const buildings: SearchResult[] = mockBuildings
    .filter(b =>
      b.name.toLowerCase().includes(lowerQuery) ||
      b.nameAr.includes(query) ||
      b.projectName.toLowerCase().includes(lowerQuery) ||
      b.areaName.toLowerCase().includes(lowerQuery)
    )
    .map(b => ({
      id: b.id,
      type: 'building' as EntityType,
      name: b.name,
      nameAr: b.nameAr,
      subtitle: `${b.projectName} · ${b.areaName}`,
      transactionCount: b.stats.transactionCount,
      avgPricePerSqft: b.stats.avgPricePerSqft,
      dataAvailable: b.dataAvailable,
    }))
    .sort((a, b) => b.transactionCount - a.transactionCount)
    .slice(0, limit)

  return {
    areas,
    projects,
    developers,
    buildings,
    total: areas.length + projects.length + developers.length + buildings.length,
  }
}

/**
 * Get entity by ID and type
 */
export function getEntityById(type: EntityType, id: string) {
  switch (type) {
    case 'area':
      return mockAreas.find(a => a.id === id)
    case 'project':
      return mockProjects.find(p => p.id === id)
    case 'developer':
      return mockDevelopers.find(d => d.id === id)
    case 'building':
      return mockBuildings.find(b => b.id === id)
    default:
      return undefined
  }
}

/**
 * Get popular/trending entities for the home screen
 */
export function getPopularEntities(limit: number = 6) {
  return {
    areas: mockAreas
      .sort((a, b) => b.stats.transactionCount - a.stats.transactionCount)
      .slice(0, limit),
    projects: mockProjects
      .sort((a, b) => b.stats.transactionCount - a.stats.transactionCount)
      .slice(0, limit),
    developers: mockDevelopers
      .sort((a, b) => b.stats.totalSales - a.stats.totalSales)
      .slice(0, limit),
  }
}

/**
 * Get stats summary for dashboard
 */
export function getDashboardStats() {
  const totalTransactions = mockAreas.reduce((sum, a) => sum + a.stats.transactionCount, 0)
  const totalValue = mockAreas.reduce((sum, a) => sum + a.stats.totalValue, 0)
  const avgPrice = mockAreas.reduce((sum, a) => sum + a.stats.avgPricePerSqft, 0) / mockAreas.length

  return {
    totalAreas: mockAreas.length,
    totalProjects: mockProjects.length,
    totalDevelopers: mockDevelopers.length,
    totalBuildings: mockBuildings.length,
    totalTransactions,
    totalValue,
    avgPricePerSqft: Math.round(avgPrice),
  }
}
