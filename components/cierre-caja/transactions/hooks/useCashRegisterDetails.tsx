"use client"

import { useMemo } from "react"
import { PaymentMethods } from "@/lib/types"
import type { Closing } from "@/lib/types"

export function useCashRegisterDetail(cashRegister: Closing) {
    const calculations = useMemo(() => {
        const totalIncome = cashRegister.payments.reduce((acc, p) => acc + p.amount + p.gps, 0)
        const totalExpense = cashRegister.expense.reduce((acc, e) => acc + e.amount, 0)
        const balance = totalIncome - totalExpense

        return {
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
