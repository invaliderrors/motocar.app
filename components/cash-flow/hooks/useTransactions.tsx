"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/useToast"
import { CashFlowService } from "@/lib/services/cash-flow.service"
import type { CashFlowTransaction, TransactionQueryDto } from "@/lib/types/cash-flow"

export function useTransactions(initialQuery?: TransactionQueryDto) {
  const [transactions, setTransactions] = useState<CashFlowTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [query, setQuery] = useState<TransactionQueryDto>(initialQuery || { page: 1, limit: 20 })
  const { toast } = useToast()

  const fetchTransactions = useCallback(async () => {
    try {
      const isRefresh = transactions.length > 0
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const response = await CashFlowService.getTransactions(query)
      setTransactions(response.data)
      setTotalItems(response.pagination.total)
      setTotalPages(response.pagination.totalPages)
    } catch (error: any) {
      console.error("Error fetching transactions:", error)
      toast({
        variant: "destructive",
        title: "Error al cargar transacciones",
        description: error.response?.data?.message || "No se pudieron obtener las transacciones del servidor",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [query, toast])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const updateQuery = useCallback((newQuery: Partial<TransactionQueryDto>) => {
    setQuery((prev) => ({ ...prev, ...newQuery }))
  }, [])

  const handleTransactionCreated = useCallback(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const refetch = useCallback(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return {
    transactions,
    loading,
    refreshing,
    totalItems,
    totalPages,
    query,
    updateQuery,
    refetch,
    handleTransactionCreated,
  }
}
