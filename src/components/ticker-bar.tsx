"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const TICKER_DATA = [
    { area: "Business Bay", price: "$1.2M", roi: "+8.5%", trend: "up" },
    { area: "Dubai Marina", price: "$950K", roi: "+7.2%", trend: "up" },
    { area: "Downtown Dubai", price: "$1.5M", roi: "+6.8%", trend: "up" },
    { area: "Palm Jumeirah", price: "$2.8M", roi: "+9.1%", trend: "up" },
    { area: "JVC", price: "$450K", roi: "+10.5%", trend: "up" },
    { area: "Dubai Hills", price: "$1.1M", roi: "+8.9%", trend: "up" },
    { area: "Creek Harbour", price: "$850K", roi: "+7.5%", trend: "up" },
    { area: "Meydan", price: "$920K", roi: "+6.2%", trend: "up" },
    { area: "JLT", price: "$550K", roi: "+8.0%", trend: "up" },
    { area: "Arabian Ranches", price: "$1.8M", roi: "+5.9%", trend: "up" },
    { area: "Damac Hills", price: "$1.3M", roi: "+7.1%", trend: "up" },
    { area: "Bluewaters", price: "$3.2M", roi: "+6.5%", trend: "down" },
    { area: "Emaar Beachfront", price: "$2.1M", roi: "+8.2%", trend: "up" },
    { area: "City Walk", price: "$1.6M", roi: "+6.9%", trend: "up" },
    { area: "La Mer", price: "$2.4M", roi: "+7.4%", trend: "up" },
    { area: "Al Barari", price: "$3.5M", roi: "+5.5%", trend: "down" },
    { area: "Emirates Hills", price: "$8.5M", roi: "+4.8%", trend: "down" },
    { area: "The Villa", price: "$1.4M", roi: "+6.1%", trend: "up" },
    { area: "Mudon", price: "$980K", roi: "+6.7%", trend: "up" },
    { area: "Town Square", price: "$420K", roi: "+9.5%", trend: "up" },
];

export function TickerBar() {
    const pathname = usePathname();

    // Hide on the Story 2025 page
    if (pathname?.startsWith("/2025")) {
        return null;
    }

    return (
        <div className="relative mt-20 z-40 flex justify-center px-4 pointer-events-none">
            <div className="w-full max-w-7xl h-10 rounded-full border border-white/10 bg-black/20 backdrop-blur-xl overflow-hidden flex items-center shadow-[0_4px_30px_rgba(0,0,0,0.1)] pointer-events-auto relative">
                <div className="flex select-none">
                    <motion.div
                        className="flex min-w-full shrink-0 gap-8 items-center pr-8"
                        animate={{
                            x: ["0%", "-100%"],
                        }}
                        transition={{
                            duration: 240,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        {[...TICKER_DATA, ...TICKER_DATA].map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-2 text-sm whitespace-nowrap"
                            >
                                <span className="font-semibold text-white/90">{item.area}:</span>
                                <span className="text-muted-foreground">{item.price}</span>
                                <span className={cn(
                                    "flex items-center text-xs font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                                    item.trend === "down" && "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                )}>
                                    ROI {item.roi}
                                </span>
                                <span className="text-white/10 mx-2">|</span>
                            </div>
                        ))}
                    </motion.div>

                    {/* Duplicate for seamless loop */}
                    <motion.div
                        className="flex min-w-full shrink-0 gap-8 items-center pr-8"
                        animate={{
                            x: ["0%", "-100%"],
                        }}
                        transition={{
                            duration: 240,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    >
                        {[...TICKER_DATA, ...TICKER_DATA].map((item, index) => (
                            <div
                                key={`dup-${index}`}
                                className="flex items-center gap-2 text-sm whitespace-nowrap"
                            >
                                <span className="font-semibold text-white/90">{item.area}:</span>
                                <span className="text-muted-foreground">{item.price}</span>
                                <span className={cn(
                                    "flex items-center text-xs font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                                    item.trend === "down" && "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                )}>
                                    ROI {item.roi}
                                </span>
                                <span className="text-white/10 mx-2">|</span>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Gradient overlays for smooth fade at edges */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/20 via-black/10 to-transparent pointer-events-none z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/20 via-black/10 to-transparent pointer-events-none z-10" />
            </div>
        </div>
    );
}
