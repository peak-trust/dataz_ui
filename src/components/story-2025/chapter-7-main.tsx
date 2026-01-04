"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChapterContainer } from "./shared-chapter-container";
import { AreaCard } from "./chapter-7-area-card";
import { DollarSign, Train, Users, TrendingUp, Sparkles, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import { neighborhoods, summaryStats, dataSource, footnotes } from "./chapter-7-data";
import { useGsap, gsap, ScrollTrigger } from "@/lib/hooks/useGsap";
import { useHaptics } from "./hooks/use-haptics";
import { motion } from "framer-motion";

type SortOption = "all" | "affordable" | "connectivity" | "family" | "investment" | "luxury";

const sortOptions: { id: SortOption; label: string; icon: React.ReactNode }[] = [
    { id: "all", label: "All Areas", icon: <LayoutGrid className="w-4 h-4" /> },
    { id: "affordable", label: "Most Affordable", icon: <DollarSign className="w-4 h-4" /> },
    { id: "connectivity", label: "Best Connectivity", icon: <Train className="w-4 h-4" /> },
    { id: "family", label: "Family-Friendly", icon: <Users className="w-4 h-4" /> },
    { id: "investment", label: "Investment Hotspots", icon: <TrendingUp className="w-4 h-4" /> },
    { id: "luxury", label: "Luxury Tier", icon: <Sparkles className="w-4 h-4" /> },
];

export function ChapterNeighborhoods() {
    const [activeSort, setActiveSort] = React.useState<SortOption>("all");
    const [sliderIndex, setSliderIndex] = React.useState(0);
    const sliderContainerRef = React.useRef<HTMLDivElement>(null);
    const sliderTrackRef = React.useRef<HTMLDivElement>(null);
    const statsRef = React.useRef<HTMLDivElement>(null);
    const footerRef = React.useRef<HTMLDivElement>(null);
    const { triggerHaptic } = useHaptics();

    const filteredNeighborhoods = React.useMemo(() => {
        if (activeSort === "all") {
            return [...neighborhoods].sort((a, b) => b.transactions - a.transactions);
        }
        return neighborhoods
            .filter((n) => n.category.includes(activeSort))
            .sort((a, b) => {
                switch (activeSort) {
                    case "affordable":
                        return a.pricePerSqft - b.pricePerSqft;
                    case "connectivity":
                        return b.transactions - a.transactions;
                    case "family":
                        return b.transactions - a.transactions;
                    case "investment":
                        return b.yoyChange - a.yoyChange;
                    case "luxury":
                        return b.pricePerSqft - a.pricePerSqft;
                    default:
                        return 0;
                }
            });
    }, [activeSort]);

    const canScrollLeft = sliderIndex > 0;
    const canScrollRight = sliderIndex < filteredNeighborhoods.length - 4;

    const scrollSlider = (direction: "left" | "right") => {
        if (direction === "left" && canScrollLeft) {
            setSliderIndex((prev) => Math.max(0, prev - 1));
        } else if (direction === "right" && canScrollRight) {
            setSliderIndex((prev) => Math.min(filteredNeighborhoods.length - 4, prev + 1));
        }
    };

    // Reset slider index when filter changes
    React.useEffect(() => {
        setSliderIndex(0);
    }, [activeSort]);

    // Slider Animation
    useGsap((gsap) => {
        if (!sliderTrackRef.current) return;

        // Calculate offset: item width (280) + gap (16)
        const offset = -sliderIndex * (280 + 16);

        gsap.to(sliderTrackRef.current, {
            x: offset,
            duration: 0.5,
            ease: "power2.out"
        });
    }, [sliderIndex]);

    // Stats & Footer Animations
    useGsap((gsap) => {
        // Stats
        if (statsRef.current) {
            gsap.fromTo(statsRef.current,
                { opacity: 0, y: 20 },
                {
                    opacity: 1, y: 0,
                    duration: 0.4,
                    delay: 0.2,
                    scrollTrigger: {
                        trigger: statsRef.current,
                        start: "top 85%",
                    }
                }
            );
        }

        // Footer
        if (footerRef.current) {
            gsap.fromTo(footerRef.current,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 0.5,
                    delay: 0.3,
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 90%",
                    }
                }
            );
        }
    }, []);

    return (
        <ChapterContainer
            chapterNumber={7}
            title="Neighborhoods Under the Microscope"
            subtitle="Discover Dubai's diverse neighborhoods. Each card reveals the unique character and investment potential of an area."
        >
            {/* Sort options */}
            <div className="flex flex-wrap gap-2 mb-8">
                {sortOptions.map((option) => (
                    <motion.button
                        key={option.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            triggerHaptic("selection");
                            setActiveSort(option.id);
                        }}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                            activeSort === option.id
                                ? "bg-primary/20 border border-primary/30 text-primary shadow-[0_0_15px_rgba(91,147,255,0.2)]"
                                : "bg-white/[0.03] border border-white/[0.08] text-foreground-secondary hover:bg-white/[0.05] hover:text-foreground"
                        )}
                    >
                        <span>{option.icon}</span>
                        <span>{option.label}</span>
                    </motion.button>
                ))}
            </div>

            {/* Area cards - Slider for "all", Grid for filtered */}
            {/* Area cards - Slider for "all" (Desktop) & Grid (Mobile/Filtered) */}
            {activeSort === "all" ? (
                <>
                    {/* Mobile: Vertical Scroll Grid */}
                    <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredNeighborhoods.map((neighborhood, index) => (
                            <div key={neighborhood.name}>
                                <AreaCard
                                    name={neighborhood.name}
                                    pricePerSqft={neighborhood.pricePerSqft}
                                    transactions={neighborhood.transactions}
                                    yoyChange={neighborhood.yoyChange}
                                    delay={index * 0.05}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Desktop: Horizontal Slider */}
                    <div className="hidden md:block relative" ref={sliderContainerRef}>
                        {/* Left Arrow */}
                        <motion.button
                            onClick={() => {
                                triggerHaptic("light");
                                scrollSlider("left");
                            }}
                            whileTap={{ scale: 0.9 }}
                            disabled={!canScrollLeft}
                            className={cn(
                                "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10",
                                "w-10 h-10 rounded-full flex items-center justify-center",
                                "bg-white/10 backdrop-blur-sm border border-white/20",
                                "transition-all duration-200",
                                canScrollLeft
                                    ? "hover:bg-white/20 hover:scale-110 cursor-pointer"
                                    : "opacity-30 cursor-not-allowed"
                            )}
                        >
                            <ChevronLeft className="w-5 h-5 text-foreground" />
                        </motion.button>

                        {/* Slider Container */}
                        <div className="overflow-hidden">
                            <div
                                ref={sliderTrackRef}
                                className="flex gap-4"
                            >
                                {filteredNeighborhoods.map((neighborhood, index) => (
                                    <div
                                        key={neighborhood.name}
                                        className="flex-shrink-0 w-[280px]"
                                    >
                                        <AreaCard
                                            name={neighborhood.name}
                                            pricePerSqft={neighborhood.pricePerSqft}
                                            transactions={neighborhood.transactions}
                                            yoyChange={neighborhood.yoyChange}
                                            delay={index * 0.05}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Arrow */}
                        <motion.button
                            onClick={() => {
                                triggerHaptic("light");
                                scrollSlider("right");
                            }}
                            whileTap={{ scale: 0.9 }}
                            disabled={!canScrollRight}
                            className={cn(
                                "absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10",
                                "w-10 h-10 rounded-full flex items-center justify-center",
                                "bg-white/10 backdrop-blur-sm border border-white/20",
                                "transition-all duration-200",
                                canScrollRight
                                    ? "hover:bg-white/20 hover:scale-110 cursor-pointer"
                                    : "opacity-30 cursor-not-allowed"
                            )}
                        >
                            <ChevronRight className="w-5 h-5 text-foreground" />
                        </motion.button>

                        {/* Dot indicators */}
                        <div className="flex justify-center gap-2 mt-4">
                            {Array.from({ length: Math.max(1, filteredNeighborhoods.length - 3) }).map((_, i) => (
                                <motion.button
                                    key={i}
                                    whileTap={{ scale: 1.2 }}
                                    onClick={() => {
                                        triggerHaptic("light");
                                        setSliderIndex(i);
                                    }}
                                    className={cn(
                                        "w-2 h-2 rounded-full transition-all duration-200",
                                        i === sliderIndex
                                            ? "bg-primary w-6"
                                            : "bg-white/20 hover:bg-white/40"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                >
                    {filteredNeighborhoods.map((neighborhood, index) => (
                        <div key={neighborhood.name}>
                            <AreaCard
                                name={neighborhood.name}
                                pricePerSqft={neighborhood.pricePerSqft}
                                transactions={neighborhood.transactions}
                                yoyChange={neighborhood.yoyChange}
                                delay={index * 0.05}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Summary stats */}
            <div
                ref={statsRef}
                className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 opacity-0"
            >
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                    <div className="text-3xl font-bold text-foreground">{summaryStats.totalAreas}</div>
                    <div className="text-sm text-foreground-secondary mt-1">Total Areas</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                    <div className="text-3xl font-bold text-success">{summaryStats.highGrowthAreas}</div>
                    <div className="text-sm text-foreground-secondary mt-1">High Growth Areas</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                    <div className="text-3xl font-bold text-chart-amber">{summaryStats.emergingMarkets}</div>
                    <div className="text-sm text-foreground-secondary mt-1">Emerging Markets</div>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] text-center">
                    <div className="text-3xl font-bold text-primary">+{summaryStats.avgPriceGrowth}%</div>
                    <div className="text-sm text-foreground-secondary mt-1">Avg. Price Growth</div>
                </div>
            </div>

            {/* Data source and footnotes */}
            <div
                ref={footerRef}
                className="mt-6 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] opacity-0"
            >
                <div className="text-xs text-foreground-secondary/80 font-medium mb-2">
                    {dataSource}
                </div>
                <ul className="space-y-1">
                    {footnotes.map((note, index) => (
                        <li key={index} className="text-xs text-foreground-secondary/60 flex gap-2">
                            <span className="text-foreground-secondary/40">{index + 1}.</span>
                            <span>{note}</span>
                        </li>
                    ))}
                </ul>
            </div>

        </ChapterContainer>
    );
}
