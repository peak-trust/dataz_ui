"use client";

import * as React from "react";
import { useGsap, gsap, ScrollTrigger } from "@/lib/hooks/useGsap";
import { cn } from "@/lib/utils";

interface ChapterContainerProps {
    children: React.ReactNode;
    chapterNumber?: number;
    title: string;
    subtitle?: string;
    className?: string;
    fullHeight?: boolean;
    isActive?: boolean;
}

export function ChapterContainer({
    children,
    chapterNumber,
    title,
    subtitle,
    className,
    fullHeight = true,
}: ChapterContainerProps) {
    const containerRef = React.useRef<HTMLElement>(null);
    const headerRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);

    useGsap(() => {
        if (!containerRef.current || !headerRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%", // Start animation when top of container hits 75% of viewport
                toggleActions: "play none none reverse",
            }
        });

        // Header Elements Animation
        const headerElements = headerRef.current.children;
        tl.from(headerElements, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out"
        });

        // Content Animation
        if (contentRef.current) {
            tl.from(contentRef.current, {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.6"); // Overlap with header animation
        }

    }, []);

    return (
        <section
            ref={containerRef}
            className={cn(
                "relative w-full",
                fullHeight && "min-h-screen",
                "py-20 px-4 md:px-8",
                className
            )}
        >
            {/* Chapter Header */}
            <div
                ref={headerRef}
                className="max-w-7xl mx-auto mb-12"
            >
                {chapterNumber && (
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="text-xs font-mono uppercase tracking-widest text-primary/70">
                            Chapter
                        </span>
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 border border-primary/30 text-primary font-bold text-sm">
                            {chapterNumber}
                        </span>
                    </div>
                )}

                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-3">
                    {title}
                </h2>

                {subtitle && (
                    <p className="text-lg text-foreground-secondary max-w-2xl">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Chapter Content */}
            <div
                ref={contentRef}
                className="max-w-7xl mx-auto w-full"
            >
                {children}
            </div>
        </section>
    );
}
