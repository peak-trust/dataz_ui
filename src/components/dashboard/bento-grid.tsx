"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BentoGridProps {
    children: React.ReactNode;
    className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className={cn(
                "grid gap-4",
                // 5-column grid for the bento layout
                "grid-cols-1 md:grid-cols-3 lg:grid-cols-5",
                "auto-rows-min",
                className
            )}
        >
            {children}
        </motion.div>
    );
}

