"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Project } from "@/components/analytics/data/mock-projects"
import { TransactionTable } from "./transaction-table"
import { Button } from "@/components/ui/button"
import { ProjectVitals } from "./project-vitals"
import { InvestorGrid } from "./investor-grid"
import { ProjectChart } from "./project-chart"

interface ProjectDetailsViewProps {
    project: Project | null
    onClose: () => void
}

export function ProjectDetailsView({ project, onClose }: ProjectDetailsViewProps) {
    if (!project) return null

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={project.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} // Elegant ease
                className="w-full bg-background border-b border-white/5 shadow-2xl relative z-10"
            >
                {/* Seamless Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] to-background pointer-events-none" />

                <div className="container relative mx-auto px-4 py-12 md:py-16">

                    {/* Header Action */}
                    <div className="flex justify-end mb-8">
                        <Button
                            variant="ghost"
                            onClick={onClose}
                            className="group gap-2 text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all rounded-full px-6"
                        >
                            <span className="text-xs uppercase tracking-widest font-medium">Close Analysis</span>
                            <div className="bg-white/10 p-1 rounded-full group-hover:bg-white/20 transition-colors">
                                <X className="w-3 h-3" />
                            </div>
                        </Button>
                    </div>

                    <div className="space-y-16 max-w-6xl mx-auto">

                        {/* 1. Vitals Section (Seamless) */}
                        <section>
                            <ProjectVitals
                                name={project.name}
                                location={project.location}
                                developer={project.developer}
                                status={project.status}
                                demandScore={project.demandScore}
                                image={project.image}
                            />
                        </section>

                        {/* 2. Investor Grid (Floating) */}
                        <section>
                            <div className="flex items-center gap-4 mb-6">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                    Market Efficiency Signals
                                </h3>
                                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                            </div>
                            <InvestorGrid
                                pricePerSqFt={project.pricePerSqFt}
                                priceTrend={project.priceTrend}
                                transactionVolume={project.transactionVolume}
                                marketComparison={project.marketComparison}
                                yieldEst={project.yieldEst}
                            />
                        </section>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* 3. Analytics Chart */}
                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                        Price History
                                    </h3>
                                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                                </div>
                                <ProjectChart data={project.chartData} />
                            </section>

                            {/* 4. Transactions Table (New Granular Data) */}
                            <section>
                                <div className="flex items-center gap-4 mb-6">
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                        Recent Transactions
                                    </h3>
                                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                                </div>
                                <TransactionTable transactions={project.transactions} />
                            </section>
                        </div>

                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
