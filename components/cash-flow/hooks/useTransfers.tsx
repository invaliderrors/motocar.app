"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/useToast"
import { CashFlowService } from "@/lib/services/cash-flow.service"
import type { CashFlowTransfer, TransferQueryDto } from "@/lib/types/cash-flow"

export function useTransfers(initialQuery?: TransferQueryDto) {
  const [transfers, setTransfers] = useState<CashFlowTransfer[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [query, setQuery] = useState<TransferQueryDto>(initialQuery || { page: 1, limit: 20 })
  const { toast } = useToast()

  const fetchTransfers = useCallback(async () => {
    try {
      const isRefresh = transfers.length > 0
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const response = await CashFlowService.getTransfers(query)
      setTransfers(response.data)
      setTotalItems(response.pagination.total)
      setTotalPages(response.pagination.totalPages)
    } catch (error: any) {
      console.error("Error fetching transfers:", error)
      toast({
        variant: "destructive",
        title: "Error al cargar transferencias",
        description: error.response?.data?.message || "No se pudieron obtener las transferencias del servidor",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [query, toast])

  useEffect(() => {
    fetchTransfers()
  }, [fetchTransfers])

  const updateQuery = useCallback((newQuery: Partial<TransferQueryDto>) => {
    setQuery((prev) => ({ ...prev, ...newQuery }))
  }, [])

  const handleTransferCreated = useCallback(() => {
    fetchTransfers()
  }, [fetchTransfers])

  const refetch = useCallback(() => {
    fetchTransfers()
  }, [fetchTransfers])

  return {
    transfers,
    loading,
    refreshing,
    totalItems,
    totalPages,
    query,
    updateQuery,
    refetch,
    handleTransferCreated,
  }
}
