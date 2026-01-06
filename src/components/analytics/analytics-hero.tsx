"use client"

import * as React from "react"
import { Search, ArrowRight, Database } from "lucide-react"
import { motion } from "framer-motion"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils/cn"

interface AnimatedTabProps {
    label: string
    value: string
    active: string
    onClick: (value: string) => void
}

function AnimatedTab({ label, value, active, onClick }: AnimatedTabProps) {
    const isActive = active === value

    return (
        <button
            onClick={() => onClick(value)}
            className={cn(
                "relative z-10 flex-1 px-4 py-3 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-0 cursor-pointer",
                isActive ? "text-white" : "text-muted-foreground hover:text-foreground"
            )}
        >
            {isActive && (
                <motion.div
                    layoutId="active-tab-bg"
                    className="absolute inset-0 z-[-1] rounded-full bg-primary shadow-lg shadow-primary/25"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
            )}
            {label}
        </button>
    )
}



interface ProjectSuggestion {
    id: string
    name: string
    developer: string
    location: string
    type: string
}

interface AnalyticsHeroProps {
    searchQuery: string
    onSearchChange: (query: string) => void
    activeTab: string
    onTabChange: (tab: string) => void
    suggestions: ProjectSuggestion[]
    onSearchSubmit: () => void
    onSuggestionClick: (suggestion: ProjectSuggestion) => void
}

export function AnalyticsHero({
    searchQuery,
    onSearchChange,
    activeTab,
    onTabChange,
    suggestions,
    onSearchSubmit,
    onSuggestionClick
}: AnalyticsHeroProps) {
    const [isFocused, setIsFocused] = React.useState(false)

    // Handle Enter key
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSearchSubmit()
            // Blur input on submit to close dropdown if needed, though state update will likely act first
            e.currentTarget.blur()
        }
    }

    // Delay hiding the dropdown to allow clicks on items
    const handleBlur = () => {
        setTimeout(() => setIsFocused(false), 200)
    }

    return (
        <div className="relative w-full overflow-hidden bg-background py-16 md:py-24 lg:py-32">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[500px] md:h-[800px] md:w-[800px] rounded-full bg-primary/10 blur-[120px] opacity-70 mix-blend-screen" />
                <div className="absolute bottom-0 right-0 h-[300px] w-[300px] md:h-[500px] md:w-[500px] rounded-full bg-accent-purple/10 blur-[100px] opacity-50" />
            </div>

            <div className="container relative z-10 mx-auto px-4 sm:px-6">
                <div className="mx-auto max-w-4xl text-center">

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 backdrop-blur-sm">
                            <span className="flex items-center justify-center mr-2">
                                <Database className="h-4 w-4" />
                            </span>
                            Market Intelligence
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-7xl mb-6 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
                            Dataz Analytics
                        </h1>
                        <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
                            The most comprehensive real-time database for Dubai's property market.
                            Analyze trends across sales and rental sectors.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mt-10 md:mt-12 flex flex-col items-center gap-6"
                    >
                        {/* Search Unit - Glassmorphism */}
                        <div className="relative w-full max-w-2xl z-20">
                            <div className="group relative w-full rounded-2xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-primary/5">
                                <div className="relative flex items-center">
                                    <Search className="absolute left-4 h-6 w-6 text-muted-foreground transition-colors group-hover:text-primary" />
                                    <Input
                                        value={searchQuery}
                                        onChange={(e) => onSearchChange(e.target.value)}
                                        onFocus={() => setIsFocused(true)}
                                        onBlur={handleBlur}
                                        onKeyDown={handleKeyDown}
                                        className="h-14 w-full border-0 bg-transparent pl-12 pr-14 text-lg md:text-xl placeholder:text-muted-foreground/70 focus-visible:ring-0 focus-visible:ring-offset-0"
                                        placeholder="Box Bay, Jumeirah, or specific project..."
                                    />
                                    <div className="absolute right-2 hidden sm:flex">
                                        <Button
                                            size="icon"
                                            onClick={onSearchSubmit}
                                            className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 cursor-pointer"
                                        >
                                            <ArrowRight className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Suggestions Dropdown */}
                            {isFocused && searchQuery && suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border-subtle bg-background-elevated/95 backdrop-blur-3xl shadow-2xl overflow-hidden z-30">
                                    <div className="py-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                                        {suggestions.map((suggestion) => (
                                            <button
                                                key={suggestion.id}
                                                onClick={() => onSuggestionClick(suggestion)}
                                                className="w-full flex items-center px-4 py-3 text-left hover:bg-white/5 transition-colors group border-b border-border/40 last:border-0"
                                            >
                                                <div className="flex-shrink-0 mr-3 p-2 rounded-full bg-primary/10 text-primary">
                                                    <Search className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium text-foreground truncate">{suggestion.name}</span>
                                                        <span className="text-xs text-muted-foreground bg-background-elevated-3 px-1.5 py-0.5 rounded ml-2">{suggestion.type}</span>
                                                    </div>
                                                    <div className="text-xs text-muted-foreground truncate">
                                                        <span className="text-accent-emerald">{suggestion.developer}</span> • {suggestion.location}
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Custom Animated Toggle */}
                        <div className="relative flex w-full max-w-[320px] items-center rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
                            <AnimatedTab
                                label="Sales"
                                value="sales"
                                active={activeTab}
                                onClick={onTabChange}
                            />
                            <AnimatedTab
                                label="Rental"
                                value="rental"
                                active={activeTab}
                                onClick={onTabChange}
                            />
                        </div>

                    </motion.div>
                </div>
            </div>
        </div>
    )
}
