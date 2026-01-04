"use client";

import * as React from "react";
import { useGsap, gsap, easingPresets } from "@/lib/hooks/useGsap";
import { cn } from "@/lib/utils";

interface DataCounterProps {
    value: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
    decimals?: number;
    format?: boolean;
}

export function DataCounter({
    value,
    duration = 2,
    prefix = "",
    suffix = "",
    className,
    decimals = 0,
    format = true,
}: DataCounterProps) {
    const ref = React.useRef<HTMLSpanElement>(null);
    const valueRef = React.useRef<HTMLSpanElement>(null);
    const [displayValue, setDisplayValue] = React.useState("0");

    // GSAP counter animation with slot machine effect
    useGsap((gsapInstance) => {
        if (!ref.current || !valueRef.current) return;

        const counter = { val: 0 };

        gsapInstance.to(counter, {
            val: value,
            duration: duration,
            ease: "power4.out",
            scrollTrigger: {
                trigger: ref.current,
                start: "top 85%", // Start slightly earlier than bottom
                toggleActions: "play none none reverse",
            },
            onUpdate: () => {
                const num = decimals > 0
                    ? counter.val.toFixed(decimals)
                    : Math.floor(counter.val);

                if (format && typeof num === "number") {
                    setDisplayValue(num.toLocaleString("en-US", { maximumFractionDigits: decimals }));
                } else if (format && typeof num === "string") {
                    const parsed = parseFloat(num);
                    setDisplayValue(parsed.toLocaleString("en-US", { maximumFractionDigits: decimals }));
                } else {
                    setDisplayValue(String(num));
                }
            },
        });

        // Add a subtle scale pulse when complete (chained with delay)
        gsapInstance.fromTo(
            valueRef.current,
            { scale: 1 },
            {
                scale: 1.05,
                duration: 0.2,
                delay: duration, // Wait for counter to finish
                yoyo: true,
                repeat: 1,
                ease: easingPresets.bouncy,
                scrollTrigger: {
                    trigger: ref.current,
                    start: "top 85%",
                }
            }
        );

    }, [value, duration, decimals, format]);

    return (
        <span ref={ref} className={cn("tabular-nums inline-block", className)}>
            {prefix}
            <span ref={valueRef} className="inline-block">
                {displayValue}
            </span>
            {suffix}
        </span>
    );
}


// Sequence counter that shows multiple values in sequence with GSAP transitions
interface SequenceCounterProps {
    items: Array<{
        value: number;
        label: string;
        suffix?: string;
    }>;
    className?: string;
}

export function SequenceCounter({ items, className }: SequenceCounterProps) {
    const [currentIndex, setCurrentIndex] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const isInView = React.useRef(false);
    const intervalRef = React.useRef<NodeJS.Timeout | null>(null);

    // GSAP powered sequence transitions
    useGsap((gsapInstance) => {
        if (!containerRef.current) return;

        ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top 80%",
            onEnter: () => {
                if (!isInView.current) {
                    isInView.current = true;

                    // Initial entrance animation
                    gsapInstance.from(contentRef.current, {
                        opacity: 0,
                        y: 30,
                        duration: 0.8,
                        ease: easingPresets.smooth,
                    });

                    // Start the interval
                    intervalRef.current = setInterval(() => {
                        setCurrentIndex((prev) => {
                            const next = (prev + 1) % items.length;

                            // Animate transition
                            gsapInstance.fromTo(
                                contentRef.current,
                                { opacity: 0, y: 20 },
                                { opacity: 1, y: 0, duration: 0.5, ease: easingPresets.smooth }
                            );

                            return next;
                        });
                    }, 3000);
                }
            }
        });

    }, [items.length]);

    React.useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const currentItem = items[currentIndex];

    // Handle dot clicks with GSAP transition
    const handleDotClick = React.useCallback((index: number) => {
        if (index === currentIndex) return;

        gsap.fromTo(
            contentRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: easingPresets.smooth }
        );

        setCurrentIndex(index);

        // Reset interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setCurrentIndex((prev) => {
                    const next = (prev + 1) % items.length;
                    gsap.fromTo(
                        contentRef.current,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.5, ease: easingPresets.smooth }
                    );
                    return next;
                });
            }, 3000);
        }
    }, [currentIndex, items.length]);

    return (
        <div ref={containerRef} className={cn("text-center", className)}>
            <div ref={contentRef} className="space-y-2">
                <div className="text-5xl md:text-7xl font-bold text-foreground tabular-nums">
                    <DataCounter
                        key={currentIndex}
                        value={currentItem.value}
                        suffix={currentItem.suffix}
                        duration={1.5}
                    />
                </div>
                <div className="text-lg text-foreground-secondary">
                    {currentItem.label}
                </div>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-6">
                {items.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleDotClick(index)}
                        className={cn(
                            "h-2 rounded-full transition-all duration-300",
                            index === currentIndex
                                ? "bg-primary w-6"
                                : "bg-white/20 hover:bg-white/40 w-2"
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
