"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BentoBoxProps {
    children: React.ReactNode;
    className?: string;
    span?: "1" | "2" | "3" | "4" | "5";
    rowSpan?: "1" | "2";
}

export function BentoBox({
    children,
    className,
    span = "1",
    rowSpan = "1",
}: BentoBoxProps) {
    const colSpanClasses = {
        "1": "col-span-1",
        "2": "col-span-2",
        "3": "col-span-3",
        "4": "col-span-4",
        "5": "col-span-5",
    };

    const rowSpanClasses = {
        "1": "row-span-1",
        "2": "row-span-2",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={{
                scale: 1.01,
                transition: { duration: 0.2 }
            }}
            className={cn(
                // Glass morphism base
                "relative overflow-hidden rounded-xl",
                "bg-white/[0.03] backdrop-blur-xl",
                "border border-white/[0.08]",
                // Subtle shadows
                "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
                // Inner glow
                "before:absolute before:inset-0 before:rounded-xl",
                "before:bg-gradient-to-br before:from-white/[0.08] before:to-transparent",
                "before:pointer-events-none",
                // Hover effect
                "hover:border-white/[0.15] hover:bg-white/[0.05]",
                "transition-colors duration-300",
                // Span classes
                colSpanClasses[span],
                rowSpanClasses[rowSpan],
                className
            )}
        >
            <div className="relative z-10 p-5 h-full">
                {children}
            </div>
        </motion.div>
    );
}
