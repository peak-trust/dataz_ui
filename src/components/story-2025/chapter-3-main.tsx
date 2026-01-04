"use client";

import * as React from "react";
import { ChapterContainer } from "./shared-chapter-container";
import { chapter3Data as data } from "./chapter-3-data";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { useGsap, gsap } from "@/lib/hooks/useGsap";
import { cn } from "@/lib/utils";
import { useHaptics } from "./hooks/use-haptics";


// Define Serie type locally since it may not be exported from @nivo/line
type Serie = {
    id: string | number;
    data: Array<{
        x: string | number;
        y: number;
        [key: string]: any;
    }>;
};

// --- Types ---
interface DataPoint {
    month?: string;
    quarter?: string;
    value: number;
    prevValue?: number;
    compareValue?: number;
    milestone?: string;
    volume?: number;
}

interface Story {
    id: string;
    title: string;
    stats: { main: string; sub: string };
    description: string[];
    area: string;
    chartType: string;
    data?: DataPoint[];
    distribution?: { label: string; value: number }[];
    trendColor: string;
    series?: { id: string; key: string; color: string }[];
    keyFindings?: string[];
    citation?: string;
}

// --- Theme & Colors ---
const THEME = {
    background: "transparent",
    text: {
        fill: "#9ca3af",
        fontSize: 11,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    },
    axis: {
        domain: {
            line: {
                stroke: "#374151",
                strokeWidth: 1,
            },
        },
        ticks: {
            line: {
                stroke: "#374151",
                strokeWidth: 1,
            },
            text: {
                fill: "#ffffff", // Pure white for maximum visibility
                fontSize: 10,
            },
        },
    },
    grid: {
        line: {
            stroke: "#374151",
            strokeWidth: 1,
            strokeDasharray: "4 4",
            strokeOpacity: 0.3,
        },
    },
    crosshair: {
        line: {
            stroke: "#ffffff",
            strokeWidth: 1,
            strokeOpacity: 0.5,
        },
    },
    tooltip: {
        container: {
            background: "#0f172a",
            color: "#fff",
            fontSize: 12,
            borderRadius: 8,
            boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
        },
    },
};

const COLORS: Record<string, string> = {
    emerald: "#10B981",
    blue: "#3B82F6",
    amber: "#F59E0B",
    purple: "#8B5CF6",
    rose: "#F43F5E",
    sky: "#0EA5E9",
    cyan: "#06B6D4",
    orange: "#F97316",
    gray: "#94a3b8", // Lighter gray for better contrast on dark bg
};

const COLOR_STYLES: Record<string, { bg: string; text: string; border: string; indicator: string }> = {
    emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", indicator: "bg-emerald-500" },
    blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", indicator: "bg-blue-500" },
    amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", indicator: "bg-amber-500" },
    purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20", indicator: "bg-purple-500" },
    rose: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", indicator: "bg-rose-500" },
    sky: { bg: "bg-sky-500/10", text: "text-sky-400", border: "border-sky-500/20", indicator: "bg-sky-500" },
    cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20", indicator: "bg-cyan-500" },
    orange: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20", indicator: "bg-orange-500" },
    gray: { bg: "bg-gray-500/10", text: "text-gray-400", border: "border-gray-500/20", indicator: "bg-gray-500" },
};

// --- Chart Wrappers ---

const PriceLineChart = ({ story }: { story: Story }) => {
    // Transform data for Nivo Line
    const series: Serie[] = [];

    // We can show Volume as a Bar Chart or similar underneath, but Nivo Line doesn't support Mixed Types easily.
    // However, we can use a custom layer or just stick to the Dual-Line for now to keep it clean, as requested "Chart feels lonely".
    // Let's implement the Dual Series correctly first.

    if (story.data) {
        // 1. Primary Series (The Story Subject)
        const primaryId = story.series?.[0]?.id || story.area || "Current";
        series.push({
            id: primaryId,
            data: story.data.map((d) => ({
                x: d.quarter || d.month || "",
                y: d.value,
                seriesName: primaryId // Explicitly pass name to data point
            })),
        });

        // 2. Secondary Series (The Benchmark/Context)
        const firstPoint = story.data[0];
        let secondaryKey = "";

        if (firstPoint) {
            if ("compareValue" in firstPoint) secondaryKey = "compareValue";
            else if ("prevValue" in firstPoint) secondaryKey = "prevValue";
            else if ("contextValue" in firstPoint) secondaryKey = "contextValue";
        }

        if (secondaryKey) {
            const secondaryId = story.series?.[1]?.id || "Benchmark";
            series.push({
                id: secondaryId,
                data: story.data.map((d) => ({
                    x: d.quarter || d.month || "",
                    y: (d as any)[secondaryKey],
                    seriesName: secondaryId // Explicitly pass name
                })).filter(d => d.y !== undefined) as { x: string, y: number, seriesName: string }[],
            });
        }
    }

    const mainColor = COLORS[story.series?.[0]?.color || story.trendColor] || COLORS.emerald;
    const secondaryColor = COLORS[story.series?.[1]?.color || "gray"] || COLORS.gray;

    return (
        <div className="w-full h-[400px]">
            <ResponsiveLine
                data={series}
                margin={{ top: 20, right: 30, bottom: 80, left: 60 }}
                xScale={{ type: "point" }}
                yScale={{
                    type: "linear",
                    min: "auto",
                    max: "auto",
                    stacked: false,
                    reverse: false,
                }}
                curve="catmullRom"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 15,
                    tickRotation: -45,
                    // removed legend to prevent overlap with footer
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 10,
                    tickRotation: 0,
                    legend: story.chartType === "volume" ? "Transaction Volume" : "Price Index (AED/sqft)",
                    legendOffset: -50,
                    legendPosition: "middle",
                    format: (v) => `${v}`,
                }}
                enableGridX={false}
                colors={[mainColor, secondaryColor]}
                lineWidth={3}
                enablePoints={true}
                pointSize={8}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                enableArea={story.chartType === "gap"}
                areaOpacity={0.15}
                useMesh={true}
                enableSlices="x"
                theme={THEME}
                legends={[
                    {
                        anchor: 'top-right',
                        direction: 'row',
                        justify: false,
                        translateX: 0,
                        translateY: -20,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 140,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemBackground: 'rgba(0, 0, 0, .03)',
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
                sliceTooltip={({ slice }) => {
                    return (
                        <div className="bg-surface-elevated-2/95 backdrop-blur-xl border border-border-default p-3 rounded-lg shadow-2xl min-w-[200px]">
                            <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-2">
                                <span className="text-xs text-gray-400 font-mono uppercase">{String(slice.points[0].data.x)}</span>
                            </div>
                            {slice.points.map((point) => (
                                <div key={point.id} className="flex items-center justify-between gap-4 mb-2 last:mb-0">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: point.seriesColor || point.borderColor || '#fff' }} />
                                        <span className="text-xs text-gray-300 font-medium">
                                            {/* @ts-ignore - Reading manually injected seriesName from data */}
                                            {String(point.data.seriesName || point.serieId)}
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-white font-mono">{point.data.yFormatted}</span>
                                </div>
                            ))}
                        </div>
                    );
                }}
            />
        </div>
    );
};

const DistributionBarChart = ({ story }: { story: Story }) => {
    if (!story.distribution) return null;

    // Transform for Nivo Bar
    // Bar expects array of objects, keys map to bars
    const data = story.distribution.map(d => ({
        type: d.label,
        value: d.value,
        color: COLORS[story.trendColor]
    }));

    return (
        <div className="w-full h-[400px]">
            <ResponsiveBar
                data={data}
                keys={["value"]}
                indexBy="type"
                margin={{ top: 20, right: 30, bottom: 35, left: 60 }}
                padding={0.3}
                valueScale={{ type: "linear" }}
                indexScale={{ type: "band", round: true }}
                colors={[COLORS.rose, COLORS.purple, COLORS.blue, COLORS.emerald, COLORS.amber]}
                colorBy="indexValue"
                borderRadius={4}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 10,
                    tickRotation: 0,
                    legend: "Unit Type",
                    legendPosition: "middle",
                    legendOffset: 28,
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 10,
                    tickRotation: 0,
                    legend: "Share (%)",
                    legendPosition: "middle",
                    legendOffset: -45,
                }}
                enableGridY={true}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="#ffffff"
                theme={THEME}
                tooltip={({ indexValue, value, color }) => (
                    <div className="bg-surface-elevated-2/95 backdrop-blur-xl border border-border-default p-3 rounded-lg shadow-2xl flex items-center gap-3">
                        <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                        <div>
                            <div className="text-xs text-gray-400 font-mono uppercase">{indexValue}</div>
                            <div className="text-sm font-bold text-white">{value}% Market Share</div>
                        </div>
                    </div>
                )}
            />
        </div>
    );
};


// --- Main Layout ---

export function ChapterPrice({ isActive = false }: { isActive?: boolean }) {
    const stories = data.stories as Story[];
    const [activeStoryIndex, setActiveStoryIndex] = React.useState(0);
    const [isDesktop, setIsDesktop] = React.useState(true);
    const { triggerHaptic } = useHaptics();

    // Initial check and listener for resizing
    React.useEffect(() => {
        const checkIsDesktop = () => setIsDesktop(window.innerWidth >= 1024);
        checkIsDesktop();
        window.addEventListener('resize', checkIsDesktop);
        return () => window.removeEventListener('resize', checkIsDesktop);
    }, []);

    const activeStory = stories[activeStoryIndex];
    const activeStyles = COLOR_STYLES[activeStory.trendColor] || COLOR_STYLES.emerald;

    // Refs for animation
    const chartContainerRef = React.useRef<HTMLDivElement>(null);

    useGsap((gsap) => {
        if (!chartContainerRef.current) return;
        gsap.killTweensOf(chartContainerRef.current);
        gsap.fromTo(chartContainerRef.current,
            { opacity: 0, scale: 0.98 },
            { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }
        );
    }, [activeStoryIndex]);

    // Sub-component for the Chart/Detail Panel
    const DetailPanel = ({ story, showHeader = true }: { story: Story, showHeader?: boolean }) => {
        const styles = COLOR_STYLES[story.trendColor] || COLOR_STYLES.emerald;

        return (
            <div className="flex flex-col h-full">
                {showHeader && (
                    <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                        <div className="w-full">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 gap-4 md:gap-0">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold text-white">{story.title}</h2>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${styles.bg} ${styles.text} ${styles.border}`}>
                                        {story.area}
                                    </span>
                                </div>
                                <div className={`text-left md:text-right ${styles.text}`}>
                                    <div className="text-xl font-mono font-bold">{story.stats.main}</div>
                                </div>
                            </div>

                            <p className="text-sm text-gray-400 max-w-2xl leading-relaxed mb-4">
                                {story.description.join(" ")}
                            </p>

                            {/* Key Findings Section - Only on Desktop Header usually, but let's keep it consistent */}
                            {story.keyFindings && (
                                <div className="bg-white/5 rounded-xl p-4 border border-white/5 mb-2">
                                    <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${styles.indicator}`} />
                                        Key Insights
                                    </h4>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                                        {story.keyFindings.map((finding, i) => (
                                            <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                                                <span className="text-gray-600 mt-0.5">•</span>
                                                {finding}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {!showHeader && (
                    /* Mobile specialized inner content (Description + Insights) */
                    <div className="mb-6 space-y-4">
                        <p className="text-sm text-gray-400 leading-relaxed">
                            {story.description.join(" ")}
                        </p>
                        {story.keyFindings && (
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                <h4 className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <div className={`w-1.5 h-1.5 rounded-full ${styles.indicator}`} />
                                    Key Insights
                                </h4>
                                <ul className="grid grid-cols-1 gap-y-2">
                                    {story.keyFindings.map((finding, i) => (
                                        <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                                            <span className="text-gray-600 mt-0.5">•</span>
                                            {finding}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Chart Area */}
                <div className="flex-1 w-full flex flex-col min-h-[400px]">
                    <div className="relative flex-1 min-h-[350px]">
                        <div
                            className={cn("absolute inset-0", showHeader && "animate-in fade-in duration-300")}
                            key={story.id} // Force re-render on story change to animate Nivo
                        >
                            {story.chartType === "distribution" ? (
                                <DistributionBarChart story={story} />
                            ) : (
                                <PriceLineChart story={story} />
                            )}
                        </div>
                    </div>

                    {story.citation && (
                        <div className="w-full text-right pt-2 border-t border-white/5 mt-auto">
                            <p className="text-[9px] text-gray-600 font-mono leading-tight opacity-60 hover:opacity-100 transition-opacity">
                                {story.citation}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const StoryListItem = ({ story, idx, isSelected, onClick }: any) => {
        const styles = COLOR_STYLES[story.trendColor] || COLOR_STYLES.emerald;

        return (
            <button
                onClick={(e) => {
                    onClick(e);
                    triggerHaptic("selection");
                }}
                className={`group relative p-5 rounded-2xl text-left transition-all duration-300 border w-full
                    ${isSelected
                        ? "bg-surface-elevated/80 shadow-lg translate-x-1"
                        : "bg-surface-base/40 border-white/5 hover:bg-surface-elevated/60 hover:border-white/20"
                    }
                `}
                style={isSelected ? { borderColor: COLORS[story.trendColor] + '80' } : {}}
            >
                <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border transition-colors
                        ${isSelected
                            ? `${styles.bg} ${styles.border} ${styles.text}`
                            : "bg-white/5 border-white/10 text-gray-500 group-hover:border-white/20"
                        }
                    `}>
                        0{idx + 1}
                    </span>
                    {isSelected && (
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider animate-in fade-in duration-300">
                            {story.area}
                        </span>
                    )}
                </div>

                <h3 className={`text-base font-bold mb-1 transition-colors ${isSelected ? "text-white" : "text-gray-300 group-hover:text-white"}`}>
                    {story.title}
                </h3>

                <div className="flex items-baseline gap-2 mt-2">
                    <span className={`text-xl font-bold font-mono ${isSelected ? "text-white" : "text-gray-500"}`}>
                        {story.stats.main}
                    </span>
                </div>
                <div className={`text-xs ${isSelected ? styles.text : "text-gray-600"}`}>
                    {story.stats.sub}
                </div>
            </button>
        );
    };


    return (
        <ChapterContainer
            chapterNumber={3}
            title="Market Dynamics"
            subtitle="Explore how Market dynamics shifted across key districts in 2025."
            isActive={isActive}
            className="bg-[#0A0A0F]"
        >
            <div className="w-full max-w-7xl mx-auto mt-8">

                {isDesktop ? (
                    /* --- DESKTOP GRID LAYOUT --- */
                    <div className="grid grid-cols-12 gap-8 lg:h-[600px]">
                        {/* List */}
                        <div className="col-span-4 flex flex-col gap-3 h-full overflow-y-auto pr-2 custom-scrollbar-gradient">
                            {stories.map((story, idx) => (
                                <StoryListItem
                                    key={story.id}
                                    story={story}
                                    idx={idx}
                                    isSelected={idx === activeStoryIndex}
                                    onClick={() => setActiveStoryIndex(idx)}
                                />
                            ))}
                        </div>
                        {/* Chart */}
                        <div className="col-span-8 bg-surface-elevated/50 rounded-3xl border border-border-default p-6 relative overflow-hidden backdrop-blur flex flex-col shadow-2xl">
                            <DetailPanel story={activeStory} showHeader={true} />
                        </div>
                    </div>
                ) : (
                    /* --- MOBILE ACCORDION LAYOUT --- */
                    <div className="flex flex-col gap-4">
                        {stories.map((story, idx) => {
                            const isSelected = idx === activeStoryIndex;
                            return (
                                <div key={story.id} className="flex flex-col gap-2">
                                    <StoryListItem
                                        story={story}
                                        idx={idx}
                                        isSelected={isSelected}
                                        onClick={() => {
                                            setActiveStoryIndex(idx);
                                            triggerHaptic("selection");
                                        }}
                                    />

                                    {/* Expanded Content */}
                                    {isSelected && (
                                        <div className="rounded-3xl bg-surface-elevated/50 border border-border-default p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <DetailPanel story={story} showHeader={false} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>

            {/* Citation */}
            <div className="mt-12 pt-6 border-t border-border-subtle">
                <p className="text-[11px] text-text-quaternary/70 leading-relaxed max-w-3xl">
                    <span className="text-text-tertiary font-medium">Source:</span> Dubai Land Department (DLD) transaction records.
                    Price per sqft calculated from transaction value divided by property area.
                    Off-plan identified via registration type. Rental yields estimated from Ejari contract data.
                    Last updated: December 31st, 2025.
                </p>
            </div>
        </ChapterContainer>
    );
}
