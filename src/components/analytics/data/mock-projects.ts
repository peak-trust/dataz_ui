export interface Transaction {
    unit: string
    type: "1BR" | "2BR" | "3BR" | "Penthouse"
    size: number // sq ft
    price: number
    date: string
}

export interface Project {
    id: string
    name: string
    developer: string
    location: string
    price: string
    status: "Off-plan" | "Ready" | "Under Construction"
    type: "Sales" | "Rental"
    image: string
    completion?: string
    // New detailed metrics
    demandScore?: "High" | "Medium" | "Low"
    pricePerSqFt?: number
    priceTrend?: number // percentage
    transactionVolume?: number
    marketComparison?: number // percentage vs area avg
    yieldEst?: number // percentage
    chartData?: { date: string; value: number }[]
    transactions?: Transaction[]
}

export const MOCK_PROJECTS: Project[] = [
    {
        id: "1",
        name: "Binghatti Mercedes-Benz Places",
        developer: "Binghatti",
        location: "Downtown Dubai",
        price: "AED 8,500,000",
        status: "Off-plan",
        type: "Sales",
        image: "/images/placeholder-1.jpg",
        completion: "Q4 2026",
        demandScore: "High",
        pricePerSqFt: 4200,
        priceTrend: 12,
        transactionVolume: 24,
        marketComparison: 15,
        yieldEst: 6.5,
        chartData: [
            { date: "Jan", value: 3800 },
            { date: "Feb", value: 3900 },
            { date: "Mar", value: 3850 },
            { date: "Apr", value: 4000 },
            { date: "May", value: 4100 },
            { date: "Jun", value: 4200 }
        ],
        transactions: [
            { unit: "A-5401", type: "3BR", size: 2800, price: 11500000, date: "2024-01-02" },
            { unit: "B-2204", type: "2BR", size: 1650, price: 6800000, date: "2023-12-28" },
            { unit: "A-1502", type: "1BR", size: 950, price: 4100000, date: "2023-12-25" },
            { unit: "A-4501", type: "Penthouse", size: 6500, price: 32000000, date: "2023-12-20" },
            { unit: "B-2101", type: "2BR", size: 1650, price: 6750000, date: "2023-12-18" },
            { unit: "A-1403", type: "2BR", size: 1800, price: 7200000, date: "2023-12-15" }
        ]
    },
    {
        id: "2",
        name: "Binghatti Jacob & Co Residences",
        developer: "Binghatti",
        location: "Business Bay",
        price: "AED 12,000,000",
        status: "Under Construction",
        type: "Sales",
        image: "/images/placeholder-2.jpg",
        completion: "Q2 2025",
        demandScore: "Medium",
        pricePerSqFt: 3500,
        priceTrend: 5,
        transactionVolume: 12,
        marketComparison: 8,
        yieldEst: 5.8,
        chartData: [
            { date: "Jan", value: 3300 },
            { date: "Feb", value: 3350 },
            { date: "Mar", value: 3400 },
            { date: "Apr", value: 3450 },
            { date: "May", value: 3500 },
            { date: "Jun", value: 3500 }
        ]
    },
    {
        id: "3",
        name: "Binghatti Trillionaire Residences",
        developer: "Binghatti",
        location: "Business Bay",
        price: "AED 3,200,000",
        status: "Off-plan",
        type: "Sales",
        image: "/images/placeholder-3.jpg",
        completion: "Q3 2025",
        demandScore: "High",
        pricePerSqFt: 2800,
        priceTrend: 8,
        transactionVolume: 45,
        marketComparison: 10,
        yieldEst: 7.2,
        chartData: [
            { date: "Jan", value: 2500 },
            { date: "Feb", value: 2600 },
            { date: "Mar", value: 2700 },
            { date: "Apr", value: 2800 },
            { date: "May", value: 2800 },
            { date: "Jun", value: 2800 }
        ]
    },
    {
        id: "4",
        name: "Binghatti Gardenia",
        developer: "Binghatti",
        location: "Jumeirah Village Circle",
        price: "AED 950,000",
        status: "Ready",
        type: "Rental",
        image: "/images/placeholder-4.jpg",
        demandScore: "Medium",
        pricePerSqFt: 1100,
        priceTrend: 3,
        transactionVolume: 8,
        marketComparison: 2,
        yieldEst: 8.5
    },
    {
        id: "5",
        name: "Emaar Beachfront",
        developer: "Emaar",
        location: "Dubai Harbour",
        price: "AED 4,100,000",
        status: "Ready",
        type: "Sales",
        image: "/images/placeholder-5.jpg",
        demandScore: "High",
        pricePerSqFt: 3800,
        priceTrend: 15,
        transactionVolume: 30,
        marketComparison: 20,
        yieldEst: 6.0
    },
    {
        id: "6",
        name: "Damac Lagoons",
        developer: "Damac",
        location: "Hessa Street",
        price: "AED 2,800,000",
        status: "Off-plan",
        type: "Sales",
        image: "/images/placeholder-6.jpg",
        completion: "Q1 2026",
        demandScore: "Low",
        pricePerSqFt: 1400,
        priceTrend: -2,
        transactionVolume: 5,
        marketComparison: -5,
        yieldEst: 5.0
    }
]
