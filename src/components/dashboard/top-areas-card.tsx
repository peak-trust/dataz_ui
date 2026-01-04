"use client";

import * as React from "react";
import { BentoBox } from "./bento-box";
import { MapPin } from "lucide-react";

interface AreaData {
    rank: number;
    name: string;
    value: number;
}

interface TopAreasCardProps {
    title?: string;
    subtitle?: string;
    areas: AreaData[];
    className?: string;
}

export function TopAreasCard({
    title = "Most Active Areas",
    subtitle,
    areas,
    className
}: TopAreasCardProps) {
    return (
        <BentoBox span="2" className={className}>
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-chart-purple/20 flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-chart-purple" />
                    </div>
                    <div>
                        <span className="text-sm font-medium text-foreground-secondary uppercase tracking-wider">
                            {title}
                        </span>
                        {subtitle && (
                            <p className="text-xs text-foreground-tertiary">{subtitle}</p>
                        )}
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-2">
                    {areas.map((area) => (
                        <div
                            key={area.rank}
                            className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-foreground-tertiary w-5">
                                    {area.rank}.
                                </span>
                                <span className="text-sm font-medium text-foreground">
                                    {area.name}
                                </span>
                            </div>
                            <span className="text-sm font-semibold text-chart-blue">
                                {area.value.toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </BentoBox>
    );
}
