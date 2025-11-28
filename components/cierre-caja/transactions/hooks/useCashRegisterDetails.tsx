"use client"

import { useMemo } from "react"
import { PaymentMethods } from "@/lib/types"
import type { Closing } from "@/lib/types"

export function useCashRegisterDetail(cashRegister: Closing) {
    const calculations = useMemo(() => {
        // Calculate base vehicle payments (without GPS)
        const totalBasePayments = cashRegister.payments.reduce((acc, p) => acc + p.amount, 0)
        
        // Calculate GPS payments separately
        const totalGpsPayments = cashRegister.payments.reduce((acc, p) => acc + p.gps, 0)
        
        // Total income is the sum of both
        const totalIncome = totalBasePayments + totalGpsPayments
        
        const totalExpense = cashRegister.expense.reduce((acc, e) => acc + e.amount, 0)
        const balance = totalIncome - totalExpense

        return {
            totalBasePayments,
            totalGpsPayments,
            totalIncome,
            totalExpense,
            balance,
        }
    }, [cashRegister.payments, cashRegister.expense])

    const formatMethod = (method: string) => {
        switch (method) {
            case PaymentMethods.CASH:
                return "Efectivo"
            case PaymentMethods.TRANSACTION:
                return "Transferencia"
            case PaymentMethods.CARD:
                return "Tarjeta"
            default:
                return method
        }
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
    }

    return {
        ...calculations,
        formatMethod,
        getInitials,
    }
}
