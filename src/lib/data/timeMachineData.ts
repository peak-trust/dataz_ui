import { StoryArea } from './storyData';

export interface YearlyPriceData {
  year: 2020 | 2021 | 2022 | 2023 | 2024 | 2025;
  avg_price_sqft: number;
  transaction_count: number;
  growth_percent: number;
}

export interface AreaHistoricalData {
  area_id: number;
  area_name: string;
  data: YearlyPriceData[];
  total_growth_2020_2025: number;
}

// Generate historical price data for 2020-2025 based on 2024 base prices
function generateHistoricalData(area: StoryArea): AreaHistoricalData {
  const basePrice2024 = area.stats.avg_price_sqft;
  const baseTransactions2024 = area.stats.transaction_count_2024;

  // Calculate growth trajectory (assuming compound growth)
  // Start from 2020 at ~75% of 2024 price, grow to 2024, then project 2025
  const price2020 = basePrice2024 * 0.75;
  const price2025 = basePrice2024 * (1 + area.stats.yoy_growth / 100);

  // Calculate annual growth rates (non-linear, accelerating)
  const years: YearlyPriceData[] = [];
  const growthRates = [0.08, 0.12, 0.15, 0.18, area.stats.yoy_growth / 100, area.stats.yoy_growth / 100];

  let currentPrice = price2020;
  let currentTransactions = baseTransactions2024 * 0.6; // Start lower in 2020

  [2020, 2021, 2022, 2023, 2024, 2025].forEach((year, index) => {
    if (index > 0) {
      currentPrice = currentPrice * (1 + growthRates[index - 1]);
      currentTransactions = currentTransactions * (1 + growthRates[index - 1] * 0.8); // Transactions grow slower
    }

    years.push({
      year: year as YearlyPriceData['year'],
      avg_price_sqft: Math.round(currentPrice),
      transaction_count: Math.round(currentTransactions),
      growth_percent: index === 0 ? 0 : growthRates[index - 1] * 100,
    });
  });

  // Ensure 2024 matches exactly
  years[4].avg_price_sqft = basePrice2024;
  years[4].transaction_count = baseTransactions2024;

  const totalGrowth = ((years[5].avg_price_sqft - years[0].avg_price_sqft) / years[0].avg_price_sqft) * 100;

  return {
    area_id: area.id,
    area_name: area.name,
    data: years,
    total_growth_2020_2025: totalGrowth,
  };
}

// Import areas from storyData
import { storyData } from './storyData';

// Generate historical data for all 20 areas
export const historicalData: AreaHistoricalData[] = storyData.areas.map((area) =>
  generateHistoricalData(area)
);

// Helper to get price for a specific area and year
export function getPriceForYear(areaId: number, year: YearlyPriceData['year']): number {
  const areaData = historicalData.find((d) => d.area_id === areaId);
  if (!areaData) return 0;
  const yearData = areaData.data.find((d) => d.year === year);
  return yearData?.avg_price_sqft || 0;
}

// Helper to get growth percentage between two years
export function getGrowthBetweenYears(
  areaId: number,
  startYear: YearlyPriceData['year'],
  endYear: YearlyPriceData['year']
): number {
  const startPrice = getPriceForYear(areaId, startYear);
  const endPrice = getPriceForYear(areaId, endYear);
  if (startPrice === 0) return 0;
  return ((endPrice - startPrice) / startPrice) * 100;
}

// Calculate investment return
export function calculateInvestmentReturn(
  amount: number,
  areaId: number,
  startYear: YearlyPriceData['year']
): {
  finalAmount: number;
  profit: number;
  growthPercent: number;
  yearByYear: Array<{ year: number; value: number }>;
} {
  const areaData = historicalData.find((d) => d.area_id === areaId);
  if (!areaData) {
    return { finalAmount: amount, profit: 0, growthPercent: 0, yearByYear: [] };
  }

  const startIndex = areaData.data.findIndex((d) => d.year === startYear);
  if (startIndex === -1) {
    return { finalAmount: amount, profit: 0, growthPercent: 0, yearByYear: [] };
  }

  const endYear = 2025;
  const endIndex = areaData.data.findIndex((d) => d.year === endYear);
  if (endIndex === -1) {
    return { finalAmount: amount, profit: 0, growthPercent: 0, yearByYear: [] };
  }

  let currentAmount = amount;
  const yearByYear: Array<{ year: number; value: number }> = [];

  for (let i = startIndex; i <= endIndex; i++) {
    if (i > startIndex) {
      const growthRate = areaData.data[i].growth_percent / 100;
      currentAmount = currentAmount * (1 + growthRate);
    }
    yearByYear.push({
      year: areaData.data[i].year,
      value: Math.round(currentAmount),
    });
  }

  const profit = currentAmount - amount;
  const growthPercent = (profit / amount) * 100;

  return {
    finalAmount: Math.round(currentAmount),
    profit: Math.round(profit),
    growthPercent: Math.round(growthPercent * 10) / 10,
    yearByYear,
  };
}

// Get top performers
export function getTopPerformers(count: number = 3): Array<{
  area_id: number;
  area_name: string;
  growth_percent: number;
}> {
  return historicalData
    .map((data) => ({
      area_id: data.area_id,
      area_name: data.area_name,
      growth_percent: data.total_growth_2020_2025,
    }))
    .sort((a, b) => b.growth_percent - a.growth_percent)
    .slice(0, count);
}

// Get market average price for a year
export function getMarketAverage(year: YearlyPriceData['year']): number {
  const prices = historicalData
    .map((data) => {
      const yearData = data.data.find((d) => d.year === year);
      return yearData?.avg_price_sqft || 0;
    })
    .filter((p) => p > 0);

  if (prices.length === 0) return 0;
  return Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length);
}

// Get total transactions for a year
export function getTotalTransactions(year: YearlyPriceData['year']): number {
  return historicalData.reduce((sum, data) => {
    const yearData = data.data.find((d) => d.year === year);
    return sum + (yearData?.transaction_count || 0);
  }, 0);
}

