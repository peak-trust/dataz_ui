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
import { ScrollToTop } from "@/components/ui/scroll-to-top";

export const dynamic = "force-static";

export default function Story2025Page() {
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
            <ScrollToTop />
        </div>
    );
}
