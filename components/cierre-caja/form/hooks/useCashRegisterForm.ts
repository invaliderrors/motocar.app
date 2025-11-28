"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/hooks/useAuth"
import { HttpService } from "@/lib/http"
import type { FormState, SelectedTransaction } from "../types"
import {
    getProviderDetailsFromTransactions,
    calculateFormValues,
    calculateTransactionTotals,
    calculateAutoFillValues,
} from "../utils"
import { Provider } from "@/lib/types";

const initialFormState: FormState = {
    cashInRegister: "",
    cashFromTransfers: "",
    cashFromCards: "",
    notes: "",
    submitting: false,
    success: false,
    error: false,
    errorMessage: "",
}

export const useCashRegisterForm = (selectedTransactions: SelectedTransaction[], closingDate?: Date) => {
    const [formState, setFormState] = useState<FormState>(initialFormState)
    const [currentProvider, setCurrentProvider] = useState<Provider | undefined>(undefined);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false)
    const { user } = useAuth()

    const { incomes, expenses, totalExpected, totalExpenses } = useMemo(
        () => calculateTransactionTotals(selectedTransactions),
        [selectedTransactions],
    )

    const calculations = useMemo(() => {
        const formCalcs = calculateFormValues(formState)
        const totalDifference = formCalcs.totalRegistered - totalExpected

        return {
            ...formCalcs,
            totalExpected,
            totalExpenses,
            totalDifference,
        }
    }, [formState, totalExpected, totalExpenses])

    const expectedCash = useMemo(() => {
        return incomes.filter((i) => i.paymentMethod === "CASH").reduce((acc, i) => acc + i.amount, 0)
    }, [incomes])

    const cashMatches = useMemo(() => {
        const cashInRegister = Number.parseFloat(formState.cashInRegister) || 0
        return Math.abs(cashInRegister - expectedCash) < 1 // Tolerance of 1 peso
    }, [formState.cashInRegister, expectedCash])

    const isFormValid = useMemo(() => {
        return !formState.submitting && incomes.length > 0 && calculations.hasAnyValue && cashMatches
    }, [formState.submitting, incomes.length, calculations.hasAnyValue, cashMatches])

    const isReadOnly = incomes.length > 0

    // Auto-fill form when transactions change
    useEffect(() => {
        console.log('💰 useCashRegisterForm - selectedTransactions changed:', selectedTransactions);
        console.log('💰 useCashRegisterForm - incomes:', incomes);
        console.log('💰 useCashRegisterForm - expenses:', expenses);
        
        // Extract provider from any transaction (income or expense)
        const provider = getProviderDetailsFromTransactions(selectedTransactions);
        console.log('💰 useCashRegisterForm - extracted provider:', provider);
        setCurrentProvider(provider);
        
        if (incomes.length > 0) {
            const { cash, transfers, cards } = calculateAutoFillValues(incomes)

            setFormState((prev) => ({
                ...prev,
                cashInRegister: cash.toString(),
                cashFromTransfers: transfers.toString(),
                cashFromCards: cards.toString(),
                success: false,
                error: false,
            }))
        } else if (selectedTransactions.length === 0) {
            // Only clear provider if no transactions are selected at all
            console.log('💰 useCashRegisterForm - no transactions, clearing provider');
            setCurrentProvider(undefined)
        }
    }, [incomes, expenses, selectedTransactions])

    const handleInputChange = (field: keyof FormState, value: string) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value,
            success: false,
            error: false,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setFormState((prev) => ({ ...prev, submitting: true, success: false, error: false }))

        try {
            const payload: any = {
                cashInRegister: calculations.cashInRegister,
                cashFromTransfers: calculations.cashFromTransfers,
                cashFromCards: calculations.cashFromCards,
                notes: formState.notes,
                installmentIds: incomes.map((i) => i.id),
                expenseIds: expenses.map((e) => e.id),
                createdById: user?.id,
                provider: currentProvider,
                providerId: currentProvider?.id,
            }

            // Note: closingDate is no longer sent - backend determines it from transactions

            await HttpService.post("/api/v1/closing", payload)

            setFormState((prev) => ({
                ...prev,
                submitting: false,
                success: true,
            }))
            setShowSuccessDialog(true)
        } catch (err: any) {
            console.error("Error registrando cierre:", err)
            
            // Extract error message from response
            let errorMessage = "Error desconocido"
            if (err?.response?.data?.message) {
                errorMessage = err.response.data.message
            } else if (err?.message) {
                errorMessage = err.message
            }
            
            setFormState((prev) => ({
                ...prev,
                submitting: false,
                error: true,
                errorMessage,
            }))
        }
    }

    const resetForm = () => {
        setFormState(initialFormState)
        setShowSuccessDialog(false)
    }

    return {
        formState,
        currentProvider,
        showSuccessDialog,
        incomes,
        expenses,
        calculations,
        isFormValid,
        isReadOnly,
        expectedCash,
        cashMatches,
        handleInputChange,
        handleSubmit,
        resetForm,
        setShowSuccessDialog,
    }
}
