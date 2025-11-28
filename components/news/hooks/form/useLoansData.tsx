"use client"

import { useState, useEffect } from "react"
import { Loan, NewsType } from "@/lib/types"
import { HttpService } from "@/lib/http"
import { useStore } from "@/contexts/StoreContext"
import { useToast } from "@/components/ui/use-toast"

interface UseLoansDataProps {
    open: boolean
    newsType: NewsType
}

export function useLoansData({ open, newsType }: UseLoansDataProps) {
    const [loans, setLoans] = useState<Loan[]>([])
    const [loadingLoans, setLoadingLoans] = useState(false)
    const [loanSearchOpen, setLoanSearchOpen] = useState(false)
    const { currentStore } = useStore()
    const { toast } = useToast()

    const loadLoans = async () => {
        if (!currentStore) return

        try {
            setLoadingLoans(true)
            const token = document.cookie
                .split("; ")
                .find((c) => c.startsWith("authToken="))
                ?.split("=")[1]

            const response = await HttpService.get<Loan[]>(
                `/api/v1/loans`,
                {
                    headers: { Authorization: token ? `Bearer ${token}` : "" },
                }
            )
            
            const loansData = Array.isArray(response.data) ? response.data : []
            setLoans(loansData)
        } catch (error: any) {
            console.error("Error loading loans:", error)
            toast({
                variant: "destructive",
                title: "Error al cargar contratos",
                description: error?.message || "No se pudieron cargar los contratos",
            })
        } finally {
            setLoadingLoans(false)
        }
    }

    useEffect(() => {
        if (open && currentStore && newsType === NewsType.LOAN_SPECIFIC) {
            loadLoans()
        }
    }, [open, currentStore, newsType])

    return {
        loans,
        loadingLoans,
        loanSearchOpen,
        setLoanSearchOpen,
    }
}
