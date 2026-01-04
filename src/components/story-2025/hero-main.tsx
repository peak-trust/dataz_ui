"use client";

import * as React from "react";
import { useGsap, gsap, easingPresets, ScrollTrigger } from "@/lib/hooks/useGsap";
import { AuroraBackground } from "./hero-aurora-background";
import { Text3DHero } from "./hero-text-3d";
import { ChevronDown } from "lucide-react";
import { HeroStatsCards } from "./hero-stats-cards";
import { LoadingSpinner } from "./hero-loading-spinner";
import { TextConfig, DEFAULT_TEXT_CONFIG } from "./hero-debug-controls";

export function HeroSection() {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const subtitleRef = React.useRef<HTMLParagraphElement>(null);
    const taglineRef = React.useRef<HTMLDivElement>(null);
    const textContainerRef = React.useRef<HTMLDivElement>(null);
    const scrollIndicatorRef = React.useRef<HTMLDivElement>(null);

    const [config, setConfig] = React.useState<TextConfig>(DEFAULT_TEXT_CONFIG);
    const [refreshKey, setRefreshKey] = React.useState(0);
    const [isLoaded, setIsLoaded] = React.useState(false);

    // Lock scroll until loaded
    React.useEffect(() => {
        if (isLoaded) {
            document.body.style.overflow = "";
            document.body.style.cursor = "default";
        } else {
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isLoaded]);

    // GSAP animations for synchronized entrance & Parallax
    useGsap((gsap) => {
        // Parallax Effect for 3D Text
        if (textContainerRef.current) {
            gsap.to(textContainerRef.current, {
                y: 80,
                opacity: 0,
                ease: "none",
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "400px top",
                    scrub: true,
                }
            });
        }

        if (!isLoaded) return;

        const masterTl = gsap.timeline({ delay: 0.2 });

        // 1. Aurora Background (Fade in)
        masterTl.to(".hero-aurora", {
            opacity: 1,
            duration: 2.5,
            ease: "power2.inOut"
        }, 0);



        // 2. Subtitle (Slide up)
        if (subtitleRef.current) {
            // Animate separator line
            masterTl.fromTo(".hero-separator",
                { scaleX: 0, opacity: 0 },
                { scaleX: 1, opacity: 1, duration: 1, ease: "power2.out" },
                0.6
            );

            masterTl.to(subtitleRef.current, {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: easingPresets.smooth,
            }, 0.8);
        }

        // 3. Tagline (Slide up)
        if (taglineRef.current) {
            masterTl.to(taglineRef.current, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: easingPresets.smooth,
            }, 1.0);
        }

        // 4. Stats Cards (Staggered entrance)
        masterTl.to(".hero-stat-card", {
            y: 0,
            opacity: 1,
            scale: 1, // Ensure it scales to 1 if we set initial scale
            duration: 1,
            stagger: 0.15,
            ease: "back.out(1.2)", // Subtle bounce
        }, 1.2);

        // 5. Scroll Indicator (Fade in & Bounce)
        if (scrollIndicatorRef.current) {
            masterTl.to(scrollIndicatorRef.current, {
                opacity: 1,
                duration: 1,
                onComplete: () => {
                    gsap.to(scrollIndicatorRef.current, {
                        y: 8,
                        duration: 2,
                        repeat: -1,
                        yoyo: true,
                        ease: "power1.inOut"
                    });
                }
            }, 2.0);
        }

    }, [isLoaded]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex flex-col items-center pt-16 overflow-hidden bg-[#0a0a0f]"
        >
            {/* Debug Controls - Fixed Position (outside of motion transforms) */}
            {/* <DebugControls
                config={config}
                onChange={setConfig}
                onForceRefresh={() => setRefreshKey(prev => prev + 1)}
            /> */}

            {/* Aurora Background - z-0, positioned at top */}
            <AuroraBackground className="hero-aurora" />

            {/* Loading Spinner - z-[100], solid black background, fades out when loaded */}
            <div className={`fixed inset-0 z-[100] bg-[#0a0a0f] flex items-center justify-center transition-opacity duration-700 ${isLoaded ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"}`}>
                <LoadingSpinner />
            </div>

            {/* 3D Text Canvas - z-10, centered */}
            <div
                ref={textContainerRef}
                className="relative z-10 w-full h-[50vh] md:h-[55vh] flex items-center justify-center will-change-transform"
            >
                <Text3DHero
                    key={refreshKey}
                    config={config}
                    className="w-full h-full"
                    onReady={() => setIsLoaded(true)}
                />
            </div>

            {/* Subtitle & Tagline - z-20, below text */}
            <div className="relative z-20 text-center -mt-12 md:-mt-20">
                {/* Glowing separator line */}
                <div
                    className="hero-separator w-32 h-[1px] mx-auto mb-6 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    style={{ opacity: 0 }}
                />

                {/* Real Estate Story Subtitle */}
                <p
                    ref={subtitleRef}
                    className="translate-y-8 text-3xl md:text-5xl lg:text-6xl font-light tracking-wide"
                    style={{ opacity: 0 }}
                >
                    <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                        Real Estate Story
                    </span>
                </p>

                {/* Tagline */}
                <div
                    ref={taglineRef}
                    className="translate-y-4 mt-6 text-sm md:text-base text-white/40 tracking-widest uppercase"
                    style={{ opacity: 0 }}
                >
                    A visual journey through Dubai&apos;s property landscape
                </div>

                {/* Live Pulse Stats */}
                <HeroStatsCards />
            </div>

            {/* Scroll indicator - z-20, bottom, pushed by flex */}
            <div
                ref={scrollIndicatorRef}
                className="opacity-0 mt-auto mb-8 z-20"
            >
                <div
                    className="flex flex-col items-center gap-2 text-white/30"
                >
                    <span className="text-xs uppercase tracking-widest">Scroll to Explore</span>
                    <ChevronDown className="w-5 h-5" />
                </div>
            </div>
        </section>
    );
}
