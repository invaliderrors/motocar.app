"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/useToast"
import { CashFlowService } from "@/lib/services/cash-flow.service"
import type { CashFlowRule, RuleQueryDto } from "@/lib/types/cash-flow"

export function useRules(initialQuery?: RuleQueryDto) {
  const [rules, setRules] = useState<CashFlowRule[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [query, setQuery] = useState<RuleQueryDto>(initialQuery || { page: 1, limit: 50 })
  const { toast } = useToast()

  const fetchRules = useCallback(async () => {
    try {
      const isRefresh = rules.length > 0
      if (isRefresh) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const response = await CashFlowService.getRules(query)
      setRules(response.data)
      setTotalItems(response.pagination.total)
      setTotalPages(response.pagination.totalPages)
    } catch (error: any) {
      console.error("Error fetching rules:", error)
      toast({
        variant: "destructive",
        title: "Error al cargar reglas",
        description: error.response?.data?.message || "No se pudieron obtener las reglas del servidor",
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [query, toast])

  useEffect(() => {
    fetchRules()
  }, [fetchRules])

  const updateQuery = useCallback((newQuery: Partial<RuleQueryDto>) => {
    setQuery((prev) => ({ ...prev, ...newQuery }))
  }, [])

  const handleRuleCreated = useCallback(() => {
    fetchRules()
  }, [fetchRules])

  const refetch = useCallback(() => {
    fetchRules()
  }, [fetchRules])

  return {
    rules,
    loading,
    refreshing,
    totalItems,
    totalPages,
    query,
    updateQuery,
    refetch,
    handleRuleCreated,
  }
}
