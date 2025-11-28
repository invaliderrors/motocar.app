"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { HttpService } from "@/lib/http"
import { DateRange } from "react-day-picker"
import { Installment } from "@/lib/types"

interface InstallmentsResponse {
    data: Installment[]
    pagination: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
}

interface FetchFilters {
    dateRange?: DateRange
    paymentMethod?: string | null
    isLate?: boolean | null
    searchTerm?: string
    page?: number
    limit?: number
}

export function useInstallments(onRefreshCallback?: (refreshFn: () => void) => void) {
    const [installments, setInstallments] = useState<Installment[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [totalItems, setTotalItems] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const { toast } = useToast()

    const fetchInstallments = async (filters: FetchFilters = {}) => {
        try {
            setLoading(true)

            // Build URL with query parameters
            let url = "/api/v1/installments"
            const params = new URLSearchParams()

            // Date range filters
            if (filters.dateRange?.from) {
                params.append("startDate", filters.dateRange.from.toISOString().split("T")[0])
            }
            if (filters.dateRange?.to) {
                params.append("endDate", filters.dateRange.to.toISOString().split("T")[0])
            }

            // Payment method filter
            if (filters.paymentMethod && filters.paymentMethod !== null) {
                params.append("paymentMethod", filters.paymentMethod)
            }

            // Late status filter
            if (filters.isLate !== null && filters.isLate !== undefined) {
                params.append("isLate", filters.isLate.toString())
            }

            // Search term (plate search)
            if (filters.searchTerm) {
                params.append("plate", filters.searchTerm)
            }

            // Pagination
            params.append("page", (filters.page || currentPage).toString())
            params.append("limit", (filters.limit || 50).toString())

            if (params.toString()) {
                url += `?${params.toString()}`
            }

            const res = await HttpService.get<InstallmentsResponse>(url)
            
            setInstallments(res.data.data)
            setTotalItems(res.data.pagination.total)
            setTotalPages(res.data.pagination.totalPages)
            setCurrentPage(res.data.pagination.page)
        } catch (error) {
            console.error("Error al obtener cuotas:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudieron obtener las cuotas del servidor",
            })
        } finally {
            setLoading(false)
        }
    }

    const refreshInstallments = () => {
        setRefreshTrigger((prev) => prev + 1)
    }

    useEffect(() => {
        fetchInstallments()
    }, [refreshTrigger])

    useEffect(() => {
        if (onRefreshCallback) {
            onRefreshCallback(refreshInstallments)
        }
    }, [onRefreshCallback])

    return {
        installments,
        setInstallments,
        loading,
        totalItems,
        totalPages,
        currentPage,
        setCurrentPage,
        fetchInstallments,
        refreshInstallments,
    }
}
