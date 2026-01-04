"use client";

import * as React from "react";
import { BentoBox } from "./bento-box";
import { LineChart } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type TimeRange = "3M" | "6M" | "1Y" | "2Y" | "3Y" | "5Y";

interface PriceTrendData {
    month: string;
    value: number;
}

interface PriceTrendsCardProps {
    currentAvg: string;
    changePercent: number;
    data?: PriceTrendData[];
    className?: string;
}

// Sample data sets for different time ranges
const timeRangeData: Record<TimeRange, PriceTrendData[]> = {
    "3M": [
        { month: "Oct", value: 1235 },
        { month: "Nov", value: 1240 },
        { month: "Dec", value: 1247 },
    ],
    "6M": [
        { month: "Jul", value: 1195 },
        { month: "Aug", value: 1210 },
        { month: "Sep", value: 1225 },
        { month: "Oct", value: 1235 },
        { month: "Nov", value: 1240 },
        { month: "Dec", value: 1247 },
    ],
    "1Y": [
        { month: "Jan", value: 1150 },
        { month: "Feb", value: 1160 },
        { month: "Mar", value: 1180 },
        { month: "Apr", value: 1175 },
        { month: "May", value: 1190 },
        { month: "Jun", value: 1200 },
        { month: "Jul", value: 1195 },
        { month: "Aug", value: 1210 },
        { month: "Sep", value: 1225 },
        { month: "Oct", value: 1235 },
        { month: "Nov", value: 1240 },
        { month: "Dec", value: 1247 },
    ],
    "2Y": [
        { month: "Jan 23", value: 1020 },
        { month: "Apr 23", value: 1055 },
        { month: "Jul 23", value: 1085 },
        { month: "Oct 23", value: 1110 },
        { month: "Jan 24", value: 1150 },
        { month: "Apr 24", value: 1175 },
        { month: "Jul 24", value: 1195 },
        { month: "Oct 24", value: 1235 },
    ],
    "3Y": [
        { month: "2022", value: 920 },
        { month: "Q2 22", value: 965 },
        { month: "Q3 22", value: 990 },
        { month: "Q4 22", value: 1015 },
        { month: "Q1 23", value: 1040 },
        { month: "Q2 23", value: 1070 },
        { month: "Q3 23", value: 1095 },
        { month: "Q4 23", value: 1120 },
        { month: "Q1 24", value: 1165 },
        { month: "Q2 24", value: 1190 },
        { month: "Q3 24", value: 1220 },
        { month: "Q4 24", value: 1247 },
    ],
    "5Y": [
        { month: "2020", value: 780 },
        { month: "2021", value: 850 },
        { month: "2022", value: 980 },
        { month: "2023", value: 1100 },
        { month: "2024", value: 1247 },
    ],
};

const timeRangeLabels: TimeRange[] = ["3M", "6M", "1Y", "2Y", "3Y", "5Y"];

export function PriceTrendsCard({
    currentAvg,
    changePercent,
    data,
    className
}: PriceTrendsCardProps) {
    const [selectedRange, setSelectedRange] = React.useState<TimeRange>("1Y");
    const isPositive = changePercent >= 0;

    const chartData = data || timeRangeData[selectedRange];

    const maxValue = Math.max(...chartData.map(d => d.value));
    const minValue = Math.min(...chartData.map(d => d.value));
    const range = maxValue - minValue || 1;

    const points = chartData.map((d, i) => {
        const x = (i / (chartData.length - 1)) * 100;
        const y = 100 - ((d.value - minValue) / range) * 80;
        return `${x},${y}`;
    }).join(" ");

    // Calculate labels to show (max 4-5 for readability)
    const labelInterval = Math.ceil(chartData.length / 4);

    return (
        <BentoBox span="5" className={className}>
            <div className="flex flex-col h-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-chart-green/20 flex items-center justify-center">
                            <LineChart className="w-4 h-4 text-chart-green" />
                        </div>
                        <span className="text-sm font-medium text-foreground-secondary uppercase tracking-wider">
                            Price Trends
                        </span>
                    </div>

                    {/* Time Range Toggles */}
                    <div className="flex items-center gap-1 p-1 rounded-full bg-white/[0.03] border border-white/[0.08]">
                        {timeRangeLabels.map((range) => (
                            <button
                                key={range}
                                onClick={() => setSelectedRange(range)}
                                className={cn(
                                    "relative px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200",
                                    selectedRange === range
                                        ? "text-white"
                                        : "text-foreground-tertiary hover:text-foreground-secondary"
                                )}
                            >
                                {selectedRange === range && (
                                    <motion.div
                                        layoutId="priceRangeIndicator"
                                        className="absolute inset-0 bg-primary/30 border border-primary/40 rounded-full"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{range}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-xs text-foreground-tertiary">Current citywide avg</p>
                            <p className="text-lg font-bold text-foreground">{currentAvg}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${isPositive
                            ? 'bg-success/20 text-success'
                            : 'bg-error/20 text-error'
                            }`}>
                            {isPositive ? '+' : ''}{changePercent}%
                        </div>
                    </div>
                </div>

                {/* Chart Area */}
                <div className="flex-1 min-h-[80px] max-h-[100px] relative">
                    <svg
                        className="w-full h-full"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        {/* Grid lines */}
                        <line x1="0" y1="25" x2="100" y2="25" stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" />
                        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" />
                        <line x1="0" y1="75" x2="100" y2="75" stroke="rgba(255,255,255,0.05)" strokeWidth="0.3" />

                        {/* Gradient fill under line */}
                        <defs>
                            <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="var(--chart-blue)" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="var(--chart-blue)" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        <motion.polygon
                            key={selectedRange}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            points={`0,100 ${points} 100,100`}
                            fill="url(#priceGradient)"
                        />

                        {/* Main line */}
                        <motion.polyline
                            key={`line-${selectedRange}`}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            points={points}
                            fill="none"
                            stroke="var(--chart-blue)"
                            strokeWidth="0.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>

                    {/* Month labels */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-foreground-tertiary px-1">
                        {chartData.filter((_, i) => i % labelInterval === 0 || i === chartData.length - 1).map((d, idx) => (
                            <span key={`${d.month}-${idx}`}>{d.month}</span>
                        ))}
                    </div>
                </div>
            </div>
        </BentoBox>
    );
}
