// Analytics Types - Dubai Real Estate Dashboard
// Based on gold_transactions, precalc_* tables schema

// ============ ENUMS & CONSTANTS ============
export type EntityType = 'area' | 'project' | 'developer' | 'building'
export type DataMode = 'sales' | 'rental'
export type DeveloperTier = 'TIER_1' | 'TIER_2' | 'TIER_3' | 'TIER_4'
export type ProjectStatus = 'Completed' | 'Under Construction' | 'Not Started' | 'Pending'
export type TrendDirection = 'up' | 'down' | 'stable'
export type Momentum = 'accelerating' | 'decelerating' | 'stable'
export type Timeframe = '1M' | '3M' | '6M' | '1Y' | '2Y' | '3Y' | '5Y' | 'ALL'

export const ROOM_TYPES = ['Studio', '1BR', '2BR', '3BR', '4BR', '5BR+', 'Penthouse'] as const
export type RoomType = typeof ROOM_TYPES[number]

export const PROPERTY_TYPES = ['Apartment', 'Villa', 'Townhouse', 'Penthouse', 'Land', 'Office', 'Retail'] as const
export type PropertyType = typeof PROPERTY_TYPES[number]

// ============ SEARCH ============
export interface SearchResult {
  id: string
  type: EntityType
  name: string
  nameAr?: string
  subtitle: string // e.g., "Business Bay" for project, "12 projects" for developer
  transactionCount: number
  avgPricePerSqft: number
  dataAvailable: DataMode[]
}

export interface RecentSearch {
  id: string
  type: EntityType
  name: string
  searchedAt: string
}

// ============ SHARED DATA STRUCTURES ============
export interface PricePoint {
  date: string // YYYY-QQ format for quarterly, YYYY-MM for monthly
  avgPricePerSqft: number
  medianPricePerSqft?: number
  transactionCount: number
  totalValue: number
}

// Registration/Status types for transactions
export type RegistrationType = 'Off Plan' | 'Ready' | 'Resale'
export type UsageType = 'Residential' | 'Commercial' | 'Industrial'

export type SellerType = 'Developer' | 'Individual'
export type MatchConfidence = 'HIGH' | 'MEDIUM' | 'LOW'

export interface Transaction {
  id: string
  date: string
  price: number
  pricePerSqft: number
  size: number // sqm
  propertyType: PropertyType
  rooms: RoomType | string
  building?: string
  project?: string
  area?: string
  areaOfficial?: string // Official area name (e.g., "Marsa Dubai")

  // Status & Registration
  regType?: RegistrationType // Off Plan, Ready, Resale
  usageType?: UsageType // Residential, Commercial
  isFreehold?: boolean
  completionPct?: number // % complete for off-plan projects

  // Transaction type from procedure_name_en
  procedureName?: string // Sell, Sell - Pre registration, Delayed Sell, etc.

  // Location details
  floor?: number
  unitNumber?: string

  // Resale tracking
  unitFingerprint?: string // Unique unit identifier
  saleSequence?: number // 1, 2, 3... (which sale this is)
  isFirstSale?: boolean // Developer sale
  isResale?: boolean // Subsequent sale
  resaleCount?: number // Total resales for this unit (sale_sequence - 1)
  sellerType?: SellerType // Developer or Individual

  // Price change from previous sale
  prevSalePrice?: number // Last sale price
  prevSaleDate?: string // Last sale date
  priceChangePct?: number // % change from previous sale
  daysSincePrevSale?: number // Days between sales

  // Match quality
  matchConfidence?: MatchConfidence // HIGH, MEDIUM, LOW

  // Investment metrics
  rentalYield?: number // Gross rental yield %
  estimatedRent?: number // Annual rent estimate
  serviceCharges?: number // Per sqft per year

  // Market context
  areaAvgPsf?: number // Area average price per sqft
  areaYoyChange?: number // Area YoY price change %
  developerName?: string
  developerTier?: DeveloperTier
  projectStatus?: ProjectStatus
}

// ============ SALE HISTORY ============
export interface SaleHistoryEntry {
  saleSequence: number
  date: string
  price: number
  pricePerSqft: number
  sellerType: SellerType
  isFirstSale: boolean
  priceChangePct: number | null
  daysSincePrevSale: number | null
}

export interface TransactionHistory {
  unitFingerprint: string
  matchConfidence: MatchConfidence
  totalSales: number
  resaleCount: number
  salesHistory: SaleHistoryEntry[]
  priceAppreciation: {
    fromFirstSale: number | null // % change from developer price
    annualizedReturn: number | null
  }
}

export interface RoomDistribution {
  rooms: RoomType | string
  count: number
  percentage: number
  avgPrice: number
  avgSize: number
  avgPricePerSqft: number
}

export interface ServiceCharges {
  avgPerSqft: number
  min: number
  max: number
}

export interface Amenities {
  schools: number
  healthcare: number
  metroStations: number
}

export interface Centroid {
  lat: number
  lng: number
}

// ============ SUMMARY TYPES (for related entities) ============
export interface ProjectSummary {
  id: string
  name: string
  transactionCount: number
  avgPricePerSqft: number
  status?: ProjectStatus
}

export interface DeveloperSummary {
  id: string
  name: string
  tier: DeveloperTier
  projectCount: number
}

export interface AreaSummary {
  id: string
  name: string
  transactionCount: number
  avgPricePerSqft: number
}

export interface BuildingSummary {
  id: string
  name: string
  transactionCount: number
  avgPricePerSqft: number
}

// ============ AREA ============
export interface AreaStats {
  avgPricePerSqft: number
  medianPricePerSqft: number
  transactionCount: number
  totalValue: number
  avgTransactionValue: number
  yoyPriceChange: number | null
  qoqPriceChange: number | null
  yoyVolumeChange: number | null
  qoqVolumeChange: number | null
}

export interface AreaDetail {
  id: string
  name: string
  nameAr: string
  geometry?: GeoJSON.Geometry | null
  centroid: Centroid | null
  hasGeometry: boolean

  // Stats (filtered by dataMode)
  stats: AreaStats

  // Time series
  priceHistory: PricePoint[]

  // Transactions
  recentTransactions: Transaction[]
  totalTransactions: number

  // Amenities
  amenities: Amenities

  // Related entities
  topProjects: ProjectSummary[]
  topDevelopers: DeveloperSummary[]
  topBuildings: BuildingSummary[]

  // Data availability
  dataAvailable: DataMode[]
}

// ============ PROJECT ============
export interface ProjectStats {
  avgPricePerSqft: number
  medianPricePerSqft: number
  avgTransactionValue: number
  transactionCount: number
  totalValue: number
  yoyPriceChange: number | null
  qoqPriceChange: number | null
  yoyVolumeChange: number | null
  yoyTransactionChange: number | null
  marketPosition: number | null // % vs area average (positive = above, negative = below)
}

export interface ProjectDetail {
  id: string
  name: string
  nameAr: string

  // Location
  areaId: string
  areaName: string

  // Developer
  developerId: string
  developerName: string
  developerTier: DeveloperTier

  // Status
  status: ProjectStatus
  startDate?: string
  endDate?: string
  completionPct?: number

  // Stats (filtered by dataMode)
  stats: ProjectStats

  // Time series
  priceHistory: PricePoint[]

  // Transactions
  recentTransactions: Transaction[]
  totalTransactions: number

  // Room distribution
  roomDistribution: RoomDistribution[]

  // Service charges (if available)
  serviceCharges?: ServiceCharges

  // Rental metrics
  avgRentalYield?: number
  yoyYieldChange?: number

  // Related
  buildings: BuildingSummary[]

  // Landmarks
  nearestLandmark?: string
  nearestMetro?: string
  nearestMall?: string

  // Data availability
  dataAvailable: DataMode[]
}

// ============ DEVELOPER ============
export interface DeveloperStats {
  totalSales: number
  totalVolume: number
  marketSharePct: number
  avgSalePrice: number
  medianSalePrice: number
  avgPricePerSqft: number
  rankByVolume: number
  rankBySales: number
  rankByProjects: number
}

export interface DeveloperPortfolio {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  underConstruction: number
  notStarted: number
  pending: number
  avgCompletionPct: number
  areasPresent: number
}

export interface DeveloperDetail {
  id: string
  name: string
  tier: DeveloperTier

  // Portfolio
  portfolio: DeveloperPortfolio

  // Sales stats
  stats: DeveloperStats

  // Time series (monthly)
  salesHistory: PricePoint[]

  // Trends
  priceTrend3m: TrendDirection
  priceTrend12m: TrendDirection
  volumeMomentum: Momentum

  // Top entities
  topProjects: ProjectSummary[]
  topAreas: AreaSummary[]

  // Recent transactions (across all projects)
  recentTransactions: Transaction[]
  totalTransactions: number

  // Service charges (aggregate)
  serviceCharges?: ServiceCharges

  // Dates
  firstSaleDate?: string
  lastSaleDate?: string

  // Data availability
  dataAvailable: DataMode[]
}

// ============ BUILDING ============
export interface BuildingStats {
  avgPricePerSqft: number
  medianPricePerSqft: number
  avgTransactionValue: number
  transactionCount: number
  totalValue: number
  yoyPriceChange: number | null
}

export interface BuildingDetail {
  id: string
  name: string
  nameAr: string

  // Location hierarchy
  projectId: string
  projectName: string
  areaId: string
  areaName: string
  developerId?: string
  developerName?: string

  // Stats
  stats: BuildingStats

  // Time series
  priceHistory: PricePoint[]

  // Transactions
  recentTransactions: Transaction[]
  totalTransactions: number

  // Room distribution
  roomDistribution: RoomDistribution[]

  // Landmarks
  nearestLandmark?: string
  nearestMetro?: string
  nearestMall?: string

  // Data availability
  dataAvailable: DataMode[]
}

// ============ WATCHLIST ============
export interface WatchlistItem {
  id: string
  type: EntityType
  name: string
  addedAt: string
  // For future sync with user accounts
  userId?: string
  syncedAt?: string
}

export interface WatchlistState {
  items: WatchlistItem[]
  isLoading: boolean
  error: string | null
}

// ============ UI STATE ============
export interface AnalyticsFilters {
  dataMode: DataMode
  timeframe: Timeframe
  propertyType?: PropertyType
  roomType?: RoomType
  sortBy: 'date' | 'price' | 'size' | 'pricePerSqft'
  sortOrder: 'asc' | 'desc'
  page: number
  pageSize: number
}

export interface SearchState {
  query: string
  isOpen: boolean
  isLoading: boolean
  results: SearchResult[]
  recentSearches: RecentSearch[]
}

// ============ API RESPONSE TYPES (for future) ============
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, unknown>
}

// ============ CHART DATA ============
export interface ChartDataPoint {
  x: string // date
  y: number // value
}

export interface ChartSeries {
  id: string
  data: ChartDataPoint[]
  color?: string
}

// ============ TABLE COLUMN DEFINITIONS ============
export interface TableColumn<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  width?: string
  align?: 'left' | 'center' | 'right'
  format?: (value: unknown, row: T) => string | number
}
