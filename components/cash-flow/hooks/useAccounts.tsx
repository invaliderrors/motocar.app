"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/useToast"
import { CashFlowService } from "@/lib/services/cash-flow.service"
import type { CashFlowAccount, AccountQueryDto } from "@/lib/types/cash-flow"

export function useAccounts(query?: AccountQueryDto) {
  const [accounts, setAccounts] = useState<CashFlowAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const { toast } = useToast()

  const fetchAccounts = useCallback(async () => {
    try {
      const isRefresh = accounts.length > 0
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const response = await CashFlowService.getAccounts(query)
      setAccounts(response.data)
      setTotalItems(response.pagination.total)
      setTotalPages(response.pagination.totalPages)
    } catch (error: any) {
      console.error("Error fetching accounts:", error)
      toast({
        variant: "destructive",
        title: "Error al cargar cuentas",
        description: error.response?.data?.message || "No se pudieron obtener las cuentas del servidor",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [query, toast])

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const handleAccountCreated = useCallback(() => {
    fetchAccounts()
  }, [fetchAccounts])

  const refetch = useCallback(() => {
    fetchAccounts()
  }, [fetchAccounts])

  return {
    accounts,
    loading,
    refreshing,
    totalItems,
    totalPages,
    refetch,
    handleAccountCreated,
  }
}
