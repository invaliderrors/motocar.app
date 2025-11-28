import { PaymentMethod, Provider } from "@/lib/types"
import type { SelectedTransaction as TransactionSelectedTransaction } from "../transactions/constants/types"

// Re-export the SelectedTransaction from transactions to ensure consistency
export type SelectedTransaction = TransactionSelectedTransaction

export type FormState = {
    cashInRegister: string
    cashFromTransfers: string
    cashFromCards: string
    notes: string
    submitting: boolean
    success: boolean
    error: boolean
    errorMessage: string
}

export type CashRegisterFormProps = {
    token: string
    selectedTransactions: SelectedTransaction[]
    closingDate?: Date
}

export type ChartData = {
    name: string
    value: number
}

export type FormCalculations = {
    cashInRegister: number
    cashFromTransfers: number
    cashFromCards: number
    totalRegistered: number
    totalExpected: number
    totalExpenses: number
    totalDifference: number
    hasAnyValue: boolean
}
