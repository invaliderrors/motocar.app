import { HttpService } from "../http"

export interface MonthlyRevenue {
  date: string
  revenue: number
  loans: number
  payments: number
}

export interface RevenueAnalyticsData {
  monthlyData: MonthlyRevenue[]
  totalRevenue: number
  averageMonthlyRevenue: number
  growthRate: number
}

export async function getRevenueAnalytics(params?: {
  storeId?: string
  startDate?: string
  endDate?: string
  days?: number
}): Promise<RevenueAnalyticsData> {
  const queryParams = new URLSearchParams()
  
  if (params?.storeId) queryParams.append("storeId", params.storeId)
  if (params?.startDate) queryParams.append("startDate", params.startDate)
  if (params?.endDate) queryParams.append("endDate", params.endDate)
  if (params?.days) queryParams.append("days", params.days.toString())

  const response = await HttpService.get<RevenueAnalyticsData>(
    `/api/v1/analytics/revenue${queryParams.toString() ? `?${queryParams.toString()}` : ""}`
  )
  return response.data
}

