"use client"

import { Installment } from "@/lib/types"
import { useState, useMemo, useEffect } from "react"
import type { DateRange } from "react-day-picker"
import { SortField, SortDirection } from "../utils/types"

interface UseTableStateProps {
    installments: Installment[]
    totalItems: number
    totalPages: number
    currentPage: number
    setCurrentPage: (page: number) => void
    onFiltersChange: (filters: {
        dateRange?: DateRange
        paymentMethod?: string | null
        isLate?: boolean | null
        searchTerm?: string
        page?: number
        limit?: number
    }) => void
}

export function useTableState({ 
    installments, 
    totalItems, 
    totalPages,
    currentPage: serverPage,
    setCurrentPage: setServerPage,
    onFiltersChange 
}: UseTableStateProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [sortField, setSortField] = useState<SortField>("date")
    const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
    const [paymentFilter, setPaymentFilter] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState<boolean | null>(null)
    const [itemsPerPage, setItemsPerPage] = useState(15)
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

    // Trigger backend fetch when filters change
    useEffect(() => {
        onFiltersChange({
            dateRange,
            paymentMethod: paymentFilter,
            isLate: statusFilter,
            searchTerm,
            page: serverPage,
            limit: itemsPerPage,
        })
    }, [dateRange, paymentFilter, statusFilter, searchTerm, serverPage, itemsPerPage])

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
        } else {
            setSortField(field)
            setSortDirection("asc")
        }
    }

    const resetFilters = () => {
        setSearchTerm("")
        setSortField("date")
        setSortDirection("desc")
        setPaymentFilter(null)
        setStatusFilter(null)
        setDateRange(undefined)
        setServerPage(1)
    }

    const hasActiveFilters = !!(searchTerm || paymentFilter !== null || statusFilter !== null || dateRange)

    // Client-side sorting of the current page results
    const sortedInstallments = useMemo(() => {
        const sorted = [...installments]
        
        if (sortField === "amount") {
            sorted.sort((a, b) => 
                sortDirection === "asc" ? a.amount - b.amount : b.amount - a.amount
            )
        } else if (sortField === "date") {
            sorted.sort((a, b) => 
                sortDirection === "asc"
                    ? new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime()
                    : new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
            )
        } else if (sortField === "userName") {
            sorted.sort((a, b) => {
                const aName = a.loan?.user?.name?.toLowerCase() || ""
                const bName = b.loan?.user?.name?.toLowerCase() || ""
                return sortDirection === "asc" ? aName.localeCompare(bName) : bName.localeCompare(aName)
            })
        } else if (sortField === "vehicleModel") {
            sorted.sort((a, b) => {
                const aModel = a.loan?.vehicle?.model?.toLowerCase() || a.loan?.motorcycle?.model?.toLowerCase() || ""
                const bModel = b.loan?.vehicle?.model?.toLowerCase() || b.loan?.motorcycle?.model?.toLowerCase() || ""
                return sortDirection === "asc" ? aModel.localeCompare(bModel) : bModel.localeCompare(aModel)
            })
        }
        
        return sorted
    }, [installments, sortField, sortDirection])

    const handlePageChange = (page: number) => {
        setServerPage(page)
    }

    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value)
        setServerPage(1)
    }

    const handleDateRangeChange = (range: DateRange | undefined) => {
        setDateRange(range)
        setServerPage(1)
    }

    // Calculate display indices
    const indexOfFirstItem = (serverPage - 1) * itemsPerPage + 1
    const indexOfLastItem = Math.min(indexOfFirstItem + installments.length - 1, totalItems)

    return {
        searchTerm,
        setSearchTerm,
        sortField,
        sortDirection,
        paymentFilter,
        setPaymentFilter,
        statusFilter,
        setStatusFilter,
        currentPage: serverPage,
        itemsPerPage,
        dateRange,
        filteredInstallments: sortedInstallments,
        paginatedInstallments: sortedInstallments,
        totalPages,
        indexOfFirstItem,
        indexOfLastItem,
        hasActiveFilters,
        handleSort,
        resetFilters,
        handlePageChange,
        handleItemsPerPageChange,
        handleDateRangeChange,
    }
}
