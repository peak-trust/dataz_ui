"use client";

import * as React from "react";
import { useGsap, gsap, ScrollTrigger, easingPresets } from "@/lib/hooks/useGsap";
import { cn } from "@/lib/utils";
import { ChapterContainer } from "./shared-chapter-container";

// Real 2025 monthly data from DLD (gold_transactions)
const monthlyData = [
    { month: "Jan", value: 14168, events: [], sentiment: "Neutral", volume: "44.3B", topArea: "Damac Hills 2", offPlanPct: 52 },
    { month: "Feb", value: 16002, events: [], sentiment: "Bullish", volume: "50.8B", topArea: "Damac Hills 2", offPlanPct: 56 },
    { month: "Mar", value: 15287, events: [], sentiment: "Neutral", volume: "47.8B", topArea: "JVC", offPlanPct: 59 },
    { month: "Apr", value: 17832, events: ["Q2 Surge Begins"], sentiment: "Bullish", volume: "62.3B", topArea: "JVC", offPlanPct: 57 },
    { month: "May", value: 18612, events: [], sentiment: "Bullish", volume: "66.8B", topArea: "JVC", offPlanPct: 55 },
    { month: "Jun", value: 16544, events: [], sentiment: "Neutral", volume: "54.9B", topArea: "JVC", offPlanPct: 59 },
    { month: "Jul", value: 20242, events: ["Summer Surge"], sentiment: "Super Bullish", volume: "63.9B", topArea: "JVC", offPlanPct: 63 },
    { month: "Aug", value: 18343, events: ["Off-Plan Hits 70%"], sentiment: "Bullish", volume: "50.6B", topArea: "Business Bay", offPlanPct: 70 },
    { month: "Sep", value: 20322, events: ["Record Breaking Month"], sentiment: "Super Bullish", volume: "54.5B", topArea: "JVC", offPlanPct: 71 },
    { month: "Oct", value: 19765, events: [], sentiment: "Bullish", volume: "58.5B", topArea: "JVC", offPlanPct: 66 },
    { month: "Nov", value: 18770, events: [], sentiment: "Bullish", volume: "63.7B", topArea: "JVC", offPlanPct: 68 },
    { month: "Dec", value: 14658, events: ["Year-End Cool Down"], sentiment: "Neutral", volume: "52.1B", topArea: "JVC", offPlanPct: 68 },
];

const maxValue = Math.max(...monthlyData.map((d) => d.value));
const minValue = Math.min(...monthlyData.map((d) => d.value));
const avgValue = monthlyData.reduce((a, b) => a + b.value, 0) / monthlyData.length;
const totalTransactions = monthlyData.reduce((a, b) => a + b.value, 0);
const totalVolume = monthlyData.reduce((a, b) => a + parseFloat(b.volume), 0);

export function ChapterHeartbeat() {
    const [revealProgress, setRevealProgress] = React.useState(0);
    const [hoveredMonth, setHoveredMonth] = React.useState<number | null>(null);
    const [currentMonth, setCurrentMonth] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const chartRef = React.useRef<HTMLDivElement>(null);
    const pathRef = React.useRef<SVGPathElement>(null);
    const fillPathRef = React.useRef<SVGPathElement>(null);
    const pointRefs = React.useRef<(HTMLDivElement | null)[]>([]);
    const labelRefs = React.useRef<(HTMLSpanElement | null)[]>([]);
    const statsRef = React.useRef<HTMLDivElement>(null);
    const clipRectRef = React.useRef<SVGRectElement>(null);
    const scannerRef = React.useRef<HTMLDivElement>(null);
    const detailsRef = React.useRef<HTMLDivElement>(null);
    const pulseRef = React.useRef<SVGSVGElement>(null);

    // Generate heartbeat waveform path
    const generateWaveformPath = React.useCallback(() => {
        const width = 100;
        const height = 50;
        const points: string[] = [];
        const padding = (maxValue - minValue) * 0.1; // 10% padding
        const rangeMin = minValue - padding;
        const rangeMax = maxValue + padding;

        monthlyData.forEach((data, index) => {
            const x = (index / (monthlyData.length - 1)) * width;
            const normalizedValue = (data.value - rangeMin) / (rangeMax - rangeMin);
            const y = height - normalizedValue * height * 0.8 - 5;

            if (index === 0) {
                points.push(`M ${x} ${y}`);
            } else {
                const prevX = ((index - 1) / (monthlyData.length - 1)) * width;
                const prevData = monthlyData[index - 1];
                const prevNormalizedValue = (prevData.value - rangeMin) / (rangeMax - rangeMin);
                const prevY = height - prevNormalizedValue * height * 0.8 - 5;

                const cpX1 = prevX + (x - prevX) / 2;
                const cpX2 = prevX + (x - prevX) / 2;

                points.push(`C ${cpX1} ${prevY} ${cpX2} ${y} ${x} ${y}`);
            }
        });

        return points.join(" ");
    }, []);

    const waveformPath = generateWaveformPath();

    // GSAP ScrollTrigger Animation
    useGsap(() => {
        if (!containerRef.current || !pathRef.current) return;

        // Get the path length for stroke animation
        const pathLength = pathRef.current.getTotalLength();

        // Set initial state
        gsap.set(fillPathRef.current, { opacity: 0 });
        gsap.set(pointRefs.current.filter(Boolean), { opacity: 0, scale: 0 });
        gsap.set(labelRefs.current.filter(Boolean), { opacity: 0.3 });

        // Create ScrollTrigger animation
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 60%",
                end: "bottom 90%",
                scrub: 0.3,
                onUpdate: (self) => {
                    const progress = self.progress;

                    // Animate clip rect directly (smooth)
                    if (clipRectRef.current) {
                        clipRectRef.current.setAttribute('width', `${progress * 100}`);
                    }

                    // Animate scanner position directly (smooth)
                    if (scannerRef.current && pathRef.current) {
                        const targetX = progress * 100;
                        const pathLength = pathRef.current.getTotalLength();

                        // Binary search for point at targetX
                        let low = 0, high = pathLength;
                        let point = pathRef.current.getPointAtLength(0);
                        for (let i = 0; i < 15; i++) {
                            const mid = (low + high) / 2;
                            point = pathRef.current.getPointAtLength(mid);
                            if (point.x < targetX) low = mid;
                            else high = mid;
                        }

                        scannerRef.current.style.left = `${point.x}%`;
                        scannerRef.current.style.top = `${(point.y / 50) * 100}%`;
                        scannerRef.current.style.opacity = (progress > 0 && progress < 1) ? '1' : '0';
                    }

                    // Update React state less frequently for UI elements
                    setRevealProgress(progress);
                    const month = Math.min(
                        Math.floor(progress * (monthlyData.length - 1)),
                        monthlyData.length - 1
                    );
                    setCurrentMonth(month);
                },
            },
        });

        // Phase 2: Fade in fill area
        tl.to(fillPathRef.current, { opacity: 0.8, duration: 0.6, ease: "power2.out" }, 0.2);

        // Phase 4: Stats fade in - Earlier timing
        tl.from(statsRef.current, { opacity: 0, y: 20, duration: 0.2, ease: easingPresets.smooth }, 0.2);

        // Pulse animation
        if (pulseRef.current) {
            gsap.to(pulseRef.current, { scale: 1.2, duration: 1, repeat: -1, yoyo: true, ease: "sine.inOut" });
        }


    }, [waveformPath]);

    return (
        <ChapterContainer
            chapterNumber={1}
            title="The Pulse of the Market"
            subtitle="Scroll to see how Dubai's real estate heartbeat evolved through 2025."
        >
            <div ref={containerRef} className="relative">
                {/* Main visualization card */}
                <div
                    ref={chartRef}
                    className="relative overflow-hidden rounded-3xl bg-[#0A0A0F] border border-white/[0.08] shadow-2xl p-6 md:p-8"
                >
                    {/* Header */}
                    {/* Header */}
                    <div className="flex justify-between items-start mb-12">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <svg
                                    ref={pulseRef}
                                    className="w-4 h-4 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                >
                                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-white/80 uppercase tracking-widest text-[10px]">
                                Market Heartbeat • 2025
                            </span>
                        </div>
                    </div>


                    {/* Chart Area Wrapper */}
                    <div className="relative h-[300px] md:h-[400px] w-full mb-8 ml-6 md:ml-8 pr-6 md:pr-8">

                        {/* Y-Axis Labels - Dark Mode Style */}
                        <div className="absolute -left-10 top-0 bottom-0 flex flex-col justify-between text-[9px] font-mono text-gray-600 py-2">
                            <span>21k</span><span>19k</span><span>17k</span><span>15k</span><span>13k</span>
                        </div>

                        {/* Coordinate System Root */}
                        <div className="relative w-full h-full">
                            {/* SVG Layer */}
                            <svg
                                viewBox="0 0 100 50"
                                preserveAspectRatio="none"
                                className="absolute inset-0 w-full h-full overflow-visible"
                            >
                                <defs>
                                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#10B981" />
                                        <stop offset="50%" stopColor="#3B82F6" />
                                        <stop offset="100%" stopColor="#8B5CF6" />
                                    </linearGradient>
                                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
                                        <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
                                    </linearGradient>
                                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="2" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                    <clipPath id="reveal-clip">
                                        <rect ref={clipRectRef} x="0" y="0" width="0" height="50" />
                                    </clipPath>
                                </defs>

                                {/* Background Grid - Always Visible */}
                                {[0, 0.25, 0.5, 0.75, 1].map((y) => (
                                    <line
                                        key={y}
                                        x1="0"
                                        y1={50 - y * 40 - 5}
                                        x2="100"
                                        y2={50 - y * 40 - 5}
                                        stroke="#333"
                                        strokeWidth="0.1"
                                        strokeDasharray="0.5 0.5"
                                        vectorEffect="non-scaling-stroke"
                                        className="opacity-20"
                                    />
                                ))}

                                {/* Main Line - Revealed by Clip Path */}
                                <g clipPath="url(#reveal-clip)">
                                    <path
                                        ref={pathRef}
                                        d={waveformPath}
                                        fill="none"
                                        stroke="url(#lineGradient)"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        vectorEffect="non-scaling-stroke"
                                        filter="url(#glow)"
                                    />
                                    <path
                                        ref={fillPathRef}
                                        d={`${waveformPath} L 100 50 L 0 50 Z`}
                                        fill="url(#areaGradient)"
                                        opacity={0.6}
                                    />
                                </g>

                                {/* Vertical Event Lines - Revealed by Scroll */}
                                {monthlyData.map((data, index) => {
                                    const x = (index / (monthlyData.length - 1)) * 100;
                                    const isActive = index <= currentMonth;
                                    return (
                                        <line
                                            key={`vline-${index}`}
                                            x1={x}
                                            y1="0"
                                            x2={x}
                                            y2="50"
                                            stroke={data.events.length > 0 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.02)"}
                                            strokeWidth={data.events.length > 0 ? 0.3 : 0.1}
                                            strokeDasharray="1 1"
                                            vectorEffect="non-scaling-stroke"
                                            className={cn(
                                                "transition-opacity duration-300",
                                                isActive ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    );
                                })}
                            </svg>

                            {/* HTML Layer: Interactive Elements & Scanner */}
                            <div className="absolute inset-0 pointer-events-none">
                                {/* Scanner Head (HTML for perfect circle) */}
                                <div
                                    ref={scannerRef}
                                    className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)] z-30"
                                    style={{
                                        left: '0%',
                                        top: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        opacity: 0
                                    }}
                                >
                                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-50" />
                                </div>

                                {monthlyData.map((data, index) => {
                                    const x = (index / (monthlyData.length - 1)) * 100;
                                    // Use same dynamic range as SVG path for consistency
                                    const padding = (maxValue - minValue) * 0.1;
                                    const rangeMin = minValue - padding;
                                    const rangeMax = maxValue + padding;
                                    const normalizedValue = (data.value - rangeMin) / (rangeMax - rangeMin);
                                    const y = 50 - normalizedValue * 50 * 0.8 - 5;
                                    const topPercent = (y / 50) * 100;

                                    const isVisible = index <= currentMonth;
                                    const isLatest = index === currentMonth;

                                    return (
                                        <React.Fragment key={index}>
                                            {/* Event Badge (Pill) */}
                                            {data.events.length > 0 && (
                                                <div
                                                    className={cn(
                                                        "absolute pointer-events-auto group/event transition-all duration-500 transform",
                                                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
                                                    )}
                                                    style={{ left: `${x}%`, top: '0px', transform: 'translateX(-50%)' }}
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <div className="h-4 w-[1px] bg-gradient-to-b from-blue-500/0 to-blue-500/50 mb-1" />
                                                        <div className="bg-[#0F172A] border border-blue-500/30 rounded px-2 py-0.5 shadow-[0_4px_10px_rgba(0,0,0,0.5)] backdrop-blur-md hover:border-blue-400 min-w-[60px] text-center cursor-help">
                                                            <span className="text-[9px] font-bold text-blue-400 tracking-wider">EVENT</span>
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover/event:opacity-100 transition-opacity bg-surface-elevated-2/95 border border-border-default p-3 rounded-lg text-xs w-[180px] text-text-secondary shadow-2xl z-40 pointer-events-none">
                                                        <div className="font-semibold text-text-primary mb-1">{data.events[0]}</div>
                                                        <div className="flex justify-between items-center text-[10px] text-text-tertiary border-t border-border-subtle pt-2 mt-2">
                                                            <span>Vol: {data.volume}</span>
                                                            <span className={cn(
                                                                data.sentiment === "Bullish" || data.sentiment === "Super Bullish" ? "text-emerald-400" :
                                                                    data.sentiment === "Bearish" ? "text-rose-400" : "text-yellow-400"
                                                            )}>{data.sentiment}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Data Point */}
                                            <div
                                                className={cn(
                                                    "absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto transition-all duration-300",
                                                    isVisible ? "scale-100 opacity-100" : "scale-0 opacity-0"
                                                )}
                                                style={{
                                                    left: `${x}%`,
                                                    top: `${topPercent}%`,
                                                    width: '20px',
                                                    height: '20px',
                                                    zIndex: 20
                                                }}
                                                onMouseEnter={() => setHoveredMonth(index)}
                                                onMouseLeave={() => setHoveredMonth(null)}
                                            >
                                                {/* The Dot */}
                                                <div
                                                    ref={(el: HTMLDivElement | null) => {
                                                        pointRefs.current[index] = el;
                                                    }}
                                                    className={cn(
                                                        "rounded-full border-2 transition-all duration-300 bg-[#0A0A0F]",
                                                        isLatest ? "w-2.5 h-2.5 border-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "w-1.5 h-1.5 border-gray-600 bg-gray-900 hover:border-emerald-400 hover:scale-125"
                                                    )}
                                                />
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                            </div>

                            {/* Hover overlay line */}
                            {hoveredMonth !== null && (
                                <div
                                    className="absolute inset-y-0 pointer-events-none border-l border-dashed border-primary/30 transition-all duration-75"
                                    style={{
                                        left: `${(hoveredMonth / (monthlyData.length - 1)) * 100}%`,
                                    }}
                                >
                                    {/* Floating Info Card */}
                                    <div className={cn(
                                        "absolute top-10 ml-4 p-3 rounded-xl bg-surface-elevated-2/90 border border-border-default shadow-xl backdrop-blur-md min-w-[140px] z-50",
                                        hoveredMonth > 8 ? "-ml-4 -translate-x-full" : ""
                                    )}>
                                        <div className="text-blue-400 text-xs font-medium mb-1">
                                            {monthlyData[hoveredMonth].month} 2025
                                        </div>
                                        <div className="text-xl font-bold text-white">
                                            {monthlyData[hoveredMonth].value.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* X-Axis Labels */}
                            <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-0">
                                {monthlyData.map((data, index) => {
                                    const isVisible = index <= currentMonth;
                                    const isLatest = index === currentMonth;

                                    return (
                                        <div
                                            key={data.month}
                                            ref={(el) => {
                                                labelRefs.current[index] = el;
                                            }}
                                            className="relative flex flex-col items-center"
                                            style={{ width: '0px' }}
                                        >
                                            <span
                                                className={cn(
                                                    "text-[10px] font-medium tracking-wide transition-all duration-500 absolute top-0 transform -translate-x-1/2 whitespace-nowrap",
                                                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
                                                    isLatest ? "text-blue-400" : "text-gray-500"
                                                )}
                                            >
                                                {data.month}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                        </div>
                    </div>

                    {/* Stats Footer */}
                    <div
                        ref={statsRef}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-6 border-t border-white/[0.05]"
                    >
                        <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-400 font-mono">
                                {(minValue / 1000).toFixed(1)}k
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">LOWEST MONTH</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400 font-mono">
                                {(maxValue / 1000).toFixed(1)}k
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">PEAK MONTH</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-emerald-400 font-mono">
                                {(totalTransactions / 1000).toFixed(0)}k
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">TOTAL SALES</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400 font-mono">
                                {totalVolume.toFixed(0)}B
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">TOTAL VALUE (AED)</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footnote */}
            <div className="mt-8 pt-6 border-t border-border-subtle">
                <p className="text-[11px] text-text-quaternary/70 leading-relaxed max-w-3xl">
                    <span className="text-text-tertiary font-medium">Source:</span> Dubai Land Department (DLD) transaction records.
                    Market trends and sentiment analysis based on registered sales and Ejari contracts.
                    Last updated: December 31st, 2025.
                </p>
            </div>
        </ChapterContainer >
    );
}
