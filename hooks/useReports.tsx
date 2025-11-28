"use client"

import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/useToast"
import {
  reportsService,
  type LoanReportFilters,
  type PaymentReportFilters,
  type ClientReportFilters,
  type VehicleReportFilters,
  type LoanReportSummary,
  type PaymentReportSummary,
  type ClientReportSummary,
  type VehicleReportSummary,
  type MissingInstallmentReportSummary,
} from "@/lib/services/reports.service"

export interface ReportFilters {
  startDate?: string
  endDate?: string
  status?: string
  search?: string
  provider?: string
}

export function useReports() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [loanReport, setLoanReport] = useState<LoanReportSummary | null>(null)
  const [paymentReport, setPaymentReport] = useState<PaymentReportSummary | null>(null)
  const [clientReport, setClientReport] = useState<ClientReportSummary | null>(null)
  const [vehicleReport, setVehicleReport] = useState<VehicleReportSummary | null>(null)
  const [missingInstallmentsReport, setMissingInstallmentsReport] = useState<MissingInstallmentReportSummary | null>(null)

  // Fetch Loan Report
  const fetchLoanReport = useCallback(async (filters: ReportFilters = {}) => {
    try {
      setLoading(true)
      const data = await reportsService.getLoanReport(filters)
      setLoanReport(data)
    } catch (error: any) {
      console.error("Error fetching loan report:", error)
      toast({
        variant: "destructive",
        title: "Error al cargar reporte",
        description: error.response?.data?.message || "No se pudo cargar el reporte de arrendamientos",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Fetch Payment Report
  const fetchPaymentReport = useCallback(async (filters: ReportFilters = {}) => {
    try {
      setLoading(true)
      const data = await reportsService.getPaymentReport(filters)
      setPaymentReport(data)
    } catch (error: any) {
      console.error("Error fetching payment report:", error)
      toast({
        variant: "destructive",
        title: "Error al cargar reporte",
        description: error.response?.data?.message || "No se pudo cargar el reporte de pagos",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Fetch Client Report
  const fetchClientReport = useCallback(async (filters: ReportFilters = {}) => {
    try {
      setLoading(true)
      const data = await reportsService.getClientReport(filters)
      setClientReport(data)
    } catch (error: any) {
      console.error("Error fetching client report:", error)
      toast({
        variant: "destructive",
        title: "Error al cargar reporte",
        description: error.response?.data?.message || "No se pudo cargar el reporte de clientes",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Fetch Vehicle Report
  const fetchVehicleReport = useCallback(async (filters: ReportFilters = {}) => {
    try {
      setLoading(true)
      const data = await reportsService.getVehicleReport(filters)
      setVehicleReport(data)
    } catch (error: any) {
      console.error("Error fetching vehicle report:", error)
      toast({
        variant: "destructive",
        title: "Error al cargar reporte",
        description: error.response?.data?.message || "No se pudo cargar el reporte de vehículos",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Export Report
  const exportReport = useCallback(async (
    type: "loans" | "payments" | "clients" | "vehicles" | "missing-installments",
    format: "excel" | "pdf" | "csv",
    filters: ReportFilters = {}
  ) => {
    try {
      setLoading(true)
      const blob = await reportsService.exportReport({ type, format, filters })
      
      const typeNames = {
        loans: "arrendamientos",
        payments: "pagos",
        clients: "clientes",
        vehicles: "vehiculos",
        "missing-installments": "cuotas_pendientes",
      }
      
      const timestamp = new Date().toISOString().split("T")[0]
      const filename = `reporte_${typeNames[type]}_${timestamp}.${format === "excel" ? "xlsx" : format}`
      
      reportsService.downloadBlob(blob, filename)
      
      toast({
        title: "Reporte exportado",
        description: `El reporte se ha descargado como ${filename}`,
      })
    } catch (error: any) {
      console.error("Error exporting report:", error)
      toast({
        variant: "destructive",
        title: "Error al exportar",
        description: error.response?.data?.message || "No se pudo exportar el reporte",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Fetch Missing Installments Report
  const fetchMissingInstallmentsReport = useCallback(async (filters: ReportFilters = {}) => {
    try {
      setLoading(true)
      const data = await reportsService.getMissingInstallmentsReport(filters)
      setMissingInstallmentsReport(data)
    } catch (error: any) {
      console.error("Error fetching missing installments report:", error)
      toast({
        variant: "destructive",
        title: "Error al cargar reporte",
        description: error.response?.data?.message || "No se pudo cargar el reporte de cuotas pendientes",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Fetch all reports
  const fetchAllReports = useCallback(async (filters: ReportFilters = {}) => {
    await Promise.all([
      fetchLoanReport(filters),
      fetchPaymentReport(filters),
      fetchClientReport(filters),
      fetchVehicleReport(filters),
      fetchMissingInstallmentsReport(filters),
    ])
  }, [fetchLoanReport, fetchPaymentReport, fetchClientReport, fetchVehicleReport, fetchMissingInstallmentsReport])

  return {
    loading,
    loanReport,
    paymentReport,
    clientReport,
    vehicleReport,
    missingInstallmentsReport,
    fetchLoanReport,
    fetchPaymentReport,
    fetchClientReport,
    fetchVehicleReport,
    fetchMissingInstallmentsReport,
    fetchAllReports,
    exportReport,
  }
}
