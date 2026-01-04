"use client";

import * as React from "react";
import { BentoBox } from "./bento-box";
import { PieChart } from "lucide-react";

interface OffPlanReadyCardProps {
    offPlanPercent: number;
    readyPercent: number;
    offPlanGrowth: number;
    readyGrowth: number;
    className?: string;
}

export function OffPlanReadyCard({
    offPlanPercent,
    readyPercent,
    offPlanGrowth,
    readyGrowth,
    className
}: OffPlanReadyCardProps) {
    // SVG donut chart
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const offPlanOffset = circumference * (1 - offPlanPercent / 100);

    return (
        <BentoBox span="3" className={className}>
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-chart-pink/20 flex items-center justify-center">
                        <PieChart className="w-4 h-4 text-chart-pink" />
                    </div>
                    <div>
                        <span className="text-sm font-medium text-foreground-secondary uppercase tracking-wider">
                            Off-Plan vs Ready
                        </span>
                        <p className="text-xs text-foreground-tertiary">(Last 12 Months)</p>
                    </div>
                </div>

                <div className="flex-1 flex items-center gap-6">
                    {/* Donut Chart */}
                    <div className="relative w-28 h-28 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            {/* Background circle */}
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                fill="none"
                                stroke="var(--chart-teal)"
                                strokeWidth="12"
                                opacity="0.3"
                            />
                            {/* Off-plan segment */}
                            <circle
                                cx="50"
                                cy="50"
                                r={radius}
                                fill="none"
                                stroke="var(--chart-purple)"
                                strokeWidth="12"
                                strokeDasharray={circumference}
                                strokeDashoffset={offPlanOffset}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-lg font-bold text-foreground">{offPlanPercent}%</span>
                            <span className="text-[10px] text-foreground-tertiary">Off-Plan</span>
                        </div>
                    </div>

                    {/* Legend & Growth */}
                    <div className="flex-1 flex flex-col gap-3">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-chart-purple" />
                                <span className="text-sm text-foreground">Off-Plan</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground">{offPlanPercent}%</span>
                                <span className={`text-xs ${offPlanGrowth >= 0 ? 'text-success' : 'text-error'}`}>
                                    ▲ {offPlanGrowth >= 0 ? '+' : ''}{offPlanGrowth}%
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03]">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-chart-teal" />
                                <span className="text-sm text-foreground">Ready</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-foreground">{readyPercent}%</span>
                                <span className={`text-xs ${readyGrowth >= 0 ? 'text-success' : 'text-error'}`}>
                                    ▲ {readyGrowth >= 0 ? '+' : ''}{readyGrowth}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BentoBox>
    );
}
