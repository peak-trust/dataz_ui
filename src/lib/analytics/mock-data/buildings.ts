import type { BuildingDetail, Transaction, PricePoint, RoomDistribution } from '../types'

// Helper to generate quarterly price history
function generatePriceHistory(
  basePrice: number,
  quarters: number = 12,
  volatility: number = 0.03,
  trend: number = 0.02
): PricePoint[] {
  const history: PricePoint[] = []
  let currentPrice = basePrice * (1 - (quarters * trend) / 2)

  const startYear = 2022
  const startQuarter = 1

  for (let i = 0; i < quarters; i++) {
    const year = startYear + Math.floor((startQuarter + i - 1) / 4)
    const quarter = ((startQuarter + i - 1) % 4) + 1

    const randomChange = (Math.random() - 0.5) * 2 * volatility
    currentPrice = currentPrice * (1 + trend / 4 + randomChange)

    const txCount = Math.floor(50 + Math.random() * 80)

    history.push({
      date: `${year}-Q${quarter}`,
      avgPricePerSqft: Math.round(currentPrice),
      medianPricePerSqft: Math.round(currentPrice * 0.95),
      transactionCount: txCount,
      totalValue: Math.round(currentPrice * txCount * 80 * 10.764),
    })
  }

  return history
}

// Helper to generate room distribution
function generateRoomDistribution(totalTx: number, avgPrice: number, avgPsf: number): RoomDistribution[] {
  const distributions = [
    { rooms: 'Studio', pct: 0.12, sizeMult: 0.4, priceMult: 0.45 },
    { rooms: '1BR', pct: 0.38, sizeMult: 0.75, priceMult: 0.65 },
    { rooms: '2BR', pct: 0.32, sizeMult: 1.1, priceMult: 1.0 },
    { rooms: '3BR', pct: 0.14, sizeMult: 1.6, priceMult: 1.5 },
    { rooms: 'Penthouse', pct: 0.04, sizeMult: 3.0, priceMult: 3.5 },
  ]

  const avgSize = 80

  return distributions.map(d => ({
    rooms: d.rooms as RoomDistribution['rooms'],
    count: Math.round(totalTx * d.pct),
    percentage: Math.round(d.pct * 100),
    avgPrice: Math.round(avgPrice * d.priceMult),
    avgSize: Math.round(avgSize * d.sizeMult),
    avgPricePerSqft: Math.round(avgPsf * (0.9 + Math.random() * 0.2)),
  }))
}

// Helper to generate transactions
function generateTransactions(
  buildingName: string,
  count: number,
  avgPrice: number,
  avgPsf: number
): Transaction[] {
  const transactions: Transaction[] = []
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

    transactions.push({
      id: `tx-${buildingName.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      date: date.toISOString().split('T')[0],
      price,
      pricePerSqft,
      size,
      propertyType: room === 'Penthouse' ? 'Penthouse' : 'Apartment',
      rooms: room,
      building: buildingName,
    })
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Mock Buildings Data
export const mockBuildings: BuildingDetail[] = [
  // Binghatti Skyrise Buildings
  {
    id: 'skyrise-tower-a',
    name: 'Skyrise Tower A',
    nameAr: 'سكاي رايز برج أ',
    projectId: 'binghatti-skyrise',
    projectName: 'Binghatti Skyrise',
    areaId: '273',
    areaName: 'Business Bay',
    developerId: 'BINGHATTI',
    developerName: 'Binghatti Group',
    stats: {
      avgPricePerSqft: 2700,
      medianPricePerSqft: 2580,
      avgTransactionValue: 2150000,
      transactionCount: 1600,
      totalValue: 3440000000,
      yoyPriceChange: 5.8,
    },
    priceHistory: generatePriceHistory(2700, 12, 0.03, 0.025),
    recentTransactions: generateTransactions('Skyrise Tower A', 40, 2150000, 2700),
    totalTransactions: 1600,
    roomDistribution: generateRoomDistribution(1600, 2150000, 2700),
    nearestLandmark: 'Burj Khalifa',
    nearestMetro: 'Business Bay Metro Station',
    nearestMall: 'Dubai Mall',
    dataAvailable: ['sales'],
  },
  {
    id: 'skyrise-tower-b',
    name: 'Skyrise Tower B',
    nameAr: 'سكاي رايز برج ب',
    projectId: 'binghatti-skyrise',
    projectName: 'Binghatti Skyrise',
    areaId: '273',
    areaName: 'Business Bay',
    developerId: 'BINGHATTI',
    developerName: 'Binghatti Group',
    stats: {
      avgPricePerSqft: 2612,
      medianPricePerSqft: 2500,
      avgTransactionValue: 1980000,
      transactionCount: 1622,
      totalValue: 3211560000,
      yoyPriceChange: 4.9,
    },
    priceHistory: generatePriceHistory(2612, 12, 0.028, 0.022),
    recentTransactions: generateTransactions('Skyrise Tower B', 40, 1980000, 2612),
    totalTransactions: 1622,
    roomDistribution: generateRoomDistribution(1622, 1980000, 2612),
    nearestLandmark: 'Burj Khalifa',
    nearestMetro: 'Business Bay Metro Station',
    nearestMall: 'Dubai Mall',
    dataAvailable: ['sales'],
  },

  // Binghatti Aquarise Building
  {
    id: 'aquarise-residence',
    name: 'Aquarise Residence',
    nameAr: 'أكوارايز ريزيدنس',
    projectId: 'binghatti-aquarise',
    projectName: 'Binghatti Aquarise',
    areaId: '273',
    areaName: 'Business Bay',
    developerId: 'BINGHATTI',
    developerName: 'Binghatti Group',
    stats: {
      avgPricePerSqft: 2624,
      medianPricePerSqft: 2480,
      avgTransactionValue: 2461770,
      transactionCount: 1084,
      totalValue: 2668558680,
      yoyPriceChange: 6.8,
    },
    priceHistory: generatePriceHistory(2624, 12, 0.032, 0.028),
    recentTransactions: generateTransactions('Aquarise Residence', 40, 2461770, 2624),
    totalTransactions: 1084,
    roomDistribution: generateRoomDistribution(1084, 2461770, 2624),
    nearestLandmark: 'Dubai Canal',
    nearestMetro: 'Business Bay Metro Station',
    nearestMall: 'Bay Avenue Mall',
    dataAvailable: ['sales'],
  },

  // JVC Buildings
  {
    id: 'corner-tower-1',
    name: 'Corner Tower 1',
    nameAr: 'كورنر تاور 1',
    projectId: 'binghatti-corner',
    projectName: 'Binghatti Corner',
    areaId: '128',
    areaName: 'Al Barsha South Fourth',
    developerId: 'BINGHATTI',
    developerName: 'Binghatti Group',
    stats: {
      avgPricePerSqft: 1010,
      medianPricePerSqft: 980,
      avgTransactionValue: 990000,
      transactionCount: 620,
      totalValue: 613800000,
      yoyPriceChange: 13.2,
    },
    priceHistory: generatePriceHistory(1010, 12, 0.04, 0.035),
    recentTransactions: generateTransactions('Corner Tower 1', 35, 990000, 1010),
    totalTransactions: 620,
    roomDistribution: generateRoomDistribution(620, 990000, 1010),
    nearestLandmark: 'Circle Mall',
    nearestMall: 'Circle Mall',
    dataAvailable: ['sales', 'rental'],
  },
  {
    id: 'corner-tower-2',
    name: 'Corner Tower 2',
    nameAr: 'كورنر تاور 2',
    projectId: 'binghatti-corner',
    projectName: 'Binghatti Corner',
    areaId: '128',
    areaName: 'Al Barsha South Fourth',
    developerId: 'BINGHATTI',
    developerName: 'Binghatti Group',
    stats: {
      avgPricePerSqft: 988,
      medianPricePerSqft: 960,
      avgTransactionValue: 972000,
      transactionCount: 621,
      totalValue: 603612000,
      yoyPriceChange: 12.5,
    },
    priceHistory: generatePriceHistory(988, 12, 0.042, 0.034),
    recentTransactions: generateTransactions('Corner Tower 2', 35, 972000, 988),
    totalTransactions: 621,
    roomDistribution: generateRoomDistribution(621, 972000, 988),
    nearestLandmark: 'Circle Mall',
    nearestMall: 'Circle Mall',
    dataAvailable: ['sales', 'rental'],
  },

  // Amber Buildings
  {
    id: 'amber-building-a',
    name: 'Amber Building A',
    nameAr: 'أمبر بناية أ',
    projectId: 'binghatti-amber',
    projectName: 'Binghatti Amber',
    areaId: '128',
    areaName: 'Al Barsha South Fourth',
    developerId: 'BINGHATTI',
    developerName: 'Binghatti Group',
    stats: {
      avgPricePerSqft: 1150,
      medianPricePerSqft: 1100,
      avgTransactionValue: 1005000,
      transactionCount: 485,
      totalValue: 487425000,
      yoyPriceChange: 15.5,
    },
    priceHistory: generatePriceHistory(1150, 12, 0.035, 0.04),
    recentTransactions: generateTransactions('Amber Building A', 30, 1005000, 1150),
    totalTransactions: 485,
    roomDistribution: generateRoomDistribution(485, 1005000, 1150),
    nearestLandmark: 'JVC Community Park',
    nearestMall: 'Circle Mall',
    dataAvailable: ['sales', 'rental'],
  },
  {
    id: 'amber-building-b',
    name: 'Amber Building B',
    nameAr: 'أمبر بناية ب',
    projectId: 'binghatti-amber',
    projectName: 'Binghatti Amber',
    areaId: '128',
    areaName: 'Al Barsha South Fourth',
    developerId: 'BINGHATTI',
    developerName: 'Binghatti Group',
    stats: {
      avgPricePerSqft: 1140,
      medianPricePerSqft: 1090,
      avgTransactionValue: 991800,
      transactionCount: 485,
      totalValue: 481023000,
      yoyPriceChange: 14.9,
    },
    priceHistory: generatePriceHistory(1140, 12, 0.036, 0.039),
    recentTransactions: generateTransactions('Amber Building B', 30, 991800, 1140),
    totalTransactions: 485,
    roomDistribution: generateRoomDistribution(485, 991800, 1140),
    nearestLandmark: 'JVC Community Park',
    nearestMall: 'Circle Mall',
    dataAvailable: ['sales', 'rental'],
  },

  // Al Jadaf Buildings
  {
    id: 'avenue-tower',
    name: 'Avenue Tower',
    nameAr: 'أفينيو تاور',
    projectId: 'binghatti-avenue',
    projectName: 'Binghatti Avenue',
    areaId: '567',
    areaName: 'Al Jadaf',
    developerId: 'BINGHATTI',
    developerName: 'Binghatti Group',
    stats: {
      avgPricePerSqft: 907,
      medianPricePerSqft: 870,
      avgTransactionValue: 1153132,
      transactionCount: 1072,
      totalValue: 1236157504,
      yoyPriceChange: 22.5,
    },
    priceHistory: generatePriceHistory(907, 12, 0.05, 0.055),
    recentTransactions: generateTransactions('Avenue Tower', 40, 1153132, 907),
    totalTransactions: 1072,
    roomDistribution: generateRoomDistribution(1072, 1153132, 907),
    nearestLandmark: 'Dubai Festival City',
    nearestMetro: 'Creek Metro Station',
    nearestMall: 'Dubai Festival City Mall',
    dataAvailable: ['sales'],
  },
  {
    id: 'ghost-residence',
    name: 'Ghost Residence',
    nameAr: 'غوست ريزيدنس',
    projectId: 'binghatti-ghost',
    projectName: 'Binghatti Ghost',
    areaId: '567',
    areaName: 'Al Jadaf',
    developerId: 'BINGHATTI',
    developerName: 'Binghatti Group',
    stats: {
      avgPricePerSqft: 1978,
      medianPricePerSqft: 1850,
      avgTransactionValue: 1393333,
      transactionCount: 661,
      totalValue: 921033213,
      yoyPriceChange: 8.2,
    },
    priceHistory: generatePriceHistory(1978, 10, 0.03, 0.025),
    recentTransactions: generateTransactions('Ghost Residence', 35, 1393333, 1978),
    totalTransactions: 661,
    roomDistribution: generateRoomDistribution(661, 1393333, 1978),
    nearestLandmark: 'Dubai Creek Harbour',
    nearestMetro: 'Creek Metro Station',
    nearestMall: 'Dubai Festival City Mall',
    dataAvailable: ['sales'],
  },

  // Downtown Buildings
  {
    id: 'burj-khalifa-tower',
    name: 'Burj Khalifa Tower',
    nameAr: 'برج خليفة',
    projectId: 'burj-khalifa',
    projectName: 'Burj Khalifa',
    areaId: '784',
    areaName: 'Downtown Dubai',
    developerId: 'EMAAR',
    developerName: 'Emaar Properties',
    stats: {
      avgPricePerSqft: 4200,
      medianPricePerSqft: 4000,
      avgTransactionValue: 8500000,
      transactionCount: 450,
      totalValue: 3825000000,
      yoyPriceChange: 6.5,
    },
    priceHistory: generatePriceHistory(4200, 12, 0.02, 0.018),
    recentTransactions: generateTransactions('Burj Khalifa Tower', 30, 8500000, 4200),
    totalTransactions: 450,
    roomDistribution: [
      { rooms: '1BR', count: 85, percentage: 19, avgPrice: 4500000, avgSize: 85, avgPricePerSqft: 4915 },
      { rooms: '2BR', count: 180, percentage: 40, avgPrice: 7200000, avgSize: 140, avgPricePerSqft: 4776 },
      { rooms: '3BR', count: 135, percentage: 30, avgPrice: 12500000, avgSize: 220, avgPricePerSqft: 5276 },
      { rooms: 'Penthouse', count: 50, percentage: 11, avgPrice: 45000000, avgSize: 550, avgPricePerSqft: 7597 },
    ],
    nearestLandmark: 'Dubai Fountain',
    nearestMetro: 'Burj Khalifa/Dubai Mall Metro',
    nearestMall: 'Dubai Mall',
    dataAvailable: ['sales', 'rental'],
  },

  // Palm Buildings
  {
    id: 'atlantis-royal-tower',
    name: 'Atlantis Royal Tower',
    nameAr: 'أتلانتس رويال تاور',
    projectId: 'atlantis-residences',
    projectName: 'Atlantis The Royal Residences',
    areaId: '892',
    areaName: 'Palm Jumeirah',
    developerId: 'NAKHEEL',
    developerName: 'Nakheel',
    stats: {
      avgPricePerSqft: 5600,
      medianPricePerSqft: 5200,
      avgTransactionValue: 18500000,
      transactionCount: 120,
      totalValue: 2220000000,
      yoyPriceChange: 12.8,
    },
    priceHistory: generatePriceHistory(5600, 12, 0.025, 0.03),
    recentTransactions: generateTransactions('Atlantis Royal Tower', 25, 18500000, 5600),
    totalTransactions: 120,
    roomDistribution: [
      { rooms: '2BR', count: 35, percentage: 29, avgPrice: 12000000, avgSize: 165, avgPricePerSqft: 6752 },
      { rooms: '3BR', count: 50, percentage: 42, avgPrice: 18000000, avgSize: 250, avgPricePerSqft: 6684 },
      { rooms: 'Penthouse', count: 35, percentage: 29, avgPrice: 45000000, avgSize: 500, avgPricePerSqft: 8356 },
    ],
    nearestLandmark: 'Atlantis The Royal',
    nearestMall: 'Nakheel Mall',
    dataAvailable: ['sales'],
  },

  // Mercedes Building
  {
    id: 'mercedes-tower',
    name: 'Mercedes-Benz Tower',
    nameAr: 'برج مرسيدس بنز',
    projectId: 'binghatti-mercedes',
    projectName: 'Binghatti Mercedes-Benz Places',
    areaId: '273',
    areaName: 'Business Bay',
    developerId: 'BINGHATTI',
    developerName: 'Binghatti Group',
    stats: {
      avgPricePerSqft: 3200,
      medianPricePerSqft: 3050,
      avgTransactionValue: 4500000,
      transactionCount: 85,
      totalValue: 382500000,
      yoyPriceChange: null,
    },
    priceHistory: generatePriceHistory(3200, 4, 0.02, 0.01),
    recentTransactions: generateTransactions('Mercedes-Benz Tower', 20, 4500000, 3200),
    totalTransactions: 85,
    roomDistribution: [
      { rooms: '1BR', count: 15, percentage: 18, avgPrice: 2800000, avgSize: 75, avgPricePerSqft: 3467 },
      { rooms: '2BR', count: 35, percentage: 41, avgPrice: 4200000, avgSize: 110, avgPricePerSqft: 3545 },
      { rooms: '3BR', count: 25, percentage: 29, avgPrice: 6500000, avgSize: 165, avgPricePerSqft: 3657 },
      { rooms: 'Penthouse', count: 10, percentage: 12, avgPrice: 15000000, avgSize: 350, avgPricePerSqft: 3980 },
    ],
    nearestLandmark: 'Burj Khalifa',
    nearestMetro: 'Business Bay Metro Station',
    nearestMall: 'Dubai Mall',
    dataAvailable: ['sales'],
  },
]

// Search helper
export function searchBuildings(query: string): BuildingDetail[] {
  const lowerQuery = query.toLowerCase()
  return mockBuildings.filter(
    building =>
      building.name.toLowerCase().includes(lowerQuery) ||
      building.nameAr.includes(query) ||
      building.projectName.toLowerCase().includes(lowerQuery) ||
      building.areaName.toLowerCase().includes(lowerQuery) ||
      building.id === query
  )
}

// Get building by ID
export function getBuildingById(id: string): BuildingDetail | undefined {
  return mockBuildings.find(building => building.id === id)
}

// Get buildings by project
export function getBuildingsByProject(projectId: string): BuildingDetail[] {
  return mockBuildings.filter(building => building.projectId === projectId)
}

// Get buildings by area
export function getBuildingsByArea(areaId: string): BuildingDetail[] {
  return mockBuildings.filter(building => building.areaId === areaId)
}
