import { HttpService } from "../http"
import { Store, StoreStatus } from "../types"

export interface CreateStoreDto {
  name: string
  code: string
  address: string
  city: string
  phone?: string
  nit?: string
  status?: StoreStatus
}

export interface UpdateStoreDto {
  name?: string
  code?: string
  address?: string
  city?: string
  phone?: string
  nit?: string
  status?: StoreStatus
}

export interface StoreSummary {
  storeId: string
  storeName: string
  storeCode: string
  totalVehicles: number
  activeLoans: number
  totalRevenue: number
  pendingPayments: number
}

export const StoreService = {
  async getAllStores(): Promise<Store[]> {
    const response = await HttpService.get<Store[]>("/api/v1/stores")
    return response.data
  },

  async getStore(id: string): Promise<Store> {
    const response = await HttpService.get<Store>(`/api/v1/stores/${id}`)
    return response.data
  },

  async createStore(data: CreateStoreDto): Promise<Store> {
    const response = await HttpService.post<Store>("/api/v1/stores", data)
    return response.data
  },

  async updateStore(id: string, data: UpdateStoreDto): Promise<Store> {
    const response = await HttpService.patch<Store>(`/api/v1/stores/${id}`, data)
    return response.data
  },

  async deleteStore(id: string): Promise<void> {
    await HttpService.delete(`/api/v1/stores/${id}`)
  },

  async getStoreSummary(id: string): Promise<StoreSummary> {
    const response = await HttpService.get<StoreSummary>(`/api/v1/stores/${id}/summary`)
    return response.data
  },

  async transferVehicle(vehicleId: string, targetStoreId: string, reason: string): Promise<void> {
    await HttpService.post(`/api/v1/vehicles/${vehicleId}/transfer`, {
      targetStoreId,
      reason,
    })
  },

  async transferLoan(loanId: string, targetStoreId: string, reason: string): Promise<void> {
    await HttpService.post(`/api/v1/loans/${loanId}/transfer`, {
      targetStoreId,
      reason,
    })
  },

  async reassignEmployee(employeeId: string, newStoreId: string, reason: string): Promise<void> {
    await HttpService.post(`/api/v1/owners/${employeeId}/reassign`, {
      newStoreId,
      reason,
    })
  },
}
