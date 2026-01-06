import * as React from "react"
// We will use a simple specialized implementation since Nivo might be heavy or complex to configure perfectly for specific "minimal" look without detailed props.
// However, since we want reliable rendering, let's use a custom SVG for maximum performance and "sparkline" feel if Nivo is too much, BUT the user has @nivo/line installed.
import { ResponsiveLine } from "@nivo/line"

interface ProjectChartProps {
    data?: { date: string; value: number }[]
}

const theme = {
    axis: {
        fontSize: "12px",
        tickColor: "#666",
        ticks: {
            line: {
                stroke: "#333"
            },
            text: {
                fill: "#666",
                fontSize: 10
            }
        }
    },
    grid: {
        line: {
            stroke: "#333",
            strokeWidth: 1,
            strokeDasharray: "4 4"
        }
    }
}

export function ProjectChart({ data = [] }: ProjectChartProps) {
    if (!data.length) {
        return (
            <div className="flex h-[200px] w-full items-center justify-center rounded-2xl bg-white/5 border border-white/10">
                <p className="text-sm text-muted-foreground">No historical data available</p>
            </div>
        )
    }

    // Transform for Nivo
    const chartData = [
        {
            id: "price",
            data: data.map(d => ({
                x: d.date,
                y: d.value
            }))
        }
    ]

    return (
        <div className="h-[250px] w-full p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-foreground">Price History</h3>
                <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-white/10 text-white cursor-pointer">6M</span>
                    <span className="text-xs px-2 py-1 rounded hover:bg-white/5 text-muted-foreground cursor-pointer transition-colors">1Y</span>
                </div>
            </div>

            <div className="h-[180px] w-full">
                <ResponsiveLine
                    data={chartData}
                    margin={{ top: 10, right: 10, bottom: 25, left: 40 }}
                    xScale={{ type: 'point' }}
                    yScale={{
                        type: 'linear',
                        min: 'auto',
                        max: 'auto',
                        stacked: true,
                        reverse: false
                    }}
                    curve="catmullRom"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 0,
                        tickPadding: 10,
                        tickRotation: 0,
                    }}
                    axisLeft={{
                        tickSize: 0,
                        tickPadding: 10,
                        tickRotation: 0,
                        format: (value) => `${value / 1000}k`
                    }}
                    enableGridX={false}
                    enableGridY={true}
                    colors={['#10b981']} // Emerald 500
                    lineWidth={2}
                    enablePoints={true}
                    pointSize={8}
                    pointColor={{ theme: 'background' }} // inherit doesn't work well sometimes with custom themes
                    pointBorderWidth={2}
                    pointBorderColor={{ from: 'serieColor' }}
                    pointLabelYOffset={-12}
                    enableArea={true}
                    areaOpacity={0.1}
                    useMesh={true}
                    enableTouchCrosshair={true}
                    theme={{
                        axis: {
                            ticks: {
                                text: { fill: '#64748b', fontSize: 10 }
                            },
                        },
                        grid: {
                            line: { stroke: 'rgba(255, 255, 255, 0.05)', strokeWidth: 1 }
                        },
                        crosshair: {
                            line: {
                                stroke: '#10b981',
                                strokeWidth: 1,
                                strokeOpacity: 0.5,
                            },
                        },
                        tooltip: {
                            container: {
                                background: '#1e1e1e',
                                color: '#fff',
                                fontSize: '12px',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            },
                        },
                    }}
                />
            </div>
        </div>
    )
}
