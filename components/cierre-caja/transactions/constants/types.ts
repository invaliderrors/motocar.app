import { Expense, ExpenseCategory, Installment, PaymentMethod, Provider } from "@/lib/types"


export interface Transaction {
  id: string
  time: string
  description: string
  category: string
  amount: number
  baseAmount?: number
  gpsAmount?: number
  paymentMethod: PaymentMethod // Changed from string to PaymentMethod enum
  type: TransactionType
  reference: string
  client?: string
  provider?: Provider
  date: Date // Actual payment date
  isLate?: boolean // Whether this is a late payment
  latePaymentDate?: Date | null // Original due date (for late payments)
  createdBy?: {
    id: string
    username: string
  }
}

export interface SelectedTransaction {
  id: string
  amount: number
  baseAmount?: number
  gpsAmount?: number
  paymentMethod: PaymentMethod
  type: TransactionType
  description: string
  date: Date
  provider?: Provider
  reference: string
  isLate?: boolean
  latePaymentDate?: Date | null
}

export type TransactionType = "income" | "expense"

// Updated SortField to match the actual Transaction properties
export type SortField = "time" | "description" | "category" | "amount" | "provider" | "date" | "type" | null

export type SortDirection = "asc" | "desc"

export interface TransactionFiltersState {
  searchTerm: string
  typeFilter: string
  providerFilter: string
  sortField: SortField
  sortDirection: SortDirection
}

export interface TransactionResponse {
  installments: Installment[]
  expenses: Expense[]
}

export interface TransactionSummary {
  totalIncome: number
  totalExpense: number
  netAmount: number
}

export interface PaginationState {
  currentPage: number
  totalPages: number
  itemsPerPage: number
}

export const PAYMENT_METHOD_LABELS = {
  [PaymentMethod.CASH]: "Efectivo",
  [PaymentMethod.CARD]: "Tarjeta",
  [PaymentMethod.TRANSACTION]: "Transferencia",
} as const

export function getPaymentMethodLabel(method: PaymentMethod): string {
  return PAYMENT_METHOD_LABELS[method] || "Desconocido"
}
