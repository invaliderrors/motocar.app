import { FilterState, PaginationState } from "@/lib/types"
import { useState } from "react"

export const useCashRegisterFilters = () => {
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: "",
        month: "all",
        providerFilter: "all",
        statusFilter: "all",
    })

    const [pagination, setPagination] = useState<PaginationState>({
        currentPage: 1,
        itemsPerPage: "10",
    })

    const updateFilter = (key: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
        setPagination(prev => ({ ...prev, currentPage: 1 }))
    }

    const updatePagination = (key: keyof PaginationState, value: string | number) => {
        setPagination(prev => ({ ...prev, [key]: value }))
    }

    const resetFilters = () => {
        setFilters({
            searchTerm: "",
            month: "all",
            providerFilter: "all",
            statusFilter: "all",
        })
        setPagination(prev => ({ ...prev, currentPage: 1 }))
    }

    return {
        filters,
        pagination,
        updateFilter,
        updatePagination,
        resetFilters,
    }
}
