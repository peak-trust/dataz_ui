"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, ChevronDown, ChevronUp, Building2 } from "lucide-react";
import { useGsap, gsap, ScrollTrigger } from "@/lib/hooks/useGsap";

interface DeveloperCardProps {
    rank: number;
    name: string;
    projects: number;
    marketShare: number;
    avgPrice: number;
    tier?: 1 | 2 | 3;
    monthlyData?: Array<{ month: string; sales: number }>;
    className?: string;
    delay?: number;
}

export function DeveloperCard({
    rank,
    name,
    projects,
    marketShare,
    avgPrice,
    tier = 1,
    monthlyData,
    className,
    delay = 0,
}: DeveloperCardProps) {
    const [isExpanded, setIsExpanded] = React.useState(false);
    const cardRef = React.useRef<HTMLDivElement>(null);
    const progressBarRef = React.useRef<HTMLDivElement>(null);
    const expandedContentRef = React.useRef<HTMLDivElement>(null);
    const chartContainerRef = React.useRef<HTMLDivElement>(null);

    const tierColors = {
        1: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/30",
        2: "from-surface-elevated-2/40 to-surface-elevated/20 border-border-emphasized",
        3: "from-amber-700/20 to-amber-800/10 border-amber-700/30",
    };

    const rankBadges = {
        1: "🥇",
        2: "🥈",
        3: "🥉",
    };

    // Entrance Animation & Progress Bar
    useGsap((gsap) => {
        if (!cardRef.current) return;

        // Card Entrance
        gsap.fromTo(cardRef.current,
            { opacity: 0, x: -30 },
            {
                opacity: 1, x: 0,
                duration: 0.5,
                delay: delay,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: "top 90%",
                }
            }
        );

        // Progress Bar
        if (progressBarRef.current) {
            gsap.fromTo(progressBarRef.current,
                { width: 0 },
                {
                    width: `${marketShare * 5}%`,
                    duration: 1,
                    delay: delay + 0.3,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: "top 90%",
                    }
                }
            );
        }
    }, [delay, marketShare]);

    // Expansion Animation
    useGsap((gsap) => {
        if (!expandedContentRef.current) return;

        if (isExpanded) {
            gsap.to(expandedContentRef.current, {
                height: "auto",
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            });

            // Animate chart bars when expanded
            if (chartContainerRef.current) {
                const bars = chartContainerRef.current.querySelectorAll(".chart-bar");
                gsap.fromTo(bars,
                    { height: 0 },
                    {
                        height: (i, target) => target.dataset.height || "0%",
                        stagger: 0.05,
                        duration: 0.4,
                        ease: "power2.out",
                        delay: 0.1 // Wait for expansion start
                    }
                );
            }
        } else {
            gsap.to(expandedContentRef.current, {
                height: 0,
                opacity: 0,
                duration: 0.3,
                ease: "power2.in"
            });
        }
    }, [isExpanded]);

    return (
        <div
            ref={cardRef}
            className={cn(
                "relative overflow-hidden rounded-xl opacity-0",
                "bg-white/[0.03] backdrop-blur-xl",
                "border border-white/[0.08]",
                "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
                "hover:border-white/[0.15]",
                "transition-all duration-300",
                className
            )}
        >
            {/* Main content */}
            <div className="relative z-10 p-5">
                <div className="flex items-center gap-4">
                    {/* Rank */}
                    <div className={cn(
                        "flex items-center justify-center w-12 h-12 rounded-xl text-2xl",
                        "bg-gradient-to-br border",
                        tierColors[tier]
                    )}>
                        {rank <= 3 ? rankBadges[rank as 1 | 2 | 3] : `#${rank}`}
                    </div>

                    {/* Name and Stats */}
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground">{name}</h3>
                        <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-foreground-secondary flex items-center gap-1">
                                <Building2 className="w-3.5 h-3.5" />
                                {projects} projects
                            </span>
                            <span className="text-sm text-primary font-medium">
                                {marketShare}% market share
                            </span>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="hidden md:block w-48">
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                                ref={progressBarRef}
                                className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
                                style={{ width: 0 }}
                            />
                        </div>
                    </div>

                    {/* Avg Price */}
                    <div className="text-right hidden sm:block">
                        <div className="text-xs text-foreground-tertiary uppercase tracking-wider">
                            Avg Price
                        </div>
                        <div className="text-foreground font-semibold">
                            {avgPrice.toLocaleString()} AED/sqft
                        </div>
                    </div>

                    {/* Expand button */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-foreground-secondary" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-foreground-secondary" />
                        )}
                    </button>
                </div>

                {/* Expanded content */}
                <div
                    ref={expandedContentRef}
                    className="overflow-hidden h-0 opacity-0"
                >
                    <div className="pt-5 mt-5 border-t border-white/10">
                        <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            Monthly Sales Performance
                        </h4>

                        {/* Mini bar chart */}
                        <div ref={chartContainerRef} className="flex items-end gap-1 h-20">
                            {(monthlyData || generateSampleMonthlyData()).map((item, index) => (
                                <div
                                    key={item.month}
                                    className="chart-bar flex-1 bg-gradient-to-t from-primary/50 to-primary rounded-t group relative"
                                    data-height={`${(item.sales / 1200) * 100}%`}
                                    style={{ height: 0 }}
                                >
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-foreground whitespace-nowrap">
                                        {item.sales}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-foreground-tertiary">
                            <span>Jan</span>
                            <span>Jun</span>
                            <span>Dec</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function generateSampleMonthlyData() {
    return [
        { month: "Jan", sales: 450 },
        { month: "Feb", sales: 380 },
        { month: "Mar", sales: 520 },
        { month: "Apr", sales: 610 },
        { month: "May", sales: 890 },
        { month: "Jun", sales: 750 },
        { month: "Jul", sales: 680 },
        { month: "Aug", sales: 920 },
        { month: "Sep", sales: 1100 },
        { month: "Oct", sales: 980 },
        { month: "Nov", sales: 850 },
        { month: "Dec", sales: 720 },
    ];
}
