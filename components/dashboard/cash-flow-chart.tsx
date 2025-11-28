"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useDashboardContext } from "./dashboard-provider"
import { Skeleton } from "@/components/ui/skeleton"

export function CashFlowChart() {
  const [isMounted, setIsMounted] = useState(false)
  const { data, loading } = useDashboardContext()
  const cashFlowData = data?.cashFlow || []

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value)
  }

  if (!isMounted) {
    return (
      <div className="h-[300px] space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  if (loading || cashFlowData.length === 0) {
    return (
      <div className="h-[300px] space-y-3">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={cashFlowData}>
          <defs>
            <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="colorEgresos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value / 1000000}M`}
          />
          <Tooltip formatter={(value: number) => [formatCurrency(value), ""]} contentStyle={{ borderRadius: "8px" }} />
          <Legend />
          <Area
            type="monotone"
            dataKey="ingresos"
            name="Ingresos"
            stroke="hsl(var(--primary))"
            fillOpacity={1}
            fill="url(#colorIngresos)"
          />
          <Area
            type="monotone"
            dataKey="egresos"
            name="Egresos"
            stroke="hsl(var(--destructive))"
            fillOpacity={1}
            fill="url(#colorEgresos)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
