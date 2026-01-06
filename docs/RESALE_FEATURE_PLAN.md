# Resale Feature Implementation Plan

## Overview
Add resale tracking to transaction displays, showing sale history timeline and price appreciation for properties that have been sold multiple times.

## Data Source
**Primary:** `gold_unit_transactions` table

| Field | Description |
|-------|-------------|
| `unit_fingerprint` | Unique unit identifier (hash) |
| `sale_sequence` | 1st, 2nd, 3rd sale number |
| `is_first_sale` | Boolean - developer sale |
| `is_resale` | Boolean - subsequent sale |
| `price_change_pct` | % change from previous sale |
| `prev_sale_price` | Previous sale amount |
| `prev_sale_date` | Previous sale date |
| `days_since_prev_sale` | Days held |
| `seller_type` | Developer / Individual |
| `match_confidence` | HIGH, MEDIUM, LOW |

## Feature Components

### 1. Transaction Table Enhancement

**In TYPE column, add badges:**
```
• 2BR  OFF PLAN           → First sale from developer
• 2BR  RESALE  +26%       → Resale with appreciation
• 2BR  RESALE 2  -8%      → 2nd resale with depreciation
```

**Badge Logic:**
- `is_first_sale=true` + `seller_type='Developer'` → Show "OFF PLAN" (existing)
- `is_resale=true` + `sale_sequence=2` → Show "RESALE"
- `is_resale=true` + `sale_sequence>2` → Show "RESALE X" (where X = sale_sequence - 1)
- `price_change_pct` → Show "+X%" (green) or "-X%" (red)

### 2. Transaction Detail Sheet/Modal

**Header Section:**
```
┌─────────────────────────────────────────────┐
│           AED 4,500,000                     │
│           3,710 /sqft                       │
│           16 Dec, 2025                      │
│  ┌──────────┐         ┌─────────────────┐   │
│  │ ↑ 52.54% │         │ Resale: 2 Times │   │
│  └──────────┘         └─────────────────┘   │
└─────────────────────────────────────────────┘
```

**Property Details:**
| Label | Value |
|-------|-------|
| Property size | 1,213 sqft │ 113 sqm |
| Category | 2 beds apartment |
| Floor | 4 |
| Status | Ready |
| Sold by | Individual |

**Location:**
```
Building Name, Project Name, Area Name
```

**Tabs:**
1. **Sales history** - Full timeline
2. **Rental estimate** - Based on similar units

### 3. Sales History Timeline

```
┌─────────────────────────────────────────────┐
│  Sales history          Rental estimate     │
├─────────────────────────────────────────────┤
│                                             │
│  AED 4.5M     16 Dec, 2025    ← Current     │
│      │        +52.54%                       │
│      │                                      │
│  AED 2.95M    16 Dec, 2022                  │
│      │        +25%                          │
│      │                                      │
│  AED 2.36M    05 Nov, 2019    ← Developer   │
│                                             │
└─────────────────────────────────────────────┘
```

**Timeline Entry Structure:**
- Price (large)
- Date
- % change from previous (if not first sale)
- "Developer" tag for first sale
- Confidence indicator (optional)

### 4. Rental Estimate Tab

Since we cannot match exact unit rental history, show:

```
┌─────────────────────────────────────────────┐
│  Sales history          Rental estimate     │
├─────────────────────────────────────────────┤
│                                             │
│  Similar units in MBL RESIDENCE             │
│                                             │
│  Typical Annual Rent    AED 115,000         │
│  Range                  95K - 140K          │
│  Gross Yield (est.)     ~4.2%               │
│                                             │
│  Based on 23 recent contracts               │
│  for similar 1BR units (70-85 sqm)          │
│                                             │
└─────────────────────────────────────────────┘
```

**Query Logic:**
```sql
SELECT
    AVG(annual_amount) as avg_rent,
    MIN(annual_amount) as min_rent,
    MAX(annual_amount) as max_rent,
    COUNT(*) as contract_count
FROM silver_rent_contracts
WHERE project_name_en = :project_name
  AND actual_area BETWEEN :unit_size * 0.85 AND :unit_size * 1.15
  AND contract_start_date > NOW() - INTERVAL '2 years'
```

---

## API Design

### New Endpoint: `/api/transactions/[id]/history`

**Request:**
```
GET /api/transactions/{transaction_id}/history
```

**Response:**
```json
{
  "unitFingerprint": "abc123...",
  "matchConfidence": "HIGH",
  "totalSales": 3,
  "resaleCount": 2,
  "salesHistory": [
    {
      "saleSequence": 1,
      "date": "2019-11-05",
      "price": 2360000,
      "pricePerSqft": 2438,
      "sellerType": "Developer",
      "isFirstSale": true,
      "priceChangePct": null
    },
    {
      "saleSequence": 2,
      "date": "2022-12-16",
      "price": 2950000,
      "pricePerSqft": 3047,
      "sellerType": "Individual",
      "isFirstSale": false,
      "priceChangePct": 25.0,
      "daysSincePrevSale": 1136
    },
    {
      "saleSequence": 3,
      "date": "2025-12-16",
      "price": 4500000,
      "pricePerSqft": 3710,
      "sellerType": "Individual",
      "isFirstSale": false,
      "priceChangePct": 52.54,
      "daysSincePrevSale": 1096
    }
  ],
  "rentalEstimate": {
    "avgAnnualRent": 115000,
    "minRent": 95000,
    "maxRent": 140000,
    "contractCount": 23,
    "estimatedYield": 4.2,
    "basedOn": "Similar 1BR units (70-85 sqm) in MBL RESIDENCE"
  },
  "priceAppreciation": {
    "fromDeveloper": 90.7,
    "annualizedReturn": 11.2
  }
}
```

---

## Type Definitions

### Update `Transaction` type in `types.ts`

```typescript
export interface Transaction {
  // ... existing fields ...

  // Resale info
  unitFingerprint?: string
  saleSequence?: number        // 1, 2, 3...
  isFirstSale?: boolean
  isResale?: boolean
  resaleCount?: number         // Total resales for this unit
  sellerType?: 'Developer' | 'Individual'

  // Price change from previous sale
  prevSalePrice?: number
  prevSaleDate?: string
  priceChangePct?: number      // % change from previous
  daysSincePrevSale?: number

  // Confidence
  matchConfidence?: 'HIGH' | 'MEDIUM' | 'LOW'
}
```

### New type: `SaleHistoryEntry`

```typescript
export interface SaleHistoryEntry {
  saleSequence: number
  date: string
  price: number
  pricePerSqft: number
  sellerType: 'Developer' | 'Individual'
  isFirstSale: boolean
  priceChangePct: number | null
  daysSincePrevSale: number | null
}
```

### New type: `RentalEstimate`

```typescript
export interface RentalEstimate {
  avgAnnualRent: number
  minRent: number
  maxRent: number
  contractCount: number
  estimatedYield: number
  basedOn: string
}
```

### New type: `TransactionHistory`

```typescript
export interface TransactionHistory {
  unitFingerprint: string
  matchConfidence: 'HIGH' | 'MEDIUM' | 'LOW'
  totalSales: number
  resaleCount: number
  salesHistory: SaleHistoryEntry[]
  rentalEstimate: RentalEstimate | null
  priceAppreciation: {
    fromDeveloper: number | null
    annualizedReturn: number | null
  }
}
```

---

## UI Components

### 1. `ResaleBadge` component

```
src/components/ui/resale-badge.tsx
```

Props:
- `resaleCount`: number (0 = not resale, 1 = first resale, 2+ = multiple)
- `priceChangePct`: number | null
- `size`: 'sm' | 'md'

Visual:
- "RESALE" in purple badge
- "RESALE 2" for multiple resales
- "+26%" in green or "-8%" in red

### 2. `SalesTimeline` component

```
src/components/analytics/sales-timeline.tsx
```

Props:
- `history`: SaleHistoryEntry[]
- `showConfidence`: boolean

Visual:
- Vertical timeline
- Price bubbles
- Date labels
- % change connectors
- "Developer" tag on first sale

### 3. `RentalEstimateCard` component

```
src/components/analytics/rental-estimate-card.tsx
```

Props:
- `estimate`: RentalEstimate | null
- `currentPrice`: number (for yield calculation)

Visual:
- Average rent
- Range (min-max)
- Estimated yield
- "Based on X contracts" note

### 4. `TransactionDetailSheet` component

```
src/components/analytics/transaction-detail-sheet.tsx
```

Mobile-first bottom sheet / desktop modal showing:
- Header with price, date, badges
- Property details grid
- Location breadcrumb
- Tabbed content (Sales history / Rental estimate)

---

## Implementation Steps

### Phase 1: Data Layer
1. [ ] Add new types to `types.ts`
2. [ ] Create API route `/api/transactions/[id]/history`
3. [ ] Add database query functions

### Phase 2: UI Components
4. [ ] Create `ResaleBadge` component
5. [ ] Create `SalesTimeline` component
6. [ ] Create `RentalEstimateCard` component
7. [ ] Create `TransactionDetailSheet` component

### Phase 3: Integration
8. [ ] Update transaction table to show resale badges
9. [ ] Add click handler to open detail sheet
10. [ ] Fetch history data on sheet open
11. [ ] Mobile responsiveness testing

### Phase 4: Polish
12. [ ] Add loading states
13. [ ] Add error handling
14. [ ] Add animations (timeline, sheet)
15. [ ] Confidence indicator styling

---

## Database Queries

### Get transaction with resale info

```sql
SELECT
    t.*,
    gut.unit_fingerprint,
    gut.sale_sequence,
    gut.is_first_sale,
    gut.is_resale,
    gut.prev_sale_price,
    gut.prev_sale_date,
    gut.price_change_pct,
    gut.days_since_prev_sale,
    gut.seller_type,
    gut.match_confidence,
    (SELECT COUNT(*) FROM gold_unit_transactions
     WHERE unit_fingerprint = gut.unit_fingerprint) as total_sales
FROM gold_transactions t
LEFT JOIN gold_unit_transactions gut
    ON t.transaction_id = gut.transaction_id
WHERE t.transaction_id = :id
```

### Get full sale history for unit

```sql
SELECT
    sale_sequence,
    instance_date,
    trans_value,
    price_per_sqft,
    seller_type,
    is_first_sale,
    price_change_pct,
    days_since_prev_sale,
    match_confidence
FROM gold_unit_transactions
WHERE unit_fingerprint = :fingerprint
ORDER BY instance_date ASC
```

### Get rental estimate for similar units

```sql
SELECT
    AVG(annual_amount::numeric) as avg_rent,
    MIN(annual_amount::numeric) as min_rent,
    MAX(annual_amount::numeric) as max_rent,
    COUNT(*) as contract_count
FROM silver_rent_contracts
WHERE project_name_en = :project_name
  AND actual_area::numeric BETWEEN :size * 0.85 AND :size * 1.15
  AND ejari_property_type_en = :property_type
  AND contract_start_date > NOW() - INTERVAL '2 years'
```

---

## Mobile Considerations

- Transaction rows remain tappable
- Detail sheet slides up from bottom
- Swipe down to dismiss
- Timeline scrolls vertically
- Tab bar sticky at top of sheet
- Touch targets 44px minimum

---

## Performance Notes

- Lazy load history data only when detail sheet opens
- Cache history for recently viewed transactions
- Consider SWR for data fetching
- Timeline renders max 10 entries initially, "Show all" for more
