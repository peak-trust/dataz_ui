"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function Navbar() {
    const pathname = usePathname();
    const isStoryPage = pathname?.startsWith("/2025");

    const [activeTab, setActiveTab] = React.useState<"analytics" | "chat">("analytics");

    if (isStoryPage) return null;

    return (
        <header className={cn(
            "top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4 pointer-events-none fixed"
        )}>
            <div className={cn(
                "mx-auto relative rounded-full p-[1px] shadow-2xl pointer-events-auto transition-transform duration-300 hover:scale-[1.01] overflow-hidden group",
                isStoryPage && "story-navbar-content opacity-0 -translate-y-12"
            )}>
                {/* Iridescent Moving Border */}
                <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/60 via-purple-500/60 via-pink-500/60 via-transparent to-transparent animate-iridescent"
                    style={{ backgroundSize: '200% 100%' }}
                />
                <div
                    className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 opacity-20"
                />

                {/* Inner Content Container */}
                <div className="relative h-14 w-full bg-black/30 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-2xl backdrop-saturate-150 rounded-full px-6 flex items-center justify-between border border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]">
                    {/* Left Side */}
                    <div className="flex items-center gap-6">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <span className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 group-hover:to-primary transition-all duration-300">
                                9711
                            </span>
                        </Link>

                        {/* Toggle */}
                        <div className="hidden md:flex items-center bg-white/5 p-1 rounded-full border border-white/5">
                            <button
                                onClick={() => setActiveTab("analytics")}
                                className={cn(
                                    "relative flex items-center justify-center px-4 py-1 text-xs font-medium rounded-full transition-colors duration-200",
                                    activeTab === "analytics" ? "text-white" : "text-white/40 hover:text-white"
                                )}
                            >
                                {activeTab === "analytics" && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white/10 rounded-full shadow-sm"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">Analytics</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("chat")}
                                className={cn(
                                    "relative flex items-center justify-center px-4 py-1 text-xs font-medium rounded-full transition-colors duration-200",
                                    activeTab === "chat" ? "text-white" : "text-white/40 hover:text-white"
                                )}
                            >
                                {activeTab === "chat" && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white/10 rounded-full shadow-sm"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">Chat</span>
                            </button>
                        </div>
                    </div>

                    {/* Center - Navigation */}
                    <nav className="hidden md:flex items-center gap-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors rounded-full px-4">
                                    Browse
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="w-48 bg-black/90 backdrop-blur-xl border-white/10 text-white rounded-xl">
                                <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">Off-Plan</DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">Resale</DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">Areas</DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">New Launches</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors rounded-full px-4">
                                    Developers
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="center" className="w-48 bg-black/90 backdrop-blur-xl border-white/10 text-white rounded-xl">
                                <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">Rankings</DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">Projects</DropdownMenuItem>
                                <DropdownMenuItem className="focus:bg-white/10 focus:text-white cursor-pointer">Track Record</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
                        >
                            <Search className="w-4 h-4" />
                        </Button>

                        <div className="h-4 w-px bg-white/10 mx-1" />

                        <Link href="/login">
                            <Button variant="ghost" className="h-8 text-[13px] font-medium text-white hover:bg-white/10 rounded-full px-5 border border-white/10 hover:border-white/20 transition-all bg-white/5">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes iridescent {
                    0% { background-position: 100% 0; }
                    100% { background-position: -100% 0; }
                }
                .animate-iridescent {
                    animation: iridescent 4s linear infinite;
                }
            `}</style>
        </header>
    );
}
