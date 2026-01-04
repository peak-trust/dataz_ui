"use client";

import * as React from "react";
import { BentoBox } from "./bento-box";
import { TrendingUp } from "lucide-react";

interface SalesVolumeCardProps {
    lastMonth: string;
    thisYear: string;
    className?: string;
}

export function SalesVolumeCard({
    lastMonth,
    thisYear,
    className
}: SalesVolumeCardProps) {
    return (
        <BentoBox span="2" className={className}>
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-chart-blue/20 flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-chart-blue" />
                    </div>
                    <span className="text-sm font-medium text-foreground-secondary uppercase tracking-wider">
                        Sales Volume
                    </span>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-4">
                    <div>
                        <p className="text-3xl font-bold text-foreground">{lastMonth}</p>
                        <p className="text-sm text-foreground-tertiary mt-1">Last month</p>
                    </div>

                    <div className="h-px bg-white/10" />

                    <div>
                        <p className="text-3xl font-bold text-foreground">{thisYear}</p>
                        <p className="text-sm text-foreground-tertiary mt-1">This year</p>
                    </div>
                </div>
            </div>
        </BentoBox>
    );
}
