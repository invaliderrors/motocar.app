"use client"

import { useEffect, useState } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import { useDashboardContext } from "./dashboard-provider"
import { Skeleton } from "@/components/ui/skeleton"

const COLORS = {
  ACTIVE: "#10b981", // green-500
  COMPLETED: "#3b82f6", // blue-500
  DEFAULTED: "#ef4444", // red-500
  PENDING: "#f59e0b", // amber-500
}

const STATUS_LABELS = {
  ACTIVE: "Activos",
  COMPLETED: "Completados",
  DEFAULTED: "Incumplidos",
  PENDING: "En Proceso",
}

export function LoanStatusChart() {
  const [isMounted, setIsMounted] = useState(false)
  const { data, loading } = useDashboardContext()
  const statusData = data?.loanStatusDistribution || []

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <div className="space-y-3 w-full">
          <Skeleton className="h-[150px] w-[150px] rounded-full mx-auto" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    )
  }

  if (loading || statusData.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <div className="space-y-3 w-full">
          <Skeleton className="h-[150px] w-[150px] rounded-full mx-auto" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    )
  }

  const total = statusData.reduce((sum, entry) => sum + entry.value, 0)

  return (
    <div className="h-[200px] flex flex-col items-center">
      <ResponsiveContainer width="100%" height={150}>
        <PieChart>
          <Pie
            data={statusData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            paddingAngle={2}
            dataKey="value"
            stroke="none"
          >
            {statusData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.status as keyof typeof COLORS] || COLORS.PENDING} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value} arrendamientos`, ""]} 
            contentStyle={{ 
              borderRadius: "8px",
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
            }} 
          />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Custom Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs">
        {statusData.map((entry, index) => {
          const percentage = total > 0 ? ((entry.value / total) * 100).toFixed(0) : 0
          return (
            <div key={`legend-${index}`} className="flex items-center gap-1.5">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[entry.status as keyof typeof COLORS] || COLORS.PENDING }}
              />
              <span className="text-muted-foreground">
                {STATUS_LABELS[entry.status as keyof typeof STATUS_LABELS]}: {percentage}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}