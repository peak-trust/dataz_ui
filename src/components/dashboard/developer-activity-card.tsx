"use client";

import * as React from "react";
import { BentoBox } from "./bento-box";
import { Users } from "lucide-react";

interface DeveloperData {
    rank: number;
    name: string;
    projects: number;
}

interface DeveloperActivityCardProps {
    title?: string;
    year?: string;
    developers: DeveloperData[];
    className?: string;
}

export function DeveloperActivityCard({
    title = "Developer Activity",
    year = "2024",
    developers,
    className
}: DeveloperActivityCardProps) {
    const maxProjects = Math.max(...developers.map(d => d.projects));

    return (
        <BentoBox span="2" className={className}>
            <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <span className="text-sm font-medium text-foreground-secondary uppercase tracking-wider">
                            {title}
                        </span>
                        <p className="text-xs text-foreground-tertiary">({year})</p>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-2">
                    {developers.map((dev) => (
                        <div
                            key={dev.rank}
                            className="flex items-center gap-3 py-2"
                        >
                            <span className="text-xs font-medium text-foreground-tertiary w-4">
                                {dev.rank}.
                            </span>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-foreground">
                                        {dev.name}
                                    </span>
                                    <span className="text-sm font-semibold text-chart-blue">
                                        {dev.projects}
                                    </span>
                                </div>
                                {/* Progress bar */}
                                <div className="h-1 w-full bg-white/[0.05] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-chart-blue to-chart-purple rounded-full transition-all duration-500"
                                        style={{ width: `${(dev.projects / maxProjects) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </BentoBox>
    );
}
