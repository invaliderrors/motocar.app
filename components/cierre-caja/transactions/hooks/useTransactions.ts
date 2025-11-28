"use client"

import { useCallback, useEffect, useState, useMemo, useRef } from "react"
import { DEFAULT_ITEMS_PER_PAGE } from "../constants"
import {
    type SelectedTransaction,
    type SortField,
    type Transaction,
    type TransactionFiltersState,
} from "../constants/types"
import { calculatePagination, calculateTransactionSummary, filterAndSortTransactions } from "../utils/filters"
import { fetchAvailableTransactions } from "../services"
import { formatProviderName } from "../utils/formatters"
import { PaymentMethod } from "@/lib/types"

interface UseTransactionsProps {
    token: string
    onSelect?: (transactions: SelectedTransaction[]) => void
    itemsPerPage?: number
}

export const useTransactions = ({ token, onSelect, itemsPerPage = DEFAULT_ITEMS_PER_PAGE }: UseTransactionsProps) => {
    // State
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [globalSelectedIds, setGlobalSelectedIds] = useState<Set<string>>(new Set())
    const [currentPage, setCurrentPage] = useState(1)

    // Provider mismatch dialog state
    const [showProviderMismatchDialog, setShowProviderMismatchDialog] = useState(false)
    const [currentProviderName, setCurrentProviderName] = useState<string | undefined>(undefined)
    const [attemptedProviderName, setAttemptedProviderName] = useState<string | undefined>(undefined)

    // Filters state
    const [filters, setFilters] = useState<TransactionFiltersState>({
        searchTerm: "",
        typeFilter: "all",
        providerFilter: "all",
        sortField: null,
        sortDirection: "asc",
    })

    // Throttling ref to prevent excessive updates
    const throttleRef = useRef<NodeJS.Timeout | null>(null)

    // Memoized derived state
    const filteredTransactions = useMemo(() => {
        const filtered = filterAndSortTransactions(transactions, filters)
        console.log('🔍 useTransactions - Filtered transactions:', filtered);
        console.log('🔍 useTransactions - Total transactions:', transactions.length);
        return filtered
    }, [transactions, filters])

    const transactionSummary = useMemo(() => calculateTransactionSummary(filteredTransactions), [filteredTransactions])

    const pagination = useMemo(
        () => calculatePagination(filteredTransactions.length, currentPage, itemsPerPage),
        [filteredTransactions.length, currentPage, itemsPerPage],
    )

    const currentItems = useMemo(
        () => filteredTransactions.slice(pagination.indexOfFirstItem, pagination.indexOfLastItem),
        [filteredTransactions, pagination.indexOfFirstItem, pagination.indexOfLastItem],
    )

    // Get selected IDs for current page only (for UI display)
    const currentPageSelectedIds = useMemo(() => {
        return currentItems
            .filter((transaction) => globalSelectedIds.has(transaction.id))
            .map((transaction) => transaction.id)
    }, [currentItems, globalSelectedIds])

    // Calculate totals for selected transactions across all pages
    const selectedTransactionsSummary = useMemo(() => {
        const selectedTransactions = transactions.filter((transaction) => globalSelectedIds.has(transaction.id))

        const totalIncome = selectedTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
        const totalExpense = selectedTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

        return {
            selectedTransactions,
            totalIncome,
            totalExpense,
            netAmount: totalIncome - totalExpense,
            count: selectedTransactions.length,
        }
    }, [transactions, globalSelectedIds])

    const hasActiveFilters = useMemo(
        () =>
            filters.searchTerm !== "" ||
            filters.typeFilter !== "all" ||
            filters.providerFilter !== "all" ||
            filters.sortField !== null,
        [filters],
    )

    // Helper function to convert string to PaymentMethod enum
    const getPaymentMethod = useCallback((paymentMethod: string | PaymentMethod): PaymentMethod => {
        if (typeof paymentMethod === "string") {
            const upperMethod = paymentMethod.toUpperCase()
            if (Object.values(PaymentMethod).includes(upperMethod as PaymentMethod)) {
                return upperMethod as PaymentMethod
            }
            return PaymentMethod.CASH
        }
        return paymentMethod
    }, [])

    // Fetch transactions
    const fetchTransactions = useCallback(async () => {
        try {
            setLoading(true)
            setRefreshing(true)
            const data = await fetchAvailableTransactions(token)
            console.log('📦 useTransactions - Fetched transactions:', data);
            console.log('📦 useTransactions - Sample expense with provider:', data.find(t => t.type === 'expense'));
            setTransactions(data)
        } catch (error) {
            console.error("Error loading transactions:", error)
        } finally {
            setLoading(false)
            setTimeout(() => setRefreshing(false), 500)
        }
    }, [token])

    // Initial fetch
    useEffect(() => {
        console.log('🚀 useTransactions - Fetching with token:', token ? 'Token exists' : 'NO TOKEN');
        fetchTransactions()
    }, [fetchTransactions])

    // Store onSelect callback in ref to avoid re-running effect
    const onSelectRef = useRef(onSelect)
    useEffect(() => {
        onSelectRef.current = onSelect
    }, [onSelect])

    // Convert Set to string for stable dependency comparison
    const selectedIdsKey = useMemo(() => {
        return Array.from(globalSelectedIds).sort().join(',')
    }, [globalSelectedIds])

    // Notify parent component when selection changes (throttled)
    useEffect(() => {
        const selectedTransactions: SelectedTransaction[] = selectedTransactionsSummary.selectedTransactions.map(
            (transaction) => ({
                id: transaction.id,
                amount: transaction.amount,
                baseAmount: transaction.baseAmount,
                gpsAmount: transaction.gpsAmount,
                type: transaction.type,
                description: transaction.description,
                date: transaction.date,
                provider: transaction.provider,
                paymentMethod: getPaymentMethod(transaction.paymentMethod),
                reference: transaction.reference || "",
            }),
        )

        console.log('🎯 useTransactions - Mapped selected transactions:', selectedTransactions);
        console.log('🎯 useTransactions - Provider info:', selectedTransactions.map(t => ({
            id: t.id,
            type: t.type,
            provider: t.provider
        })));

        // Call onSelect directly with throttling handled internally
        if (throttleRef.current) {
            clearTimeout(throttleRef.current)
        }

        throttleRef.current = setTimeout(() => {
            onSelectRef.current?.(selectedTransactions)
        }, 50)

        return () => {
            if (throttleRef.current) {
                clearTimeout(throttleRef.current)
            }
        }
    }, [selectedIdsKey, selectedTransactionsSummary.selectedTransactions, getPaymentMethod])

    // Filter handlers with throttling
    const handleSearchChange = useCallback((value: string) => {
        setFilters((prev) => ({ ...prev, searchTerm: value }))
        setCurrentPage(1)
    }, [])

    const handleTypeFilterChange = useCallback((value: string) => {
        setFilters((prev) => ({ ...prev, typeFilter: value }))
        setCurrentPage(1)
    }, [])

    const handleProviderFilterChange = useCallback((value: string) => {
        setFilters((prev) => ({ ...prev, providerFilter: value }))
        setCurrentPage(1)
    }, [])

    const handleSort = useCallback((field: SortField) => {
        setFilters((prev) => ({
            ...prev,
            sortField: field,
            sortDirection: prev.sortField === field && prev.sortDirection === "asc" ? "desc" : "asc",
        }))
    }, [])

    const resetFilters = useCallback(() => {
        setFilters({
            searchTerm: "",
            typeFilter: "all",
            providerFilter: "all",
            sortField: null,
            sortDirection: "asc",
        })
        setCurrentPage(1)
    }, [])

    // Selection handlers
    const handleSelection = useCallback(
        (id: string, checked: boolean) => {
            if (checked) {
                const currentTransaction = transactions.find((t) => t.id === id)

                if (globalSelectedIds.size > 0 && currentTransaction) {
                    const firstSelectedTransaction = transactions.find((t) => globalSelectedIds.has(t.id))
                    
                    if (firstSelectedTransaction && currentTransaction.provider?.id !== firstSelectedTransaction.provider?.id) {
                        // Provider mismatch validation
                        setCurrentProviderName(formatProviderName(firstSelectedTransaction.provider?.name))
                        setAttemptedProviderName(formatProviderName(currentTransaction.provider?.name))
                        setShowProviderMismatchDialog(true)
                        return
                    }
                }

                setGlobalSelectedIds((prev) => {
                    const newSet = new Set(prev)
                    newSet.add(id)
                    return newSet
                })
            } else {
                setGlobalSelectedIds((prev) => {
                    const newSet = new Set(prev)
                    newSet.delete(id)
                    return newSet
                })
            }
        },
        [transactions, globalSelectedIds],
    )

    const handleSelectAll = useCallback(
        (checked: boolean) => {
            if (checked) {
                setGlobalSelectedIds((prev) => {
                    const newSet = new Set(prev)
                    currentItems.forEach((transaction) => {
                        newSet.add(transaction.id)
                    })
                    return newSet
                })
            } else {
                setGlobalSelectedIds((prev) => {
                    const newSet = new Set(prev)
                    currentItems.forEach((transaction) => {
                        newSet.delete(transaction.id)
                    })
                    return newSet
                })
            }
        },
        [currentItems],
    )

    const handleSelectAllFiltered = useCallback(
        (checked: boolean) => {
            if (checked) {
                setGlobalSelectedIds((prev) => {
                    const newSet = new Set(prev)
                    filteredTransactions.forEach((transaction) => {
                        newSet.add(transaction.id)
                    })
                    return newSet
                })
            } else {
                setGlobalSelectedIds((prev) => {
                    const newSet = new Set(prev)
                    filteredTransactions.forEach((transaction) => {
                        newSet.delete(transaction.id)
                    })
                    return newSet
                })
            }
        },
        [filteredTransactions],
    )

    const clearAllSelections = useCallback(() => {
        setGlobalSelectedIds(new Set())
    }, [])

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page)
    }, [])

    return {
        // Data
        transactions,
        filteredTransactions,
        currentItems,
        loading,
        refreshing,

        // Selection
        selectedIds: currentPageSelectedIds,
        globalSelectedIds,
        selectedCount: selectedTransactionsSummary.count,
        selectedSummary: selectedTransactionsSummary,

        // Summary
        totalIncome: transactionSummary.totalIncome,
        totalExpense: transactionSummary.totalExpense,
        netAmount: transactionSummary.netAmount,

        // Filters
        filters,
        hasActiveFilters,

        // Pagination
        currentPage,
        totalPages: pagination.totalPages,
        indexOfFirstItem: pagination.indexOfFirstItem,
        indexOfLastItem: pagination.indexOfLastItem,
        totalItems: filteredTransactions.length,

        // Dialog
        showProviderMismatchDialog,
        currentProviderName,
        attemptedProviderName,

        // Actions
        fetchTransactions,
        handleSearchChange,
        handleTypeFilterChange,
        handleProviderFilterChange,
        handleSort,
        resetFilters,
        handleSelection,
        handleSelectAll,
        handleSelectAllFiltered,
        clearAllSelections,
        handlePageChange,
        setShowProviderMismatchDialog,
    }
}
