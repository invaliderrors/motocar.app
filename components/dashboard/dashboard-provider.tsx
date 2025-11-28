"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useDashboard } from "@/hooks/useDashboard"
import type { DashboardData } from "@/lib/types/dashboard"

type DashboardContextType = {
  data: DashboardData | null
  loading: boolean
  error: string | null
  refetch: () => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const dashboardData = useDashboard()

  return <DashboardContext.Provider value={dashboardData}>{children}</DashboardContext.Provider>
}

export function useDashboardContext() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error("useDashboardContext must be used within DashboardProvider")
  }
  return context
}
