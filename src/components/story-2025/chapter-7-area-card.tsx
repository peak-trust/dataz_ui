"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Building2, Train, GraduationCap, Stethoscope, TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import { useGsap, gsap, ScrollTrigger } from "@/lib/hooks/useGsap";
import { useHaptics } from "./hooks/use-haptics";
import { motion } from "framer-motion";

interface AreaCardProps {
    name: string;
    nameAr?: string;
    pricePerSqft: number;
    transactions: number;
    units?: number;
    amenities?: {
        schools?: number;
        metro?: number;
        clinics?: number;
    };
    yoyChange?: number;
    className?: string;
    onClick?: () => void;
    delay?: number;
}

export function AreaCard({
    name,
    nameAr,
    pricePerSqft,
    transactions,
    units,
    amenities,
    yoyChange,
    className,
    onClick,
    delay = 0,
}: AreaCardProps) {
    const cardRef = React.useRef<HTMLDivElement>(null);

    useGsap((gsap) => {
        if (!cardRef.current) return;

        gsap.fromTo(cardRef.current,
            { opacity: 0, y: 30, scale: 0.95 },
            {
                opacity: 1, y: 0, scale: 1,
                duration: 0.3,
                delay: delay,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: "top 90%", // Animate when card enters view
                }
            }
        );
    }, [delay]);

    const { triggerHaptic } = useHaptics();

    return (
        <motion.div
            ref={cardRef}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
                triggerHaptic("light");
                onClick && onClick();
            }}
            className={cn(
                "relative overflow-hidden rounded-2xl group opacity-0", // Start hidden
                "bg-white/[0.03] backdrop-blur-xl",
                "border border-white/[0.08]",
                "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
                "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
                "hover:border-white/[0.15] hover:bg-white/[0.05]",
                "transition-all duration-300",
                onClick && "cursor-pointer", // Only show cursor-pointer if onClick is provided
                className
            )}
        >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Inner glow */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />

            <div className="relative z-10 p-5">
                {/* Header */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {name}
                    </h3>
                    {nameAr && (
                        <p className="text-sm text-foreground-secondary font-arabic mt-0.5">
                            {nameAr}
                        </p>
                    )}
                </div>

                {/* Stats */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-foreground-secondary text-sm flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4" /> Price/sqft
                        </span>
                        <span className="text-foreground font-semibold">
                            {pricePerSqft.toLocaleString()} AED
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-foreground-secondary text-sm flex items-center gap-1.5">
                            <BarChart3 className="w-4 h-4" /> Transactions
                        </span>
                        <span className="text-foreground font-semibold">
                            {transactions.toLocaleString()}
                        </span>
                    </div>

                    {units && (
                        <div className="flex items-center justify-between">
                            <span className="text-foreground-secondary text-sm flex items-center gap-1.5">
                                <Building2 className="w-4 h-4" /> Units
                            </span>
                            <span className="text-foreground font-semibold">
                                {units.toLocaleString()}
                            </span>
                        </div>
                    )}

                    {yoyChange !== undefined && (
                        <div className="flex items-center justify-between">
                            <span className="text-foreground-secondary text-sm">YoY Change</span>
                            <span className={cn(
                                "font-semibold flex items-center gap-1",
                                yoyChange >= 0 ? "text-success" : "text-error"
                            )}>
                                {yoyChange >= 0 ? (
                                    <TrendingUp className="w-4 h-4" />
                                ) : (
                                    <TrendingDown className="w-4 h-4" />
                                )}
                                {yoyChange >= 0 ? "+" : ""}{yoyChange}%
                            </span>
                        </div>
                    )}
                </div>

                {/* Amenities */}
                {amenities && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="text-xs text-foreground-secondary mb-2 uppercase tracking-wider">
                            Amenities
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {amenities.schools !== undefined && (
                                <div className="flex items-center gap-1.5 text-sm text-foreground-secondary">
                                    <GraduationCap className="w-4 h-4 text-chart-blue" />
                                    <span>{amenities.schools} schools</span>
                                </div>
                            )}
                            {amenities.metro !== undefined && (
                                <div className="flex items-center gap-1.5 text-sm text-foreground-secondary">
                                    <Train className="w-4 h-4 text-chart-green" />
                                    <span>{amenities.metro} metro</span>
                                </div>
                            )}
                            {amenities.clinics !== undefined && (
                                <div className="flex items-center gap-1.5 text-sm text-foreground-secondary">
                                    <Stethoscope className="w-4 h-4 text-chart-pink" />
                                    <span>{amenities.clinics} clinics</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
