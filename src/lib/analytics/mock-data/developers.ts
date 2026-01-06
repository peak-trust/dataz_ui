import type { DeveloperDetail, Transaction, PricePoint, ProjectSummary, AreaSummary } from '../types'

// Helper to generate monthly sales history
function generateSalesHistory(
  basePrice: number,
  months: number = 24,
  volatility: number = 0.05,
  trend: number = 0.015
): PricePoint[] {
  const history: PricePoint[] = []
  let currentPrice = basePrice * (1 - (months * trend) / 2)

  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - months)

  for (let i = 0; i < months; i++) {
    const date = new Date(startDate)
    date.setMonth(date.getMonth() + i)

    const randomChange = (Math.random() - 0.5) * 2 * volatility
    currentPrice = currentPrice * (1 + trend + randomChange)

    const txCount = Math.floor(800 + Math.random() * 600)

    history.push({
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      avgPricePerSqft: Math.round(currentPrice),
      transactionCount: txCount,
      totalValue: Math.round(currentPrice * txCount * 85 * 10.764),
    })
  }

  return history
}

// Helper to generate transactions
function generateTransactions(
  developerName: string,
  count: number,
  avgPrice: number,
  avgPsf: number
): Transaction[] {
  const transactions: Transaction[] = []
  const projects = ['Skyrise', 'Aquarise', 'Hills', 'Corner', 'Azure', 'Elite']
  const areas = ['Business Bay', 'JVC', 'Al Jadaf', 'Dubai Marina', 'Downtown Dubai']
  const rooms = ['Studio', '1BR', '2BR', '3BR', 'Penthouse'] as const
  const roomSizes: Record<string, [number, number]> = {
    'Studio': [28, 45],
    '1BR': [50, 75],
    '2BR': [80, 120],
    '3BR': [125, 180],
    'Penthouse': [180, 400],
  }
  const roomPriceMultiplier: Record<string, number> = {
    'Studio': 0.45,
    '1BR': 0.65,
    '2BR': 1.0,
    '3BR': 1.5,
    'Penthouse': 3.5,
  }

  for (let i = 0; i < count; i++) {
    const room = rooms[Math.floor(Math.random() * rooms.length)]
    const [minSize, maxSize] = roomSizes[room]
    const size = Math.floor(minSize + Math.random() * (maxSize - minSize))
    const priceMultiplier = roomPriceMultiplier[room] * (0.85 + Math.random() * 0.3)
    const price = Math.round(avgPrice * priceMultiplier)
    const pricePerSqft = Math.round(price / (size * 10.764))

    const daysAgo = Math.floor(Math.random() * 365)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)

    const project = projects[Math.floor(Math.random() * projects.length)]
    const area = areas[Math.floor(Math.random() * areas.length)]

    transactions.push({
      id: `tx-${developerName.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      date: date.toISOString().split('T')[0],
      price,
      pricePerSqft,
      size,
      propertyType: room === 'Penthouse' ? 'Penthouse' : 'Apartment',
      rooms: room,
      project: `${developerName.split(' ')[0]} ${project}`,
      area,
    })
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Mock Developers Data - Based on actual RDS precalc_developer_index
export const mockDevelopers: DeveloperDetail[] = [
  {
    id: 'BINGHATTI',
    name: 'Binghatti Group',
    tier: 'TIER_1',
    portfolio: {
      totalProjects: 68,
      activeProjects: 16,
      completedProjects: 34,
      underConstruction: 34,
      notStarted: 14,
      pending: 4,
      avgCompletionPct: 56.4,
      areasPresent: 12,
    },
    stats: {
      totalSales: 32450,
      totalVolume: 50783315001,
      marketSharePct: 2.27,
      avgSalePrice: 1564971,
      medianSalePrice: 1000000,
      avgPricePerSqft: 1672,
      rankByVolume: 5,
      rankBySales: 3,
      rankByProjects: 4,
    },
    salesHistory: generateSalesHistory(1672, 24, 0.04, 0.02),
    priceTrend3m: 'up',
    priceTrend12m: 'up',
    volumeMomentum: 'accelerating',
    topProjects: [
      { id: 'binghatti-skyrise', name: 'Binghatti Skyrise', transactionCount: 3222, avgPricePerSqft: 2656, status: 'Under Construction' },
      { id: 'binghatti-elite', name: 'Binghatti Elite', transactionCount: 1691, avgPricePerSqft: 1562, status: 'Completed' },
      { id: 'binghatti-hills', name: 'Binghatti Hills', transactionCount: 1601, avgPricePerSqft: 1602, status: 'Completed' },
      { id: 'binghatti-corner', name: 'Binghatti Corner', transactionCount: 1241, avgPricePerSqft: 999, status: 'Under Construction' },
      { id: 'binghatti-aquarise', name: 'Binghatti Aquarise', transactionCount: 1084, avgPricePerSqft: 2624, status: 'Under Construction' },
    ],
    topAreas: [
      { id: '273', name: 'Business Bay', transactionCount: 4910, avgPricePerSqft: 2650 },
      { id: '128', name: 'Al Barsha South Fourth', transactionCount: 5773, avgPricePerSqft: 1200 },
      { id: '567', name: 'Al Jadaf', transactionCount: 2297, avgPricePerSqft: 1350 },
      { id: '129', name: 'Al Barsha South Second', transactionCount: 3061, avgPricePerSqft: 1580 },
    ],
    recentTransactions: generateTransactions('Binghatti Group', 50, 1564971, 1672),
    totalTransactions: 32450,
    serviceCharges: { avgPerSqft: 14.5, min: 8, max: 28 },
    firstSaleDate: '2007-06-12',
    lastSaleDate: '2025-12-24',
    dataAvailable: ['sales', 'rental'],
  },
  {
    id: 'EMAAR',
    name: 'Emaar Properties',
    tier: 'TIER_1',
    portfolio: {
      totalProjects: 156,
      activeProjects: 28,
      completedProjects: 98,
      underConstruction: 45,
      notStarted: 8,
      pending: 5,
      avgCompletionPct: 72.5,
      areasPresent: 25,
    },
    stats: {
      totalSales: 85000,
      totalVolume: 245000000000,
      marketSharePct: 12.5,
      avgSalePrice: 2882352,
      medianSalePrice: 2100000,
      avgPricePerSqft: 2450,
      rankByVolume: 1,
      rankBySales: 1,
      rankByProjects: 1,
    },
    salesHistory: generateSalesHistory(2450, 24, 0.03, 0.015),
    priceTrend3m: 'up',
    priceTrend12m: 'up',
    volumeMomentum: 'stable',
    topProjects: [
      { id: 'burj-khalifa', name: 'Burj Khalifa', transactionCount: 4500, avgPricePerSqft: 4200, status: 'Completed' },
      { id: 'dubai-mall-res', name: 'Dubai Mall Residences', transactionCount: 3200, avgPricePerSqft: 3800, status: 'Completed' },
      { id: 'creek-harbour', name: 'Dubai Creek Harbour', transactionCount: 8500, avgPricePerSqft: 2200, status: 'Under Construction' },
      { id: 'emaar-south', name: 'Emaar South', transactionCount: 6500, avgPricePerSqft: 980, status: 'Under Construction' },
    ],
    topAreas: [
      { id: '784', name: 'Downtown Dubai', transactionCount: 18500, avgPricePerSqft: 3100 },
      { id: '395', name: 'Dubai Marina', transactionCount: 12000, avgPricePerSqft: 1850 },
      { id: '567', name: 'Dubai Creek Harbour', transactionCount: 8500, avgPricePerSqft: 2200 },
      { id: '445', name: 'Dubai South', transactionCount: 6500, avgPricePerSqft: 980 },
    ],
    recentTransactions: generateTransactions('Emaar Properties', 50, 2882352, 2450),
    totalTransactions: 85000,
    serviceCharges: { avgPerSqft: 22.0, min: 15, max: 45 },
    firstSaleDate: '2002-01-15',
    lastSaleDate: '2025-12-28',
    dataAvailable: ['sales', 'rental'],
  },
  {
    id: 'DAMAC',
    name: 'DAMAC Properties',
    tier: 'TIER_1',
    portfolio: {
      totalProjects: 95,
      activeProjects: 22,
      completedProjects: 58,
      underConstruction: 32,
      notStarted: 5,
      pending: 0,
      avgCompletionPct: 68.2,
      areasPresent: 18,
    },
    stats: {
      totalSales: 52000,
      totalVolume: 98500000000,
      marketSharePct: 5.8,
      avgSalePrice: 1894230,
      medianSalePrice: 1450000,
      avgPricePerSqft: 1850,
      rankByVolume: 2,
      rankBySales: 2,
      rankByProjects: 2,
    },
    salesHistory: generateSalesHistory(1850, 24, 0.035, 0.018),
    priceTrend3m: 'up',
    priceTrend12m: 'up',
    volumeMomentum: 'accelerating',
    topProjects: [
      { id: 'damac-hills', name: 'DAMAC Hills', transactionCount: 12000, avgPricePerSqft: 1650, status: 'Completed' },
      { id: 'damac-lagoons', name: 'DAMAC Lagoons', transactionCount: 8500, avgPricePerSqft: 1200, status: 'Under Construction' },
      { id: 'damac-towers', name: 'DAMAC Towers', transactionCount: 4200, avgPricePerSqft: 2100, status: 'Completed' },
    ],
    topAreas: [
      { id: '273', name: 'Business Bay', transactionCount: 8500, avgPricePerSqft: 2100 },
      { id: '395', name: 'Dubai Marina', transactionCount: 6800, avgPricePerSqft: 1900 },
      { id: 'damac-hills', name: 'DAMAC Hills', transactionCount: 12000, avgPricePerSqft: 1650 },
    ],
    recentTransactions: generateTransactions('DAMAC Properties', 50, 1894230, 1850),
    totalTransactions: 52000,
    serviceCharges: { avgPerSqft: 18.0, min: 12, max: 32 },
    firstSaleDate: '2005-03-20',
    lastSaleDate: '2025-12-26',
    dataAvailable: ['sales', 'rental'],
  },
  {
    id: 'NAKHEEL',
    name: 'Nakheel',
    tier: 'TIER_1',
    portfolio: {
      totalProjects: 78,
      activeProjects: 15,
      completedProjects: 52,
      underConstruction: 20,
      notStarted: 6,
      pending: 0,
      avgCompletionPct: 75.8,
      areasPresent: 15,
    },
    stats: {
      totalSales: 38000,
      totalVolume: 125000000000,
      marketSharePct: 4.2,
      avgSalePrice: 3289473,
      medianSalePrice: 2500000,
      avgPricePerSqft: 2650,
      rankByVolume: 3,
      rankBySales: 4,
      rankByProjects: 3,
    },
    salesHistory: generateSalesHistory(2650, 24, 0.03, 0.02),
    priceTrend3m: 'up',
    priceTrend12m: 'up',
    volumeMomentum: 'stable',
    topProjects: [
      { id: 'palm-jumeirah', name: 'Palm Jumeirah', transactionCount: 15000, avgPricePerSqft: 3500, status: 'Completed' },
      { id: 'jumeirah-islands', name: 'Jumeirah Islands', transactionCount: 4500, avgPricePerSqft: 2800, status: 'Completed' },
      { id: 'palm-jebel-ali', name: 'Palm Jebel Ali', transactionCount: 2800, avgPricePerSqft: 1800, status: 'Under Construction' },
    ],
    topAreas: [
      { id: '892', name: 'Palm Jumeirah', transactionCount: 15000, avgPricePerSqft: 3500 },
      { id: 'ji', name: 'Jumeirah Islands', transactionCount: 4500, avgPricePerSqft: 2800 },
      { id: 'jvc', name: 'JVC', transactionCount: 5200, avgPricePerSqft: 1350 },
    ],
    recentTransactions: generateTransactions('Nakheel', 50, 3289473, 2650),
    totalTransactions: 38000,
    serviceCharges: { avgPerSqft: 25.0, min: 18, max: 48 },
    firstSaleDate: '2004-06-01',
    lastSaleDate: '2025-12-27',
    dataAvailable: ['sales', 'rental'],
  },
  {
    id: 'DANUBE',
    name: 'Danube Properties',
    tier: 'TIER_1',
    portfolio: {
      totalProjects: 45,
      activeProjects: 18,
      completedProjects: 22,
      underConstruction: 20,
      notStarted: 3,
      pending: 0,
      avgCompletionPct: 58.5,
      areasPresent: 10,
    },
    stats: {
      totalSales: 28000,
      totalVolume: 32500000000,
      marketSharePct: 2.1,
      avgSalePrice: 1160714,
      medianSalePrice: 950000,
      avgPricePerSqft: 1150,
      rankByVolume: 6,
      rankBySales: 5,
      rankByProjects: 6,
    },
    salesHistory: generateSalesHistory(1150, 24, 0.045, 0.025),
    priceTrend3m: 'up',
    priceTrend12m: 'up',
    volumeMomentum: 'accelerating',
    topProjects: [
      { id: 'danube-elitz', name: 'Danube Elitz', transactionCount: 5500, avgPricePerSqft: 1100, status: 'Under Construction' },
      { id: 'danube-bayz', name: 'Danube Bayz', transactionCount: 4200, avgPricePerSqft: 1250, status: 'Under Construction' },
      { id: 'danube-glamz', name: 'Danube Glamz', transactionCount: 3800, avgPricePerSqft: 1080, status: 'Completed' },
    ],
    topAreas: [
      { id: '128', name: 'JVC', transactionCount: 12000, avgPricePerSqft: 1150 },
      { id: '234', name: 'Jabal Ali', transactionCount: 6500, avgPricePerSqft: 870 },
      { id: '273', name: 'Business Bay', transactionCount: 3500, avgPricePerSqft: 1800 },
    ],
    recentTransactions: generateTransactions('Danube Properties', 50, 1160714, 1150),
    totalTransactions: 28000,
    serviceCharges: { avgPerSqft: 11.0, min: 8, max: 16 },
    firstSaleDate: '2014-08-15',
    lastSaleDate: '2025-12-25',
    dataAvailable: ['sales', 'rental'],
  },
  {
    id: 'AZIZI',
    name: 'Azizi Developments',
    tier: 'TIER_1',
    portfolio: {
      totalProjects: 52,
      activeProjects: 20,
      completedProjects: 25,
      underConstruction: 24,
      notStarted: 3,
      pending: 0,
      avgCompletionPct: 52.8,
      areasPresent: 8,
    },
    stats: {
      totalSales: 25000,
      totalVolume: 35800000000,
      marketSharePct: 1.9,
      avgSalePrice: 1432000,
      medianSalePrice: 1150000,
      avgPricePerSqft: 1380,
      rankByVolume: 7,
      rankBySales: 6,
      rankByProjects: 5,
    },
    salesHistory: generateSalesHistory(1380, 24, 0.04, 0.022),
    priceTrend3m: 'up',
    priceTrend12m: 'up',
    volumeMomentum: 'stable',
    topProjects: [
      { id: 'azizi-riviera', name: 'Azizi Riviera', transactionCount: 8500, avgPricePerSqft: 1350, status: 'Under Construction' },
      { id: 'azizi-venice', name: 'Azizi Venice', transactionCount: 4200, avgPricePerSqft: 1420, status: 'Under Construction' },
      { id: 'azizi-aura', name: 'Azizi Aura', transactionCount: 3500, avgPricePerSqft: 1280, status: 'Completed' },
    ],
    topAreas: [
      { id: 'meydan', name: 'Meydan', transactionCount: 12000, avgPricePerSqft: 1400 },
      { id: '567', name: 'Al Jadaf', transactionCount: 4500, avgPricePerSqft: 1350 },
      { id: 'al-furjan', name: 'Al Furjan', transactionCount: 3800, avgPricePerSqft: 1200 },
    ],
    recentTransactions: generateTransactions('Azizi Developments', 50, 1432000, 1380),
    totalTransactions: 25000,
    serviceCharges: { avgPerSqft: 12.5, min: 9, max: 18 },
    firstSaleDate: '2014-02-20',
    lastSaleDate: '2025-12-24',
    dataAvailable: ['sales', 'rental'],
  },
  {
    id: 'SAMANA',
    name: 'Samana Developers',
    tier: 'TIER_2',
    portfolio: {
      totalProjects: 28,
      activeProjects: 15,
      completedProjects: 8,
      underConstruction: 18,
      notStarted: 2,
      pending: 0,
      avgCompletionPct: 42.5,
      areasPresent: 6,
    },
    stats: {
      totalSales: 12500,
      totalVolume: 14200000000,
      marketSharePct: 0.85,
      avgSalePrice: 1136000,
      medianSalePrice: 920000,
      avgPricePerSqft: 1280,
      rankByVolume: 12,
      rankBySales: 10,
      rankByProjects: 12,
    },
    salesHistory: generateSalesHistory(1280, 24, 0.05, 0.028),
    priceTrend3m: 'up',
    priceTrend12m: 'up',
    volumeMomentum: 'accelerating',
    topProjects: [
      { id: 'samana-golf', name: 'Samana Golf Avenue', transactionCount: 3200, avgPricePerSqft: 1300, status: 'Under Construction' },
      { id: 'samana-waves', name: 'Samana Waves', transactionCount: 2800, avgPricePerSqft: 1250, status: 'Under Construction' },
    ],
    topAreas: [
      { id: '128', name: 'JVC', transactionCount: 8500, avgPricePerSqft: 1280 },
      { id: 'arjan', name: 'Arjan', transactionCount: 2500, avgPricePerSqft: 1200 },
    ],
    recentTransactions: generateTransactions('Samana Developers', 50, 1136000, 1280),
    totalTransactions: 12500,
    serviceCharges: { avgPerSqft: 10.5, min: 8, max: 14 },
    firstSaleDate: '2018-05-10',
    lastSaleDate: '2025-12-22',
    dataAvailable: ['sales', 'rental'],
  },
  {
    id: 'OMNIYAT',
    name: 'Omniyat',
    tier: 'TIER_2',
    portfolio: {
      totalProjects: 18,
      activeProjects: 6,
      completedProjects: 10,
      underConstruction: 6,
      notStarted: 2,
      pending: 0,
      avgCompletionPct: 68.5,
      areasPresent: 5,
    },
    stats: {
      totalSales: 4500,
      totalVolume: 28500000000,
      marketSharePct: 0.52,
      avgSalePrice: 6333333,
      medianSalePrice: 4800000,
      avgPricePerSqft: 3850,
      rankByVolume: 8,
      rankBySales: 18,
      rankByProjects: 22,
    },
    salesHistory: generateSalesHistory(3850, 24, 0.025, 0.012),
    priceTrend3m: 'stable',
    priceTrend12m: 'up',
    volumeMomentum: 'stable',
    topProjects: [
      { id: 'one-palm', name: 'One Palm', transactionCount: 850, avgPricePerSqft: 4800, status: 'Completed' },
      { id: 'the-opus', name: 'The Opus by Zaha Hadid', transactionCount: 620, avgPricePerSqft: 4200, status: 'Completed' },
      { id: 'dorchester', name: 'Dorchester Collection', transactionCount: 450, avgPricePerSqft: 5500, status: 'Under Construction' },
    ],
    topAreas: [
      { id: '892', name: 'Palm Jumeirah', transactionCount: 1200, avgPricePerSqft: 4800 },
      { id: '273', name: 'Business Bay', transactionCount: 1800, avgPricePerSqft: 3500 },
      { id: '784', name: 'Downtown Dubai', transactionCount: 850, avgPricePerSqft: 4200 },
    ],
    recentTransactions: generateTransactions('Omniyat', 30, 6333333, 3850),
    totalTransactions: 4500,
    serviceCharges: { avgPerSqft: 35.0, min: 28, max: 55 },
    firstSaleDate: '2010-09-15',
    lastSaleDate: '2025-12-20',
    dataAvailable: ['sales'],
  },
]

// Search helper
export function searchDevelopers(query: string): DeveloperDetail[] {
  const lowerQuery = query.toLowerCase()
  return mockDevelopers.filter(
    developer =>
      developer.name.toLowerCase().includes(lowerQuery) ||
      developer.id.toLowerCase().includes(lowerQuery)
  )
}

// Get developer by ID
export function getDeveloperById(id: string): DeveloperDetail | undefined {
  return mockDevelopers.find(developer => developer.id === id)
}

// Get developers by tier
export function getDevelopersByTier(tier: DeveloperDetail['tier']): DeveloperDetail[] {
  return mockDevelopers.filter(developer => developer.tier === tier)
}
