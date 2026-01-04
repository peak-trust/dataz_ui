"use client";

import * as React from "react";
import { BentoBox } from "./bento-box";
import { FileCheck } from "lucide-react";

interface ConstructionPermitsCardProps {
    approved: string;
    changePercent: number;
    className?: string;
}

export function ConstructionPermitsCard({
    approved,
    changePercent,
    className
}: ConstructionPermitsCardProps) {
    const isPositive = changePercent >= 0;

    // Mini trend chart data
    const trendData = [30, 45, 35, 55, 48, 60, 52, 70, 65, 75, 72, 80];
    const maxValue = Math.max(...trendData);

    return (
        <BentoBox span="2" className={className}>
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                        <FileCheck className="w-4 h-4 text-success" />
                    </div>
                    <div>
                        <span className="text-sm font-medium text-foreground-secondary uppercase tracking-wider">
                            Construction Permits
                        </span>
                        <p className="text-xs text-foreground-tertiary">(2024)</p>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold text-foreground">{approved}</p>
                            <p className="text-sm text-foreground-tertiary mt-1">Approved</p>
                        </div>

                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${isPositive
                                ? 'bg-success/20 text-success'
                                : 'bg-error/20 text-error'
                            }`}>
                            {isPositive ? '+' : ''}{changePercent}% vs 2023
                        </div>
                    </div>

                    {/* Mini bar chart */}
                    <div className="flex items-end justify-between gap-1 h-16 px-1">
                        {trendData.map((value, i) => (
                            <div
                                key={i}
                                className="flex-1 bg-gradient-to-t from-success/50 to-success rounded-t transition-all duration-300 hover:from-success/70 hover:to-success"
                                style={{ height: `${(value / maxValue) * 100}%` }}
                            />
                        ))}
                    </div>

                    {/* Month labels */}
                    <div className="flex justify-between text-[9px] text-foreground-tertiary px-1">
                        <span>Jan</span>
                        <span>Apr</span>
                        <span>Jul</span>
                        <span>Oct</span>
                        <span>Dec</span>
                    </div>
                </div>
            </div>
        </BentoBox>
    );
}
