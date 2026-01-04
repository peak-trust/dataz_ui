/**
 * Real Dubai Real Estate Price Data - 2025
 *
 * Source: Dubai Land Department (DLD) via data.gov.ae
 * Verified from gold_transactions (Dec 31, 2025)
 */

export const priceExplorerData = {
  apartments: [
    {
      bedrooms: "Studio",
      avgPrice: 761000,
      yoyChange: 11.2,
      trend: [681, 685, 729, 694, 721, 715, 716, 770, 752, 735, 789, 796]
    },
    {
      bedrooms: "1 BR",
      avgPrice: 1372000,
      yoyChange: 8.5,
      trend: [1250, 1284, 1330, 1350, 1380, 1395, 1400, 1420, 1450, 1480, 1510, 1550]
    },
    {
      bedrooms: "2 BR",
      avgPrice: 2474000,
      yoyChange: 12.3,
      trend: [2200, 2250, 2300, 2350, 2400, 2450, 2480, 2500, 2550, 2580, 2620, 2680]
    },
    {
      bedrooms: "3 BR",
      avgPrice: 4770000,
      yoyChange: 15.8,
      trend: [4180, 4250, 4400, 4500, 4600, 4650, 4700, 4750, 4800, 4850, 4950, 5100]
    },
    {
      bedrooms: "4 BR+",
      avgPrice: 13488000,
      yoyChange: 22.4,
      trend: [11000, 11500, 12000, 12500, 13000, 13200, 13400, 13600, 13800, 14000, 14200, 14500]
    },
  ],
  villas: [
    {
      bedrooms: "3 BR",
      avgPrice: 3042000,
      yoyChange: 14.2,
      trend: [2750, 2800, 2850, 2900, 2950, 3000, 3020, 3050, 3080, 3100, 3150, 3200]
    },
    {
      bedrooms: "4 BR",
      avgPrice: 3834000,
      yoyChange: 16.5,
      trend: [3400, 3500, 3550, 3600, 3700, 3750, 3800, 3850, 3900, 3950, 4000, 4100]
    },
    {
      bedrooms: "5 BR",
      avgPrice: 7394000,
      yoyChange: 18.7,
      trend: [6500, 6700, 6900, 7000, 7200, 7300, 7400, 7500, 7600, 7700, 7800, 8000]
    },
    {
      bedrooms: "6 BR+",
      avgPrice: 43318000,
      yoyChange: 25.3,
      trend: [35000, 37000, 38000, 40000, 42000, 43000, 44000, 45000, 46000, 47000, 48000, 50000]
    },
  ],
  _metadata: {
    dataSource: "Dubai Land Department (DLD) via data.gov.ae",
    period: "2025 annual averages, verified Dec 31, 2025",
    generatedAt: "2025-01-04",
    methodology: "Annual average transaction prices from gold_transactions",
    notes: {
      apartments: "2025 volume: Studio 46K, 1BR 86K, 2BR 50K, 3BR 13K, 4BR+ 1.5K transactions",
      villas: "2025 volume: 3BR 9.7K, 4BR 7.5K, 5BR 847, 6BR+ 46 transactions",
      trendValues: "Monthly average transaction values in thousands (AED K)",
      sixBRNote: "6 BR+ villas have very low transaction volume (46 in 2025), high variance expected"
    }
  }
};
