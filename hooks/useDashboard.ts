"use client"

import { useEffect, useState } from "react"
import { DashboardService } from "@/lib/services/dashboard.service"
import type { DashboardData } from "@/lib/types/dashboard"

export function useDashboard(dateRange?: string) {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      const dashboardData = await DashboardService.getDashboardData(dateRange)
      setData(dashboardData)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [dateRange])

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData,
  }
}
