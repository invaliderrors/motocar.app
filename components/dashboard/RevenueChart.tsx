"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useIsMobile } from "@/hooks/useMobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { getRevenueAnalytics, MonthlyRevenue } from "@/lib/services/analytics.service"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp, TrendingDown } from "lucide-react"

interface RevenueChartProps {
  storeId?: string
  className?: string
}

const chartConfig = {
  revenue: {
    label: "Ingresos",
    color: "hsl(var(--primary))",
  },
  loans: {
    label: "contratos",
    color: "hsl(var(--chart-2))",
  },
  payments: {
    label: "Pagos",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function RevenueChart({ storeId, className }: RevenueChartProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90")
  const [data, setData] = React.useState<MonthlyRevenue[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [totalRevenue, setTotalRevenue] = React.useState(0)
  const [growthRate, setGrowthRate] = React.useState(0)

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7")
    }
  }, [isMobile])

  React.useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        
        const days = parseInt(timeRange)

        const result = await getRevenueAnalytics({
          storeId,
          days,
        })

        setData(result.monthlyData)
        setTotalRevenue(result.totalRevenue)
        setGrowthRate(result.growthRate)
      } catch (err) {
        console.error("Error fetching revenue data:", err)
        setError("Error al cargar los datos de ingresos")
        setData([])
        setTotalRevenue(0)
        setGrowthRate(0)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [timeRange, storeId])

  const filteredData = React.useMemo(() => {
    const days = parseInt(timeRange)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    
    return data.filter((item) => {
      const itemDate = new Date(item.date)
      return itemDate >= cutoffDate
    })
  }, [data, timeRange])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "7":
        return "Últimos 7 días"
      case "30":
        return "Últimos 30 días"
      case "90":
        return "Últimos 3 meses"
      default:
        return "Últimos 3 meses"
    }
  }

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-col gap-4 space-y-0 pb-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 space-y-1">
          <CardTitle className="flex items-center gap-2">
            Ingresos Totales
            {growthRate > 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : growthRate < 0 ? (
              <TrendingDown className="h-4 w-4 text-red-500" />
            ) : null}
          </CardTitle>
          <CardDescription>
            {getTimeRangeLabel()}
            {totalRevenue > 0 && (
              <span className="ml-2 font-semibold text-foreground">
                {formatCurrency(totalRevenue)}
              </span>
            )}
          </CardDescription>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => value && setTimeRange(value)}
            className="hidden sm:flex"
          >
            <ToggleGroupItem value="90" aria-label="3 meses">
              3 meses
            </ToggleGroupItem>
            <ToggleGroupItem value="30" aria-label="30 días">
              30 días
            </ToggleGroupItem>
            <ToggleGroupItem value="7" aria-label="7 días">
              7 días
            </ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="w-40 sm:hidden"
              aria-label="Seleccionar período"
            >
              <SelectValue placeholder="Últimos 3 meses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="90">Últimos 3 meses</SelectItem>
              <SelectItem value="30">Últimos 30 días</SelectItem>
              <SelectItem value="7">Últimos 7 días</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {error ? (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">
            {error}
          </div>
        ) : filteredData.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">
            No hay datos disponibles para este período
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[250px] w-full"
          >
            <AreaChart
              data={filteredData}
              margin={{
                left: 12,
                right: 12,
                top: 12,
              }}
            >
              <defs>
                <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-revenue)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillLoans" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-loans)"
                    stopOpacity={0.6}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-loans)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("es-CO", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `$${(value / 1000000).toFixed(1)}M`
                  } else if (value >= 1000) {
                    return `$${(value / 1000).toFixed(0)}K`
                  }
                  return `$${value}`
                }}
              />
              <ChartTooltip
                cursor={{ strokeDasharray: "3 3", opacity: 0.5 }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("es-CO", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                    formatter={(value) => formatCurrency(Number(value))}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="revenue"
                type="monotone"
                fill="url(#fillRevenue)"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
