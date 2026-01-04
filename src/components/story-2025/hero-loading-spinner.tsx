"use client";

import { cn } from "@/lib/utils";

export function LoadingSpinner({ className }: { className?: string }) {
    return (
        <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
            {/* Geometric Spinner */}
            <div className="relative w-12 h-12">
                <div className="absolute inset-0 border-2 border-white/10 rounded-full" />
                <div className="absolute inset-0 border-t-2 border-cyan-400 rounded-full animate-spin" />
                <div className="absolute inset-2 border-r-2 border-purple-400 rounded-full animate-spin reverse" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            </div>

            {/* Loading text with pulse */}
            <span className="text-xs font-medium tracking-[0.2em] text-white/40 uppercase animate-pulse">
                Loading Experience
            </span>
        </div>
    );
}
