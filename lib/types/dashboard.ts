export type DashboardStats = {
  totalUsers: number
  totalVehicles: number
  totalLoans: number
  totalInstallments: number
  totalRevenue: number
  pendingPayments: number
  growthRate: number
  defaultRate: number
}

export type CashFlowData = {
  name: string
  month: number
  year: number
  ingresos: number
  egresos: number
  net: number
}

export type LoanStatusData = {
  name: string
  value: number
  status: string
}

export type RecentLoan = {
  id: string
  userName: string
  userIdentification: string
  vehicleModel: string
  vehiclePlate: string
  amount: number
  downPayment: number
  date: string
  status: string
  paidInstallments: number
  totalInstallments: number
  isArchived?: boolean
  archivedAt?: string
}

export type OverviewData = {
  monthly: Array<{
    name: string
    month: number
    year: number
    total: number
    pagos: number
  }>
  weekly: Array<{
    name: string
    day: number
    month: number
    year: number
    total: number
    pagos: number
  }>
}

export type UpcomingPayment = {
  date: string
  amount: number
  client: string
  vehiclePlate: string
  loanId: string
  status: 'pending' | 'late'
}

export type RecentInstallment = {
  date: string
  amount: number
  client: string
  vehiclePlate: string
  loanId: string
  paymentMethod: string
  isLate: boolean
  status: 'paid'
}

export type DashboardData = {
  stats: DashboardStats
  cashFlow: CashFlowData[]
  loanStatusDistribution: LoanStatusData[]
  recentLoans: RecentLoan[]
  archivedLoans?: RecentLoan[]
  overview: OverviewData
  upcomingPayments: UpcomingPayment[]
  recentInstallments: RecentInstallment[]
  alerts: {
    pendingPaymentsThisWeek: number
  }
}
