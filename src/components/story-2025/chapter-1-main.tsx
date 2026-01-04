"use client";

import * as React from "react";
import { useGsap, gsap } from "@/lib/hooks/useGsap";
import { cn } from "@/lib/utils";
import { ChapterContainer } from "./shared-chapter-container";
import { DataCounter } from "./shared-data-counter";
import { ResponsiveBar } from '@nivo/bar';
import { useHaptics } from "./hooks/use-haptics";

// Verified 2025 data from DLD (Dec 31, 2025)
const TOTAL_VALUE_AED_BILLION = 902;
const TOTAL_TRANSACTIONS_2025 = 262110;
const TOTAL_RENTAL_CONTRACTS_2025 = 1134452;

// Monthly transaction data for 2025 (verified from gold_transactions)
const MONTHLY_TRANSACTIONS_2025 = [
    { month: "Jan", transactions: 17751 },
    { month: "Feb", transactions: 19807 },
    { month: "Mar", transactions: 19209 },
    { month: "Apr", transactions: 22471 },
    { month: "May", transactions: 23368 },
    { month: "Jun", transactions: 20718 },
    { month: "Jul", transactions: 25145 }, // Peak month
    { month: "Aug", transactions: 22595 },
    { month: "Sep", transactions: 24890 },
    { month: "Oct", transactions: 24826 },
    { month: "Nov", transactions: 23404 },
    { month: "Dec", transactions: 17926 },
];

export function ChapterPulse() {
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Advanced Timeline Animation
    useGsap(() => {
        if (!containerRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%", // Standardized to match shared container
                toggleActions: "play none none reverse",
            }
        });

        // 1. Narrative Lines: Staggered entrance
        tl.from(".narrative-line", {
            y: 30,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power3.out"
        });

        // 2. Counter Groups: Slide in slightly after narrative
        tl.from(".counter-group", {
            x: -20,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
            ease: "back.out(1.2)" // Subtle overshoot for energy
        }, "-=0.4"); // Overlap with narrative

        // 3. Right Panel (Chart): Fade in with scale
        tl.from(".chart-panel", {
            opacity: 0,
            scale: 0.95,
            x: 20,
            duration: 0.6,
            ease: "power3.out"
        }, "-=0.8"); // Significant overlap for unified feel

    }, []);

    // Prepare data for Nivo chart
    const chartData = MONTHLY_TRANSACTIONS_2025.map(m => ({
        month: m.month,
        Transactions: m.transactions,
    }));

    const maxTransactions = Math.max(...MONTHLY_TRANSACTIONS_2025.map(m => m.transactions));
    const { triggerHaptic } = useHaptics();

    return (
        <ChapterContainer
            chapterNumber={1}
            title="The Pulse"
            subtitle="The heartbeat of a city that never stops."
            className="overflow-hidden"
        >
            <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center min-h-[600px]">

                {/* Left Panel: Counters & Narrative */}
                <div className="flex flex-col gap-16 order-2 lg:order-1 relative z-10">

                    {/* Narrative */}
                    <div className="space-y-6 text-lg md:text-xl font-light text-text-secondary">
                        <p className="narrative-line block">
                            In 2025, Dubai didn&apos;t sleep.
                        </p>
                        <div className="narrative-line pl-6 border-l border-border-default">
                            <p className="mb-3 text-text-tertiary"><span className="text-text-primary font-medium">Every 2 minutes:</span> A property changed hands.</p>
                            <p className="mb-3 text-text-tertiary"><span className="text-text-primary font-medium">Every hour:</span> 130 rental contracts signed.</p>
                            <p className="text-text-tertiary"><span className="text-text-primary font-medium">Every day:</span> AED 2.5 billion in transactions.</p>
                        </div>
                    </div>

                    {/* Counters */}
                    <div className="grid grid-cols-1 gap-10">
                        {/* Transactions */}
                        <div className="relative group counter-group">
                            <div className="text-xs font-medium text-text-quaternary uppercase tracking-wider mb-2">Total Transactions</div>
                            <div className="text-5xl md:text-6xl font-bold tracking-tight text-text-primary">
                                <DataCounter value={TOTAL_TRANSACTIONS_2025} duration={0.8} />
                            </div>
                            <div className="absolute -left-3 top-0 bottom-0 w-[1px] bg-border-default group-hover:bg-border-emphasized transition-colors duration-300" />
                        </div>

                        {/* Rental Contracts */}
                        <div className="relative group counter-group">
                            <div className="text-xs font-medium text-text-quaternary uppercase tracking-wider mb-2">Rental Contracts</div>
                            <div className="text-5xl md:text-6xl font-bold tracking-tight text-text-primary">
                                <DataCounter value={TOTAL_RENTAL_CONTRACTS_2025} duration={0.8} />
                            </div>
                            <div className="absolute -left-3 top-0 bottom-0 w-[1px] bg-border-default group-hover:bg-border-emphasized transition-colors duration-300" />
                        </div>

                        {/* Value */}
                        <div className="relative group counter-group">
                            <div className="text-xs font-medium text-text-quaternary uppercase tracking-wider mb-2">Total Value</div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-xl text-text-quaternary">AED</span>
                                <div className="text-5xl md:text-6xl font-bold tracking-tight text-text-primary">
                                    <DataCounter value={TOTAL_VALUE_AED_BILLION} duration={0.8} />
                                </div>
                                <span className="text-xl text-text-quaternary">Billion</span>
                            </div>
                            <div className="absolute -left-3 top-0 bottom-0 w-[1px] bg-border-default group-hover:bg-border-emphasized transition-colors duration-300" />
                        </div>
                    </div>

                </div>

                {/* Right Panel: Clean Minimal Chart */}
                <div className="chart-panel relative order-1 lg:order-2 min-h-[500px] lg:h-[600px] flex flex-col justify-center">

                    {/* Subtle background */}
                    <div className="absolute inset-0 bg-surface-base/30 rounded-2xl border border-border-subtle" />

                    {/* Content */}
                    <div className="relative z-10 p-4 md:p-8 space-y-8">

                        {/* Stats Card */}
                        <div className="bg-surface-elevated/50 border border-border-default rounded-xl p-6 backdrop-blur-sm">
                            <div className="text-xs font-medium text-text-quaternary uppercase tracking-wider mb-4">Market Rhythm</div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                <div>
                                    <div className="text-xs text-text-quaternary mb-1">Peak Month</div>
                                    <div className="text-lg font-semibold text-text-primary">July</div>
                                </div>
                                <div>
                                    <div className="text-xs text-text-quaternary mb-1">Avg. Transactions</div>
                                    <div className="text-lg font-semibold text-text-primary">
                                        {Math.round(TOTAL_TRANSACTIONS_2025 / 12).toLocaleString()}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-text-quaternary mb-1">Daily Transactions</div>
                                    <div className="text-lg font-semibold text-text-primary">
                                        {Math.round(TOTAL_TRANSACTIONS_2025 / 365).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Nivo Bar Chart */}
                        <div className="bg-surface-elevated/50 border border-border-default rounded-xl p-6 backdrop-blur-sm">
                            <div className="text-xs font-medium text-text-quaternary uppercase tracking-wider mb-4">Monthly Transactions</div>
                            <div className="h-[320px]">
                                <ResponsiveBar
                                    data={chartData}
                                    keys={['Transactions']}
                                    indexBy="month"
                                    margin={{ top: 10, right: 10, bottom: 40, left: 60 }}
                                    padding={0.3}
                                    valueScale={{ type: 'linear' }}
                                    indexScale={{ type: 'band', round: true }}
                                    colors={({ data }) => {
                                        // Highlight July (peak month)
                                        return data.Transactions === maxTransactions ? '#3b82f6' : '#475569';
                                    }}
                                    borderRadius={4}
                                    borderColor={{
                                        from: 'color',
                                        modifiers: [['darker', 0.3]]
                                    }}
                                    axisTop={null}
                                    axisRight={null}
                                    axisBottom={{
                                        tickSize: 0,
                                        tickPadding: 12,
                                        tickRotation: -45, // Rotated to prevent overlap on mobile
                                        legend: '',
                                        legendPosition: 'middle',
                                        legendOffset: 32
                                    }}
                                    axisLeft={{
                                        tickSize: 0,
                                        tickPadding: 12,
                                        tickRotation: 0,
                                        legend: '',
                                        legendPosition: 'middle',
                                        legendOffset: -40,
                                        format: (value) => `${(value / 1000).toFixed(0)}k`
                                    }}
                                    enableLabel={false}
                                    enableGridY={true}
                                    gridYValues={5}
                                    theme={{
                                        background: 'transparent',
                                        text: {
                                            fontSize: 11,
                                            fill: '#94a3b8',
                                            fontFamily: 'inherit'
                                        },
                                        axis: {
                                            domain: {
                                                line: {
                                                    stroke: '#334155',
                                                    strokeWidth: 1
                                                }
                                            },
                                            ticks: {
                                                line: {
                                                    stroke: '#334155',
                                                    strokeWidth: 1
                                                }
                                            }
                                        },
                                        grid: {
                                            line: {
                                                stroke: '#1e293b',
                                                strokeWidth: 1
                                            }
                                        },
                                        tooltip: {
                                            container: {
                                                background: '#0f172a',
                                                color: '#f1f5f9',
                                                fontSize: '12px',
                                                borderRadius: '6px',
                                                border: '1px solid #334155',
                                                padding: '8px 12px'
                                            }
                                        }
                                    }}
                                    tooltip={({ data, value }) => (
                                        <div className="flex flex-col gap-1">
                                            <div className="text-xs text-text-tertiary">{data.month} 2025</div>
                                            <div className="text-sm font-semibold text-text-primary">
                                                {value.toLocaleString()} transactions
                                            </div>
                                            {data.Transactions === maxTransactions && (
                                                <div className="text-xs text-blue-400">Peak Month</div>
                                            )}
                                        </div>
                                    )}
                                    animate={true}
                                    motionConfig="gentle"
                                    onClick={() => triggerHaptic("light")}
                                />
                            </div>
                        </div>

                    </div>

                </div>

            </div>

            {/* Footnote */}
            <div className="mt-16 pt-6 border-t border-border-subtle">
                <p className="text-[11px] text-text-quaternary/70 leading-relaxed max-w-3xl">
                    <span className="text-text-tertiary font-medium">Source:</span> Dubai Land Department (DLD) via Dubai Pulse Open Data Portal.
                    Data reflects registered sales and Ejari rental contracts for 2025.
                    Last updated: December 31st, 2025.
                </p>
            </div>
        </ChapterContainer>
    );
}
