"use client";

import { motion } from "framer-motion";
import {
  BentoGrid,
  SalesVolumeCard,
  GrowthCard,
  TopAreasCard,
  PriceTrendsCard,
  RentalMarketCard,
  OffPlanReadyCard,
  SupplyCard,
  DeveloperActivityCard,
  ConstructionPermitsCard,
} from "@/components/dashboard";

// Sample data matching the mockup
const topAreas = [
  { rank: 1, name: "Marina", value: 3247 },
  { rank: 2, name: "Downtown", value: 2891 },
  { rank: 3, name: "Business Bay", value: 2456 },
  { rank: 4, name: "JVC", value: 2103 },
  { rank: 5, name: "JLT", value: 1847 },
];

const topDevelopers = [
  { rank: 1, name: "Emaar", projects: 427 },
  { rank: 2, name: "Damac", projects: 312 },
  { rank: 3, name: "Nakheel", projects: 289 },
  { rank: 4, name: "Meraas", projects: 201 },
  { rank: 5, name: "Sobha", projects: 156 },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[20%] w-[25%] h-[25%] bg-purple-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Dubai Real Estate Market
          </h1>
          <p className="text-foreground-secondary mt-2">
            Last 12 Months (Jan - Dec 2024)
          </p>
        </motion.div>

        {/* Bento Grid Dashboard */}
        <BentoGrid>
          {/* Row 1: Sales Volume | Growth | Top Areas */}
          <SalesVolumeCard
            lastMonth="24,847"
            thisYear="289,764"
          />

          <GrowthCard
            percentage={12.3}
            comparison="vs 2023"
          />

          <TopAreasCard
            subtitle="(Dec 2024)"
            areas={topAreas}
          />

          {/* Row 2: Price Trends (full width) */}
          <PriceTrendsCard
            currentAvg="AED 1,247/sqft"
            changePercent={8.2}
          />

          {/* Row 3: Rental Market | Off-Plan vs Ready */}
          <RentalMarketCard
            newContracts="115,045"
            avgGrowth={6.8}
            topAreas={["Marina", "Downtown", "Business Bay"]}
          />

          <OffPlanReadyCard
            offPlanPercent={45}
            readyPercent={55}
            offPlanGrowth={18}
            readyGrowth={4}
          />

          {/* Row 4: Supply | Developer Activity | Construction Permits */}
          <SupplyCard
            areas={127}
            activeDevelopers={892}
          />

          <DeveloperActivityCard
            developers={topDevelopers}
          />

          <ConstructionPermitsCard
            approved="72,400"
            changePercent={15.8}
          />
        </BentoGrid>
      </div>
    </main>
  );
}
