import * as React from "react"
import { ArrowUpRight, ArrowDownRight, Activity, Percent, DollarSign, BarChart3, type LucideIcon } from "lucide-react"

interface MetricCardProps {
    title: string
    value: string
    subValue?: string
    trend?: number
    icon: LucideIcon
    delay?: number
}

function MetricCard({ title, value, subValue, trend, icon: Icon, delay = 0 }: MetricCardProps) {
    const isPositive = trend && trend > 0

    return (
        <div className="group relative p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-start justify-between mb-2">
                <div className="p-2 rounded-lg bg-white/5 text-muted-foreground group-hover:text-primary transition-colors">
                    <Icon className="w-4 h-4" />
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center text-xs font-medium ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                        {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{title}</p>
                <div className="flex items-baseline gap-2">
                    <p className="text-xl font-semibold text-foreground">{value}</p>
                    {subValue && (
                        <span className="text-xs text-muted-foreground">{subValue}</span>
                    )}
                </div>
            </div>
        </div>
    )
}

interface InvestorGridProps {
    pricePerSqFt?: number
    priceTrend?: number
    transactionVolume?: number
    marketComparison?: number
    yieldEst?: number
}

export function InvestorGrid({
    pricePerSqFt = 0,
    priceTrend = 0,
    transactionVolume = 0,
    marketComparison = 0,
    yieldEst = 0
}: InvestorGridProps) {
    const comparisonLabel = marketComparison > 0 ? `${marketComparison}% above avg` : `${Math.abs(marketComparison)}% below avg`

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
                title="Avg Price"
                value={`AED ${pricePerSqFt.toLocaleString()}`}
                subValue="/ sq.ft"
                trend={priceTrend}
                icon={DollarSign}
            />
            <MetricCard
                title="Volume (30d)"
                value={transactionVolume.toString()}
                subValue="transactions"
                icon={Activity}
            />
            <MetricCard
                title="Market Position"
                value={comparisonLabel}
                trend={marketComparison}
                icon={BarChart3}
            />
            <MetricCard
                title="Est. Yield"
                value={`${yieldEst}%`}
                subValue="ROI"
                icon={Percent}
            />
        </div>
    )
}
