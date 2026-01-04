/**
 * Chapter Timeline Data - Real 2025 DLD Transaction Data
 * Source: Dubai Land Department via dxb_analytics RDS (precalc_area_quarterly)
 * Last updated: December 2025
 */

export interface QuarterlyMilestone {
    quarter: "Q1" | "Q2" | "Q3" | "Q4";
    title: string;
    highlight: string;
    transactions: number;
    valueAedBillions: number;
    offPlanPercent: number;
    avgPricePerSqft: number;
    yoyTxGrowth: number;
    yoyValueGrowth: number;
    topAreas: Array<{ name: string; transactions: number }>;
    fastestGrowing: { name: string; yoyGrowth: number };
    insights: string[];
    type: "milestone" | "record" | "growth";
    recordHighlight?: string;
}

// Verified quarterly data from DLD (Dec 31, 2025)
export const quarterlyMilestones2025: QuarterlyMilestone[] = [
    {
        quarter: "Q1",
        title: "Strong Start",
        highlight: "Off-plan leads with 45% market share as year begins",
        transactions: 56767,
        valueAedBillions: 193.52,
        offPlanPercent: 45,
        avgPricePerSqft: 1663,
        yoyTxGrowth: 23.5,
        yoyValueGrowth: 17.6,
        topAreas: [
            { name: "JVC", transactions: 4374 },
            { name: "MBR City", transactions: 4111 },
            { name: "Dubai Marina", transactions: 3371 },
        ],
        fastestGrowing: { name: "Dubai Investment Park", yoyGrowth: 157.6 },
        insights: [
            "56,767 transactions worth AED 193.5B - strongest Q1 ever",
            "Off-plan captures 45% market share from day one",
            "DIP prices surge 158% YoY - affordability rush begins",
        ],
        type: "growth",
    },
    {
        quarter: "Q2",
        title: "Value Peak",
        highlight: "Record value quarter - AED 237.77B (+34% YoY)",
        transactions: 66557,
        valueAedBillions: 237.77,
        offPlanPercent: 46,
        avgPricePerSqft: 1761,
        yoyTxGrowth: 25.0,
        yoyValueGrowth: 33.8,
        topAreas: [
            { name: "JVC", transactions: 6091 },
            { name: "Business Bay", transactions: 3502 },
            { name: "MBR City", transactions: 3083 },
        ],
        fastestGrowing: { name: "Mirdif", yoyGrowth: 396.3 },
        insights: [
            "Record value quarter: AED 237.77B (+34% YoY)",
            "Mirdif prices spike 396% YoY as families seek space",
            "JVC crosses 6,000 quarterly transactions - new benchmark",
        ],
        type: "record",
        recordHighlight: "Highest value quarter ever recorded",
    },
    {
        quarter: "Q3",
        title: "Volume Record",
        highlight: "Peak quarter with 72,630 transactions - all-time high",
        transactions: 72630,
        valueAedBillions: 236.15,
        offPlanPercent: 55,
        avgPricePerSqft: 1784,
        yoyTxGrowth: 15.9,
        yoyValueGrowth: 19.1,
        topAreas: [
            { name: "JVC", transactions: 6512 },
            { name: "Business Bay", transactions: 5006 },
            { name: "Dubai Investment Park", transactions: 3220 },
        ],
        fastestGrowing: { name: "Saih Shuaib", yoyGrowth: 89.6 },
        insights: [
            "Peak quarter: 72,630 transactions - all-time record",
            "Off-plan reaches 55% share in Q3 - peak for the year",
            "July records 25,145 sales - busiest month ever",
        ],
        type: "record",
        recordHighlight: "Highest transaction volume ever recorded",
    },
    {
        quarter: "Q4",
        title: "Year-End Rally",
        highlight: "Strong finish with record single-day value on Dec 15",
        transactions: 66156,
        valueAedBillions: 234.45,
        offPlanPercent: 54,
        avgPricePerSqft: 1806,
        yoyTxGrowth: 4.5,
        yoyValueGrowth: 7.8,
        topAreas: [
            { name: "JVC", transactions: 5190 },
            { name: "Business Bay", transactions: 3514 },
            { name: "MBR City", transactions: 3440 },
        ],
        fastestGrowing: { name: "Trade Center", yoyGrowth: 115.4 },
        insights: [
            "Stable finish with 66,156 transactions",
            "Dec 15 sees 1,700 sales worth AED 8.3B - record single-day value",
            "Off-plan holds at 54% as investor confidence remains strong",
        ],
        type: "milestone",
        recordHighlight: "Highest single-day transaction value",
    },
];

// Verified year summary from DLD (Dec 31, 2025)
export const yearSummary2025 = {
    totalTransactions: 262110,
    totalValueBillions: 901.89,
    yoyTransactionGrowth: 16.4,
    yoyValueGrowth: 19.0,
    peakQuarter: "Q3" as const,
    peakQuarterTransactions: 72630,
    rentalContracts: 1134452,
    offPlanShare: 51, // Annual average (50.6% rounded)
    offPlanPeakShare: 55, // Peak in Q3
    topArea: "JVC (Al Barsha South Fourth)",
    topAreaTransactions: 22167, // Sum of all quarters
    // New metrics
    avgPricePerSqft: 1758, // Weighted average across quarters
    priceGrowthYoY: 6.3, // YoY price appreciation (1654→1758 PSF)
    recordDay: { date: "2025-07-21", transactions: 1880 },
    recordMonth: { month: "July", transactions: 25145 },
    topProject: { name: "Binghatti Skyrise", transactions: 2683, valueBillions: 5.34 },
    offPlanTransactions: 132512, // Total off-plan sales
    existingTransactions: 129598, // Total existing property sales
};

// Comparison with previous year
export const yearComparison = {
    year2024: {
        transactions: 225188,
        valueBillions: 758.01,
        rentalContracts: 1140042,
    },
    year2023: {
        transactions: 165619,
        valueBillions: 629.74,
        rentalContracts: 992581,
    },
};

// Key 2025 Market Narratives (verified Dec 31, 2025)
export const key2025Narratives = {
    offPlanBoom: {
        title: "The Off-Plan Surge",
        summary: "Off-plan sales captured 51% market share, with Q3 peaking at 55%",
        stats: {
            peakShare: 55,
            totalOffPlanTx: 132512,
            topProject: "Binghatti Skyrise (2,683 transactions)",
            yoyGrowth: "+22% off-plan volume vs 2024",
        },
    },
    premiumVsAffordable: {
        title: "Two Markets, One City",
        summary: "Premium areas command 50% higher prices while affordable segments drive volume",
        stats: {
            premiumPsf: 2504,
            affordablePsf: 1669,
            premiumGap: "50% premium",
            premiumShare: "10.6% of transactions",
        },
    },
    developerDominance: {
        title: "Rise of the Super-Developers",
        summary: "Top 10 projects account for 15,447 transactions (5.9% of market)",
        topProjects: [
            { name: "Binghatti Skyrise", transactions: 2683, value: "AED 5.34B" },
            { name: "Sobha Solis", transactions: 2038, value: "AED 2.51B" },
            { name: "Binghatti Elite", transactions: 1689, value: "AED 1.13B" },
            { name: "Skyvue", transactions: 1613, value: "AED 3.64B" },
            { name: "Sobha Orbis", transactions: 1520, value: "AED 1.98B" },
        ],
    },
    rentalMarket: {
        title: "Rental Resilience",
        summary: "1.13M contracts registered with 7.6% rent increase YoY",
        stats: {
            totalContracts: 1134452,
            avgAnnualRent: 359785,
            yoyRentGrowth: 7.6,
            topRentalArea: "JVC",
        },
    },
    priceAppreciation: {
        title: "Steady Price Growth",
        summary: "Market-wide prices rose 6.3% YoY with Q4 reaching AED 1,806/sqft",
        quarterlyPsf: {
            Q1: 1663,
            Q2: 1761,
            Q3: 1784,
            Q4: 1806,
        },
    },
};

// Footnotes for data attribution
export const timelineFootnotes = {
    dataSource: "Dubai Land Department (DLD) via Dubai Pulse Open Data Portal",
    lastUpdated: "December 31st, 2025",
    methodology: [
        "Transaction data includes all registered sales (off-plan and ready properties)",
        "Off-plan identified from DLD registration category",
        "Price per sqft converted from AED/sqm at 10.764 sqft/sqm",
        "YoY growth compares same quarter of previous year",
        "Area names mapped from DLD registration areas to common names",
    ],
    definitions: {
        transactions: "Number of registered property sales with DLD",
        value: "Total transaction value in AED as recorded by DLD",
        offPlan: "Properties sold before or during construction",
        ready: "Completed properties (existing/ready units)",
        yoyGrowth: "Year-over-year percentage change vs same period in 2024",
        pricePerSqft: "Average transaction price divided by property area in square feet",
    },
    caveats: [
        "Data reflects registered transactions only; actual market activity may vary",
        "Some areas consolidated for readability (e.g., JVC = Al Barsha South Fourth)",
        "Rental data from Ejari registration system",
        "Record day/month statistics based on registration date, not contract signing date",
    ],
};

// Quarter color schemes for UI
export const quarterColors = {
    Q1: {
        gradient: "from-blue-500/20 to-cyan-500/20",
        border: "border-blue-500/30",
        accent: "text-blue-400",
        bg: "bg-blue-500/10",
    },
    Q2: {
        gradient: "from-green-500/20 to-emerald-500/20",
        border: "border-green-500/30",
        accent: "text-green-400",
        bg: "bg-green-500/10",
    },
    Q3: {
        gradient: "from-amber-500/20 to-orange-500/20",
        border: "border-amber-500/30",
        accent: "text-amber-400",
        bg: "bg-amber-500/10",
    },
    Q4: {
        gradient: "from-purple-500/20 to-pink-500/20",
        border: "border-purple-500/30",
        accent: "text-purple-400",
        bg: "bg-purple-500/10",
    },
};
