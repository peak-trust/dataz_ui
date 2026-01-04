import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Send, BarChart2, TrendingUp, Users, DollarSign } from "lucide-react"

export default function SamplePage() {
    return (
        <div className="min-h-screen bg-background p-8 space-y-12">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">Design System</h1>
                    <p className="text-xl text-foreground-secondary">
                        Dark Mode Primary • Inter Font • Semantic Colors
                    </p>
                </div>

                {/* Colors Section */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">Color System</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <ColorGroup title="Backgrounds">
                            <ColorSwatch name="DEFAULT" color="bg-background" hex="#121212" />
                            <ColorSwatch name="elevated" color="bg-background-elevated" hex="#1E1E1E" />
                            <ColorSwatch name="elevated2" color="bg-background-elevated-2" hex="#2C2C2C" />
                            <ColorSwatch name="elevated3" color="bg-background-elevated-3" hex="#383838" />
                        </ColorGroup>

                        <ColorGroup title="Primary Brand">
                            <ColorSwatch name="DEFAULT" color="bg-primary" hex="#5B93FF" />
                            <ColorSwatch name="hover" color="bg-primary-hover" hex="#4A7FE0" />
                            <ColorSwatch name="light" color="bg-primary-light" hex="#7DA8FF" />
                            <ColorSwatch name="dark" color="bg-primary-dark" hex="#3D6FCC" />
                        </ColorGroup>

                        <ColorGroup title="Text">
                            <ColorSwatch name="primary" color="bg-foreground" hex="#E3E3E3" />
                            <ColorSwatch name="secondary" color="bg-foreground-secondary" hex="#A0A0A0" />
                            <ColorSwatch name="tertiary" color="bg-foreground-tertiary" hex="#737373" />
                            <ColorSwatch name="disabled" color="bg-foreground-disabled" hex="#4A4A4A" />
                        </ColorGroup>

                        <ColorGroup title="Semantic">
                            <ColorSwatch name="success" color="bg-success" hex="#10B981" />
                            <ColorSwatch name="warning" color="bg-warning" hex="#F59E0B" />
                            <ColorSwatch name="error" color="bg-error" hex="#F87171" />
                            <ColorSwatch name="info" color="bg-info" hex="#5B93FF" />
                        </ColorGroup>
                    </div>
                </section>

                {/* Typography Section */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">Typography</h2>
                    <div className="space-y-4 p-6 bg-background-elevated rounded-lg border border-border">
                        <div className="flex items-center gap-4">
                            <span className="w-24 text-foreground-secondary text-sm">Heading 1</span>
                            <span className="text-5xl font-bold text-foreground">The quick brown fox</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="w-24 text-foreground-secondary text-sm">Heading 2</span>
                            <span className="text-4xl font-bold text-foreground">Jumped over the lazy dog</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="w-24 text-foreground-secondary text-sm">Heading 3</span>
                            <span className="text-3xl font-bold text-foreground">Pack my box with five dozen</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="w-24 text-foreground-secondary text-sm">Body</span>
                            <span className="text-base text-foreground">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="w-24 text-foreground-secondary text-sm">Small</span>
                            <span className="text-sm text-foreground-secondary">
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            </span>
                        </div>
                    </div>
                </section>

                {/* Components Section */}
                <section className="space-y-6">
                    <h2 className="text-2xl font-semibold text-foreground border-b border-border pb-2">Components</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Buttons & Inputs */}
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-foreground">Buttons</h3>
                                <div className="flex flex-wrap gap-4">
                                    <Button>Primary Button</Button>
                                    <Button variant="secondary" className="bg-background-elevated-2 border border-border hover:bg-background-elevated-3 text-foreground">Secondary Button</Button>
                                    <Button variant="ghost" className="text-foreground hover:bg-background-elevated-2">Ghost Button</Button>
                                    <Button disabled>Disabled</Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-foreground">Inputs</h3>
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Input type="email" placeholder="Email address" className="bg-background-elevated-2 border-border text-foreground placeholder:text-foreground-tertiary focus:border-border-focus focus:ring-primary/20" />
                                </div>
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground-tertiary" />
                                        <Input type="search" placeholder="Search..." className="pl-9 bg-background-elevated-2 border-border text-foreground placeholder:text-foreground-tertiary focus:border-border-focus" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Application Cards */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-foreground">UI Cards</h3>

                            {/* KPI Metric Card - Tremor Style */}
                            <Card className="bg-background-elevated border-border shadow-md">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-foreground-secondary">Total Revenue</span>
                                        <Badge variant="outline" className="bg-success-bg text-success border-0">+12.5%</Badge>
                                    </div>
                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-3xl font-bold text-foreground">$45,231.89</span>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Chat Bubble Simulation */}
                            <div className="p-6 bg-background rounded-xl border border-border space-y-4">
                                <div className="flex justify-end">
                                    <div className="bg-primary text-white px-4 py-3 rounded-l-lg rounded-br-none rounded-tr-lg max-w-[80%]">
                                        Show me the latest market trends for Dubai.
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="bg-background-elevated text-foreground border border-border px-4 py-3 rounded-r-lg rounded-bl-none rounded-tl-lg max-w-[80%]">
                                        <p>Based on recent data, the Dubai market is showing strong growth in the technology and real estate sectors.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

function ColorGroup({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-medium text-foreground-secondary uppercase tracking-wider">{title}</h3>
            <div className="space-y-2">
                {children}
            </div>
        </div>
    )
}

function ColorSwatch({ name, color, hex }: { name: string, color: string, hex: string }) {
    return (
        <div className="flex items-center justify-between p-2 rounded-md hover:bg-background-elevated-2 transition-colors">
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-md shadow-sm border border-white/5 ${color}`} />
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">{name}</span>
                    <span className="text-xs text-foreground-tertiary">{color}</span>
                </div>
            </div>
            <span className="text-xs font-mono text-foreground-secondary">{hex}</span>
        </div>
    )
}
