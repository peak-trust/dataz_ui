"use client";

import * as React from "react";
import { BentoBox } from "./bento-box";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface GrowthCardProps {
    percentage: number;
    comparison: string;
    className?: string;
}

export function GrowthCard({
    percentage,
    comparison,
    className
}: GrowthCardProps) {
    const isPositive = percentage >= 0;

    return (
        <BentoBox span="1" className={className}>
            <div className="flex flex-col h-full items-center justify-center text-center">
                <span className="text-sm font-medium text-foreground-secondary uppercase tracking-wider mb-4">
                    Growth
                </span>

                <div className="flex items-center gap-2">
                    <span className={`text-4xl font-bold ${isPositive ? 'text-success' : 'text-error'}`}>
                        {isPositive ? '▲' : '▼'} {Math.abs(percentage)}%
                    </span>
                </div>

                <p className="text-sm text-foreground-tertiary mt-3">{comparison}</p>
            </div>
        </BentoBox>
    );
}
