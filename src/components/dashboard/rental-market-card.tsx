"use client";

import * as React from "react";
import { BentoBox } from "./bento-box";
import { Home } from "lucide-react";

interface RentalMarketCardProps {
    newContracts: string;
    avgGrowth: number;
    topAreas: string[];
    className?: string;
}

export function RentalMarketCard({
    newContracts,
    avgGrowth,
    topAreas,
    className
}: RentalMarketCardProps) {
    const isPositive = avgGrowth >= 0;

    return (
        <BentoBox span="2" className={className}>
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-chart-amber/20 flex items-center justify-center">
                        <Home className="w-4 h-4 text-chart-amber" />
                    </div>
                    <div>
                        <span className="text-sm font-medium text-foreground-secondary uppercase tracking-wider">
                            Rental Market
                        </span>
                        <p className="text-xs text-foreground-tertiary">(Last 12 Months)</p>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-4">
                    <div>
                        <p className="text-3xl font-bold text-foreground">{newContracts}</p>
                        <p className="text-sm text-foreground-tertiary mt-1">New contracts</p>
                    </div>

                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium w-fit ${isPositive
                            ? 'bg-success/20 text-success'
                            : 'bg-error/20 text-error'
                        }`}>
                        Avg rent growth: {isPositive ? '+' : ''}{avgGrowth}%
                    </div>

                    <div>
                        <p className="text-xs text-foreground-tertiary mb-2">Top rental areas:</p>
                        <div className="flex flex-wrap gap-2">
                            {topAreas.map((area) => (
                                <span
                                    key={area}
                                    className="px-2 py-1 rounded-md bg-white/[0.05] text-xs text-foreground-secondary"
                                >
                                    • {area}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </BentoBox>
    );
}
