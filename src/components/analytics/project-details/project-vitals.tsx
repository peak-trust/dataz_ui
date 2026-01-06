import * as React from "react"
import { Building2, MapPin, TrendingUp, AlertCircle } from "lucide-react"

interface ProjectVitalsProps {
    name: string
    location: string
    developer: string
    status: string
    demandScore?: "High" | "Medium" | "Low"
    image: string
}

export function ProjectVitals({
    name,
    location,
    developer,
    status,
    demandScore = "Medium",
    image
}: ProjectVitalsProps) {
    const getScoreColor = (score: string) => {
        switch (score) {
            case "High": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
            case "Medium": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
            case "Low": return "bg-red-500/10 text-red-500 border-red-500/20"
            default: return "bg-primary/10 text-primary border-primary/20"
        }
    }

    return (
        <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Thumbnail */}
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0 border border-white/10 shadow-lg">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 pt-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getScoreColor(demandScore)}`}>
                        <TrendingUp className="w-3 h-3 mr-1.5" />
                        {demandScore} Demand
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/5 text-muted-foreground border border-white/10">
                        {status}
                    </span>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-2">
                    {name}
                </h2>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5 opacity-70" />
                        {location}
                    </div>
                    <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-border" />
                    <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-1.5 opacity-70" />
                        {developer}
                    </div>
                </div>
            </div>
        </div>
    )
}
