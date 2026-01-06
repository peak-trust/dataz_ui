import type { AreaDetail, Transaction, PricePoint, ProjectSummary, DeveloperSummary, BuildingSummary } from '../types'

// Helper to generate quarterly price history
function generatePriceHistory(
  basePrice: number,
  quarters: number = 12,
  volatility: number = 0.03,
  trend: number = 0.02
): PricePoint[] {
  const history: PricePoint[] = []
  let currentPrice = basePrice * (1 - (quarters * trend) / 2) // Start lower to end at basePrice

  const startYear = 2022
  const startQuarter = 1

  for (let i = 0; i < quarters; i++) {
    const year = startYear + Math.floor((startQuarter + i - 1) / 4)
    const quarter = ((startQuarter + i - 1) % 4) + 1

    const randomChange = (Math.random() - 0.5) * 2 * volatility
    currentPrice = currentPrice * (1 + trend / 4 + randomChange)

    const txCount = Math.floor(400 + Math.random() * 300)

    history.push({
      date: `${year}-Q${quarter}`,
      avgPricePerSqft: Math.round(currentPrice),
      medianPricePerSqft: Math.round(currentPrice * 0.95),
      transactionCount: txCount,
      totalValue: Math.round(currentPrice * txCount * 85 * 10.764), // avg 85sqm
    })
  }

  return history
}

// Helper to generate recent transactions with resale data
function generateTransactions(
  areaName: string,
  count: number = 20,
  avgPrice: number = 1500000,
  avgPsf: number = 2000
): Transaction[] {
  const transactions: Transaction[] = []
  const buildings = ['Tower A', 'Tower B', 'Tower C', 'Residence 1', 'Residence 2']
  const rooms = ['Studio', '1BR', '2BR', '3BR', 'Penthouse'] as const
  const roomSizes: Record<string, [number, number]> = {
    'Studio': [30, 45],
    '1BR': [55, 75],
    '2BR': [85, 120],
    '3BR': [130, 180],
    'Penthouse': [200, 400],
  }
  const roomPriceMultiplier: Record<string, number> = {
    'Studio': 0.5,
    '1BR': 0.7,
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

    // Determine sale type: ~20% developer, ~30% 1x resale, ~25% 2x resale, ~15% 3x resale, ~10% 4x resale
    const rand = Math.random()
    let saleSequence: number
    let isResale: boolean
    let isFirstSale: boolean
    let prevSalePrice: number | undefined
    let prevSaleDate: string | undefined
    let priceChangePct: number | undefined
    let sellerType: 'Developer' | 'Individual'
    let regType: 'Off Plan' | 'Ready' | 'Resale'
    let completionPct: number | undefined
    let procedureName: string

    if (rand < 0.2) {
      // Developer sale (first sale)
      saleSequence = 1
      isResale = false
      isFirstSale = true
      sellerType = 'Developer'
      regType = Math.random() > 0.5 ? 'Off Plan' : 'Ready'
      // Off Plan gets completion percentage and Pre-Reg procedure
      if (regType === 'Off Plan') {
        completionPct = Math.floor(15 + Math.random() * 70) // 15-85%
        procedureName = 'Sell - Pre registration'
      } else {
        procedureName = 'Sell'
      }
    } else if (rand < 0.5) {
      // 1x resale
      saleSequence = 2
      isResale = true
      isFirstSale = false
      prevSalePrice = Math.round(price * (0.7 + Math.random() * 0.15)) // 15-30% appreciation
      const prevDate = new Date(date)
      prevDate.setFullYear(prevDate.getFullYear() - Math.floor(1 + Math.random() * 3)) // 1-3 years ago
      prevSaleDate = prevDate.toISOString().split('T')[0]
      priceChangePct = ((price - prevSalePrice) / prevSalePrice) * 100
      sellerType = 'Individual'
      regType = 'Ready' // Resales are existing properties
      procedureName = 'Sell'
    } else if (rand < 0.75) {
      // 2x resale
      saleSequence = 3
      isResale = true
      isFirstSale = false
      prevSalePrice = Math.round(price * (0.78 + Math.random() * 0.12)) // 10-22% appreciation from last sale
      const prevDate = new Date(date)
      prevDate.setFullYear(prevDate.getFullYear() - Math.floor(1 + Math.random() * 2)) // 1-2 years ago
      prevSaleDate = prevDate.toISOString().split('T')[0]
      priceChangePct = ((price - prevSalePrice) / prevSalePrice) * 100
      sellerType = 'Individual'
      regType = 'Ready' // Resales are existing properties
      procedureName = 'Sell'
    } else if (rand < 0.9) {
      // 3x resale
      saleSequence = 4
      isResale = true
      isFirstSale = false
      prevSalePrice = Math.round(price * (0.82 + Math.random() * 0.1)) // 8-18% appreciation from last sale
      const prevDate = new Date(date)
      prevDate.setFullYear(prevDate.getFullYear() - Math.floor(1 + Math.random() * 2)) // 1-2 years ago
      prevSaleDate = prevDate.toISOString().split('T')[0]
      priceChangePct = ((price - prevSalePrice) / prevSalePrice) * 100
      sellerType = 'Individual'
      regType = 'Ready' // Resales are existing properties
      procedureName = 'Sell'
    } else {
      // 4x resale
      saleSequence = 5
      isResale = true
      isFirstSale = false
      prevSalePrice = Math.round(price * (0.85 + Math.random() * 0.08)) // 7-15% appreciation from last sale
      const prevDate = new Date(date)
      prevDate.setFullYear(prevDate.getFullYear() - Math.floor(1 + Math.random() * 1.5)) // 1-1.5 years ago
      prevSaleDate = prevDate.toISOString().split('T')[0]
      priceChangePct = ((price - prevSalePrice) / prevSalePrice) * 100
      sellerType = 'Individual'
      regType = 'Ready' // Resales are existing properties
      procedureName = 'Sell'
    }

    transactions.push({
      id: `tx-${areaName.toLowerCase().replace(/\s+/g, '-')}-${i}`,
      date: date.toISOString().split('T')[0],
      price,
      pricePerSqft,
      size,
      propertyType: room === 'Penthouse' ? 'Penthouse' : 'Apartment',
      rooms: room,
      building: buildings[Math.floor(Math.random() * buildings.length)],
      area: areaName,
      floor: Math.floor(5 + Math.random() * 40),
      isFreehold: Math.random() > 0.2,
      // Resale data
      saleSequence,
      isResale,
      isFirstSale,
      resaleCount: saleSequence - 1,
      prevSalePrice,
      prevSaleDate,
      priceChangePct,
      sellerType,
      regType,
      completionPct,
      procedureName,
      // Investment metrics - 70% have yield, 65% have rent estimate, 60% have service charges
      rentalYield: Math.random() > 0.3 ? 4.5 + Math.random() * 4 : undefined, // 4.5-8.5% yield
      estimatedRent: Math.random() > 0.35 ? Math.round(price * (0.055 + Math.random() * 0.025)) : undefined, // 5.5-8% of price
      serviceCharges: Math.random() > 0.4 ? 10 + Math.random() * 15 : undefined, // 10-25 per sqft
      // Market context
      areaAvgPsf: avgPsf,
      areaYoyChange: 5 + Math.random() * 15, // 5-20% YoY
      developerName: ['Binghatti', 'Emaar', 'DAMAC', 'Danube', 'Azizi'][Math.floor(Math.random() * 5)],
      developerTier: ['TIER_1', 'TIER_2', 'TIER_1', 'TIER_2', 'TIER_2'][Math.floor(Math.random() * 5)] as 'TIER_1' | 'TIER_2',
      projectStatus: isFirstSale ? (Math.random() > 0.5 ? 'Under Construction' : 'Completed') : 'Completed',
    })
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Mock Areas Data - Based on actual RDS data
export const mockAreas: AreaDetail[] = [
  {
    id: '273',
    name: 'Business Bay',
    nameAr: 'الخليج التجاري',
    centroid: { lat: 25.1850, lng: 55.2666 },
    hasGeometry: true,
    stats: {
      avgPricePerSqft: 2258,
      medianPricePerSqft: 2100,
      transactionCount: 3064,
      totalValue: 8500000000,
      avgTransactionValue: 2773000,
      yoyPriceChange: 2.99,
      qoqPriceChange: 1.2,
      yoyVolumeChange: 8.5,
      qoqVolumeChange: 3.2,
    },
    priceHistory: generatePriceHistory(2258, 12, 0.025, 0.025),
    recentTransactions: generateTransactions('Business Bay', 50, 2773000, 2258),
    totalTransactions: 3064,
    amenities: {
      schools: 8,
      healthcare: 12,
      metroStations: 2,
    },
    topProjects: [
      { id: 'binghatti-skyrise', name: 'Binghatti Skyrise', transactionCount: 3222, avgPricePerSqft: 2656, status: 'Under Construction' },
      { id: 'binghatti-aquarise', name: 'Binghatti Aquarise', transactionCount: 1084, avgPricePerSqft: 2624, status: 'Under Construction' },
      { id: 'binghatti-skyhall', name: 'Binghatti Skyhall', transactionCount: 604, avgPricePerSqft: 2573, status: 'Under Construction' },
      { id: 'damac-towers', name: 'DAMAC Towers', transactionCount: 520, avgPricePerSqft: 2100, status: 'Completed' },
      { id: 'bay-square', name: 'Bay Square', transactionCount: 480, avgPricePerSqft: 1950, status: 'Completed' },
    ],
    topDevelopers: [
      { id: 'BINGHATTI', name: 'Binghatti Group', tier: 'TIER_1', projectCount: 5 },
      { id: 'DAMAC', name: 'DAMAC Properties', tier: 'TIER_1', projectCount: 3 },
      { id: 'OMNIYAT', name: 'Omniyat', tier: 'TIER_2', projectCount: 2 },
    ],
    topBuildings: [
      { id: 'bldg-skyrise-a', name: 'Skyrise Tower A', transactionCount: 1200, avgPricePerSqft: 2700 },
      { id: 'bldg-skyrise-b', name: 'Skyrise Tower B', transactionCount: 1100, avgPricePerSqft: 2650 },
      { id: 'bldg-aquarise-1', name: 'Aquarise Residence', transactionCount: 800, avgPricePerSqft: 2600 },
    ],
    dataAvailable: ['sales', 'rental'],
  },
  {
    id: '128',
    name: 'Al Barsha South Fourth',
    nameAr: 'البرشاء جنوب الرابعة',
    centroid: { lat: 25.0657, lng: 55.2000 },
    hasGeometry: true,
    stats: {
      avgPricePerSqft: 1350,
      medianPricePerSqft: 1280,
      transactionCount: 8500,
      totalValue: 6200000000,
      avgTransactionValue: 729000,
      yoyPriceChange: 12.5,
      qoqPriceChange: 4.1,
      yoyVolumeChange: 22.3,
      qoqVolumeChange: 5.8,
    },
    priceHistory: generatePriceHistory(1350, 12, 0.04, 0.035),
    recentTransactions: generateTransactions('JVC', 50, 729000, 1350),
    totalTransactions: 8500,
    amenities: {
      schools: 15,
      healthcare: 8,
      metroStations: 0,
    },
    topProjects: [
      { id: 'binghatti-corner', name: 'Binghatti Corner', transactionCount: 1241, avgPricePerSqft: 999, status: 'Under Construction' },
      { id: 'binghatti-amber', name: 'Binghatti Amber', transactionCount: 970, avgPricePerSqft: 1145, status: 'Completed' },
      { id: 'binghatti-azure', name: 'Binghatti Azure', transactionCount: 840, avgPricePerSqft: 1356, status: 'Completed' },
      { id: 'binghatti-circle', name: 'Binghatti Circle', transactionCount: 770, avgPricePerSqft: 1653, status: 'Under Construction' },
      { id: 'binghatti-onyx', name: 'Binghatti Onyx', transactionCount: 745, avgPricePerSqft: 1214, status: 'Completed' },
    ],
    topDevelopers: [
      { id: 'BINGHATTI', name: 'Binghatti Group', tier: 'TIER_1', projectCount: 12 },
      { id: 'DANUBE', name: 'Danube Properties', tier: 'TIER_1', projectCount: 8 },
      { id: 'SAMANA', name: 'Samana Developers', tier: 'TIER_2', projectCount: 6 },
    ],
    topBuildings: [
      { id: 'bldg-corner-1', name: 'Corner Tower 1', transactionCount: 650, avgPricePerSqft: 1000 },
      { id: 'bldg-amber-a', name: 'Amber Building A', transactionCount: 500, avgPricePerSqft: 1150 },
    ],
    dataAvailable: ['sales', 'rental'],
  },
  {
    id: '784',
    name: 'Burj Khalifa',
    nameAr: 'برج خليفة',
    centroid: { lat: 25.1972, lng: 55.2744 },
    hasGeometry: true,
    stats: {
      avgPricePerSqft: 3100,
      medianPricePerSqft: 2900,
      transactionCount: 1850,
      totalValue: 12500000000,
      avgTransactionValue: 6756000,
      yoyPriceChange: 8.2,
      qoqPriceChange: 2.5,
      yoyVolumeChange: 5.1,
      qoqVolumeChange: 1.8,
    },
    priceHistory: generatePriceHistory(3100, 12, 0.02, 0.02),
    recentTransactions: generateTransactions('Downtown Dubai', 50, 6756000, 3100),
    totalTransactions: 1850,
    amenities: {
      schools: 5,
      healthcare: 10,
      metroStations: 2,
    },
    topProjects: [
      { id: 'burj-khalifa', name: 'Burj Khalifa', transactionCount: 450, avgPricePerSqft: 4200, status: 'Completed' },
      { id: 'address-downtown', name: 'Address Downtown', transactionCount: 380, avgPricePerSqft: 3500, status: 'Completed' },
      { id: 'boulevard-point', name: 'Boulevard Point', transactionCount: 320, avgPricePerSqft: 2800, status: 'Completed' },
    ],
    topDevelopers: [
      { id: 'EMAAR', name: 'Emaar Properties', tier: 'TIER_1', projectCount: 15 },
      { id: 'ADDRESS', name: 'Address Hotels', tier: 'TIER_1', projectCount: 3 },
    ],
    topBuildings: [
      { id: 'burj-khalifa-tower', name: 'Burj Khalifa Tower', transactionCount: 450, avgPricePerSqft: 4200 },
      { id: 'address-residence', name: 'Address Residence', transactionCount: 280, avgPricePerSqft: 3600 },
    ],
    dataAvailable: ['sales', 'rental'],
  },
  {
    id: '395',
    name: 'Dubai Marina',
    nameAr: 'دبي مارينا',
    centroid: { lat: 25.0805, lng: 55.1403 },
    hasGeometry: true,
    stats: {
      avgPricePerSqft: 1850,
      medianPricePerSqft: 1750,
      transactionCount: 4200,
      totalValue: 9800000000,
      avgTransactionValue: 2333000,
      yoyPriceChange: 6.8,
      qoqPriceChange: 1.9,
      yoyVolumeChange: 4.2,
      qoqVolumeChange: 0.8,
    },
    priceHistory: generatePriceHistory(1850, 12, 0.025, 0.02),
    recentTransactions: generateTransactions('Dubai Marina', 50, 2333000, 1850),
    totalTransactions: 4200,
    amenities: {
      schools: 6,
      healthcare: 8,
      metroStations: 2,
    },
    topProjects: [
      { id: 'marina-gate', name: 'Marina Gate', transactionCount: 650, avgPricePerSqft: 2100, status: 'Completed' },
      { id: 'damac-heights', name: 'DAMAC Heights', transactionCount: 520, avgPricePerSqft: 1900, status: 'Completed' },
      { id: 'cayan-tower', name: 'Cayan Tower', transactionCount: 480, avgPricePerSqft: 1800, status: 'Completed' },
    ],
    topDevelopers: [
      { id: 'EMAAR', name: 'Emaar Properties', tier: 'TIER_1', projectCount: 8 },
      { id: 'DAMAC', name: 'DAMAC Properties', tier: 'TIER_1', projectCount: 6 },
      { id: 'SELECT', name: 'Select Group', tier: 'TIER_2', projectCount: 4 },
    ],
    topBuildings: [
      { id: 'marina-gate-1', name: 'Marina Gate Tower 1', transactionCount: 350, avgPricePerSqft: 2150 },
      { id: 'cayan-infinity', name: 'Cayan Infinity Tower', transactionCount: 280, avgPricePerSqft: 1850 },
    ],
    dataAvailable: ['sales', 'rental'],
  },
  {
    id: '567',
    name: 'Al Jadaf',
    nameAr: 'الجداف',
    centroid: { lat: 25.2285, lng: 55.3387 },
    hasGeometry: true,
    stats: {
      avgPricePerSqft: 1450,
      medianPricePerSqft: 1380,
      transactionCount: 2800,
      totalValue: 4100000000,
      avgTransactionValue: 1464000,
      yoyPriceChange: 15.2,
      qoqPriceChange: 5.8,
      yoyVolumeChange: 28.5,
      qoqVolumeChange: 8.2,
    },
    priceHistory: generatePriceHistory(1450, 12, 0.035, 0.04),
    recentTransactions: generateTransactions('Al Jadaf', 50, 1464000, 1450),
    totalTransactions: 2800,
    amenities: {
      schools: 4,
      healthcare: 3,
      metroStations: 1,
    },
    topProjects: [
      { id: 'binghatti-avenue', name: 'Binghatti Avenue', transactionCount: 1072, avgPricePerSqft: 907, status: 'Under Construction' },
      { id: 'binghatti-ghost', name: 'Binghatti Ghost', transactionCount: 661, avgPricePerSqft: 1978, status: 'Under Construction' },
      { id: 'binghatti-creek', name: 'Binghatti Creek', transactionCount: 564, avgPricePerSqft: 1089, status: 'Under Construction' },
    ],
    topDevelopers: [
      { id: 'BINGHATTI', name: 'Binghatti Group', tier: 'TIER_1', projectCount: 4 },
      { id: 'AZIZI', name: 'Azizi Developments', tier: 'TIER_1', projectCount: 3 },
    ],
    topBuildings: [
      { id: 'avenue-tower', name: 'Avenue Tower', transactionCount: 600, avgPricePerSqft: 920 },
      { id: 'ghost-residence', name: 'Ghost Residence', transactionCount: 400, avgPricePerSqft: 2000 },
    ],
    dataAvailable: ['sales', 'rental'],
  },
  {
    id: '892',
    name: 'Palm Jumeirah',
    nameAr: 'نخلة جميرا',
    centroid: { lat: 25.1124, lng: 55.1390 },
    hasGeometry: true,
    stats: {
      avgPricePerSqft: 3500,
      medianPricePerSqft: 3200,
      transactionCount: 1200,
      totalValue: 15800000000,
      avgTransactionValue: 13166000,
      yoyPriceChange: 12.5,
      qoqPriceChange: 3.8,
      yoyVolumeChange: 6.2,
      qoqVolumeChange: 2.1,
    },
    priceHistory: generatePriceHistory(3500, 12, 0.03, 0.03),
    recentTransactions: generateTransactions('Palm Jumeirah', 50, 13166000, 3500),
    totalTransactions: 1200,
    amenities: {
      schools: 3,
      healthcare: 5,
      metroStations: 1,
    },
    topProjects: [
      { id: 'atlantis-residences', name: 'Atlantis The Royal Residences', transactionCount: 180, avgPricePerSqft: 5500, status: 'Completed' },
      { id: 'one-palm', name: 'One Palm', transactionCount: 150, avgPricePerSqft: 4800, status: 'Completed' },
      { id: 'raffles-palm', name: 'Raffles The Palm', transactionCount: 120, avgPricePerSqft: 4200, status: 'Completed' },
    ],
    topDevelopers: [
      { id: 'NAKHEEL', name: 'Nakheel', tier: 'TIER_1', projectCount: 12 },
      { id: 'OMNIYAT', name: 'Omniyat', tier: 'TIER_2', projectCount: 2 },
    ],
    topBuildings: [
      { id: 'atlantis-royal', name: 'Atlantis Royal Tower', transactionCount: 120, avgPricePerSqft: 5600 },
      { id: 'one-palm-tower', name: 'One Palm Tower', transactionCount: 100, avgPricePerSqft: 4900 },
    ],
    dataAvailable: ['sales', 'rental'],
  },
  {
    id: '445',
    name: 'Madinat Al Mataar',
    nameAr: 'مدينة المطار',
    centroid: { lat: 24.8960, lng: 55.1615 },
    hasGeometry: true,
    stats: {
      avgPricePerSqft: 950,
      medianPricePerSqft: 900,
      transactionCount: 3500,
      totalValue: 2800000000,
      avgTransactionValue: 800000,
      yoyPriceChange: 25.8,
      qoqPriceChange: 8.2,
      yoyVolumeChange: 45.2,
      qoqVolumeChange: 12.5,
    },
    priceHistory: generatePriceHistory(950, 12, 0.05, 0.06),
    recentTransactions: generateTransactions('Dubai South', 50, 800000, 950),
    totalTransactions: 3500,
    amenities: {
      schools: 2,
      healthcare: 2,
      metroStations: 0,
    },
    topProjects: [
      { id: 'mag-city', name: 'MAG City', transactionCount: 800, avgPricePerSqft: 920, status: 'Under Construction' },
      { id: 'emaar-south', name: 'Emaar South', transactionCount: 650, avgPricePerSqft: 980, status: 'Under Construction' },
    ],
    topDevelopers: [
      { id: 'EMAAR', name: 'Emaar Properties', tier: 'TIER_1', projectCount: 5 },
      { id: 'MAG', name: 'MAG Property Development', tier: 'TIER_2', projectCount: 4 },
    ],
    topBuildings: [
      { id: 'mag-tower-1', name: 'MAG Tower 1', transactionCount: 400, avgPricePerSqft: 930 },
    ],
    dataAvailable: ['sales'],
  },
  {
    id: '234',
    name: 'Jabal Ali First',
    nameAr: 'جبل علي الأولى',
    centroid: { lat: 25.0150, lng: 55.0280 },
    hasGeometry: true,
    stats: {
      avgPricePerSqft: 850,
      medianPricePerSqft: 800,
      transactionCount: 2100,
      totalValue: 1500000000,
      avgTransactionValue: 714000,
      yoyPriceChange: 18.5,
      qoqPriceChange: 6.2,
      yoyVolumeChange: 35.8,
      qoqVolumeChange: 9.5,
    },
    priceHistory: generatePriceHistory(850, 12, 0.045, 0.05),
    recentTransactions: generateTransactions('Jabal Ali', 50, 714000, 850),
    totalTransactions: 2100,
    amenities: {
      schools: 3,
      healthcare: 2,
      metroStations: 1,
    },
    topProjects: [
      { id: 'danube-elitz', name: 'Danube Elitz', transactionCount: 450, avgPricePerSqft: 870, status: 'Under Construction' },
      { id: 'azizi-riviera', name: 'Azizi Riviera', transactionCount: 380, avgPricePerSqft: 820, status: 'Under Construction' },
    ],
    topDevelopers: [
      { id: 'DANUBE', name: 'Danube Properties', tier: 'TIER_1', projectCount: 6 },
      { id: 'AZIZI', name: 'Azizi Developments', tier: 'TIER_1', projectCount: 4 },
    ],
    topBuildings: [
      { id: 'elitz-tower', name: 'Elitz Tower', transactionCount: 250, avgPricePerSqft: 880 },
    ],
    dataAvailable: ['sales'],
  },
]

// Search helper
export function searchAreas(query: string): AreaDetail[] {
  const lowerQuery = query.toLowerCase()
  return mockAreas.filter(
    area =>
      area.name.toLowerCase().includes(lowerQuery) ||
      area.nameAr.includes(query) ||
      area.id === query
  )
}

// Get area by ID
export function getAreaById(id: string): AreaDetail | undefined {
  return mockAreas.find(area => area.id === id)
}
