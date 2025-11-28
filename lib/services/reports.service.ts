import { HttpService } from "@/lib/http"

export interface LoanReportFilters {
  startDate?: string
  endDate?: string
  status?: string
  search?: string
}

export interface PaymentReportFilters {
  startDate?: string
  endDate?: string
  status?: string
  search?: string
}

export interface ClientReportFilters {
  startDate?: string
  endDate?: string
  status?: string
  search?: string
  provider?: string
}

export interface VehicleReportFilters {
  startDate?: string
  endDate?: string
  status?: string
  search?: string
}

export interface LoanReportData {
  id: string
  clientName: string
  motorcycle: string
  amount: number
  interestRate: number
  interestType: string
  paymentFrequency: string
  installments: number
  paidInstallments: number
  startDate: string
  status: string
  progress: number
  providerId?: string
  providerName?: string
}

export interface PaymentReportData {
  id: string
  loanId: string
  clientName: string
  amount: number
  dueDate: string
  paymentDate: string | null
  status: string
  installmentNumber: number
  motorcycle?: string
}

export interface ClientReportData {
  id: string
  name: string
  document: string
  phone: string
  email: string
  address: string
  activeLoans: number
  totalLoans: number
  totalAmount: number
  status: string
  joinDate: string
}

export interface VehicleReportData {
  id: string
  brand: string
  model: string
  plate: string
  color: string
  year: number
  price: number
  purchaseDate: string
  status: string
  clientName: string | null
  providerId?: string
  providerName?: string
}

export interface MissingInstallmentData {
  userId: string
  userName: string
  userDocument: string
  userPhone: string
  userAddress: string
  loanId: string
  contractNumber: string | null
  vehicle: string
  plate: string
  providerId: string | null
  providerName: string | null
  lastPaymentDate: string | null
  lastPaymentWasLate: boolean
  daysSinceLastPayment: number
  missedInstallments: number
  installmentAmount: number
  gpsAmount: number
  totalMissedAmount: number
  totalInstallments: number
  paidInstallments: number
  loanStatus: string
  paymentFrequency: string
}

export interface LoanReportSummary {
  total: number
  active: number
  completed: number
  defaulted: number
  totalAmount: number
  totalInterest: number
  items: LoanReportData[]
}

export interface PaymentReportSummary {
  total: number
  onTime: number
  late: number
  totalCollected: number
  pendingCollection: number
  items: PaymentReportData[]
}

export interface ClientReportSummary {
  total: number
  active: number
  inactive: number
  withDefaultedLoans: number
  items: ClientReportData[]
}

export interface VehicleReportSummary {
  total: number
  financed: number
  available: number
  totalValue: number
  items: VehicleReportData[]
}

export interface MissingInstallmentReportSummary {
  totalClients: number
  totalMissedPayments: number
  totalMissedAmount: number
  criticalClients: number
  items: MissingInstallmentData[]
}

export interface ReportExportParams {
  type: "loans" | "payments" | "clients" | "vehicles" | "missing-installments"
  format: "excel" | "pdf" | "csv"
  filters: any
}

class ReportsService {
  // Loan Reports
  async getLoanReport(filters: LoanReportFilters): Promise<LoanReportSummary> {
    const params = new URLSearchParams()
    if (filters.startDate) params.append("startDate", filters.startDate)
    if (filters.endDate) params.append("endDate", filters.endDate)
    if (filters.status && filters.status !== "all") params.append("status", filters.status)
    if (filters.search) params.append("search", filters.search)

    const response = await HttpService.get(`/api/v1/reports/loans?${params.toString()}`)
    return response.data
  }

  // Payment Reports
  async getPaymentReport(filters: PaymentReportFilters): Promise<PaymentReportSummary> {
    const params = new URLSearchParams()
    if (filters.startDate) params.append("startDate", filters.startDate)
    if (filters.endDate) params.append("endDate", filters.endDate)
    if (filters.status && filters.status !== "all") params.append("status", filters.status)
    if (filters.search) params.append("search", filters.search)

    const response = await HttpService.get(`/api/v1/reports/payments?${params.toString()}`)
    return response.data
  }

  // Client Reports
  async getClientReport(filters: ClientReportFilters): Promise<ClientReportSummary> {
    const params = new URLSearchParams()
    if (filters.startDate) params.append("startDate", filters.startDate)
    if (filters.endDate) params.append("endDate", filters.endDate)
    if (filters.status && filters.status !== "all") params.append("status", filters.status)
    if (filters.search) params.append("search", filters.search)

    const response = await HttpService.get(`/api/v1/reports/clients?${params.toString()}`)
    return response.data
  }

  // Vehicle Reports
  async getVehicleReport(filters: VehicleReportFilters): Promise<VehicleReportSummary> {
    const params = new URLSearchParams()
    if (filters.startDate) params.append("startDate", filters.startDate)
    if (filters.endDate) params.append("endDate", filters.endDate)
    if (filters.status && filters.status !== "all") params.append("status", filters.status)
    if (filters.search) params.append("search", filters.search)

    const response = await HttpService.get(`/api/v1/reports/vehicles?${params.toString()}`)
    return response.data
  }

  // Missing Installments Report
  async getMissingInstallmentsReport(filters: ClientReportFilters): Promise<MissingInstallmentReportSummary> {
    const params = new URLSearchParams()
    if (filters.startDate) params.append("startDate", filters.startDate)
    if (filters.endDate) params.append("endDate", filters.endDate)
    if (filters.status && filters.status !== "all") params.append("status", filters.status)
    if (filters.search) params.append("search", filters.search)
    if (filters.provider && filters.provider !== "all") params.append("provider", filters.provider)

    const response = await HttpService.get(`/api/v1/reports/missing-installments?${params.toString()}`)
    return response.data
  }

  // Export Reports
  async exportReport(params: ReportExportParams): Promise<Blob> {
    const queryParams = new URLSearchParams()
    Object.entries(params.filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        queryParams.append(key, String(value))
      }
    })

    const response = await HttpService.get(
      `/api/v1/reports/export/${params.type}/${params.format}?${queryParams.toString()}`,
      {
        responseType: "blob",
      }
    )
    return response.data
  }

  // Download helper
  downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
}

export const reportsService = new ReportsService()
