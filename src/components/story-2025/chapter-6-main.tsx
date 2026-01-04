"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChapterContainer } from "./shared-chapter-container";
import { DataCounter } from "./shared-data-counter";
import { TrendingUp, Building2, MapPin, Calendar, HardHat, DollarSign, BarChart3, Lightbulb } from "lucide-react";
import { useGsap, gsap } from "@/lib/hooks/useGsap";
import { motion } from "framer-motion";


// Verified data from DLD gold_transactions (Dec 31, 2025)
const offPlanData = {
    avgPricePerSqft: 2029,           // City-wide avg from gold_transactions 2025
    marketShare: 51,                  // 50.6% of all sales (132,512 transactions)
    yoyGrowth: 22.1,                 // Transactions YoY growth
    topArea: "JVC",                   // Top off-plan area (Al Barsha South Fourth)
    topAreaTransactions: 25792,       // Sports City Swimming Academy landmark area
    totalTransactions: 132512,
    avgTransactionValue: 2.19,        // Million AED - accessible entry point
};

const existingData = {
    avgPricePerSqft: 1401,           // City-wide avg from gold_transactions 2025
    marketShare: 49,                  // 49.4% of all sales (129,598 transactions)
    yoyGrowth: 10.5,                 // Transactions YoY growth
    topArea: "Downtown Dubai",        // Top existing area
    topAreaTransactions: 10889,       // Downtown Dubai landmark area
    totalTransactions: 129598,
    avgTransactionValue: 4.72,        // Million AED - larger/premium units
};

// Verified 2025 monthly data from gold_transactions (Dec 31, 2025)
const monthlyComparison = [
    { month: "Jan", offPlan: 42, existing: 58 },
    { month: "Feb", offPlan: 46, existing: 54 },
    { month: "Mar", offPlan: 48, existing: 52 },
    { month: "Apr", offPlan: 46, existing: 54 },
    { month: "May", offPlan: 44, existing: 56 },
    { month: "Jun", offPlan: 47, existing: 53 },
    { month: "Jul", offPlan: 51, existing: 49 },
    { month: "Aug", offPlan: 57, existing: 43 },
    { month: "Sep", offPlan: 58, existing: 42 },  // Peak off-plan share
    { month: "Oct", offPlan: 53, existing: 47 },
    { month: "Nov", offPlan: 55, existing: 45 },
    { month: "Dec", offPlan: 56, existing: 44 },
];

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    subValue?: string;
    color: "primary" | "success" | "warning";
}

function StatCard({ icon, label, value, subValue, color }: StatCardProps) {

    const colorClasses = {
        primary: "text-primary",
        success: "text-success",
        warning: "text-chart-amber",
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.05)" }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] transition-colors"
        >
            <div className="flex items-center gap-2 text-foreground-secondary mb-2">
                {icon}
                <span className="text-sm">{label}</span>
            </div>
            <div className={cn("text-2xl font-bold", colorClasses[color])}>
                {value}
            </div>
            {subValue && (
                <div className="text-sm text-foreground-tertiary mt-1">{subValue}</div>
            )}
        </motion.div>
    );
}

export function ChapterOffPlanVsExisting() {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const vsBadgeRef = React.useRef<HTMLDivElement>(null);
    const splitContainerRef = React.useRef<HTMLDivElement>(null);
    const offPlanRef = React.useRef<HTMLDivElement>(null);
    const existingRef = React.useRef<HTMLDivElement>(null);
    const offPlanBarRef = React.useRef<HTMLDivElement>(null);
    const existingBarRef = React.useRef<HTMLDivElement>(null);


    const chartContainerRef = React.useRef<HTMLDivElement>(null);
    const insightRef = React.useRef<HTMLDivElement>(null);

    useGsap((gsap) => {
        // Main Comparison Section
        if (containerRef.current) {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 75%",
                }
            });

            // VS Badge
            if (vsBadgeRef.current) {
                tl.fromTo(vsBadgeRef.current,
                    { scale: 0 },
                    { scale: 1, duration: 0.5, ease: "back.out(1.7)" }
                );
            }

            // Columns
            if (offPlanRef.current && existingRef.current) {
                tl.fromTo(offPlanRef.current,
                    { x: -30, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
                    "-=0.2"
                );
                tl.fromTo(existingRef.current,
                    { x: 30, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
                    "<"
                );
            }

            // Progress Bars
            if (offPlanBarRef.current) {
                tl.fromTo(offPlanBarRef.current,
                    { width: 0 },
                    { width: `${offPlanData.marketShare}%`, duration: 0.6, ease: "power2.out" },
                    "-=0.2"
                );
            }
            if (existingBarRef.current) {
                tl.fromTo(existingBarRef.current,
                    { width: 0 },
                    { width: `${existingData.marketShare}%`, duration: 0.6, ease: "power2.out" },
                    "<"
                );
            }
        }

        // Monthly Chart
        if (chartContainerRef.current) {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: chartContainerRef.current,
                    start: "top 80%",
                }
            });

            tl.fromTo(chartContainerRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
            );

            // Stagger bars
            const bars = chartContainerRef.current.querySelectorAll(".chart-bar");
            tl.fromTo(bars,
                { height: 0 },
                {
                    height: (i, target) => target.dataset.height || "0%",
                    stagger: 0.05,
                    duration: 0.4,
                    ease: "power2.out"
                },
                "-=0.3"
            );
        }

        // Key Insight
        if (insightRef.current) {
            gsap.fromTo(insightRef.current,
                { opacity: 0, y: 20 },
                {
                    opacity: 1, y: 0,
                    duration: 0.5,
                    delay: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: insightRef.current,
                        start: "top 85%",
                    }
                }
            );
        }

    }, []);

    return (
        <ChapterContainer
            chapterNumber={6}
            title="Off-Plan vs. Existing"
            subtitle="Off-plan edges ahead with 51% market share. Despite higher price per sqft, average transactions are half the cost - making it Dubai's accessible entry point."
        >
            <div ref={containerRef}>
                {/* Main split-screen comparison */}
                <div ref={splitContainerRef} className="relative rounded-2xl overflow-hidden bg-white/[0.03] backdrop-blur-xl border border-white/[0.08]">
                    {/* VS Badge */}
                    <div
                        ref={vsBadgeRef}
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 scale-0"
                    >
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-chart-amber to-orange-500 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                            <span className="text-xl font-black text-white">VS</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Off-Plan Side */}
                        <div
                            ref={offPlanRef}
                            className="p-6 pb-12 md:p-8 border-b md:border-b-0 md:border-r border-white/[0.08] opacity-0"
                        >
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-sm font-medium mb-3">
                                    <HardHat className="w-4 h-4" /> OFF-PLAN
                                </div>
                                <h3 className="text-xl font-bold text-foreground">Properties</h3>
                            </div>

                            <div className="space-y-4">
                                <StatCard
                                    icon={<DollarSign className="w-4 h-4" />}
                                    label="Avg Price/sqft"
                                    value={`${offPlanData.avgPricePerSqft.toLocaleString()} AED`}
                                    color="primary"
                                />

                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                    <div className="flex items-center gap-2 text-foreground-secondary mb-2">
                                        <BarChart3 className="w-4 h-4" /> <span className="text-sm">Market Share</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl font-bold text-primary">
                                            <DataCounter value={offPlanData.marketShare} suffix="%" />
                                        </div>
                                        <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                ref={offPlanBarRef}
                                                className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
                                                style={{ width: 0 }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <StatCard
                                    icon={<TrendingUp className="w-4 h-4" />}
                                    label="YoY Growth"
                                    value={`+${offPlanData.yoyGrowth}%`}
                                    subValue="Strong off-plan demand"
                                    color="success"
                                />

                                <StatCard
                                    icon={<MapPin className="w-4 h-4" />}
                                    label="Top Area"
                                    value={offPlanData.topArea}
                                    subValue={`${offPlanData.topAreaTransactions.toLocaleString()} transactions`}
                                    color="warning"
                                />
                            </div>
                        </div>

                        {/* Existing Side */}
                        <div
                            ref={existingRef}
                            className="p-6 pt-12 md:p-8 opacity-0"
                        >
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/20 border border-success/30 text-success text-sm font-medium mb-3">
                                    <Building2 className="w-4 h-4" /> EXISTING
                                </div>
                                <h3 className="text-xl font-bold text-foreground">Properties</h3>
                            </div>

                            <div className="space-y-4">
                                <StatCard
                                    icon={<DollarSign className="w-4 h-4" />}
                                    label="Avg Price/sqft"
                                    value={`${existingData.avgPricePerSqft.toLocaleString()} AED`}
                                    color="success"
                                />

                                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                    <div className="flex items-center gap-2 text-foreground-secondary mb-2">
                                        <BarChart3 className="w-4 h-4" /> <span className="text-sm">Market Share</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl font-bold text-success">
                                            <DataCounter value={existingData.marketShare} suffix="%" />
                                        </div>
                                        <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                ref={existingBarRef}
                                                className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full"
                                                style={{ width: 0 }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <StatCard
                                    icon={<TrendingUp className="w-4 h-4" />}
                                    label="YoY Growth"
                                    value={`+${existingData.yoyGrowth}%`}
                                    subValue="▲ Steady growth"
                                    color="success"
                                />

                                <StatCard
                                    icon={<MapPin className="w-4 h-4" />}
                                    label="Top Area"
                                    value={existingData.topArea}
                                    subValue={`${existingData.topAreaTransactions.toLocaleString()} transactions`}
                                    color="warning"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Monthly comparison chart */}
                <motion.div
                    ref={chartContainerRef}
                    className="mt-8 p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] opacity-0"
                >
                    <h4 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-primary" />
                        Market Share Evolution (2025)
                    </h4>

                    {/* Stacked bar chart */}
                    <div className="overflow-x-auto pb-4 -mx-2 px-2 custom-scrollbar">
                        <div className="flex items-end gap-2 h-40 min-w-[600px] md:min-w-0">
                            {monthlyComparison.map((data, index) => (
                                <div key={data.month} className="flex-1 flex flex-col items-center">
                                    <div className="w-full flex flex-col-reverse h-32">
                                        <motion.div
                                            whileHover={{ scaleX: 1.1, opacity: 0.9 }}
                                            className="chart-bar w-full bg-gradient-to-t from-primary/80 to-primary rounded-t"
                                            style={{ height: 0 }}
                                            data-height={`${data.offPlan}%`}
                                        />
                                        <motion.div
                                            whileHover={{ scaleX: 1.1, opacity: 0.9 }}
                                            className="chart-bar w-full bg-gradient-to-t from-success/80 to-success rounded-t"
                                            style={{ height: 0 }}
                                            data-height={`${data.existing}%`}
                                        />
                                    </div>
                                    <span className="text-xs text-foreground-tertiary mt-2">{data.month}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center gap-6 mt-6">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-gradient-to-r from-primary to-primary-light" />
                            <span className="text-sm text-foreground-secondary">Off-Plan</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded bg-gradient-to-r from-success to-emerald-400" />
                            <span className="text-sm text-foreground-secondary">Existing</span>
                        </div>
                    </div>
                </motion.div>

                {/* Key insight */}
                <div
                    ref={insightRef}
                    className="mt-6 p-4 rounded-xl bg-chart-amber/10 border border-chart-amber/20 opacity-0"
                >
                    <div className="flex items-start gap-3">
                        <Lightbulb className="w-6 h-6 text-chart-amber flex-shrink-0" />
                        <div>
                            <div className="font-semibold text-foreground mb-1">Key Insight</div>
                            <div className="text-sm text-foreground-secondary">
                                Off-plan now accounts for 51% of all Dubai property sales. While priced 45% higher
                                per sqft (2,029 vs 1,401 AED), off-plan units average 2.19M AED versus 4.72M for existing -
                                making new developments the gateway for first-time buyers and investors seeking
                                flexible payment plans.
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Citation */}
                <div className="mt-6 text-xs text-foreground-tertiary/60 border-t border-white/[0.05] pt-4">
                    <p className="mb-1">
                        <span className="font-medium">Data Source:</span> Dubai Land Department (DLD) official transaction records, 2025. Last updated: December 31st, 2025.
                    </p>
                    <p className="mb-1">
                        <span className="font-medium">Methodology:</span> "Off-Plan" = properties registered under DLD's "Off-Plan Properties"
                        category (under construction/pre-completion). "Existing" = completed/ready properties.
                    </p>
                    <p>
                        <span className="font-medium">Price/sqft:</span> Calculated as transaction value ÷ property area.
                        Outliers filtered (PSF &gt; 10,000 AED excluded).
                    </p>
                </div>
            </div>
        </ChapterContainer>
    );
}
