"use client";

import { useRef, useLayoutEffect, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// Use useLayoutEffect on client, useEffect on server (for SSR safety)
const useIsomorphicLayoutEffect =
    typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Hook for GSAP animations with automatic cleanup
 */
export function useGsap(callback: (gsap: typeof import("gsap").default) => void | gsap.core.Timeline | gsap.core.Tween, deps: React.DependencyList = []) {
    const ctx = useRef<gsap.Context | null>(null);

    useIsomorphicLayoutEffect(() => {
        ctx.current = gsap.context(() => {
            callback(gsap);
        });

        return () => {
            ctx.current?.revert();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return ctx;
}

/**
 * Hook for GSAP ScrollTrigger animations
 */
export interface ScrollTriggerConfig {
    trigger?: string | Element | null;
    start?: string;
    end?: string;
    scrub?: boolean | number;
    pin?: boolean;
    markers?: boolean;
    toggleActions?: string;
    onEnter?: () => void;
    onLeave?: () => void;
    onEnterBack?: () => void;
    onLeaveBack?: () => void;
}

export function useGsapScrollTrigger<T extends HTMLElement>(
    animationCallback: (element: T, gsap: typeof import("gsap").default) => gsap.core.Timeline | gsap.core.Tween | void,
    config: ScrollTriggerConfig = {},
    deps: React.DependencyList = []
) {
    const ref = useRef<T>(null);
    const ctx = useRef<gsap.Context | null>(null);

    useIsomorphicLayoutEffect(() => {
        if (!ref.current) return;

        ctx.current = gsap.context(() => {
            const element = ref.current!;
            const animation = animationCallback(element, gsap);

            if (animation) {
                ScrollTrigger.create({
                    trigger: config.trigger ?? element,
                    start: config.start ?? "top center",
                    end: config.end ?? "bottom center",
                    scrub: config.scrub ?? false,
                    pin: config.pin ?? false,
                    markers: config.markers ?? false,
                    toggleActions: config.toggleActions ?? "play none none reverse",
                    animation: animation as gsap.core.Animation,
                    onEnter: config.onEnter,
                    onLeave: config.onLeave,
                    onEnterBack: config.onEnterBack,
                    onLeaveBack: config.onLeaveBack,
                });
            }
        }, ref);

        return () => {
            ctx.current?.revert();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return ref;
}

/**
 * Hook for creating GSAP timelines with ScrollTrigger
 */
export function useGsapTimeline(
    config?: ScrollTriggerConfig & { duration?: number },
    deps: React.DependencyList = []
) {
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline | null>(null);

    useIsomorphicLayoutEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            timelineRef.current = gsap.timeline({
                scrollTrigger: config ? {
                    trigger: config.trigger ?? containerRef.current,
                    start: config.start ?? "top center",
                    end: config.end ?? "bottom center",
                    scrub: config.scrub ?? false,
                    pin: config.pin ?? false,
                    markers: config.markers ?? false,
                    toggleActions: config.toggleActions ?? "play none none reverse",
                } : undefined,
            });
        }, containerRef);

        return () => {
            ctx.revert();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return { containerRef, timeline: timelineRef };
}

/**
 * Utility to create stagger animation configs
 */
export const staggerPresets = {
    fadeUp: {
        from: { opacity: 0, y: 30 },
        to: { opacity: 1, y: 0 },
    },
    fadeDown: {
        from: { opacity: 0, y: -30 },
        to: { opacity: 1, y: 0 },
    },
    fadeLeft: {
        from: { opacity: 0, x: -30 },
        to: { opacity: 1, x: 0 },
    },
    fadeRight: {
        from: { opacity: 0, x: 30 },
        to: { opacity: 1, x: 0 },
    },
    scaleUp: {
        from: { opacity: 0, scale: 0 },
        to: { opacity: 1, scale: 1 },
    },
    scaleDown: {
        from: { opacity: 0, scale: 1.5 },
        to: { opacity: 1, scale: 1 },
    },
} as const;

/**
 * Easing presets for GSAP
 */
export const easingPresets = {
    // Smooth
    smooth: "power2.out",
    smoothIn: "power2.in",
    smoothInOut: "power2.inOut",

    // Bouncy
    bouncy: "back.out(1.7)",
    elastic: "elastic.out(1, 0.3)",

    // Sharp
    sharp: "power4.out",
    sharpIn: "power4.in",

    // Expo
    expo: "expo.out",
    expoIn: "expo.in",
    expoInOut: "expo.inOut",
} as const;

export { gsap, ScrollTrigger };
