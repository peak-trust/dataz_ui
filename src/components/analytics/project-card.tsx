import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Building2, Calendar } from "lucide-react"
import type { Project } from "./data/mock-projects"

interface ProjectCardProps {
    project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Card className="group overflow-hidden bg-background-elevated border-border-subtle hover:border-border-accent transition-all duration-300">
            <div className="relative h-48 w-full bg-background-elevated-2 overflow-hidden">
                {/* Placeholder Gradient if no image (or as fallback) */}
                <div className="absolute inset-0 bg-gradient-to-br from-background-elevated-2 to-background-elevated-3" />
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 font-bold text-4xl">
                    {project.developer[0]}
                </div>

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm border-white/10 text-xs text-foreground">
                        {project.status}
                    </Badge>
                </div>

                {/* Price Tag */}
                <div className="absolute bottom-3 right-3">
                    <Badge className="bg-primary/90 text-white border-0 shadow-lg text-sm px-3 py-1">
                        {project.price}
                    </Badge>
                </div>
            </div>

            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                        <h3 className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                            {project.name}
                        </h3>
                        <div className="flex items-center text-muted-foreground text-sm mt-1">
                            <Building2 className="h-3.5 w-3.5 mr-1" />
                            {project.developer}
                        </div>
                    </div>
                </div>

                <div className="flex items-center text-muted-foreground text-sm mt-3">
                    <MapPin className="h-3.5 w-3.5 mr-1 text-accent-cyan" />
                    {project.location}
                </div>
            </CardContent>

            {project.completion && (
                <CardFooter className="px-5 py-3 border-t border-border-subtle bg-background-elevated-2/30 text-xs text-muted-foreground flex justify-between">
                    <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1.5 opacity-70" />
                        Completion:
                    </span>
                    <span className="font-medium text-foreground-secondary">{project.completion}</span>
                </CardFooter>
            )}
        </Card>
    )
}
