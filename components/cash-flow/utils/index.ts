import type { CashFlowAccountType, CashFlowCategory, CashFlowTransactionType, CashFlowScenario } from "@/lib/types/cash-flow"

// Currency formatting
export function formatCurrency(amount: number, currency: string = "COP"): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Account Type Labels
export function getAccountTypeLabel(type: CashFlowAccountType): string {
  const labels: Record<CashFlowAccountType, string> = {
    OPERATING: "Operación",
    INVESTING: "Inversión",
    FINANCING: "Financiamiento",
    BANK: "Banco",
    CASH: "Efectivo",
    OTHER: "Otro",
  }
  return labels[type] || type
}

export function getAccountTypeBadgeVariant(type: CashFlowAccountType): "default" | "secondary" | "outline" | "destructive" {
  const variants: Record<CashFlowAccountType, "default" | "secondary" | "outline" | "destructive"> = {
    OPERATING: "default",
    INVESTING: "secondary",
    FINANCING: "outline",
    BANK: "default",
    CASH: "secondary",
    OTHER: "outline",
  }
  return variants[type] || "default"
}

// Transaction Type Labels
export function getTransactionTypeLabel(type: CashFlowTransactionType): string {
  return type === "INFLOW" ? "Entrada" : "Salida"
}

export function getTransactionTypeBadgeVariant(type: CashFlowTransactionType): "default" | "destructive" {
  return type === "INFLOW" ? "default" : "destructive"
}

// Category Labels
export function getCategoryLabel(category: CashFlowCategory): string {
  const labels: Record<CashFlowCategory, string> = {
    SALES_REVENUE: "Ingresos por Ventas",
    SERVICE_REVENUE: "Ingresos por Servicios",
    LOAN_DISBURSEMENT: "Desembolso de contrato",
    INVESTMENT_INCOME: "Ingresos de Inversión",
    ASSET_SALE: "Venta de Activo",
    LOAN_REPAYMENT_RECEIVED: "Cobro de contrato",
    OTHER_INCOME: "Otros Ingresos",
    OPERATING_EXPENSE: "Gasto Operativo",
    PAYROLL: "Nómina",
    RENT: "Alquiler",
    UTILITIES: "Servicios Públicos",
    MARKETING: "Marketing",
    LOAN_DISBURSEMENT_OUT: "contrato Otorgado",
    LOAN_REPAYMENT: "Pago de contrato",
    INTEREST_PAYMENT: "Pago de Intereses",
    TAX_PAYMENT: "Pago de Impuestos",
    ASSET_PURCHASE: "Compra de Activo",
    INVENTORY_PURCHASE: "Compra de Inventario",
    DIVIDEND_PAYMENT: "Pago de Dividendos",
    OTHER_EXPENSE: "Otros Gastos",
  }
  return labels[category] || category
}

// Get category badge variant
export function getCategoryBadgeVariant(category: CashFlowCategory): "default" | "secondary" | "outline" {
  const incomeCategories = [
    "SALES_REVENUE",
    "SERVICE_REVENUE",
    "LOAN_DISBURSEMENT",
    "INVESTMENT_INCOME",
    "ASSET_SALE",
    "LOAN_REPAYMENT_RECEIVED",
    "OTHER_INCOME",
  ]
  return incomeCategories.includes(category) ? "default" : "secondary"
}

// Scenario Labels
export function getScenarioLabel(scenario: CashFlowScenario): string {
  const labels: Record<CashFlowScenario, string> = {
    BASE: "Base",
    BEST: "Mejor Caso",
    WORST: "Peor Caso",
  }
  return labels[scenario] || scenario
}

// Date formatting
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("es-DO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleString("es-DO", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Generate unique key
export function generateIdempotencyKey(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

// Number formatting
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("es-DO").format(num)
}

// Get all categories grouped
export function getCategoriesGrouped() {
  return {
    income: [
      "SALES_REVENUE" as CashFlowCategory,
      "SERVICE_REVENUE" as CashFlowCategory,
      "LOAN_DISBURSEMENT" as CashFlowCategory,
      "INVESTMENT_INCOME" as CashFlowCategory,
      "ASSET_SALE" as CashFlowCategory,
      "LOAN_REPAYMENT_RECEIVED" as CashFlowCategory,
      "OTHER_INCOME" as CashFlowCategory,
    ],
    expense: [
      "OPERATING_EXPENSE" as CashFlowCategory,
      "PAYROLL" as CashFlowCategory,
      "RENT" as CashFlowCategory,
      "UTILITIES" as CashFlowCategory,
      "MARKETING" as CashFlowCategory,
      "LOAN_DISBURSEMENT_OUT" as CashFlowCategory,
      "LOAN_REPAYMENT" as CashFlowCategory,
      "INTEREST_PAYMENT" as CashFlowCategory,
      "TAX_PAYMENT" as CashFlowCategory,
      "ASSET_PURCHASE" as CashFlowCategory,
      "INVENTORY_PURCHASE" as CashFlowCategory,
      "DIVIDEND_PAYMENT" as CashFlowCategory,
      "OTHER_EXPENSE" as CashFlowCategory,
    ],
  }
}

// Download file helper
export function downloadFile(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(url)
  document.body.removeChild(a)
}
