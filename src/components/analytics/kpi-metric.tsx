import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface KPIMetricProps {
    label: string
    value: string
    change?: string
    changeType?: "positive" | "negative" | "neutral"
}

export function KPIMetric({ label, value, change, changeType = "neutral" }: KPIMetricProps) {
    const changeColor =
        changeType === "positive" ? "bg-success-bg text-success" :
            changeType === "negative" ? "bg-error-bg text-error" :
                "bg-background-elevated-3 text-foreground-secondary"

    return (
        <Card className="bg-background-elevated border-border shadow-md">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground-secondary">{label}</span>
                    {change && (
                        <Badge variant="outline" className={`${changeColor} border-0`}>
                            {change}
                        </Badge>
                    )}
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground">{value}</span>
                </div>
            </CardContent>
        </Card>
    )
}
