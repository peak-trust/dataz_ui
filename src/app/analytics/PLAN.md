# Analytics Dashboard - Project/Area Details Plan

## Overview
Modern analytics dashboard for Dubai real estate data with unified search across Areas, Projects, Developers, and Buildings. Mobile-first, dark glassmorphism design, mock data now with API-ready architecture.

---

## 1. Component Architecture

```
/analytics
├── page.tsx                      # Main analytics page
├── components/
│   ├── search/
│   │   ├── unified-search.tsx    # Command palette style search (⌘K)
│   │   ├── search-results.tsx    # Grouped results dropdown
│   │   ├── search-result-item.tsx # Individual result with icon/badge
│   │   └── recent-searches.tsx   # Recent/saved searches
│   │
│   ├── detail-views/
│   │   ├── area-detail.tsx       # Area analytics view
│   │   ├── project-detail.tsx    # Project analytics view
│   │   ├── developer-detail.tsx  # Developer analytics view
│   │   └── building-detail.tsx   # Building analytics view
│   │
│   ├── data-display/
│   │   ├── stats-grid.tsx        # KPI cards grid (responsive)
│   │   ├── price-chart.tsx       # Line chart with timeframe selector
│   │   ├── transaction-table.tsx # Sortable, paginated table
│   │   ├── bedroom-distribution.tsx # Rooms breakdown chart
│   │   ├── amenities-card.tsx    # Schools, metro, healthcare
│   │   └── map-preview.tsx       # Mini map with geometry
│   │
│   ├── layout/
│   │   ├── detail-header.tsx     # Entity name, type badge, breadcrumb
│   │   ├── tab-switcher.tsx      # Sales | Rental toggle
│   │   ├── timeframe-selector.tsx # 1Y | 2Y | 3Y | All
│   │   └── empty-state.tsx       # "Limited data available"
│   │
│   └── watchlist/
│       ├── watchlist-button.tsx  # Add/remove from watchlist
│       └── watchlist-provider.tsx # Context for watchlist state
```

---

## 2. Data Models (TypeScript)

```typescript
// types/analytics.ts

// ============ SEARCH ============
type EntityType = 'area' | 'project' | 'developer' | 'building'
type DataMode = 'sales' | 'rental'

interface SearchResult {
  id: string
  type: EntityType
  name: string
  subtitle: string        // e.g., "Business Bay" for project, "12 projects" for developer
  transactionCount: number
  avgPrice: number
  dataAvailable: DataMode[]
}

// ============ AREA ============
interface AreaDetail {
  id: string
  name: string
  nameAr: string
  geometry?: GeoJSON.Geometry
  centroid: { lat: number; lng: number }

  // Stats
  stats: AreaStats

  // Time series
  priceHistory: PricePoint[]

  // Transactions
  recentTransactions: Transaction[]

  // Amenities
  amenities: {
    schools: number
    healthcare: number
    metroStations: number
  }

  // Related
  topProjects: ProjectSummary[]
  topDevelopers: DeveloperSummary[]
}

interface AreaStats {
  avgPricePerSqft: number
  medianPricePerSqft: number
  transactionCount: number
  totalValue: number
  yoyPriceChange: number
  qoqPriceChange: number
  yoyVolumeChange: number
}

// ============ PROJECT ============
interface ProjectDetail {
  id: string
  name: string
  nameAr: string

  // Location
  areaId: string
  areaName: string

  // Developer
  developerId: string
  developerName: string
  developerTier: 'TIER_1' | 'TIER_2' | 'TIER_3' | 'TIER_4'

  // Status
  status: 'Completed' | 'Under Construction' | 'Not Started' | 'Pending'
  startDate?: string
  endDate?: string
  completionPct?: number

  // Stats (for selected mode: sales/rental)
  stats: ProjectStats

  // Time series
  priceHistory: PricePoint[]

  // Transactions
  recentTransactions: Transaction[]

  // Room distribution
  roomDistribution: RoomDistribution[]

  // Service charges
  serviceCharges?: {
    avgPerSqft: number
    min: number
    max: number
  }
}

interface ProjectStats {
  avgPricePerSqft: number
  avgTransactionValue: number
  transactionCount: number
  totalValue: number
  yoyPriceChange: number
  marketPosition: number  // % vs area average
}

// ============ DEVELOPER ============
interface DeveloperDetail {
  id: string
  name: string
  tier: 'TIER_1' | 'TIER_2' | 'TIER_3' | 'TIER_4'

  // Portfolio
  totalProjects: number
  activeProjects: number
  completedProjects: number
  underConstruction: number
  areasPresent: number

  // Sales stats
  stats: DeveloperStats

  // Time series
  salesHistory: PricePoint[]

  // Trends
  priceTrend3m: 'up' | 'down' | 'stable'
  priceTrend12m: 'up' | 'down' | 'stable'
  volumeMomentum: 'accelerating' | 'decelerating' | 'stable'

  // Top projects
  topProjects: ProjectSummary[]

  // Recent transactions (across all projects)
  recentTransactions: Transaction[]
}

interface DeveloperStats {
  totalSales: number
  totalVolume: number
  marketSharePct: number
  avgSalePrice: number
  medianSalePrice: number
  avgPricePerSqft: number
  rankByVolume: number
  rankBySales: number
}

// ============ BUILDING ============
interface BuildingDetail {
  id: string
  name: string
  nameAr: string

  // Location
  projectId: string
  projectName: string
  areaId: string
  areaName: string

  // Stats
  stats: BuildingStats

  // Transactions
  recentTransactions: Transaction[]

  // Landmarks
  nearestLandmark?: string
  nearestMetro?: string
  nearestMall?: string
}

// ============ SHARED ============
interface PricePoint {
  date: string          // YYYY-QQ format for quarterly
  avgPricePerSqft: number
  transactionCount: number
  totalValue: number
}

interface Transaction {
  id: string
  date: string
  price: number
  pricePerSqft: number
  size: number          // sqm
  propertyType: string
  rooms: string
  building?: string
}

interface RoomDistribution {
  rooms: string         // "Studio", "1BR", "2BR", etc.
  count: number
  avgPrice: number
  avgSize: number
}

// Summaries for related entities
interface ProjectSummary {
  id: string
  name: string
  transactionCount: number
  avgPricePerSqft: number
}

interface DeveloperSummary {
  id: string
  name: string
  tier: string
  projectCount: number
}

// ============ WATCHLIST ============
interface WatchlistItem {
  id: string
  type: EntityType
  name: string
  addedAt: string
  // For future sync
  userId?: string
}
```

---

## 3. UI/UX Patterns

### 3.1 Unified Search (Command Palette Style)

```
┌─────────────────────────────────────────────────────────┐
│  🔍 Search areas, projects, developers...         ⌘K   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│  Recent Searches                                        │
│  ├─ 🏢 Business Bay                                     │
│  └─ 🏗️ Binghatti Skyrise                               │
├─────────────────────────────────────────────────────────┤
│  AREAS                                         See all →│
│  ├─ 📍 Business Bay          2,450 sales  AED 2,340/sqft│
│  ├─ 📍 Dubai Marina          1,890 sales  AED 2,100/sqft│
│  └─ 📍 Downtown Dubai        1,200 sales  AED 3,200/sqft│
├─────────────────────────────────────────────────────────┤
│  PROJECTS                                      See all →│
│  ├─ 🏢 Binghatti Skyrise     3,222 sales  AED 2,862/sqft│
│  └─ 🏢 Binghatti Aquarise    1,084 sales  AED 2,827/sqft│
├─────────────────────────────────────────────────────────┤
│  DEVELOPERS                                    See all →│
│  └─ 🏗️ Binghatti Group       32,450 sales  Tier 1      │
└─────────────────────────────────────────────────────────┘
```

**Features:**
- Keyboard navigation (↑↓ to select, Enter to open)
- Instant filtering as you type
- Shows transaction count + avg price for context
- Entity type icons for visual differentiation
- Mobile: Full-screen search overlay

### 3.2 Detail View Layout (Mobile-First)

**Mobile (< 768px):**
```
┌────────────────────────────┐
│ ← Back        ☆ Watchlist  │
├────────────────────────────┤
│ 📍 Business Bay            │
│ Area · Dubai               │
├────────────────────────────┤
│ [  Sales  ] [ Rental ]     │ ← Tab switcher
├────────────────────────────┤
│ ┌──────────┐ ┌──────────┐  │
│ │AED 2,340 │ │  +3.2%   │  │ ← Stats cards (2-col grid)
│ │ per sqft │ │   YoY    │  │
│ └──────────┘ └──────────┘  │
│ ┌──────────┐ ┌──────────┐  │
│ │  2,450   │ │ AED 5.7B │  │
│ │  Sales   │ │  Volume  │  │
│ └──────────┘ └──────────┘  │
├────────────────────────────┤
│ Price Trend                │
│ [1Y] [2Y] [3Y] [All]       │
│ ┌────────────────────────┐ │
│ │     📈 Line Chart      │ │
│ └────────────────────────┘ │
├────────────────────────────┤
│ Recent Transactions    →   │
│ ┌────────────────────────┐ │
│ │ 2BR · 95 sqm · 1.2M    │ │
│ │ Dec 24 · Bldg A        │ │
│ ├────────────────────────┤ │
│ │ 1BR · 65 sqm · 850K    │ │
│ │ Dec 23 · Bldg B        │ │
│ └────────────────────────┘ │
│      View all 2,450 →      │
├────────────────────────────┤
│ Bedroom Distribution       │
│ ┌────────────────────────┐ │
│ │   📊 Horizontal Bars   │ │
│ └────────────────────────┘ │
├────────────────────────────┤
│ Amenities                  │
│ 🏫 12 Schools              │
│ 🏥 5 Healthcare            │
│ 🚇 3 Metro Stations        │
├────────────────────────────┤
│ Map                        │
│ ┌────────────────────────┐ │
│ │      🗺️ Mini Map       │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```

**Desktop (≥ 1024px):**
```
┌──────────────────────────────────────────────────────────────────────┐
│ ← Back to Search                                                      │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  📍 Business Bay                                    ☆ Add to Watchlist│
│  Area · Dubai · 2,450 transactions                                    │
│                                                                       │
│  [  Sales  ] [ Rental ]                                               │
│                                                                       │
├───────────────────────────────────┬──────────────────────────────────┤
│                                   │                                   │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ │  Price Trend        [1Y][2Y][3Y] │
│  │2,340│ │+3.2%│ │2,450│ │5.7B │ │  ┌────────────────────────────┐  │
│  │/sqft│ │ YoY │ │Sales│ │ Vol │ │  │                            │  │
│  └─────┘ └─────┘ └─────┘ └─────┘ │  │      📈 Line Chart         │  │
│                                   │  │                            │  │
│  Recent Transactions              │  └────────────────────────────┘  │
│  ┌───────────────────────────────┐│                                   │
│  │Date    │Type│Size │Price│/sqft││  Bedroom Distribution            │
│  ├────────┼────┼─────┼─────┼─────┤│  ┌────────────────────────────┐  │
│  │Dec 24  │2BR │95sqm│1.2M │12.6K││  │   📊 Horizontal Bars       │  │
│  │Dec 23  │1BR │65sqm│850K │13.1K││  └────────────────────────────┘  │
│  │Dec 22  │3BR │140  │2.1M │15.0K││                                   │
│  └───────────────────────────────┘│  ┌──────────┬──────────────────┐ │
│       View all transactions →     │  │ Amenities│    Mini Map      │ │
│                                   │  │ 🏫 12    │  ┌────────────┐  │ │
│  Top Projects in Area             │  │ 🏥 5     │  │   🗺️       │  │ │
│  ├─ Binghatti Skyrise (3,222)     │  │ 🚇 3     │  └────────────┘  │ │
│  ├─ Marina Gate (1,500)           │  └──────────┴──────────────────┘ │
│  └─ See all 45 projects →         │                                   │
│                                   │                                   │
└───────────────────────────────────┴──────────────────────────────────┘
```

### 3.3 Transaction Table (Full View)

```
┌──────────────────────────────────────────────────────────────────────┐
│ Transactions · Business Bay · Sales                                   │
├──────────────────────────────────────────────────────────────────────┤
│ 🔍 Filter   Type: [All ▼]   Rooms: [All ▼]   Sort: [Newest ▼]        │
├──────────────────────────────────────────────────────────────────────┤
│ Date ↓    │ Price      │ Size    │ AED/sqft │ Type    │ Rooms │ Bldg │
├───────────┼────────────┼─────────┼──────────┼─────────┼───────┼──────┤
│ 24 Dec 25 │ 1,245,000  │ 95 sqm  │ 13,105   │ Apt     │ 2BR   │ A-12 │
│ 23 Dec 25 │ 856,000    │ 65 sqm  │ 13,169   │ Apt     │ 1BR   │ B-03 │
│ 22 Dec 25 │ 2,100,000  │ 142 sqm │ 14,789   │ Apt     │ 3BR   │ A-08 │
│ ...       │            │         │          │         │       │      │
├───────────────────────────────────────────────────────────────────────┤
│ Showing 1-20 of 2,450      ← [1] [2] [3] ... [123] →                  │
└──────────────────────────────────────────────────────────────────────┘
```

### 3.4 Empty/Limited Data State

```
┌────────────────────────────────────────┐
│                                        │
│         📊                             │
│                                        │
│   Limited data available               │
│                                        │
│   This area has fewer than 10          │
│   transactions in the selected         │
│   time period.                         │
│                                        │
│   [ Expand timeframe to All ]          │
│                                        │
└────────────────────────────────────────┘
```

---

## 4. Mock Data Structure

```typescript
// data/mock-areas.ts
export const mockAreas: AreaDetail[] = [
  {
    id: "273",
    name: "Business Bay",
    nameAr: "الخليج التجاري",
    centroid: { lat: 25.1850, lng: 55.2666 },
    stats: {
      avgPricePerSqft: 2340,
      medianPricePerSqft: 2200,
      transactionCount: 2450,
      totalValue: 5700000000,
      yoyPriceChange: 3.2,
      qoqPriceChange: 1.1,
      yoyVolumeChange: 8.5
    },
    priceHistory: [
      { date: "2024-Q1", avgPricePerSqft: 2180, transactionCount: 580, totalValue: 1200000000 },
      { date: "2024-Q2", avgPricePerSqft: 2220, transactionCount: 620, totalValue: 1350000000 },
      { date: "2024-Q3", avgPricePerSqft: 2290, transactionCount: 610, totalValue: 1400000000 },
      { date: "2024-Q4", avgPricePerSqft: 2340, transactionCount: 640, totalValue: 1750000000 },
    ],
    recentTransactions: [/* ... */],
    amenities: { schools: 12, healthcare: 5, metroStations: 3 },
    topProjects: [
      { id: "p1", name: "Binghatti Skyrise", transactionCount: 3222, avgPricePerSqft: 2862 },
      { id: "p2", name: "Binghatti Aquarise", transactionCount: 1084, avgPricePerSqft: 2827 },
    ],
    topDevelopers: [
      { id: "d1", name: "Binghatti Group", tier: "TIER_1", projectCount: 5 }
    ]
  },
  // ... more areas
]

// data/mock-projects.ts - Binghatti Skyrise example
export const mockProjects: ProjectDetail[] = [
  {
    id: "binghatti-skyrise",
    name: "Binghatti Skyrise",
    nameAr: "بن غاطي سكاي رايز",
    areaId: "273",
    areaName: "Business Bay",
    developerId: "BINGHATTI",
    developerName: "Binghatti Group",
    developerTier: "TIER_1",
    status: "Under Construction",
    completionPct: 65,
    stats: {
      avgPricePerSqft: 2862,
      avgTransactionValue: 1962377,
      transactionCount: 3222,
      totalValue: 6324940000,
      yoyPriceChange: 5.2,
      marketPosition: 22.3  // 22.3% above area average
    },
    priceHistory: [/* quarterly data */],
    recentTransactions: [/* ... */],
    roomDistribution: [
      { rooms: "Studio", count: 450, avgPrice: 650000, avgSize: 35 },
      { rooms: "1BR", count: 1200, avgPrice: 950000, avgSize: 65 },
      { rooms: "2BR", count: 1100, avgPrice: 1800000, avgSize: 95 },
      { rooms: "3BR", count: 400, avgPrice: 3200000, avgSize: 145 },
      { rooms: "Penthouse", count: 72, avgPrice: 8500000, avgSize: 280 },
    ],
    serviceCharges: { avgPerSqft: 18.5, min: 15, max: 25 }
  }
]

// data/mock-developers.ts
export const mockDevelopers: DeveloperDetail[] = [
  {
    id: "BINGHATTI",
    name: "Binghatti Group",
    tier: "TIER_1",
    totalProjects: 68,
    activeProjects: 16,
    completedProjects: 34,
    underConstruction: 34,
    areasPresent: 12,
    stats: {
      totalSales: 32450,
      totalVolume: 50783315001,
      marketSharePct: 2.27,
      avgSalePrice: 1564971,
      medianSalePrice: 1000000,
      avgPricePerSqft: 18009,
      rankByVolume: 5,
      rankBySales: 3
    },
    priceTrend3m: "up",
    priceTrend12m: "up",
    volumeMomentum: "accelerating",
    salesHistory: [/* monthly data */],
    topProjects: [/* ... */],
    recentTransactions: [/* ... */]
  }
]
```

---

## 5. File Structure

```
/dataz_ui/src/
├── app/
│   └── analytics/
│       ├── page.tsx                    # Main page with search
│       ├── [type]/
│       │   └── [id]/
│       │       └── page.tsx            # Dynamic detail page
│       └── transactions/
│           └── page.tsx                # Full transactions view
│
├── components/
│   └── analytics/
│       ├── search/
│       │   ├── unified-search.tsx
│       │   ├── search-results.tsx
│       │   ├── search-result-item.tsx
│       │   └── recent-searches.tsx
│       │
│       ├── detail-views/
│       │   ├── area-detail.tsx
│       │   ├── project-detail.tsx
│       │   ├── developer-detail.tsx
│       │   └── building-detail.tsx
│       │
│       ├── data-display/
│       │   ├── stats-grid.tsx
│       │   ├── price-chart.tsx
│       │   ├── transaction-table.tsx
│       │   ├── transaction-row.tsx
│       │   ├── bedroom-distribution.tsx
│       │   ├── amenities-card.tsx
│       │   └── map-preview.tsx
│       │
│       ├── layout/
│       │   ├── detail-header.tsx
│       │   ├── tab-switcher.tsx
│       │   ├── timeframe-selector.tsx
│       │   └── empty-state.tsx
│       │
│       └── watchlist/
│           ├── watchlist-button.tsx
│           ├── watchlist-provider.tsx
│           └── use-watchlist.ts
│
├── lib/
│   └── analytics/
│       ├── types.ts                    # All TypeScript interfaces
│       ├── mock-data/
│       │   ├── areas.ts
│       │   ├── projects.ts
│       │   ├── developers.ts
│       │   ├── buildings.ts
│       │   └── transactions.ts
│       ├── utils/
│       │   ├── format.ts               # Price, date formatters
│       │   ├── search.ts               # Search/filter logic
│       │   └── chart.ts                # Chart data transforms
│       └── hooks/
│           ├── use-search.ts
│           ├── use-detail.ts
│           └── use-transactions.ts
│
└── styles/
    └── analytics.css                   # Component-specific styles
```

---

## 6. Implementation Phases

### Phase 1: Core Search & Navigation
- [ ] TypeScript types (types.ts)
- [ ] Mock data (areas, projects, developers)
- [ ] Unified search component
- [ ] Search results dropdown
- [ ] URL routing for detail pages

### Phase 2: Detail Views
- [ ] Area detail view
- [ ] Project detail view
- [ ] Developer detail view
- [ ] Building detail view
- [ ] Tab switcher (Sales/Rental)
- [ ] Stats grid component

### Phase 3: Data Visualization
- [ ] Price chart with timeframe selector
- [ ] Transaction table with sorting/pagination
- [ ] Bedroom distribution chart
- [ ] Amenities card

### Phase 4: Watchlist & Polish
- [ ] Watchlist provider (localStorage + future API ready)
- [ ] Watchlist button component
- [ ] Empty states
- [ ] Loading skeletons
- [ ] Mobile optimizations

---

## 7. Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Search style | Command palette (⌘K) | Modern, keyboard-friendly, fast |
| Results grouping | Unified with sections | Fewer clicks than tabs |
| Chart library | Nivo (existing) | Already in stack, good animations |
| Routing | `/analytics/[type]/[id]` | SEO-friendly, shareable URLs |
| State | Local state + URL params | Simple, works with SSR |
| Watchlist storage | localStorage now, API later | Progressive enhancement |
| Mobile nav | Full-screen search overlay | Better touch UX |
| Empty state | Message + CTA | Guides user to useful action |

---

## 8. Sample UI Specifications

### Color Usage (from existing theme)
- **Primary accent**: `#5B93FF` (blue) - CTAs, active states
- **Success/Up**: `#10B981` (emerald) - positive trends
- **Warning/Down**: `#F59E0B` (amber) - negative trends
- **Surface**: `#1E1E1E` - cards, elevated elements
- **Border**: `rgba(255,255,255,0.1)` - subtle dividers

### Typography
- **Entity name**: `text-2xl font-semibold` (24px)
- **Stats value**: `text-3xl font-bold` (30px)
- **Stats label**: `text-sm text-muted-foreground` (14px)
- **Table header**: `text-xs font-medium uppercase tracking-wider`
- **Table cell**: `text-sm`

### Spacing
- **Card padding**: `p-6` (24px)
- **Section gap**: `space-y-6` (24px)
- **Stats grid gap**: `gap-4` (16px)
- **Mobile padding**: `px-4` (16px)

### Animations
- **Search open**: `duration-200 ease-out`
- **Card hover**: `transition-all duration-150`
- **Chart transitions**: `500ms` (Nivo default)
- **Page transitions**: Framer Motion `layoutId`
