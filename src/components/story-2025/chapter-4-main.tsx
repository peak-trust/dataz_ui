"use client";

import * as React from "react";
import {
    Trophy,
    TrendingUp,
    Building2,
    Award,
    MapPin,
    ArrowRight,
    PlayCircle
} from "lucide-react";
import { ResponsivePie } from "@nivo/pie";
import { ChapterContainer } from "./shared-chapter-container";
import { cn } from "@/lib/utils";
import mockData from "./chapter-4-data.json";
import { useGsap, gsap, ScrollTrigger } from "@/lib/hooks/useGsap";
import { useHaptics } from "./hooks/use-haptics";
import { motion } from "framer-motion";

// --- Types ---
interface Developer {
    rank: number;
    name: string;
    projects: number;
    areas: number;
    tagline: string;
    essence: string;
    value: number;
    featuredProjects: string[];
    tier: number;
    logo?: string;
}

interface MarketShareItem {
    id: string;
    label: string;
    value: number;
    color: string;
}

// --- Components ---

const PodiumCard = ({ developer, delay }: { developer: Developer; delay: number }) => {
    const isFirst = developer.rank === 1;
    const cardRef = React.useRef<HTMLDivElement>(null);

    useGsap((gsap) => {
        if (!cardRef.current) return;
        gsap.fromTo(cardRef.current,
            { opacity: 0, y: 30, scale: 0.9 },
            {
                opacity: 1, y: 0, scale: 1,
                duration: 0.5,
                delay: delay,
                ease: "back.out(0.4)",
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: "top 80%",
                }
            }
        );
    }, []);

    const { triggerHaptic } = useHaptics();

    return (
        <motion.div
            ref={cardRef}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={cn(
                "relative flex flex-col items-center p-6 rounded-2xl border transition-all duration-300 group opacity-0", // Start hidden
                "bg-white/[0.03] backdrop-blur-xl hover:bg-white/[0.06] hover:border-white/20",
                isFirst
                    ? "border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)] z-10 scale-100 md:scale-110 md:-mt-12"
                    : "border-white/10"
            )}
        >
            {/* Rank Badge */}
            <div className={cn(
                "absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold border shadow-lg z-20",
                isFirst ? "bg-amber-500 text-black border-amber-300" :
                    developer.rank === 2 ? "bg-surface-elevated-2 text-text-primary border-border-emphasized" :
                        "bg-orange-700 text-orange-100 border-orange-600"
            )}>
                {developer.rank}
            </div>

            {/* Content */}
            <div className="mt-8 text-center w-full">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-sm font-bold text-white/50 p-1 border border-white/10">
                    {/* Logo */}{developer.logo ? (
                        <img
                            src={developer.logo}
                            alt={`${developer.name} logo`}
                            className="w-full h-full object-contain p-2 brightness-0 invert opacity-70 group-hover:opacity-100 transition-all duration-300"
                        />
                    ) : <Building2 className="w-8 h-8" />}
                </div>

                <h3 className="text-xl font-bold text-white mb-1 whitespace-nowrap overflow-hidden text-ellipsis px-2">
                    {developer.name}
                </h3>
                <p className="text-xs text-primary font-medium tracking-wider uppercase mb-4">
                    {developer.essence}
                </p>

                <div className="grid grid-cols-2 gap-2 w-full text-center py-4 border-t border-white/5">
                    <div>
                        <div className="text-lg font-bold text-white">{developer.projects}</div>
                        <div className="text-[10px] text-gray-400 uppercase">Projects</div>
                    </div>
                    <div>
                        <div className="text-lg font-bold text-white">{developer.areas}</div>
                        <div className="text-[10px] text-gray-400 uppercase">Areas</div>
                    </div>
                </div>

                <div className="w-full pt-4 border-t border-white/5 text-left">
                    <p className="text-xs text-gray-400 italic mb-2 line-clamp-1">"{developer.tagline}"</p>
                    <div className="flex flex-wrap gap-1">
                        {developer.featuredProjects.slice(0, 2).map((p, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-full bg-white/5 text-[10px] text-gray-300 border border-white/5">
                                {p}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const DeveloperRow = ({ developer, index }: { developer: Developer; index: number }) => {
    const rowRef = React.useRef<HTMLDivElement>(null);

    useGsap((gsap) => {
        if (!rowRef.current) return;
        gsap.fromTo(rowRef.current,
            { opacity: 0, x: -20 },
            {
                opacity: 1, x: 0,
                delay: index * 0.05,
                duration: 0.5,
                scrollTrigger: {
                    trigger: rowRef.current,
                    start: "top 85%",
                }
            }
        );
    }, []);

    const { triggerHaptic } = useHaptics();

    return (
        <motion.div
            ref={rowRef}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="group flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-colors opacity-0"
        >
            <div className="w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-500 font-mono">
                #{developer.rank}
            </div>

            {/* Developer Logo */}
            {developer.logo && (
                <div className="w-10 h-10 rounded-lg bg-white/5 p-1.5 border border-white/5 flex items-center justify-center shrink-0">
                    <img
                        src={developer.logo}
                        alt={developer.name}
                        className="w-full h-full object-contain brightness-0 invert opacity-60 group-hover:opacity-100 transition-all"
                    />
                </div>
            )}

            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-gray-200 group-hover:text-white transition-colors">
                        {developer.name}
                    </h4>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                    <span>{developer.projects} Projects</span>
                    <span className="w-1 h-1 rounded-full bg-gray-700" />
                    <span>{developer.essence}</span>
                </div>
            </div>
            <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-gray-300">{(developer.value / 1000000000).toFixed(1)}B</div>
                <div className="text-[10px] text-gray-600 uppercase">Est. Value (AED)</div>
            </div>
        </motion.div>
    );
};

const NivoDonutChart = ({ data }: { data: MarketShareItem[] }) => {
    const { triggerHaptic } = useHaptics();
    // Transform data for Nivo
    const chartData = data.map(item => ({
        id: item.id,
        label: item.label,
        value: item.value,
        color: item.color
    }));

    const containerRef = React.useRef<HTMLDivElement>(null);

    useGsap((gsap) => {
        if (!containerRef.current) return;
        const legendItems = containerRef.current.querySelectorAll(".legend-item");

        gsap.fromTo(legendItems,
            { opacity: 0, x: 20 },
            {
                opacity: 1, x: 0,
                stagger: 0.05,
                duration: 0.5,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            }
        );
    }, []);

    return (
        <div ref={containerRef} className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-64 h-64 flex-shrink-0">
                <ResponsivePie
                    data={chartData}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    innerRadius={0.6}
                    padAngle={2}
                    cornerRadius={4}
                    activeOuterRadiusOffset={8}
                    colors={{ datum: 'data.color' }}
                    borderWidth={2}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
                    enableArcLinkLabels={false}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor="#ffffff"
                    arcLabel={(d) => `${d.value}%`}
                    theme={{
                        text: {
                            fill: '#ffffff',
                            fontSize: 11,
                            fontWeight: 600
                        },
                        tooltip: {
                            container: {
                                background: '#1f2937',
                                color: '#ffffff',
                                fontSize: 12,
                                borderRadius: 8,
                                border: '1px solid rgba(255,255,255,0.1)',
                                padding: '8px 12px'
                            }
                        }
                    }}
                    tooltip={({ datum }) => (
                        <div className="bg-gray-800 px-3 py-2 rounded-lg border border-white/10">
                            <strong className="text-white">{datum.label}</strong>
                            <div className="text-gray-300 text-sm">{datum.value}%</div>
                        </div>
                    )}
                    animate={true}
                    motionConfig="gentle"
                />
                {/* Center Text Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-white">2025</span>
                    <span className="text-xs text-gray-400">Market Share</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {data.map((item, i) => (
                    <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="legend-item flex items-center gap-3 group opacity-0"
                    >
                        <span
                            className="w-3 h-3 min-w-[12px] min-h-[12px] rounded-full flex-shrink-0 block"
                            style={{ backgroundColor: item.color }}
                        />
                        <div>
                            <div className="text-sm font-bold text-white group-hover:text-primary">{item.label}</div>
                            <div className="text-xs text-gray-400">{item.value}%</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const HeatmapGrid = ({ data }: { data: any[] }) => {
    const containerRef = React.useRef<HTMLDivElement>(null);

    useGsap((gsap) => {
        if (!containerRef.current) return;
        const rows = containerRef.current.querySelectorAll(".heatmap-row");

        gsap.fromTo(rows,
            { opacity: 0, x: -20 },
            {
                opacity: 1, x: 0,
                stagger: 0.1,
                duration: 0.5,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top 80%",
                }
            }
        );
    }, []);

    return (
        <div ref={containerRef} className="space-y-2">
            {data.map((area, rowIdx) => (
                <div
                    key={area.id}
                    className="heatmap-row flex items-center gap-3 opacity-0"
                >
                    {/* Area Name */}
                    <div className="w-20 md:w-28 text-[10px] md:text-xs font-medium text-gray-400 text-right shrink-0">
                        {area.id}
                    </div>

                    {/* Developer Bars */}
                    <div className="flex-1 flex gap-1">
                        {area.data.map((point: any, colIdx: number) => {
                            const intensity = point.share / 100;
                            const isTop = colIdx === 0;
                            return (
                                <div
                                    key={`${rowIdx}-${colIdx}`}
                                    className="h-8 rounded-lg flex items-center justify-center text-xs font-medium relative group transition-all"
                                    style={{
                                        width: `${Math.max(point.share, 15)}%`,
                                        backgroundColor: isTop
                                            ? `rgba(91, 147, 255, ${Math.max(0.4, intensity)})`
                                            : `rgba(91, 147, 255, ${Math.max(0.15, intensity * 0.5)})`,
                                    }}
                                >
                                    <span className="text-white/90 truncate px-1">
                                        {point.developer} {point.share}%
                                    </span>

                                    {/* Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-xs text-white rounded border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20">
                                        {area.id} • {point.developer}: {point.share}%
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- Main Chapter Component ---

export function ChapterBuilders() {
    const risingStarsRef = React.useRef<HTMLDivElement>(null);
    const timelineRef = React.useRef<HTMLDivElement>(null);
    const { triggerHaptic } = useHaptics();

    useGsap((gsap) => {
        // Rising Stars
        if (risingStarsRef.current) {
            gsap.fromTo(risingStarsRef.current,
                { opacity: 0, x: 20 },
                {
                    opacity: 1, x: 0,
                    duration: 0.5,
                    scrollTrigger: {
                        trigger: risingStarsRef.current,
                        start: "top 80%",
                    }
                }
            );
        }

        // Timeline Strip
        if (timelineRef.current) {
            gsap.fromTo(timelineRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0,
                    duration: 0.5,
                    scrollTrigger: {
                        trigger: timelineRef.current,
                        start: "top 80%",
                    }
                }
            );

            // Stagger items inside timeline
            const items = timelineRef.current.querySelectorAll(".timeline-item");
            if (items.length > 0) {
                gsap.fromTo(items,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1, y: 0,
                        stagger: 0.05,
                        duration: 0.4,
                        delay: 0.1, // Wait for container
                        scrollTrigger: {
                            trigger: timelineRef.current,
                            start: "top 85%",
                        }
                    }
                );
            }
        }

    }, []);

    return (
        <ChapterContainer
            chapterNumber={4}
            title="The Builders"
            subtitle="The visionary developers shaping the skyline of 2025. From established giants to rising stars."
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">

                {/* --- LEFT: Leaderboard --- */}
                <div className="lg:col-span-7 flex flex-col gap-8">

                    {/* Top 3 Podium */}
                    <div className="relative pt-12">
                        <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-6">
                            {/* Rank 2 */}
                            <div className="order-2 md:order-1 w-full md:w-1/3">
                                <PodiumCard developer={mockData.topDevelopers[1]} delay={0.4} />
                            </div>
                            {/* Rank 1 */}
                            <div className="order-1 md:order-2 w-full md:w-1/3">
                                <PodiumCard developer={mockData.topDevelopers[0]} delay={0.2} />
                            </div>
                            {/* Rank 3 */}
                            <div className="order-3 md:order-3 w-full md:w-1/3">
                                <PodiumCard developer={mockData.topDevelopers[2]} delay={0.6} />
                            </div>
                        </div>
                    </div>

                    {/* Rest of the list */}
                    <div className="space-y-3 bg-white/[0.02] p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                            The Top 10
                        </h4>
                        {mockData.topDevelopers.slice(3).map((dev, idx) => (
                            <DeveloperRow key={dev.rank} developer={dev} index={idx} />
                        ))}
                    </div>

                </div>

                {/* --- RIGHT: Insights & Stats --- */}
                <div className="lg:col-span-5 flex flex-col gap-8">

                    {/* Rising Stars */}
                    <div
                        ref={risingStarsRef}
                        className="p-6 rounded-3xl bg-gradient-to-br from-purple-500/10 to-blue-500/5 border border-purple-500/20 opacity-0"
                    >
                        <h3 className="flex items-center gap-2 text-lg font-bold text-white mb-6">
                            <TrendingUp className="w-5 h-5 text-purple-400" />
                            Rising Stars of 2025
                        </h3>

                        <div className="space-y-4">
                            {mockData.risingStars.map((star, i) => (
                                <div key={star.name} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                    <div>
                                        <div className="font-bold text-white">{star.name}</div>
                                        <div className="text-xs text-purple-300">{star.badge}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-success">+{star.growth}%</div>
                                        <div className="text-[10px] text-gray-500">YoY Growth</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Market Share */}
                    <div className="p-6 rounded-3xl bg-black/20 border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-6">Market Dominance</h3>
                        <NivoDonutChart data={mockData.marketShare} />
                    </div>

                    {/* Area Heatmap (Plain) */}
                    <div className="p-6 rounded-3xl bg-black/20 border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white">Area Control</h3>
                            <span className="text-xs text-gray-500">Project Concentration</span>
                        </div>
                        <HeatmapGrid data={mockData.areaDominance} />
                    </div>

                </div>
            </div>

            {/* Timeline Strip */}
            <div
                ref={timelineRef}
                className="mt-16 pt-12 border-t border-white/10 opacity-0"
            >
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-3xl font-bold text-white mb-2">2025 Launch Timeline</h3>
                        <p className="text-sm text-gray-400">Major project launches throughout the year</p>
                    </div>
                    <div className="flex gap-3">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => triggerHaptic("light")}
                            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all hover:scale-105"
                        >
                            <ArrowRight className="w-5 h-5 text-white rotate-180" />
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => triggerHaptic("light")}
                            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all hover:scale-105"
                        >
                            <ArrowRight className="w-5 h-5 text-white" />
                        </motion.button>
                    </div>
                </div>

                <div className="overflow-x-auto pb-6 custom-scrollbar">
                    <div className="flex gap-6 min-w-max px-2">
                        {mockData.timeline.map((monthData, idx) => (
                            <div
                                key={idx}
                                className="timeline-item min-w-[280px] p-6 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-white/10 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(91,147,255,0.1)] transition-all duration-300 relative group hover:scale-[1.02] opacity-0"
                            >
                                {/* Quarter Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary/20 to-blue-500/20 border border-primary/30 mb-6">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    <span className="text-base font-bold text-white uppercase tracking-wide">{monthData.quarter}</span>
                                </div>

                                {/* Projects List */}
                                <div className="space-y-3">
                                    {monthData.projects.map((proj: any, pIdx: number) => (
                                        <div key={pIdx} className="flex items-start gap-3 group/item">
                                            <div className="w-2 h-2 rounded-full bg-primary/60 mt-1.5 flex-shrink-0 group-hover/item:bg-primary transition-colors" />
                                            <div className="flex-1">
                                                <span className="text-base text-gray-200 leading-relaxed group-hover/item:text-white transition-colors">{proj.name}</span>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-gray-500">{proj.developer}</span>
                                                    <span className="text-xs text-primary/70">AED {(proj.value / 1000000000).toFixed(1)}B</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 to-blue-500/0 group-hover:from-primary/5 group-hover:to-blue-500/5 pointer-events-none transition-all duration-300" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Citation */}
            <div className="mt-12 pt-6 border-t border-border-subtle">
                <p className="text-[11px] text-text-quaternary/70 leading-relaxed max-w-3xl">
                    <span className="text-text-tertiary font-medium">Source:</span> Dubai Land Department (DLD) transaction records.
                    Developer rankings based on total transaction volume. Market share calculated from 2025 registered sales.
                    Project launches identified from first registration dates. Last updated: December 31st, 2025.
                </p>
            </div>
        </ChapterContainer>
    );
}

// Add strict type for custom-scrollbar in globals.css if needed, or use tailwind plugin
