"use client";

import * as React from "react";
import { TrendingUp, Building2, Banknote } from "lucide-react";
import { useGsap, easingPresets } from "@/lib/hooks/useGsap";

// Real 2025 Dubai market stats from DLD data (verified Dec 31, 2025)
const stats = [
    {
        label: "Total Sales",
        value: "AED 902B",
        trend: "+19% YoY",
        icon: Banknote,
        color: "from-emerald-400 to-cyan-400",
    },
    {
        label: "Off-Plan Share",
        value: "51%",
        trend: "Peak: 58%",
        icon: Building2,
        color: "from-purple-400 to-pink-400",
    },
    {
        label: "Price Growth",
        value: "+6.3%",
        trend: "Sustained",
        icon: TrendingUp,
        color: "from-amber-300 to-orange-400",
    }
];

export function HeroStatsCards() {
    const containerRef = React.useRef<HTMLDivElement>(null);

    // Entrance animation is now controlled by HeroSection via GSAP
    // We just keep the hover effects below

    return (
        <div ref={containerRef} className="flex flex-wrap items-center justify-center gap-6 mt-16 [perspective:1000px]">
            {stats.map((stat, i) => (
                <TiltCard key={i} stat={stat} />
            ))}
        </div>
    );
}

function TiltCard({ stat }: { stat: typeof stats[0] }) {
    const cardRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const sheenRef = React.useRef<HTMLDivElement>(null);

    // GSAP quickTo for performant mouse following
    // These need to be stored in refs to be accessible in event handlers
    const xTo = React.useRef<((value: number) => void) | null>(null);
    const yTo = React.useRef<((value: number) => void) | null>(null);
    const sheenXTo = React.useRef<((value: number) => void) | null>(null);
    const sheenYTo = React.useRef<((value: number) => void) | null>(null);

    useGsap((gsap) => {
        if (!cardRef.current || !sheenRef.current) return;

        // Initialize quickTo functions for smooth spring-like movement
        xTo.current = gsap.quickTo(cardRef.current, "rotationY", { duration: 0.4, ease: "power3.out" });
        yTo.current = gsap.quickTo(cardRef.current, "rotationX", { duration: 0.4, ease: "power3.out" });

        // Sheen movement
        sheenXTo.current = gsap.quickTo(sheenRef.current, "x", { duration: 0.4, ease: "power3.out" });
        sheenYTo.current = gsap.quickTo(sheenRef.current, "y", { duration: 0.4, ease: "power3.out" });
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || !xTo.current || !yTo.current || !sheenXTo.current || !sheenYTo.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = (mouseX / width - 0.5);
        const yPct = (mouseY / height - 0.5);

        // Calculate rotation (max 10 degrees)
        xTo.current(xPct * 20); // rotateY
        yTo.current(yPct * -20); // rotateX (inverted for natural tilt)

        // Move sheen
        sheenXTo.current(xPct * 200);
        sheenYTo.current(yPct * 200);
    };

    const handleMouseLeave = () => {
        if (!xTo.current || !yTo.current || !sheenXTo.current || !sheenYTo.current) return;

        // Reset position
        xTo.current(0);
        yTo.current(0);
        sheenXTo.current(0);
        sheenYTo.current(0);
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="hero-stat-card translate-y-8 scale-90 stat-card group relative w-[240px] h-[140px] cursor-default preserve-3d"
            style={{ transformStyle: "preserve-3d", opacity: 0 }}
        >
            {/* 
               APPLE INSPIRED GLASS
               - Heavy blur (backdrop-blur-3xl)
               - Subtle white gradient
               - Crisp border
               - Deep subtle shadow (no colored glow)
            */}
            <div
                className={`
                    absolute inset-0 rounded-3xl
                    bg-gradient-to-b from-white/10 to-white/5
                    backdrop-blur-2xl 
                    border border-white/20
                    shadow-2xl shadow-black/20
                    transition-colors duration-300
                    group-hover:bg-white/15 group-hover:border-white/30
                `}
                style={{
                    transform: "translateZ(0px)",
                }}
            >
                {/* Subtle Noise Texture */}
                <div className="absolute inset-0 rounded-3xl opacity-20 pointer-events-none mix-blend-overlay"
                    style={{ backgroundImage: 'url("/noise.png")' }}
                />

                {/* Specular Highlight / Sheen effect */}
                <div
                    ref={sheenRef}
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                        background: "radial-gradient(circle at center, rgba(255,255,255,0.08) 0%, transparent 45%)",
                        width: "150%",
                        height: "150%",
                        left: "-25%",
                        top: "-25%",
                        mixBlendMode: "plus-lighter"
                    }}
                />

                {/* Content */}
                <div
                    ref={contentRef}
                    className="relative h-full flex flex-col justify-between p-6"
                    style={{ transform: "translateZ(20px)" }}
                >
                    <div className="flex items-start justify-between">
                        <span className="text-white/70 text-[13px] font-medium tracking-wide">
                            {stat.label}
                        </span>
                        {/* Icon Container - clean frost */}
                        <div className={`
                            p-2 rounded-xl bg-white/10
                            backdrop-blur-md 
                            border border-white/10
                        `}>
                            <stat.icon className="w-4 h-4 text-white/90" />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-3xl font-semibold text-white tracking-tight">
                                {stat.value}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Trend Indicator - Cleaner, pill shaped */}
                            <span className={`
                                text-[11px] font-semibold px-2 py-0.5 rounded-full
                                bg-gradient-to-r ${stat.color} 
                                text-white/90 shadow-sm
                            `}>
                                {stat.trend}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
