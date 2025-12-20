"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { HttpService } from "@/lib/http"
import type { Expense } from "@/lib/types"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useProviders } from "@/components/providers/hooks/useProviders"


export function useExpenseTable() {
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [searchInput, setSearchInput] = useState("") // For immediate UI update
    const [categoryFilter, setCategoryFilter] = useState("todos")
    const [providerFilter, setProviderFilter] = useState("todos")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(15)
    const [sortDirection, setSortDirection] = useState<"desc" | "asc">("desc")
    const [refreshKey, setRefreshKey] = useState(0)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null)
    const [viewExpense, setViewExpense] = useState<Expense | null>(null)
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [expenseToEdit, setExpenseToEdit] = useState<Expense | undefined>(undefined)
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
    const [attachmentDialogOpen, setAttachmentDialogOpen] = useState(false)
    const [selectedAttachmentUrl, setSelectedAttachmentUrl] = useState("")

    const { toast } = useToast()
    const { providers, getProviderName } = useProviders()

    useEffect(() => {
        fetchExpenses()
    }, [refreshKey, searchTerm, categoryFilter, providerFilter])

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchTerm(searchInput)
            setCurrentPage(1)
        }, 500)
        return () => clearTimeout(timer)
    }, [searchInput])

    const fetchExpenses = async () => {
        try {
            setLoading(true)
            let url = "/api/v1/expense"
            const params = new URLSearchParams()

            if (dateRange?.from) {
                params.append("startDate", dateRange.from.toISOString().split("T")[0])
            }
            if (dateRange?.to) {
                params.append("endDate", dateRange.to.toISOString().split("T")[0])
            }
            if (searchTerm) {
                params.append("search", searchTerm)
            }
            if (categoryFilter && categoryFilter !== "todos") {
                params.append("category", categoryFilter)
            }
            if (providerFilter && providerFilter !== "todos") {
                // Find provider ID from name
                const provider = providers.find(p => p.name === providerFilter)
                if (provider) {
                    params.append("providerId", provider.id)
                }
            }
            if (params.toString()) {
                url += `?${params.toString()}`
            }

            const res = await HttpService.get<any[]>(url)
            const mappedExpenses = res.data.map((item) => ({
                ...item,
                createdBy: item.createdBy || null,
            }))
            setExpenses(mappedExpenses)
        } catch (err) {
            console.error("Error fetching expenses:", err)
            toast({
                variant: "destructive",
                title: "Error al cargar gastos",
                description: "No se pudieron obtener los gastos del servidor",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleDateRangeChange = (range: DateRange | undefined) => {
        setDateRange(range)
        if (range === undefined || (range.from && range.to)) {
            setRefreshKey((prev) => prev + 1)
        }
    }

    const toggleSortDirection = () => {
        const newDirection = sortDirection === "desc" ? "asc" : "desc"
        setSortDirection(newDirection)
        const sortedExpenses = [...expenses].sort((a, b) => {
            const dateA = new Date(a.date)
            const dateB = new Date(b.date)
            const comparison = dateB.getTime() - dateA.getTime()
            return newDirection === "desc" ? comparison : -comparison
        })
        setExpenses(sortedExpenses)
        setCurrentPage(1)
    }

    const handleDelete = (id: string) => {
        setExpenseToDelete(id)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!expenseToDelete) return
        try {
            await HttpService.delete(`/api/v1/expense/${expenseToDelete}`)
            setExpenses((prev) => prev.filter((expense) => expense.id !== expenseToDelete))
            toast({
                title: "Egreso eliminado",
                description: "El egreso ha sido eliminado correctamente",
            })
        } catch (error) {
            console.error("Error al eliminar egreso:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo eliminar el egreso",
            })
        } finally {
            setDeleteDialogOpen(false)
            setExpenseToDelete(null)
        }
    }

    const handleViewDetails = (expense: Expense) => {
        setViewExpense(expense)
        setViewDialogOpen(true)
    }

    const handleEditExpense = (expense: Expense) => {
        setExpenseToEdit(expense)
        document.getElementById(`edit-expense-trigger-${expense.id}`)?.click()
    }

    const handleViewAttachment = (attachmentUrl: string) => {
        if (attachmentUrl) {
            setSelectedAttachmentUrl(attachmentUrl)
            setAttachmentDialogOpen(true)
        }
    }

    const refreshData = () => {
        setRefreshKey((prev) => prev + 1)
    }

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat("es-CO", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount)
    }

    const exportToCSV = () => {
        const categoryMap: Record<string, string> = {
            RENT: "Alquiler",
            SERVICES: "Servicios",
            SALARIES: "Salarios",
            TAXES: "Impuestos",
            MAINTENANCE: "Mantenimiento",
            WORKSHOP: "Taller",
            SPARE_PARTS: "Repuestos",
            PURCHASES: "Compras",
            MARKETING: "Marketing",
            TRANSPORT: "Transporte",
            OTHER: "Otros",
        }

        const paymentMethodMap: Record<string, string> = {
            CASH: "Efectivo",
            TRANSACTION: "Transferencia",
            CARD: "Tarjeta",
            CHECK: "Cheque",
            OTHER: "Otro",
        }

        const headers = [
            "ID",
            "Fecha",
            "Categoría",
            "Monto",
            "Método de Pago",
            "Beneficiario",
            "Referencia",
            "Descripción",
            "Proveedor",
            "Creado por",
        ]

        const csvRows = [
            headers.join(","),
            ...filteredExpenses.map((expense) =>
                [
                    expense.id,
                    format(new Date(expense.date), "dd/MM/yyyy", { locale: es }),
                    categoryMap[expense.category] || expense.category,
                    formatMoney(expense.amount),
                    paymentMethodMap[expense.paymentMethod] || expense.paymentMethod,
                    expense.beneficiary,
                    expense.reference,
                    expense.description,
                    expense.provider ? getProviderName(expense.provider.id) : "—",
                    expense.createdBy?.username || "—",
                ].join(","),
            ),
        ]

        const csvContent = csvRows.join("\n")
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", "egresos.csv")
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const clearFilters = () => {
        setSearchInput("")
        setSearchTerm("")
        setCategoryFilter("todos")
        setProviderFilter("todos")
        setCurrentPage(1)
    }

    // Computed values - no more client-side filtering, use server data directly
    const filteredExpenses = expenses

    const totalItems = filteredExpenses.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
    const currentItems = filteredExpenses.slice(startIndex, endIndex)
    const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        const maxVisiblePages = 5
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            pages.push(1)
            let startPage = Math.max(2, currentPage - 1)
            let endPage = Math.min(totalPages - 1, currentPage + 1)
            if (currentPage <= 3) endPage = Math.min(totalPages - 1, 4)
            else if (currentPage >= totalPages - 2) startPage = Math.max(2, totalPages - 3)
            if (startPage > 2) pages.push("ellipsis-start")
            for (let i = startPage; i <= endPage; i++) pages.push(i)
            if (endPage < totalPages - 1) pages.push("ellipsis-end")
            pages.push(totalPages)
        }
        return pages
    }

    const hasActiveFilters = searchInput !== "" || categoryFilter !== "todos" || providerFilter !== "todos"

    // Get unique providers from expenses for filter options
    const availableProviders = providers.filter((provider) =>
        expenses.some((expense) => expense.provider?.id === provider.id),
    )

    return {
        // State
        expenses: currentItems,
        loading,
        searchTerm: searchInput, // Return searchInput for UI binding
        setSearchTerm: setSearchInput, // Use setSearchInput for immediate updates
        categoryFilter,
        setCategoryFilter,
        providerFilter,
        setProviderFilter,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        sortDirection,
        deleteDialogOpen,
        setDeleteDialogOpen,
        viewExpense,
        viewDialogOpen,
        setViewDialogOpen,
        expenseToEdit,
        dateRange,
        attachmentDialogOpen,
        setAttachmentDialogOpen,
        selectedAttachmentUrl,

        // Actions
        handleDateRangeChange,
        toggleSortDirection,
        handleDelete,
        confirmDelete,
        handleViewDetails,
        handleEditExpense,
        handleViewAttachment,
        refreshData,
        exportToCSV,
        clearFilters,

        // Computed values
        totalItems,
        totalPages,
        startIndex,
        endIndex,
        totalAmount,
        getPageNumbers,
        hasActiveFilters,
        availableProviders,
        filteredExpenses,
        formatMoney,
    }
}
