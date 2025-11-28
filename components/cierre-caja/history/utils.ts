import { CashRegisterDisplay, Closing } from "@/lib/types"
import { formatProviderName } from "@/lib/utils"
import { format, parseISO } from "date-fns"
import { formatInTimeZone } from "date-fns-tz"
import es from "date-fns/locale/es"

// Helper function to parse UTC date without timezone conversion
const parseUTCDate = (dateString: string): Date => {
    const date = parseISO(dateString)
    // Extract just the date part to avoid timezone issues
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth()
    const day = date.getUTCDate()
    return new Date(year, month, day)
}

export const transformCashRegisterData = (data: Closing[]): CashRegisterDisplay[] => {
    return data.map((item) => {
        // Calculate base vehicle payments (without GPS)
        const totalBasePayments = item.payments.reduce((acc, p) => acc + p.amount, 0)
        
        // Calculate GPS payments separately
        const totalGpsPayments = item.payments.reduce((acc, p) => acc + p.gps, 0)
        
        // Total income is the sum of both
        const totalIncome = totalBasePayments + totalGpsPayments
        
        const totalExpense = item.expense.reduce((acc, e) => acc + e.amount, 0)
        const balance = totalIncome - totalExpense
        
        // Parse closing date from UTC without timezone conversion
        const closingDate = parseUTCDate(item.date)
        // Use createdAt for the full registration date and time
        const createdAt = new Date(item.createdAt)
        
        const totalCashInSystem = item.cashInRegister + item.cashFromTransfers + item.cashFromCards

        const status: CashRegisterDisplay["status"] =
            Math.abs(balance - totalCashInSystem) <= 1000 ? "balanced"
                : Math.abs(balance - totalCashInSystem) <= 5000 ? "minor-diff"
                    : "major-diff"

        return {
            id: item.id,
            date: format(closingDate, "dd/MM/yyyy", { locale: es }), // Show closing date (no timezone shift)
            time: format(createdAt, "dd/MM/yyyy HH:mm", { locale: es }), // Show full registration date and time
            user: item.createdBy?.name || "N/A",
            totalBasePayments,
            totalGpsPayments,
            totalIncome,
            totalExpense,
            balance,
            status,
            provider: item.provider
                ? {
                    id: item.provider.id,
                    storeId: item.provider.storeId,
                    name: item.provider.name,
                    createdAt: item.provider.createdAt,
                    updatedAt: item.provider.updatedAt,
                    vehicles: item.provider.motorcylces || [], // Use motorcylces from API response
                    motorcylces: item.provider.motorcylces, // Keep for backwards compatibility
                    cashRegisters: item.provider.cashRegisters,
                }
                : undefined, 
            cashInRegister: item.cashInRegister,
            cashFromTransfers: item.cashFromTransfers,
            cashFromCards: item.cashFromCards,
            notes: item.notes,
            raw: item,
        }
    })
}

export const getMonthFromFilter = (monthFilter: string): string => {
    const months: Record<string, string> = {
        "01": "/01/",
        "02": "/02/",
        "03": "/03/",
        "04": "/04/",
        "05": "/05/",
        "06": "/06/",
        "07": "/07/",
        "08": "/08/",
        "09": "/09/",
        "10": "/10/",
        "11": "/11/",
        "12": "/12/",
    }
    return months[monthFilter] || ""
}

export const filterRegisters = (
    registers: CashRegisterDisplay[],
    filters: {
        searchTerm: string
        month: string
        providerFilter: string
        statusFilter: string
    }
) => {
    return registers.filter((r) => {
        const matchesSearch =
            r.id.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            r.user.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
            (r.provider && formatProviderName(r.provider.name).toLowerCase().includes(filters.searchTerm.toLowerCase()))

        const matchesMonth = filters.month === "all" || r.date.includes(getMonthFromFilter(filters.month))
        const matchesProvider = filters.providerFilter === "all" || r.provider?.name === filters.providerFilter
        const matchesStatus = filters.statusFilter === "all" || r.status === filters.statusFilter

        return matchesSearch && matchesMonth && matchesProvider && matchesStatus
    })
}

export const calculateSummaryStats = (registers: CashRegisterDisplay[]) => {
    return {
        totalIncome: registers.reduce((sum, r) => sum + r.totalIncome, 0),
        totalExpense: registers.reduce((sum, r) => sum + r.totalExpense, 0),
        totalBalance: registers.reduce((sum, r) => sum + r.balance, 0),
        totalPayments: registers.reduce((sum, r) => sum + r.raw.payments.length, 0),
        totalExpenses: registers.reduce((sum, r) => sum + r.raw.expense.length, 0),
    }
}

export const getPageNumbers = (currentPage: number, totalPages: number) => {
    const pageNumbers: (number | string)[] = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
        for (let i = 1; i <= totalPages; i++) pageNumbers.push(i)
    } else {
        pageNumbers.push(1)
        let startPage = Math.max(2, currentPage - 1)
        let endPage = Math.min(totalPages - 1, currentPage + 1)

        if (currentPage <= 2) endPage = 4
        else if (currentPage >= totalPages - 1) startPage = totalPages - 3

        if (startPage > 2) pageNumbers.push("ellipsis1")
        for (let i = startPage; i <= endPage; i++) pageNumbers.push(i)
        if (endPage < totalPages - 1) pageNumbers.push("ellipsis2")
        pageNumbers.push(totalPages)
    }

    return pageNumbers
}
