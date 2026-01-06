import type { ProjectDetail, Transaction, PricePoint, RoomDistribution, BuildingSummary, RegistrationType } from '../types'

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

    const txCount = Math.floor(150 + Math.random() * 150)

    history.push({
      date: `${year}-Q${quarter}`,
      avgPricePerSqft: Math.round(currentPrice),
      medianPricePerSqft: Math.round(currentPrice * 0.95),
      transactionCount: txCount,
      totalValue: Math.round(currentPrice * txCount * 75 * 10.764),
    })
  }

  return history
}

// Helper to generate room distribution
function generateRoomDistribution(totalTx: number, avgPrice: number, avgPsf: number): RoomDistribution[] {
  const distributions = [
    { rooms: 'Studio', pct: 0.15, sizeMult: 0.4, priceMult: 0.45 },
    { rooms: '1BR', pct: 0.35, sizeMult: 0.75, priceMult: 0.65 },
    { rooms: '2BR', pct: 0.30, sizeMult: 1.1, priceMult: 1.0 },
    { rooms: '3BR', pct: 0.15, sizeMult: 1.6, priceMult: 1.5 },
    { rooms: 'Penthouse', pct: 0.05, sizeMult: 3.0, priceMult: 3.5 },
  ]

  const avgSize = 85 // sqm base

  return distributions.map(d => ({
    rooms: d.rooms as RoomDistribution['rooms'],
    count: Math.round(totalTx * d.pct),
    percentage: Math.round(d.pct * 100),
    avgPrice: Math.round(avgPrice * d.priceMult),
    avgSize: Math.round(avgSize * d.sizeMult),
    avgPricePerSqft: Math.round(avgPsf * (0.9 + Math.random() * 0.2)),
  }))
}

// Helper to generate transactions with full details
function generateTransactions(
  projectName: string,
  count: number,
  avgPrice: number,
  avgPsf: number,
  areaName?: string
): Transaction[] {
  const transactions: Transaction[] = []
  const buildings = ['Tower A', 'Tower B', 'Tower C', 'Building 1', 'Building 2']
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

  // Registration types with realistic distribution
  const regTypes: RegistrationType[] = ['Off Plan', 'Ready', 'Resale']
  const regTypeWeights = [0.45, 0.35, 0.20] // 45% off-plan, 35% ready, 20% resale

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

    // Determine registration type with weighted random selection
    const rand = Math.random()
    let regType: RegistrationType
    if (rand < regTypeWeights[0]) {
      regType = 'Off Plan'
    } else if (rand < regTypeWeights[0] + regTypeWeights[1]) {
      regType = 'Ready'
    } else {
      regType = 'Resale'
    }

    // Generate resale-specific data
    let resaleCount: number | undefined
    let prevSalePrice: number | undefined
    let priceChangePct: number | undefined
    let daysSincePrevSale: number | undefined
    let isResale: boolean = false
    let isFirstSale: boolean = regType === 'Off Plan'
    let saleSequence: number = 1
    let sellerType: 'Developer' | 'Individual' = 'Developer'
    let completionPct: number | undefined
    let procedureName: string = 'Sell'

    // Off Plan gets completion percentage and Pre-Reg procedure
    if (regType === 'Off Plan') {
      completionPct = Math.floor(15 + Math.random() * 70) // 15-85%
      procedureName = 'Sell - Pre registration'
    }

    if (regType === 'Resale') {
      isResale = true
      isFirstSale = false
      resaleCount = Math.floor(Math.random() * 2) + 1 // 1-2 times resold
      saleSequence = resaleCount + 1
      sellerType = 'Individual'
      const priceChangePercent = (Math.random() - 0.3) * 40 // -12% to +28%
      priceChangePct = Math.round(priceChangePercent * 10) / 10
      prevSalePrice = Math.round(price / (1 + priceChangePct / 100))
      daysSincePrevSale = Math.floor(Math.random() * 1500) + 180 // 6 months to 5 years
    }

    // Generate rental yield (for ready/completed units)
    let rentalYield: number | undefined
    let estimatedRent: number | undefined
    if (regType === 'Ready' || (regType === 'Resale' && Math.random() > 0.5)) {
      rentalYield = 4.5 + Math.random() * 3.5 // 4.5% to 8% yield
      rentalYield = Math.round(rentalYield * 10) / 10
      estimatedRent = Math.round(price * (rentalYield / 100))
    }

    // Generate floor and unit number
    const floor = Math.floor(Math.random() * 40) + 1
    const unitNumber = `${floor}${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}`

    transactions.push({
      id: `tx-${projectName.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      date: date.toISOString().split('T')[0],
      price,
      pricePerSqft,
      size,
      propertyType: room === 'Penthouse' ? 'Penthouse' : 'Apartment',
      rooms: room,
      building: buildings[Math.floor(Math.random() * buildings.length)],
      project: projectName,
      area: areaName,

      // New fields
      regType,
      completionPct,
      procedureName,
      usageType: 'Residential',
      isFreehold: Math.random() > 0.1, // 90% freehold
      floor,
      unitNumber,

      // Resale tracking
      isFirstSale,
      isResale,
      saleSequence,
      resaleCount,
      sellerType,
      prevSalePrice,
      priceChangePct,
      daysSincePrevSale,

      // Investment metrics
      rentalYield,
      estimatedRent,
    })
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Mock Projects Data - Based on actual RDS Binghatti data
export const mockProjects: ProjectDetail[] = [
  // Business Bay Projects
  {
    id: 'binghatti-skyrise',
    name: 'Binghatti Skyrise',
    nameAr: 'بن غاطي سكاي رايز',
    areaId: '273',
    areaName: 'Business Bay',
    developerId: 'BINGHATTI',
    developerName: 'Binghatti Group',
    developerTier: 'TIER_1',
    status: 'Under Construction',
    completionPct: 72,
    startDate: '2022-03-15',
    endDate: '2025-06-30',
    stats: {
      avgPricePerSqft: 2656,
      medianPricePerSqft: 2500,
      avgTransactionValue: 1962377,
      transactionCount: 3222,
      totalValue: 6324940000,
      yoyPriceChange: 5.2,
      qoqPriceChange: 1.8,
      yoyVolumeChange: 18.4,
      yoyTransactionChange: 12.3,
      marketPosition: 17.6, // 17.6% above area average
    },
    avgRentalYield: 5.8,
    yoyYieldChange: -0.3,
    priceHistory: generatePriceHistory(2656, 12, 0.03, 0.025),
    recentTransactions: generateTransactions('Binghatti Skyrise', 50, 1962377, 2656, 'Business Bay'),
    totalTransactions: 3222,
    roomDistribution: generateRoomDistribution(3222, 1962377, 2656),
    serviceCharges: { avgPerSqft: 18.5, min: 15, max: 25 },
    buildings: [
      { id: 'skyrise-a', name: 'Skyrise Tower A', transactionCount: 1600, avgPricePerSqft: 2700 },
      { id: 'skyrise-b', name: 'Skyrise Tower B', transactionCount: 1622, avgPricePerSqft: 2612 },
    ],
    nearestLandmark: 'Burj Khalifa',
    nearestMetro: 'Business Bay Metro Station',
    nearestMall: 'Dubai Mall',
    dataAvailable: ['sales'],
  },
  {
    id: 'binghatti-aquarise',
    name: 'Binghatti Aquarise',
    nameAr: 'بن غاطي أكوارايز',
    areaId: '273',
    areaName: 'Business Bay',
    developerId: 'BINGHATTI',
    developerName: 'Binghatti Group',
    developerTier: 'TIER_1',
    status: 'Under Construction',
    completionPct: 58,
    startDate: '2022-08-01',
    endDate: '2025-12-31',
    stats: {
      avgPricePerSqft: 2624,
      medianPricePerSqft: 2450,
      avgTransactionValue: 2461770,
      transactionCount: 1084,
      totalValue: 2668558680,
      yoyPriceChange: 6.8,
      qoqPriceChange: 2.2,
      yoyVolumeChange: 22.1,
      yoyTransactionChange: 15.8,
      marketPosition: 16.2,
    },
    avgRentalYield: 5.4,
    yoyYieldChange: -0.5,
    priceHistory: generatePriceHistory(2624, 12, 0.035, 0.028),
    recentTransactions: generateTransactions('Binghatti Aquarise', 50, 2461770, 2624, 'Business Bay'),
    totalTransactions: 1084,
    roomDistribution: generateRoomDistribution(1084, 2461770, 2624),
    serviceCharges: { avgPerSqft: 19.0, min: 16, max: 26 },
    buildings: [
      { id: 'aquarise-1', name: 'Aquarise Tower', transactionCount: 1084, avgPricePerSqft: 2624 },
    ],
    nearestLandmark: 'Dubai Canal',
    nearestMetro: 'Business Bay Metro Station',
    nearestMall: 'Bay Avenue Mall',
    dataAvailable: ['sales'],
  },
  {
    id: 'binghatti-skyhall',
    name: 'Binghatti Skyhall',
    nameAr: 'بن غاطي سكاي هول',
    areaId: '273',
    areaName: 'Business Bay',
    developerId: 'BINGHATTI',
    developerName: 'Binghatti Group',
    developerTier: 'TIER_1',
    status: 'Under Construction',
    completionPct: 45,
    startDate: '2023-01-15',
    endDate: '2026-06-30',
    stats: {
      avgPricePerSqft: 2573,
      medianPricePerSqft: 2400,
      avgTransactionValue: 1954354,
      transactionCount: 604,
      totalValue: 1180430216,
      yoyPriceChange: 4.5,
      qoqPriceChange: 1.5,
      yoyVolumeChange: 14.2,
      yoyTransactionChange: 9.5,
      marketPosition: 13.9,
    },
    avgRentalYield: 5.2,
    yoyYieldChange: -0.2,
    priceHistory: generatePriceHistory(2573, 10, 0.03, 0.022),
    recentTransactions: generateTransactions('Binghatti Skyhall', 40, 1954354, 2573),
    totalTransactions: 604,
    roomDistribution: generateRoomDistribution(604, 1954354, 2573),
    serviceCharges: { avgPerSqft: 17.5, min: 14, max: 24 },
    buildings: [
      { id: 'skyhall-1', name: 'Skyhall Tower', transactionCount: 604, avgPricePerSqft: 2573 },
    ],
    nearestLandmark: 'DIFC',
    nearestMetro: 'Business Bay Metro Station',
    nearestMall: 'Dubai Mall',
    dataAvailable: ['sales'],
  },

  // JVC (Al Barsha South Fourth) Projects
  {
    id: 'binghatti-corner',
    name: 'Binghatti Corner',
    nameAr: 'بن غاطي كورنر',
    areaId: '128',
    areaName: 'Al Barsha South Fourth',
    developerId: 'BINGHATTI',
    developerName: 'Binghatti Group',
    developerTier: 'TIER_1',
    status: 'Under Construction',
    completionPct: 85,
    startDate: '2021-06-01',
    endDate: '2024-12-31',
    stats: {
      avgPricePerSqft: 999,
      medianPricePerSqft: 950,
      avgTransactionValue: 981039,
      transactionCount: 1241,
      totalValue: 1217469000,
      yoyPriceChange: 12.8,
      qoqPriceChange: 4.2,
      yoyVolumeChange: 28.5,
      yoyTransactionChange: 18.2,
      marketPosition: -26.0, // Below area average (affordable segment)
    },
    avgRentalYield: 7.2,
    yoyYieldChange: 0.4,
    priceHistory: generatePriceHistory(999, 12, 0.04, 0.035),
    recentTransactions: generateTransactions('Binghatti Corner', 50, 981039, 999, 'Al Barsha South Fourth'),
    totalTransactions: 1241,
    roomDistribution: generateRoomDistribution(1241, 981039, 999),
    serviceCharges: { avgPerSqft: 12.0, min: 10, max: 15 },
    buildings: [
      { id: 'corner-1', name: 'Corner Tower 1', transactionCount: 620, avgPricePerSqft: 1010 },
      { id: 'corner-2', name: 'Corner Tower 2', transactionCount: 621, avgPricePerSqft: 988 },
    ],
    nearestLandmark: 'Circle Mall',
    nearestMetro: 'None (Bus service available)',
    nearestMall: 'Circle Mall',
    dataAvailable: ['sales', 'rental'],
  },
  {
    id: 'binghatti-amber',
    name: 'Binghatti Amber',
    nameAr: 'بن غاطي أمبر',
    areaId: '128',
    areaName: 'Al Barsha South Fourth',
    developerId: 'BINGHATTI',
    developerName: 'Binghatti Group',
    developerTier: 'TIER_1',
    status: 'Completed',
    completionPct: 100,
    startDate: '2019-03-01',
    endDate: '2022-06-30',
    stats: {
      avgPricePerSqft: 1145,
      medianPricePerSqft: 1100,
      avgTransactionValue: 998366,
      transactionCount: 970,
      totalValue: 968415020,
      yoyPriceChange: 15.2,
      qoqPriceChange: 3.8,
      yoyVolumeChange: 32.1,
      yoyTransactionChange: 22.5,
      marketPosition: -15.2,
    },
    avgRentalYield: 7.8,
    yoyYieldChange: 0.6,
    priceHistory: generatePriceHistory(1145, 12, 0.035, 0.04),
    recentTransactions: generateTransactions('Binghatti Amber', 50, 998366, 1145),
    totalTransactions: 970,
    roomDistribution: generateRoomDistribution(970, 998366, 1145),
    serviceCharges: { avgPerSqft: 11.5, min: 9, max: 14 },
    buildings: [
      { id: 'amber-a', name: 'Amber Building A', transactionCount: 485, avgPricePerSqft: 1150 },
      { id: 'amber-b', name: 'Amber Building B', transactionCount: 485, avgPricePerSqft: 1140 },
    ],
    nearestLandmark: 'JVC Community Park',
    nearestMall: 'Circle Mall',
    dataAvailable: ['sales', 'rental'],
  },
  {
    id: 'binghatti-azure',
    name: 'Binghatti Azure',
    nameAr: 'بن غاطي أزور',
    areaId: '128',
    areaName: 'Al Barsha South Fourth',
    developerId: 'BINGHATTI',
    developerName: 'Binghatti Group',
    developerTier: 'TIER_1',
    status: 'Completed',
    completionPct: 100,
    startDate: '2018-09-01',
    endDate: '2021-12-31',
    stats: {
      avgPricePerSqft: 1356,
      medianPricePerSqft: 1300,
      avgTransactionValue: 905158,
      transactionCount: 840,
      totalValue: 760332720,
      yoyPriceChange: 18.5,
      qoqPriceChange: 5.2,
      yoyVolumeChange: 35.8,
      yoyTransactionChange: 24.2,
      marketPosition: 0.4,
    },
    avgRentalYield: 7.5,
    yoyYieldChange: 0.3,
    priceHistory: generatePriceHistory(1356, 12, 0.04, 0.045),
    recentTransactions: generateTransactions('Binghatti Azure', 50, 905158, 1356),
    totalTransactions: 840,
    roomDistribution: generateRoomDistribution(840, 905158, 1356),
    serviceCharges: { avgPerSqft: 12.5, min: 10, max: 16 },
    buildings: [
      { id: 'azure-1', name: 'Azure Tower', transactionCount: 840, avgPricePerSqft: 1356 },
    ],
    nearestLandmark: 'JVC Community Park',
    nearestMall: 'Circle Mall',
    dataAvailable: ['sales', 'rental'],
  },
  {
    id: 'binghatti-circle',
    name: 'Binghatti Circle',
    nameAr: 'بن غاطي سيركل',
    areaId: '128',
    areaName: 'Al Barsha South Fourth',
    developerId: 'BINGHATTI',
    developerName: 'Binghatti Group',
    developerTier: 'TIER_1',
    status: 'Under Construction',
    completionPct: 65,
    startDate: '2022-01-15',
    endDate: '2025-09-30',
    stats: {
      avgPricePerSqft: 1653,
      medianPricePerSqft: 1580,
      avgTransactionValue: 1811422,
      transactionCount: 770,
      totalValue: 1394794940,
      yoyPriceChange: 8.5,
      qoqPriceChange: 2.8,
      yoyVolumeChange: 19.2,
      yoyTransactionChange: 11.5,
      marketPosition: 22.4,
    },
    avgRentalYield: 6.1,
    yoyYieldChange: -0.2,
    priceHistory: generatePriceHistory(1653, 12, 0.03, 0.025),
    recentTransactions: generateTransactions('Binghatti Circle', 50, 1811422, 1653),
    totalTransactions: 770,
    roomDistribution: generateRoomDistribution(770, 1811422, 1653),
    serviceCharges: { avgPerSqft: 14.0, min: 11, max: 18 },
    buildings: [
      { id: 'circle-1', name: 'Circle Tower', transactionCount: 770, avgPricePerSqft: 1653 },
    ],
    nearestLandmark: 'Circle Mall',
    nearestMall: 'Circle Mall',
    dataAvailable: ['sales'],
  },

  // Al Jadaf Projects
  {
    id: 'binghatti-avenue',
    name: 'Binghatti Avenue',
    nameAr: 'بن غاطي أفينيو',
    areaId: '567',
    areaName: 'Al Jadaf',
    developerId: 'BINGHATTI',
    developerName: 'Binghatti Group',
    developerTier: 'TIER_1',
    status: 'Under Construction',
    completionPct: 55,
    startDate: '2022-06-01',
    endDate: '2025-12-31',
    stats: {
      avgPricePerSqft: 907,
      medianPricePerSqft: 870,
      avgTransactionValue: 1153132,
      transactionCount: 1072,
      totalValue: 1236157504,
      yoyPriceChange: 22.5,
      qoqPriceChange: 7.2,
      yoyVolumeChange: 45.2,
      yoyTransactionChange: 32.8,
      marketPosition: -37.4,
    },
    avgRentalYield: 8.2,
    yoyYieldChange: 0.8,
    priceHistory: generatePriceHistory(907, 12, 0.05, 0.055),
    recentTransactions: generateTransactions('Binghatti Avenue', 50, 1153132, 907),
    totalTransactions: 1072,
    roomDistribution: generateRoomDistribution(1072, 1153132, 907),
    serviceCharges: { avgPerSqft: 10.0, min: 8, max: 13 },
    buildings: [
      { id: 'avenue-1', name: 'Avenue Tower', transactionCount: 1072, avgPricePerSqft: 907 },
    ],
    nearestLandmark: 'Dubai Festival City',
    nearestMetro: 'Creek Metro Station',
    nearestMall: 'Dubai Festival City Mall',
    dataAvailable: ['sales'],
  },
  {
    id: 'binghatti-ghost',
    name: 'Binghatti Ghost',
    nameAr: 'بن غاطي غوست',
    areaId: '567',
    areaName: 'Al Jadaf',
    developerId: 'BINGHATTI',
    developerName: 'Binghatti Group',
    developerTier: 'TIER_1',
    status: 'Under Construction',
    completionPct: 40,
    startDate: '2023-03-01',
    endDate: '2026-06-30',
    stats: {
      avgPricePerSqft: 1978,
      medianPricePerSqft: 1850,
      avgTransactionValue: 1393333,
      transactionCount: 661,
      totalValue: 921033213,
      yoyPriceChange: 8.2,
      qoqPriceChange: 2.5,
      yoyVolumeChange: 16.5,
      yoyTransactionChange: 8.8,
      marketPosition: 36.4,
    },
    avgRentalYield: 5.9,
    yoyYieldChange: -0.4,
    priceHistory: generatePriceHistory(1978, 10, 0.03, 0.025),
    recentTransactions: generateTransactions('Binghatti Ghost', 40, 1393333, 1978),
    totalTransactions: 661,
    roomDistribution: generateRoomDistribution(661, 1393333, 1978),
    serviceCharges: { avgPerSqft: 16.0, min: 13, max: 20 },
    buildings: [
      { id: 'ghost-1', name: 'Ghost Tower', transactionCount: 661, avgPricePerSqft: 1978 },
    ],
    nearestLandmark: 'Dubai Creek Harbour',
    nearestMetro: 'Creek Metro Station',
    nearestMall: 'Dubai Festival City Mall',
    dataAvailable: ['sales'],
  },

  // Hills area projects
  {
    id: 'binghatti-hills',
    name: 'Binghatti Hills',
    nameAr: 'بن غاطي هيلز',
    areaId: '129',
    areaName: 'Al Barsha South Second',
    developerId: 'BINGHATTI',
    developerName: 'Binghatti Group',
    developerTier: 'TIER_1',
    status: 'Completed',
    completionPct: 100,
    startDate: '2019-01-01',
    endDate: '2022-03-31',
    stats: {
      avgPricePerSqft: 1602,
      medianPricePerSqft: 1520,
      avgTransactionValue: 1520507,
      transactionCount: 1601,
      totalValue: 2434331607,
      yoyPriceChange: 14.2,
      qoqPriceChange: 4.5,
      yoyVolumeChange: 29.4,
      yoyTransactionChange: 19.8,
      marketPosition: 8.5,
    },
    avgRentalYield: 6.8,
    yoyYieldChange: 0.2,
    priceHistory: generatePriceHistory(1602, 12, 0.035, 0.038),
    recentTransactions: generateTransactions('Binghatti Hills', 50, 1520507, 1602),
    totalTransactions: 1601,
    roomDistribution: generateRoomDistribution(1601, 1520507, 1602),
    serviceCharges: { avgPerSqft: 13.0, min: 10, max: 17 },
    buildings: [
      { id: 'hills-a', name: 'Hills Tower A', transactionCount: 800, avgPricePerSqft: 1620 },
      { id: 'hills-b', name: 'Hills Tower B', transactionCount: 801, avgPricePerSqft: 1584 },
    ],
    nearestLandmark: 'Al Barsha Park',
    nearestMetro: 'Mall of the Emirates Metro',
    nearestMall: 'Mall of the Emirates',
    dataAvailable: ['sales', 'rental'],
  },
  {
    id: 'binghatti-elite',
    name: 'Binghatti Elite',
    nameAr: 'بن غاطي إيليت',
    areaId: '445',
    areaName: "Me'Aisem First",
    developerId: 'BINGHATTI',
    developerName: 'Binghatti Group',
    developerTier: 'TIER_1',
    status: 'Completed',
    completionPct: 100,
    startDate: '2018-06-01',
    endDate: '2021-09-30',
    stats: {
      avgPricePerSqft: 1562,
      medianPricePerSqft: 1480,
      avgTransactionValue: 708305,
      transactionCount: 1691,
      totalValue: 1197743755,
      yoyPriceChange: 10.8,
      qoqPriceChange: 3.2,
      yoyVolumeChange: 24.6,
      yoyTransactionChange: 16.2,
      marketPosition: 5.2,
    },
    avgRentalYield: 7.1,
    yoyYieldChange: 0.3,
    priceHistory: generatePriceHistory(1562, 12, 0.03, 0.03),
    recentTransactions: generateTransactions('Binghatti Elite', 50, 708305, 1562),
    totalTransactions: 1691,
    roomDistribution: generateRoomDistribution(1691, 708305, 1562),
    serviceCharges: { avgPerSqft: 11.0, min: 9, max: 14 },
    buildings: [
      { id: 'elite-1', name: 'Elite Tower 1', transactionCount: 845, avgPricePerSqft: 1570 },
      { id: 'elite-2', name: 'Elite Tower 2', transactionCount: 846, avgPricePerSqft: 1554 },
    ],
    nearestLandmark: 'Dubai Production City',
    nearestMall: 'Ibn Battuta Mall',
    dataAvailable: ['sales', 'rental'],
  },

  // Mercedes-Benz Places (upcoming/new project)
  {
    id: 'binghatti-mercedes',
    name: 'Binghatti Mercedes-Benz Places',
    nameAr: 'بن غاطي مرسيدس بنز بليسز',
    areaId: '273',
    areaName: 'Business Bay',
    developerId: 'BINGHATTI',
    developerName: 'Binghatti Group',
    developerTier: 'TIER_1',
    status: 'Not Started',
    completionPct: 0,
    startDate: '2025-01-01',
    endDate: '2028-12-31',
    stats: {
      avgPricePerSqft: 3200,
      medianPricePerSqft: 3050,
      avgTransactionValue: 4500000,
      transactionCount: 85,
      totalValue: 382500000,
      yoyPriceChange: null,
      qoqPriceChange: null,
      yoyVolumeChange: null,
      yoyTransactionChange: null,
      marketPosition: 41.7, // Premium positioning
    },
    avgRentalYield: undefined, // Not applicable for new off-plan
    yoyYieldChange: undefined,
    priceHistory: generatePriceHistory(3200, 4, 0.02, 0.01),
    recentTransactions: generateTransactions('Binghatti Mercedes-Benz Places', 20, 4500000, 3200),
    totalTransactions: 85,
    roomDistribution: [
      { rooms: '1BR', count: 15, percentage: 18, avgPrice: 2800000, avgSize: 75, avgPricePerSqft: 3467 },
      { rooms: '2BR', count: 35, percentage: 41, avgPrice: 4200000, avgSize: 110, avgPricePerSqft: 3545 },
      { rooms: '3BR', count: 25, percentage: 29, avgPrice: 6500000, avgSize: 165, avgPricePerSqft: 3657 },
      { rooms: 'Penthouse', count: 10, percentage: 12, avgPrice: 15000000, avgSize: 350, avgPricePerSqft: 3980 },
    ],
    serviceCharges: { avgPerSqft: 28.0, min: 24, max: 35 },
    buildings: [
      { id: 'mercedes-tower', name: 'Mercedes-Benz Tower', transactionCount: 85, avgPricePerSqft: 3200 },
    ],
    nearestLandmark: 'Burj Khalifa',
    nearestMetro: 'Business Bay Metro Station',
    nearestMall: 'Dubai Mall',
    dataAvailable: ['sales'],
  },
]

// Search helper
export function searchProjects(query: string): ProjectDetail[] {
  const lowerQuery = query.toLowerCase()
  return mockProjects.filter(
    project =>
      project.name.toLowerCase().includes(lowerQuery) ||
      project.nameAr.includes(query) ||
      project.areaName.toLowerCase().includes(lowerQuery) ||
      project.developerName.toLowerCase().includes(lowerQuery) ||
      project.id === query
  )
}

// Get project by ID
export function getProjectById(id: string): ProjectDetail | undefined {
  return mockProjects.find(project => project.id === id)
}

// Get projects by area
export function getProjectsByArea(areaId: string): ProjectDetail[] {
  return mockProjects.filter(project => project.areaId === areaId)
}

// Get projects by developer
export function getProjectsByDeveloper(developerId: string): ProjectDetail[] {
  return mockProjects.filter(project => project.developerId === developerId)
}
