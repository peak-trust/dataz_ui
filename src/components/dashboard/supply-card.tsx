"use client";

import * as React from "react";
import { BentoBox } from "./bento-box";
import { Building2 } from "lucide-react";

interface SupplyCardProps {
    areas: number;
    activeDevelopers: number;
    className?: string;
}

export function SupplyCard({
    areas,
    activeDevelopers,
    className
}: SupplyCardProps) {
    return (
        <BentoBox span="1" className={className}>
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-chart-teal/20 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-chart-teal" />
                    </div>
                    <span className="text-sm font-medium text-foreground-secondary uppercase tracking-wider">
                        Supply
                    </span>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-4">
                    <div className="text-center p-3 rounded-lg bg-white/[0.03]">
                        <p className="text-3xl font-bold text-foreground">{areas}</p>
                        <p className="text-xs text-foreground-tertiary mt-1">Areas</p>
                    </div>

                    <div className="text-center p-3 rounded-lg bg-white/[0.03]">
                        <p className="text-3xl font-bold text-foreground">{activeDevelopers}</p>
                        <p className="text-xs text-foreground-tertiary mt-1">Active Devs</p>
                    </div>
                </div>
            </div>
        </BentoBox>
    );
}
