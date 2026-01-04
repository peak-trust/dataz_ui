"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChapterContainer } from "./shared-chapter-container";
import { TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Building2, Home } from "lucide-react";
import { priceExplorerData } from "./chapter-5-data";
import { useGsap, gsap, ScrollTrigger } from "@/lib/hooks/useGsap";
import { useHaptics } from "./hooks/use-haptics";
import { motion } from "framer-motion";


type PropertyType = "apartments" | "villas";

const propertyTypes: { id: PropertyType; label: string; icon: React.ReactNode }[] = [
    { id: "apartments", label: "Apartments", icon: <Building2 className="w-4 h-4" /> },
    { id: "villas", label: "Villas", icon: <Home className="w-4 h-4" /> },
];

// Real price data by bedroom type for each property type (imported from chapter-price-explorer-data.ts)
const priceData = priceExplorerData;

function MiniTrendChart({ data, positive }: { data: number[]; positive: boolean }) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * 100;
        const y = 100 - ((value - min) / range) * 100;
        return `${x},${y}`;
    }).join(" ");

    return (
        <svg viewBox="0 0 100 100" className="w-full h-12" preserveAspectRatio="none">
            <defs>
                <linearGradient id={`gradient-${positive ? "up" : "down"}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={positive ? "rgba(16, 185, 129, 0.3)" : "rgba(248, 113, 113, 0.3)"} />
                    <stop offset="100%" stopColor="transparent" />
                </linearGradient>
            </defs>
            <polygon
                points={`0,100 ${points} 100,100`}
                fill={`url(#gradient-${positive ? "up" : "down"})`}
            />
            <polyline
                points={points}
                fill="none"
                stroke={positive ? "#10B981" : "#F87171"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function PriceCard({
    bedrooms,
    avgPrice,
    yoyChange,
    trend,
    delay
}: {
    bedrooms: string;
    avgPrice: number;
    yoyChange: number;
    trend: number[];
    delay: number;
}) {
    const ref = React.useRef<HTMLDivElement>(null);
    const { triggerHaptic } = useHaptics();

    useGsap((gsap) => {
        if (!ref.current) return;

        gsap.fromTo(ref.current,
            { opacity: 0, x: 30 },
            {
                opacity: 1, x: 0,
                duration: 0.4,
                delay: delay,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: ref.current,
                    start: "top 85%", // Trigger when top of card hits bottom 15% of viewport
                    toggleActions: "play none none reverse"
                }
            }
        );
    }, [delay]);

    const formatPrice = (price: number) => {
        if (price >= 1000000) {
            return `${(price / 1000000).toFixed(1)}M`;
        }
        return `${(price / 1000).toFixed(0)}K`;
    };

    return (
        <motion.div
            ref={ref}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 w-[200px] md:w-[240px] rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] overflow-hidden hover:border-white/[0.15] transition-all opacity-0"
        >
            <div className="p-5">
                <div className="text-sm text-foreground-secondary mb-1">{bedrooms}</div>
                <div className="text-2xl font-bold text-foreground mb-2">
                    AED {formatPrice(avgPrice)}
                </div>
                <div className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    yoyChange >= 0 ? "text-success" : "text-error"
                )}>
                    {yoyChange >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                    ) : (
                        <TrendingDown className="w-4 h-4" />
                    )}
                    {yoyChange >= 0 ? "+" : ""}{yoyChange}% YoY
                </div>
            </div>
            <div className="px-2 pb-2">
                <MiniTrendChart data={trend} positive={yoyChange >= 0} />
            </div>
        </motion.div>
    );
}

export function ChapterPriceExplorer() {
    const [activeType, setActiveType] = React.useState<PropertyType>("apartments");
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const summaryRef = React.useRef<HTMLDivElement>(null);
    const { triggerHaptic } = useHaptics();

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = direction === "left" ? -300 : 300;
            scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    useGsap((gsap) => {
        if (!summaryRef.current) return;

        gsap.fromTo(summaryRef.current,
            { opacity: 0, y: 20 },
            {
                opacity: 1, y: 0,
                duration: 0.4,
                delay: 0.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: summaryRef.current,
                    start: "top 85%",
                }
            }
        );
    }, []);

    return (
        <ChapterContainer
            chapterNumber={5}
            title="The Price is Right?"
            subtitle="A year of price trends across property types. Scroll through to discover how different segments performed."
        >
            {/* Property type tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
                {propertyTypes.map((type) => (
                    <motion.button
                        key={type.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            triggerHaptic("selection");
                            setActiveType(type.id);
                        }}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                            activeType === type.id
                                ? "bg-primary/20 border border-primary/30 text-primary shadow-[0_0_15px_rgba(91,147,255,0.2)]"
                                : "bg-white/[0.03] border border-white/[0.08] text-foreground-secondary hover:bg-white/[0.05] hover:text-foreground"
                        )}
                    >
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                    </motion.button>
                ))}
            </div>

            {/* Netflix-style scrolling cards */}
            <div className="relative">
                {/* Scroll buttons */}
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                        triggerHaptic("light");
                        scroll("left");
                    }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 hidden md:flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-white/10 text-foreground hover:bg-background hover:border-white/20 transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                        triggerHaptic("light");
                        scroll("right");
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 hidden md:flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-white/10 text-foreground hover:bg-background hover:border-white/20 transition-all"
                >
                    <ChevronRight className="w-5 h-5" />
                </motion.button>

                {/* Cards container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-4 md:px-12"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {priceData[activeType].map((item, index) => (
                        <PriceCard
                            key={`${activeType}-${item.bedrooms}`}
                            bedrooms={item.bedrooms}
                            avgPrice={item.avgPrice}
                            yoyChange={item.yoyChange}
                            trend={item.trend}
                            delay={index * 0.1}
                        />
                    ))}
                </div>

                {/* Gradient overlays for scroll indication */}
                <div className="absolute left-10 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none hidden md:block" />
                <div className="absolute right-10 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none hidden md:block" />
            </div>

            {/* Scroll hint */}
            <div className="text-center mt-4 text-sm text-foreground-tertiary">
                ← Scroll for more bedroom configurations →
            </div>

            {/* Summary stats */}
            <div
                ref={summaryRef}
                className="mt-8 p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] opacity-0"
            >
                <h4 className="text-lg font-semibold text-foreground mb-4">
                    {propertyTypes.find(t => t.id === activeType)?.label} Market Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <div className="text-sm text-foreground-secondary">Avg. Price Range</div>
                        <div className="text-xl font-bold text-foreground mt-1">
                            AED {(Math.min(...priceData[activeType].map(d => d.avgPrice)) / 1000000).toFixed(1)}M - {(Math.max(...priceData[activeType].map(d => d.avgPrice)) / 1000000).toFixed(1)}M
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-foreground-secondary">Best Performer</div>
                        <div className="text-xl font-bold text-success mt-1">
                            {priceData[activeType].reduce((a, b) => a.yoyChange > b.yoyChange ? a : b).bedrooms}
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-foreground-secondary">Avg. YoY Growth</div>
                        <div className="text-xl font-bold text-primary mt-1">
                            +{(priceData[activeType].reduce((a, b) => a + b.yoyChange, 0) / priceData[activeType].length).toFixed(1)}%
                        </div>
                    </div>
                    <div>
                        <div className="text-sm text-foreground-secondary">Most Popular</div>
                        <div className="text-xl font-bold text-chart-amber mt-1">
                            {activeType === "apartments" ? "1 BR" : "3-4 BR"}
                        </div>
                    </div>
                </div>
            </div>

            {/* Citation */}
            <div className="mt-12 pt-6 border-t border-border-subtle">
                <p className="text-[11px] text-text-quaternary/70 leading-relaxed max-w-3xl">
                    <span className="text-text-tertiary font-medium">Source:</span> Dubai Land Department (DLD) transaction records.
                    Average prices calculated from registered sales by bedroom count.
                    YoY change compares 2025 vs 2024 median transaction prices. Property types classified per DLD categories.
                    Last updated: December 31st, 2025.
                </p>
            </div>
        </ChapterContainer>
    );
}
