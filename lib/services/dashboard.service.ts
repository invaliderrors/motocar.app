import { HttpService } from "../http"
import type { DashboardData } from "../types/dashboard"

const API_BASE = "/api/v1"

export const DashboardService = {
  async getDashboardData(dateRange?: string): Promise<DashboardData> {
    const params = dateRange ? `?dateRange=${dateRange}` : ""
    const response = await HttpService.get<DashboardData>(`${API_BASE}/dashboard${params}`)
    return response.data
  },
}
