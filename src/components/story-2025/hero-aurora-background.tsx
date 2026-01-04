"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
    className?: string;
}

export function AuroraBackground({ className }: AuroraBackgroundProps) {
    return (
        <div
            className={cn(
                "opacity-0 absolute inset-x-0 top-0 h-screen overflow-hidden pointer-events-none",
                className
            )}
        >
            {/* Aurora Layer 1 - Cyan/Teal */}
            <div className="ab-layer ab-1" />

            {/* Aurora Layer 2 - Purple/Pink */}
            <div className="ab-layer ab-2" />

            {/* Aurora Layer 3 - Blue accent */}
            <div className="ab-layer ab-3" />

            {/* Fade to transparent at bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0f]" />

            <style>{`
                .ab-layer {
                    position: absolute;
                    inset: -30%;
                    width: 160%;
                    height: 160%;
                    opacity: 0.6;
                    mix-blend-mode: screen;
                    will-change: transform;
                    filter: blur(60px);
                }

                .ab-1 {
                    background: radial-gradient(
                        ellipse 50% 40% at 30% 40%,
                        rgba(6, 182, 212, 0.6) 0%,
                        transparent 70%
                    );
                    animation: ab-float-1 12s ease-in-out infinite;
                }

                .ab-2 {
                    background: radial-gradient(
                        ellipse 45% 35% at 70% 50%,
                        rgba(168, 85, 247, 0.5) 0%,
                        transparent 70%
                    );
                    animation: ab-float-2 16s ease-in-out infinite;
                    animation-delay: -8s;
                }

                .ab-3 {
                    background: radial-gradient(
                        ellipse 40% 30% at 50% 30%,
                        rgba(59, 130, 246, 0.4) 0%,
                        transparent 70%
                    );
                    animation: ab-float-3 10s ease-in-out infinite;
                    animation-delay: -4s;
                }

                @keyframes ab-float-1 {
                    0%, 100% { transform: translate(0%, 0%) rotate(0deg); }
                    33% { transform: translate(25%, 15%) rotate(10deg); }
                    66% { transform: translate(-10%, -10%) rotate(-5deg); }
                }

                @keyframes ab-float-2 {
                    0%, 100% { transform: translate(0%, 0%) rotate(0deg); }
                    50% { transform: translate(-25%, 20%) rotate(-10deg); }
                }

                @keyframes ab-float-3 {
                    0%, 100% { transform: translate(0%, 0%); }
                    50% { transform: translate(20%, -15%); }
                }
            `}</style>
        </div>
    );
}
