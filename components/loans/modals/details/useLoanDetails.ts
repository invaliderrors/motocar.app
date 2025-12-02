"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useToast } from "@/components/ui/use-toast"
import { fetchLoan } from "@/lib/api"
import { getInterest } from "@/lib/utils"
import { Loan } from "@/lib/types"

interface UseLoanDetailsResult {
    loan: Loan | null
    loading: boolean
    interests: number
    currentPage: number
    setCurrentPage: (page: number) => void
    refetchLoan: () => void
}

export function useLoanDetails(loanId: string, open: boolean): UseLoanDetailsResult {
    const [loan, setLoan] = useState<Loan | null>(null)
    const [loading, setLoading] = useState(true)
    const [interests, setInterests] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const dataFetchedRef = useRef(false)
    const { toast } = useToast()

    const fetchLoanData = useCallback(async () => {
        setLoading(true)
        try {
            const response = await fetchLoan(loanId)
            const periods =
                response.paymentFrequency === "DAILY"
                    ? 365
                    : response.paymentFrequency === "WEEKLY"
                        ? 52
                        : response.paymentFrequency === "BIWEEKLY"
                            ? 24
                            : 12
            setInterests(getInterest(response.totalAmount, response.interestRate, periods))
            setLoan(response)
        } catch (error) {
            console.error("Error al cargar datos del contrato:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudieron cargar los datos del contrato",
            })
        } finally {
            setLoading(false)
        }
    }, [loanId, toast])

    useEffect(() => {
        if (open && !dataFetchedRef.current) {
            dataFetchedRef.current = true
            fetchLoanData()
        }

        if (!open) {
            dataFetchedRef.current = false
        }
    }, [open, fetchLoanData])

    const refetchLoan = useCallback(() => {
        fetchLoanData()
    }, [fetchLoanData])

    return {
        loan,
        loading,
        interests,
        currentPage,
        setCurrentPage,
        refetchLoan,
    }
}
