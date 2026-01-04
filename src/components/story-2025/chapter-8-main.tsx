"use client";

import * as React from "react";
import { useGsap, gsap, ScrollTrigger, easingPresets } from "@/lib/hooks/useGsap";
import { cn } from "@/lib/utils";
import { useHaptics } from "./hooks/use-haptics";
import { motion } from "framer-motion";
import { ChapterContainer } from "./shared-chapter-container";
import { TrendingUp, Building2, Trophy, PartyPopper, MapPin, ArrowUpRight, BarChart3, Info, DollarSign, Home, Users, Briefcase, Key, Sparkles, Quote, Calendar } from "lucide-react";
import {
    quarterlyMilestones2025,
    yearSummary2025,
    quarterColors,
    timelineFootnotes,
    key2025Narratives,
    type QuarterlyMilestone,
} from "./chapter-8-data";

// Format large numbers
function formatNumber(num: number, decimals = 1): string {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(decimals)}M`;
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(decimals)}K`;
    }
    return num.toLocaleString();
}

interface MilestoneStreamItemProps {
    milestone: QuarterlyMilestone;
    index: number;
}

function MilestoneStreamItem({ milestone, index }: MilestoneStreamItemProps) {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const qIndicatorRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const { triggerHaptic } = useHaptics();

    const colors = quarterColors[milestone.quarter];
    const isRecord = milestone.type === "record";

    useGsap(() => {
        if (!containerRef.current || !qIndicatorRef.current || !contentRef.current) return;

        // Sticky Indicator Animation
        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top center",
            end: "bottom center",
            onToggle: (self) => {
                if (self.isActive) {
                    gsap.to(qIndicatorRef.current, {
                        opacity: 1,
                        scale: 1,
                        filter: "blur(0px)",
                        duration: 0.5
                    });
                } else {
                    gsap.to(qIndicatorRef.current, {
                        opacity: 0.2,
                        scale: 0.8,
                        filter: "blur(2px)",
                        duration: 0.5
                    });
                }
            }
        });

        // Content Reveal
        const elements = contentRef.current.children;
        gsap.fromTo(elements,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: contentRef.current,
                    start: "top 80%",
                }
            }
        );

    }, []);

    return (
        <div ref={containerRef} className="relative grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 py-12 md:py-24 border-l border-white/10 md:border-none pl-8 md:pl-0">

            {/* --- Left: Sticky Quarter Indicator (Desktop) --- */}
            <div className="hidden md:block md:col-span-3 lg:col-span-4 relative">
                <div className="sticky top-1/4">
                    <div
                        ref={qIndicatorRef}
                        className={cn(
                            "text-[8rem] lg:text-[12rem] leading-none font-bold opacity-20 transition-colors duration-500 origin-left select-none relative",
                            colors.accent
                        )}
                    >
                        {milestone.quarter}
                        {isRecord && (
                            <div className="absolute -right-4 top-0 rotate-12 bg-chart-amber text-black text-sm font-bold px-3 py-1 rounded-full tracking-wider shadow-lg opacity-100 scale-50 md:scale-100">
                                RECORD
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- Mobile Quarter Indicator --- */}
            <div className="md:hidden absolute -left-[19px] top-12 flex items-center justify-center">
                <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold bg-background border-4",
                    colors.border,
                    colors.accent
                )}>
                    {milestone.quarter}
                </div>
            </div>

            {/* --- Right: Content Stream --- */}
            <div ref={contentRef} className="md:col-span-9 lg:col-span-8 flex flex-col gap-10">

                {/* 1. Header & Quote */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/10", colors.accent)}>
                            {milestone.title}
                        </span>
                        {isRecord && (
                            <span className="flex items-center gap-1.5 text-xs text-chart-amber font-medium">
                                <Trophy className="w-3 h-3" />
                                {milestone.recordHighlight}
                            </span>
                        )}
                    </div>

                    <h3 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                        {milestone.highlight}
                    </h3>

                    <div className="pl-6 border-l-2 border-white/20">
                        <p className="text-lg text-foreground-secondary italic">
                            "{milestone.insights[0]}"
                        </p>
                    </div>
                </div>

                {/* 2. Hero Statistics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Tx */}
                    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                        <div className="text-sm text-foreground-tertiary mb-1">Transactions</div>
                        <div className="text-3xl font-bold text-foreground mb-1">
                            {formatNumber(milestone.transactions)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-success">
                            <TrendingUp className="w-3 h-3" />
                            +{milestone.yoyTxGrowth}% YoY
                        </div>
                    </div>

                    {/* Value */}
                    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                        <div className="text-sm text-foreground-tertiary mb-1">Value (AED)</div>
                        <div className="text-3xl font-bold text-foreground mb-1">
                            {milestone.valueAedBillions.toFixed(0)}B
                        </div>
                        <div className="flex items-center gap-1 text-xs text-success">
                            <TrendingUp className="w-3 h-3" />
                            +{milestone.yoyValueGrowth}% YoY
                        </div>
                    </div>

                    {/* Price */}
                    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                        <div className="text-sm text-foreground-tertiary mb-1">Price/sqft</div>
                        <div className="text-3xl font-bold text-foreground mb-1">
                            {milestone.avgPricePerSqft.toLocaleString()}
                        </div>
                        <div className={cn("text-xs font-medium", colors.accent)}>
                            AED
                        </div>
                    </div>

                    {/* Off Plan */}
                    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05]">
                        <div className="text-sm text-foreground-tertiary mb-1">Off-Plan Share</div>
                        <div className="text-3xl font-bold text-foreground mb-1">
                            {milestone.offPlanPercent}%
                        </div>
                        <div className="text-xs text-foreground-tertiary">
                            of total sales
                        </div>
                    </div>
                </div>

                {/* 3. Deep Dive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Top Areas */}
                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05]">
                        <h4 className="text-sm font-bold text-foreground-secondary uppercase tracking-widest mb-6 flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> Top Areas
                        </h4>
                        <div className="space-y-4">
                            {milestone.topAreas.map((area, i) => (
                                <div key={area.name} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <span className={cn(
                                            "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-colors",
                                            i === 0 ? "bg-chart-amber text-black" : "bg-white/10 text-foreground-secondary"
                                        )}>
                                            {i + 1}
                                        </span>
                                        <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                                            {area.name}
                                        </span>
                                    </div>
                                    <span className="text-sm text-foreground-tertiary font-mono">
                                        {formatNumber(area.transactions)} tx
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Insights List */}
                    <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05]">
                        <h4 className="text-sm font-bold text-foreground-secondary uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> Key Insights
                        </h4>
                        <ul className="space-y-4">
                            {milestone.insights.slice(1).map((insight, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-foreground-secondary leading-relaxed">
                                    <span className={cn("mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0", colors.bg.replace("bg-", "bg-opacity-100 bg-"))} />
                                    {insight}
                                </li>
                            ))}
                            <li className="flex items-start gap-3 mt-6 pt-4 border-t border-white/5">
                                <span className="flex items-center justify-center w-5 h-5 rounded bg-white/5">
                                    <TrendingUp className="w-3 h-3 text-success" />
                                </span>
                                <div>
                                    <span className="text-xs text-foreground-tertiary block mb-0.5">Fastest Growing Area</span>
                                    <span className="text-sm font-medium text-foreground">{milestone.fastestGrowing.name}</span>
                                    <span className="text-xs text-success ml-2">+{milestone.fastestGrowing.yoyGrowth}%</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    );
}

export function ChapterTimeline() {
    const { triggerHaptic } = useHaptics();
    const containerRef = React.useRef<HTMLDivElement>(null);
    const summaryRef = React.useRef<HTMLDivElement>(null);

    // Initial simple fade in
    useGsap(() => {
        if (summaryRef.current) {
            gsap.fromTo(summaryRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: summaryRef.current,
                        start: "top 75%",
                    }
                }
            );
        }
    }, []);

    return (
        <ChapterContainer
            chapterNumber={8}
            title="The Calendar of Milestones"
            subtitle="A quarterly journey through 2025's most significant real estate achievements."
        >
            <div ref={containerRef} className="relative mt-8 md:mt-16">

                {/* The Vertical Line (Mobile Only - on Desktop we use layout structure) */}
                <div className="absolute left-[20px] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-green-500 to-purple-500 opacity-20 md:hidden" />

                {/* --- Milestones Stream --- */}
                <div className="space-y-0">
                    {quarterlyMilestones2025.map((milestone, index) => (
                        <MilestoneStreamItem
                            key={milestone.quarter}
                            milestone={milestone}
                            index={index}
                        />
                    ))}
                </div>

                {/* --- Year Summary & Narratives --- */}
                <div className="mt-24 pt-24 border-t border-white/10" ref={summaryRef}>
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-chart-amber/10 mb-6">
                            <PartyPopper className="w-8 h-8 text-chart-amber" />
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            2025: A Historic Year
                        </h2>
                        <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
                            From off-plan dominance to unprecedented transaction volumes, 2025 has cemented Dubai's position as the world's most dynamic real estate market.
                        </p>
                    </div>

                    {/* Summary Stats Strip */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-24 max-w-5xl mx-auto">
                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] text-center">
                            <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                {formatNumber(yearSummary2025.totalTransactions)}
                            </div>
                            <div className="text-sm text-foreground-secondary">Total Transactions</div>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] text-center">
                            <div className="text-3xl md:text-4xl font-bold text-success mb-2">
                                {yearSummary2025.totalValueBillions.toFixed(0)}B
                            </div>
                            <div className="text-sm text-foreground-secondary">Total Value (AED)</div>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] text-center">
                            <div className="text-3xl md:text-4xl font-bold text-chart-amber mb-2">
                                {yearSummary2025.offPlanShare}%
                            </div>
                            <div className="text-sm text-foreground-secondary">Peak Off-Plan Share</div>
                        </div>
                        <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] text-center">
                            <div className="text-3xl md:text-4xl font-bold text-purple-400 mb-2">
                                +{yearSummary2025.priceGrowthYoY}%
                            </div>
                            <div className="text-sm text-foreground-secondary">Price Growth YoY</div>
                        </div>
                    </div>

                    {/* Key Narratives Grid */}
                    <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-primary" />
                        The Stories That Defined 2025
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Off Plan Boom */}
                        <div className="group p-8 rounded-3xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                            <Home className="w-8 h-8 text-blue-400 mb-6" />
                            <h4 className="text-xl font-bold text-white mb-3">{key2025Narratives.offPlanBoom.title}</h4>
                            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                                {key2025Narratives.offPlanBoom.summary}
                            </p>
                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <span className="text-xs text-gray-500">Peak Share</span>
                                <span className="text-lg font-bold text-blue-400">{key2025Narratives.offPlanBoom.stats.peakShare}%</span>
                            </div>
                        </div>

                        {/* Premium vs Affordable */}
                        <div className="group p-8 rounded-3xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                            <Users className="w-8 h-8 text-purple-400 mb-6" />
                            <h4 className="text-xl font-bold text-white mb-3">{key2025Narratives.premiumVsAffordable.title}</h4>
                            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                                {key2025Narratives.premiumVsAffordable.summary}
                            </p>
                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <span className="text-xs text-gray-500">Price Gap</span>
                                <span className="text-lg font-bold text-purple-400">{key2025Narratives.premiumVsAffordable.stats.premiumGap}</span>
                            </div>
                        </div>

                        {/* Rental Resilience */}
                        <div className="group p-8 rounded-3xl bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 hover:border-green-500/40 transition-colors">
                            <Key className="w-8 h-8 text-green-400 mb-6" />
                            <h4 className="text-xl font-bold text-white mb-3">{key2025Narratives.rentalMarket.title}</h4>
                            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                                {key2025Narratives.rentalMarket.summary}
                            </p>
                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                <span className="text-xs text-gray-500">Avg Rent</span>
                                <span className="text-lg font-bold text-green-400">AED {formatNumber(key2025Narratives.rentalMarket.stats.avgAnnualRent)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footnotes */}
                    <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row gap-8 justify-between text-xs text-gray-500">
                        <div className="space-y-2 max-w-lg">
                            <p><span className="font-bold text-gray-400">Source:</span> {timelineFootnotes.dataSource}</p>
                            <p><span className="font-bold text-gray-400">Last Updated:</span> {timelineFootnotes.lastUpdated}</p>
                        </div>
                        <div className="space-y-1">
                            {timelineFootnotes.methodology.slice(0, 3).map((item, i) => (
                                <p key={i}>• {item}</p>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </ChapterContainer>
    );
}
