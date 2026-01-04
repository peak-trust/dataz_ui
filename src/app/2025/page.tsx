"use client";

import {
    HeroSection,
    ChapterHeartbeat,
    ChapterPulse,
    ChapterGeography,
    ChapterBuilders,
    ChapterPriceExplorer,
    ChapterOffPlanVsExisting,
    ChapterNeighborhoods,
    ChapterTimeline,
    ChapterPrice,
} from "@/components/story-2025";
import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function Story2025Page() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="relative min-h-screen bg-background overflow-x-hidden -mt-6">
            {/* Dynamic Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/3 blur-[150px] rounded-full" />
                <div className="absolute top-[30%] -right-[10%] w-[40%] h-[40%] bg-blue-500/3 blur-[150px] rounded-full" />
                <div className="absolute bottom-[10%] left-[20%] w-[35%] h-[35%] bg-purple-500/3 blur-[150px] rounded-full" />
                <div className="absolute top-[60%] right-[30%] w-[25%] h-[25%] bg-chart-amber/3 blur-[150px] rounded-full" />
            </div>

            {/* Hero Section */}
            <HeroSection />

            {/* Chapter 1: The Pulse */}
            <ChapterPulse />

            {/* Chapter 2: Geography */}
            <ChapterGeography />

            {/* Chapter 3: The Price Story */}
            <ChapterPrice />

            {/* Chapter 4: Builders */}
            <ChapterBuilders />

            {/* Chapter 5: Price Explorer */}
            <ChapterPriceExplorer />

            {/* Chapter 6: Off-Plan vs Existing */}
            <ChapterOffPlanVsExisting />

            {/* Chapter 6: Neighborhoods */}
            <ChapterNeighborhoods />

            {/* Chapter 7: Timeline */}
            <ChapterTimeline />

            {/* Scroll to Top Button */}
            <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                    opacity: showScrollTop ? 1 : 0,
                    scale: showScrollTop ? 1 : 0
                }}
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-primary/90 backdrop-blur-sm border border-primary/30 text-white shadow-[0_0_20px_rgba(91,147,255,0.4)] flex items-center justify-center hover:bg-primary transition-colors"
            >
                <ChevronUp className="w-6 h-6" />
            </motion.button>
        </div>
    );
}
