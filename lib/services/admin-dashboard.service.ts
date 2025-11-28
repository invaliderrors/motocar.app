import { HttpService } from "../http"

export interface StoreStats {
  totalVehicles: number
  totalLoans: number
  totalEmployees: number
  totalProviders: number
  activeLoans: number
  vehiclesInUse: number
  monthlyRevenue: number
  pendingPayments: number
}

export interface StoreData {
  id: string
  name: string
  code: string
  city: string
  status: string
  whatsappEnabled: boolean
  whatsappConfigured: boolean
  stats: StoreStats
}

export interface AdminDashboardData {
  overview: {
    totalStores: number
    activeStores: number
    totalVehicles: number
    totalLoans: number
    totalEmployees: number
    totalProviders: number
    activeLoans: number
    totalRevenue: number
  }
  stores: StoreData[]
}

export async function getAdminDashboard(): Promise<AdminDashboardData> {
  const response = await HttpService.get<AdminDashboardData>("/api/v1/stores/admin/dashboard")
  return response.data
}
