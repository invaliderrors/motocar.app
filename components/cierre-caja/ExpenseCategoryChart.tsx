"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { HttpService } from "@/lib/http"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"

// Elegant color palette with soft, harmonious colors
const COLORS = [
    "hsl(210, 100%, 60%)", // Vibrant blue
    "hsl(340, 80%, 65%)", // Soft pink
    "hsl(150, 60%, 50%)", // Mint green
    "hsl(45, 90%, 65%)", // Warm yellow
    "hsl(280, 60%, 65%)", // Lavender
    "hsl(190, 70%, 50%)", // Turquoise
    "hsl(30, 90%, 65%)", // Peach
    "hsl(170, 50%, 50%)", // Teal
]

interface ExpenseCategoryChartProps {
    compact?: boolean
}

export function ExpenseCategoryChart({ compact = false }: ExpenseCategoryChartProps) {
    const [data, setData] = useState<{ name: string; value: number }[]>([])
    const [loading, setLoading] = useState(true)
    const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined)
    const [totalExpenses, setTotalExpenses] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await HttpService.get("/api/v1/closing/summary")
                const expenses = res.data.categories?.expenses || {}

                // Transform and sort data by value (descending)
                const chartData = Object.entries(expenses)
                    .map(([key, val]) => ({
                        name: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
                        value: val as number,
                    }))
                    .sort((a, b) => b.value - a.value)

                const total = chartData.reduce((sum, item) => sum + item.value, 0)

                setData(chartData)
                setTotalExpenses(total)
            } catch (err) {
                console.error("Error cargando grafico de egresos por categoria:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // Enhanced active shape with elegant animation
    const renderActiveShape = (props: any) => {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props

        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius}
                    outerRadius={outerRadius + 8}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                    opacity={0.9}
                />
                <Sector
                    cx={cx}
                    cy={cy}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    innerRadius={outerRadius + 10}
                    outerRadius={outerRadius + 12}
                    fill={fill}
                />
            </g>
        )
    }

    // Elegant center label
    const CenterLabel = () => (
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
            <tspan x="50%" dy="-10" fontSize={compact ? "12" : "14"} fontWeight="500" className="fill-muted-foreground">
                Total
            </tspan>
            <tspan
                x="50%"
                dy={compact ? "25" : "30"}
                fontSize={compact ? "16" : "20"}
                fontWeight="600"
                className="fill-foreground"
            >
                {formatCurrency(totalExpenses)}
            </tspan>
        </text>
    )

    // Calculate percentage for display
    const getPercentage = (value: number) => {
        return totalExpenses > 0 ? ((value / totalExpenses) * 100).toFixed(1) + "%" : "0%"
    }

    if (compact) {
        return (
            <Card className="card-hover-effect">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold">Distribución de Egresos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px]">
                        {loading ? (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                                <Skeleton className="w-[150px] h-[150px] rounded-full" />
                                <div className="space-y-2 w-full">
                                    <Skeleton className="w-full h-3" />
                                    <Skeleton className="w-4/5 h-3" />
                                    <Skeleton className="w-3/5 h-3" />
                                </div>
                            </div>
                        ) : data.length === 0 ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <p className="text-muted-foreground text-center text-sm">No hay egresos registrados</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Compact Chart */}
                                <div className="h-[180px] flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height={180}>
                                        <PieChart>
                                            <defs>
                                                {COLORS.map((color, index) => (
                                                    <linearGradient
                                                        key={`gradient-${index}`}
                                                        id={`colorGradient-${index}`}
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop offset="0%" stopColor={color} stopOpacity={1} />
                                                        <stop offset="100%" stopColor={color} stopOpacity={0.8} />
                                                    </linearGradient>
                                                ))}
                                            </defs>
                                            <Pie
                                                activeIndex={activeIndex}
                                                activeShape={renderActiveShape}
                                                data={data}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={40}
                                                outerRadius={70}
                                                paddingAngle={3}
                                                animationDuration={750}
                                                animationBegin={0}
                                                animationEasing="ease-out"
                                                onMouseEnter={(_, index) => setActiveIndex(index)}
                                                onMouseLeave={() => setActiveIndex(undefined)}
                                            >
                                                {data.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={`url(#colorGradient-${index % COLORS.length})`}
                                                        stroke="rgba(255,255,255,0.2)"
                                                        strokeWidth={1}
                                                    />
                                                ))}
                                                <CenterLabel />
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Compact Legend */}
                                <div className="space-y-2 max-h-[100px] overflow-auto">
                                    {data.slice(0, 4).map((item, index) => (
                                        <div
                                            key={index}
                                            className={cn(
                                                "flex items-center justify-between p-2 rounded-md transition-all duration-200 text-sm",
                                                activeIndex === index ? "bg-muted/80" : "hover:bg-muted/40",
                                            )}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            onMouseLeave={() => setActiveIndex(undefined)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                />
                                                <span className="font-medium truncate">{item.name}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold text-xs">{formatCurrency(item.value)}</div>
                                                <div className="text-xs text-muted-foreground">{getPercentage(item.value)}</div>
                                            </div>
                                        </div>
                                    ))}
                                    {data.length > 4 && (
                                        <div className="text-xs text-muted-foreground text-center pt-1">+{data.length - 4} más</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="overflow-hidden border-none shadow-md bg-gradient-to-br from-background to-background/95">
            <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold tracking-tight">Distribución de Egresos</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[400px]">
                    {loading ? (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                            <Skeleton className="w-[220px] h-[220px] rounded-full" />
                            <div className="space-y-2 w-full max-w-md">
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-4/5 h-4" />
                                <Skeleton className="w-3/5 h-4" />
                            </div>
                        </div>
                    ) : data.length === 0 ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <p className="text-muted-foreground text-center">No hay egresos registrados</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 h-full">
                            {/* Chart - takes 3/5 of the space on desktop */}
                            <div className="md:col-span-3 h-full flex items-center justify-center">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <defs>
                                            {COLORS.map((color, index) => (
                                                <linearGradient
                                                    key={`gradient-${index}`}
                                                    id={`colorGradient-${index}`}
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                                                    <stop offset="100%" stopColor={color} stopOpacity={0.8} />
                                                </linearGradient>
                                            ))}
                                        </defs>
                                        <Pie
                                            activeIndex={activeIndex}
                                            activeShape={renderActiveShape}
                                            data={data}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={110}
                                            paddingAngle={3}
                                            animationDuration={750}
                                            animationBegin={0}
                                            animationEasing="ease-out"
                                            onMouseEnter={(_, index) => setActiveIndex(index)}
                                            onMouseLeave={() => setActiveIndex(undefined)}
                                        >
                                            {data.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={`url(#colorGradient-${index % COLORS.length})`}
                                                    stroke="rgba(255,255,255,0.2)"
                                                    strokeWidth={1}
                                                />
                                            ))}
                                            <CenterLabel />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Legend - takes 2/5 of the space on desktop */}
                            <div className="md:col-span-2 overflow-auto pr-2 flex flex-col justify-center">
                                <h4 className="font-medium mb-4 text-sm text-muted-foreground uppercase tracking-wider">Categorías</h4>
                                <ul className="space-y-3">
                                    {data.map((item, index) => (
                                        <li
                                            key={index}
                                            className={cn(
                                                "flex items-center justify-between p-3 rounded-lg transition-all duration-200",
                                                activeIndex === index ? "bg-muted/80 shadow-sm transform scale-[1.02]" : "hover:bg-muted/40",
                                            )}
                                            onMouseEnter={() => setActiveIndex(index)}
                                            onMouseLeave={() => setActiveIndex(undefined)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-4 h-4 rounded-full shadow-sm flex-shrink-0"
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                />
                                                <span className="font-medium">{item.name}</span>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold">{formatCurrency(item.value)}</div>
                                                <div className="text-xs text-muted-foreground">{getPercentage(item.value)}</div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
