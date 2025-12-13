"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { AuditLogService } from "@/lib/services/audit-log.service"
import type { AuditLog, AuditLogFilters, PaginatedAuditLogs } from "@/lib/types/audit-log"

export function useAuditLogTable() {
  const [data, setData] = useState<PaginatedAuditLogs | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AuditLogFilters>({
    page: 1,
    limit: 20,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [filters])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await AuditLogService.getAll(filters)
      setData(result)
    } catch (err) {
      console.error('Error loading audit logs:', err)
      setError('Error al cargar los registros de auditoría')
      toast({
        variant: "destructive",
        title: "Error al cargar registros",
        description: "No se pudieron obtener los registros de auditoría",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters: Partial<AuditLogFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page when filters change
    }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  const refreshData = () => {
    loadData()
  }

  const exportToCSV = () => {
    if (!data || data.data.length === 0) return

    const headers = [
      "Fecha",
      "Usuario",
      "Rol",
      "Acción",
      "Entidad",
      "ID Entidad",
      "IP",
    ]
    const csvRows = [
      headers.join(","),
      ...data.data.map((log) =>
        [
          new Date(log.createdAt).toLocaleString(),
          log.actor?.name || "N/A",
          log.actorRole,
          log.action,
          log.entity,
          log.entityId,
          log.ipAddress || "N/A",
        ].map(v => `"${v}"`).join(","),
      ),
    ]
    const csvContent = csvRows.join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `audit-logs-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    logs: data?.data || [],
    loading,
    error,
    filters,
    handleFilterChange,
    handlePageChange,
    refreshData,
    exportToCSV,
    totalItems: data?.pagination.total || 0,
    totalPages: data?.pagination.totalPages || 0,
    currentPage: data?.pagination.page || 1,
    itemsPerPage: data?.pagination.limit || 20,
  }
}
