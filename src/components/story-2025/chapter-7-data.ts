/**
 * Real neighborhood data from Dubai Land Department
 * Source: precalc_area_quarterly (2025) + gold_dim_areas
 */

export interface NeighborhoodData {
    name: string;
    pricePerSqft: number;
    transactions: number;
    yoyChange: number;
    category: ("affordable" | "connectivity" | "family" | "investment" | "luxury")[];
}

// Real data from DLD 2025 - Verified December 2025
export const neighborhoods: NeighborhoodData[] = [
    {
        name: "JVC",
        pricePerSqft: 1432,
        transactions: 22167,
        yoyChange: 12.4,
        category: ["affordable", "family", "investment"],
    },
    {
        name: "Business Bay",
        pricePerSqft: 2501,
        transactions: 15086,
        yoyChange: 10.0,
        category: ["connectivity", "investment"],
    },
    {
        name: "MBR City",
        pricePerSqft: 1321,
        transactions: 13597,
        yoyChange: 17.5,
        category: ["affordable", "family", "investment"],
    },
    {
        name: "Dubai South",
        pricePerSqft: 1509,
        transactions: 11347,
        yoyChange: 16.9,
        category: ["affordable", "investment"],
    },
    {
        name: "Dubai Marina",
        pricePerSqft: 2768,
        transactions: 10433,
        yoyChange: 12.4,
        category: ["luxury", "connectivity"],
    },
    {
        name: "Downtown Dubai",
        pricePerSqft: 2593,
        transactions: 7099,
        yoyChange: 10.1,
        category: ["luxury", "connectivity", "investment"],
    },
    {
        name: "Dubai Hills Estate",
        pricePerSqft: 2232,
        transactions: 6414,
        yoyChange: 4.3,
        category: ["family", "luxury"],
    },
    {
        name: "Palm Jumeirah",
        pricePerSqft: 3213,
        transactions: 2825,
        yoyChange: -0.6,
        category: ["luxury"],
    },
];

// Summary statistics from DLD 2025 data - Verified December 31st, 2025
export const summaryStats = {
    totalAreas: 182,
    highGrowthAreas: 60,
    emergingMarkets: 23,
    avgPriceGrowth: 9.3,
};

export const dataSource = "Source: Dubai Land Department 2025. Last updated: December 31st, 2025.";

export const footnotes = [
    "Prices shown are average price per square foot based on 2025 registered transactions.",
    "YoY Change reflects year-over-year price growth comparing 2025 to 2024 averages.",
    "High Growth Areas defined as areas with >15% YoY price appreciation.",
    "Emerging Markets are affordable areas (<AED 1,500/sqft) with above-average growth potential.",
    "Avg. Price Growth is the median YoY appreciation across all 182 active trading areas.",
];
