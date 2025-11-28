"use client"

import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { useAdminDashboard } from "@/hooks/useAdminDashboard"
import { OverviewStats } from "./components/OverviewStats"
import { StoresGrid } from "./components/StoresGrid"
import { DashboardLoadingState } from "./components/LoadingState"
import { DashboardErrorState } from "./components/ErrorState"

export function AdminDashboard() {
  const { data, loading, error, refetch } = useAdminDashboard()

  if (loading) {
    return <DashboardLoadingState />
  }

  if (error || !data) {
    return <DashboardErrorState onRetry={refetch} />
  }

  return (
    <div className="space-y-8 relative">
      {/* Decorative background elements */}
      <div className="fixed top-20 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Overview Statistics */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <OverviewStats data={data.overview} />
      </div>

      {/* Revenue Analytics Chart */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '100ms', animationFillMode: 'backwards' }}>
        <RevenueChart />
      </div>

      {/* Stores Grid */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: '200ms', animationFillMode: 'backwards' }}>
        <StoresGrid stores={data.stores} />
      </div>
    </div>
  )
}

