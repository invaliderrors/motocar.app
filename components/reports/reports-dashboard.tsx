"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { DownloadIcon, FileTextIcon, PieChartIcon, BarChart3Icon, TrendingUpIcon, Loader2, FileSpreadsheet } from "lucide-react"
import { LoanReportTable } from "./loan-report-table"
import { PaymentReportTable } from "./payment-report-table"
import { ClientReportTable } from "./client-report-table"
import { MotorcycleReportTable } from "./motorcycle-report-table"
import { VehicleStatusReportTable } from "./vehicle-status-report-table"
import { MissingInstallmentsReportTable } from "./missing-installments-report-table"
import { ReportSummary } from "./report-summary"
import { ReportCharts } from "./report-charts"
import { useReports, type ReportFilters } from "@/hooks/useReports"
import type { DateRange } from "react-day-picker"

export default function ReportsDashboard() {
  const [activeTab, setActiveTab] = useState("prestamos")
  const [clientSubTab, setClientSubTab] = useState<"general" | "missing">("general")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [mounted, setMounted] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState<string>("")
  const [includeArchivedLoans, setIncludeArchivedLoans] = useState(false)

  const {
    loading,
    loanReport,
    paymentReport,
    clientReport,
    vehicleReport,
    vehicleStatusReport,
    missingInstallmentsReport,
    fetchLoanReport,
    fetchPaymentReport,
    fetchClientReport,
    fetchVehicleReport,
    fetchVehicleStatusReport,
    fetchMissingInstallmentsReport,
    fetchAllReports,
    exportReport,
  } = useReports()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Build filters object
  const getFilters = (): ReportFilters => ({
    startDate: dateRange?.from?.toISOString().split("T")[0],
    endDate: dateRange?.to?.toISOString().split("T")[0],
    status: includeArchivedLoans && clientSubTab === "missing" ? "include-archived" : filterStatus,
    search: searchTerm || undefined,
  })

  // Initial load
  useEffect(() => {
    if (mounted) {
      fetchAllReports(getFilters())
    }
  }, [mounted])

  // Fetch report based on active tab
  const handleApplyFilters = () => {
    const filters = getFilters()
    
    switch (activeTab) {
      case "prestamos":
        fetchLoanReport(filters)
        break
      case "pagos":
        fetchPaymentReport(filters)
        break
      case "clientes":
        if (clientSubTab === "missing") {
          fetchMissingInstallmentsReport(filters)
        } else {
          fetchClientReport(filters)
        }
        break
      case "motocicletas":
        fetchVehicleReport(filters)
        break
      case "estado-vehiculos":
        fetchVehicleStatusReport(filters)
        break
    }
  }

  // Export handler
  const handleExport = async (format: "excel" | "pdf" | "csv") => {
    const typeMap = {
      prestamos: "loans" as const,
      pagos: "payments" as const,
      clientes: "clients" as const,
      motocicletas: "vehicles" as const,
      "estado-vehiculos": "vehicle-status" as const,
    }
    
    setIsExporting(true)
    setExportFormat(format.toUpperCase())
    await new Promise(resolve => setTimeout(resolve, 100))
    
    try {
      await exportReport(typeMap[activeTab as keyof typeof typeMap], format, getFilters())
    } finally {
      await new Promise(resolve => setTimeout(resolve, 300))
      setIsExporting(false)
      setExportFormat("")
    }
  }

  // Export handler for missing installments
  const handleMissingInstallmentsExport = async (format: "excel" | "pdf" | "csv", providerFilter?: string) => {
    setIsExporting(true)
    setExportFormat(format.toUpperCase())
    await new Promise(resolve => setTimeout(resolve, 100))
    
    try {
      const filters = getFilters()
      // Add provider filter if specified
      if (providerFilter) {
        filters.provider = providerFilter
      }
      await exportReport("missing-installments", format, filters)
    } finally {
      await new Promise(resolve => setTimeout(resolve, 300))
      setIsExporting(false)
      setExportFormat("")
    }
  }

  // Export handler for vehicle status with status filter
  const handleVehicleStatusExport = async (format: "excel" | "pdf" | "csv", statusFilter: string) => {
    setIsExporting(true)
    setExportFormat(format.toUpperCase())
    await new Promise(resolve => setTimeout(resolve, 100))
    
    try {
      const filters = getFilters()
      // Override status with the current filter from the table
      filters.status = statusFilter
      await exportReport("vehicle-status", format, filters)
    } finally {
      await new Promise(resolve => setTimeout(resolve, 300))
      setIsExporting(false)
      setExportFormat("")
    }
  }

  // Aggregate report data for summary
  const reportData = {
    loans: loanReport || { total: 0, active: 0, completed: 0, defaulted: 0, totalAmount: 0, totalInterest: 0, items: [] },
    payments: paymentReport || { total: 0, onTime: 0, late: 0, totalCollected: 0, pendingCollection: 0, items: [] },
    clients: clientReport || { total: 0, active: 0, inactive: 0, withDefaultedLoans: 0, items: [] },
    motorcycles: vehicleReport || { total: 0, financed: 0, available: 0, totalValue: 0, items: [] },
    vehicleStatus: vehicleStatusReport || { total: 0, inCirculation: 0, inWorkshop: 0, seized: 0, totalValue: 0, items: [] },
    missingInstallments: missingInstallmentsReport || { totalClients: 0, totalMissedPayments: 0, totalMissedAmount: 0, criticalClients: 0, items: [] },
  }

  // Format currency consistently (fixes hydration issue)
  const formatCompactCurrency = (value: number) => {
    if (!mounted) return "$0" // Return simple string during SSR
    return new Intl.NumberFormat("es-CO", { 
      style: "currency", 
      currency: "COP", 
      notation: "compact",
      maximumFractionDigits: 1 
    }).format(value)
  }

  // Don't render stats until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="flex flex-col h-full space-y-3">
        <div className="flex gap-3">
          <Card className="flex-1">
            <CardContent className="p-3">
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
          <Card className="w-[320px]">
            <CardContent className="p-3">
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        </div>
        <Skeleton className="flex-1 w-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Compact Top Bar with Filters and Stats */}
      <div className="flex gap-3">
        {/* Left: Filters */}
        <Card className="flex-1">
          <CardContent className="p-3">
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-[220px] max-w-[280px]">
                <DatePickerWithRange 
                  className="w-full h-9" 
                  date={dateRange}
                  onDateChange={setDateRange}
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-9 w-[140px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {activeTab === "estado-vehiculos" ? (
                    <>
                      <SelectItem value="IN_CIRCULATION">En Circulación</SelectItem>
                      <SelectItem value="IN_WORKSHOP">En Taller</SelectItem>
                      <SelectItem value="SEIZED_BY_PROSECUTOR">Incautado</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="ACTIVE">Activos</SelectItem>
                      <SelectItem value="COMPLETED">Completados</SelectItem>
                      <SelectItem value="DEFAULTED">En mora</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>

              <Input 
                placeholder="Buscar..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
                className="h-9 w-[180px]"
              />

              <Button 
                onClick={handleApplyFilters} 
                disabled={loading}
                size="sm"
                className="h-9 px-4"
              >
                Aplicar
              </Button>

              <div className="h-6 w-px bg-border mx-1" />

              <Button
                variant="outline"
                size="sm"
                className="h-9 px-2.5"
                onClick={() => handleExport("excel")}
                disabled={loading}
                title="Excel"
              >
                <FileTextIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-2.5"
                onClick={() => handleExport("pdf")}
                disabled={loading}
                title="PDF"
              >
                <DownloadIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-2.5"
                onClick={() => handleExport("csv")}
                disabled={loading}
                title="CSV"
              >
                <FileTextIcon className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right: Quick Stats Summary */}
        {loading ? (
          <Card className="w-[320px]">
            <CardContent className="p-3">
              <Skeleton className="h-12 w-full" />
            </CardContent>
          </Card>
        ) : (
          <Card className="w-[320px]">
            <CardContent className="p-3">
              <div className="grid grid-cols-2 gap-2">
                {activeTab === "prestamos" && (
                  <>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase">Total</div>
                      <div className="text-lg font-bold">{reportData.loans.total}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase">Activos</div>
                      <div className="text-lg font-bold text-blue-500">{reportData.loans.active}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase">Financiado</div>
                      <div className="text-sm font-semibold">
                        {formatCompactCurrency(reportData.loans.totalAmount)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase">Mora</div>
                      <div className="text-lg font-bold text-red-500">{reportData.loans.defaulted}</div>
                    </div>
                  </>
                )}
                {activeTab === "pagos" && (
                  <>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase">Total</div>
                      <div className="text-lg font-bold">{reportData.payments.total}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase">A Tiempo</div>
                      <div className="text-lg font-bold text-green-500">{reportData.payments.onTime}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase">Recaudado</div>
                      <div className="text-sm font-semibold">
                        {formatCompactCurrency(reportData.payments.totalCollected)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase">Tardíos</div>
                      <div className="text-lg font-bold text-orange-500">{reportData.payments.late}</div>
                    </div>
                  </>
                )}
                {activeTab === "clientes" && (
                  <>
                    {clientSubTab === "general" ? (
                      <>
                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase">Total</div>
                          <div className="text-lg font-bold">{reportData.clients.total}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase">Activos</div>
                          <div className="text-lg font-bold text-green-500">{reportData.clients.active}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase">Inactivos</div>
                          <div className="text-lg font-bold text-gray-500">{reportData.clients.inactive}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase">En Mora</div>
                          <div className="text-lg font-bold text-red-500">{reportData.clients.withDefaultedLoans}</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase">Clientes</div>
                          <div className="text-lg font-bold text-amber-600">{reportData.missingInstallments.totalClients}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase">Cuotas</div>
                          <div className="text-lg font-bold text-red-600">{reportData.missingInstallments.totalMissedPayments}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase">Monto</div>
                          <div className="text-sm font-semibold text-red-600">
                            {formatCompactCurrency(reportData.missingInstallments.totalMissedAmount)}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-muted-foreground uppercase">Críticos</div>
                          <div className="text-lg font-bold text-red-600">{reportData.missingInstallments.criticalClients}</div>
                        </div>
                      </>
                    )}
                  </>
                )}
                {activeTab === "motocicletas" && (
                  <>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase">Total</div>
                      <div className="text-lg font-bold">{reportData.motorcycles.total}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase">Financiadas</div>
                      <div className="text-lg font-bold text-blue-500">{reportData.motorcycles.financed}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase">Valor Total</div>
                      <div className="text-sm font-semibold">
                        {formatCompactCurrency(reportData.motorcycles.totalValue)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase">Disponibles</div>
                      <div className="text-lg font-bold text-green-500">{reportData.motorcycles.available}</div>
                    </div>
                  </>
                )}
                {activeTab === "estado-vehiculos" && (
                  <>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase">Total</div>
                      <div className="text-lg font-bold">{reportData.vehicleStatus.total}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase">Circulación</div>
                      <div className="text-lg font-bold text-green-500">{reportData.vehicleStatus.inCirculation}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase">Taller</div>
                      <div className="text-lg font-bold text-orange-500">{reportData.vehicleStatus.inWorkshop}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase">Incautados</div>
                      <div className="text-lg font-bold text-red-500">{reportData.vehicleStatus.seized}</div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Main Content Area with Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
        <TabsList className="w-full grid grid-cols-5 h-9 shrink-0">
          <TabsTrigger value="prestamos" className="flex items-center gap-1.5 text-xs">
            <BarChart3Icon className="h-3.5 w-3.5" />
            <span>contratos</span>
          </TabsTrigger>
          <TabsTrigger value="pagos" className="flex items-center gap-1.5 text-xs">
            <TrendingUpIcon className="h-3.5 w-3.5" />
            <span>Pagos</span>
          </TabsTrigger>
          <TabsTrigger value="clientes" className="flex items-center gap-1.5 text-xs">
            <PieChartIcon className="h-3.5 w-3.5" />
            <span>Clientes</span>
          </TabsTrigger>
          <TabsTrigger value="motocicletas" className="flex items-center gap-1.5 text-xs">
            <BarChart3Icon className="h-3.5 w-3.5" />
            <span>Vehículos</span>
          </TabsTrigger>
          <TabsTrigger value="estado-vehiculos" className="flex items-center gap-1.5 text-xs">
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Estado Vehículos</span>
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-3 mt-3 min-h-0">
          {/* Main Table Area - Takes 3 columns */}
          <div className="lg:col-span-3 min-h-0">
            <TabsContent value="prestamos" className="mt-0 h-full">
              {loading ? (
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <Skeleton className="h-full w-full" />
                  </CardContent>
                </Card>
              ) : (
                <LoanReportTable data={reportData?.loans.items || []} />
              )}
            </TabsContent>

            <TabsContent value="pagos" className="mt-0 h-full">
              {loading ? (
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <Skeleton className="h-full w-full" />
                  </CardContent>
                </Card>
              ) : (
                <PaymentReportTable data={reportData?.payments.items || []} />
              )}
            </TabsContent>

            <TabsContent value="clientes" className="mt-0 h-full">
              {loading ? (
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <Skeleton className="h-full w-full" />
                  </CardContent>
                </Card>
              ) : (
                <div className="h-full flex flex-col gap-3">
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant={clientSubTab === "general" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setClientSubTab("general")}
                    >
                      Clientes General
                    </Button>
                    <Button
                      variant={clientSubTab === "missing" ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setClientSubTab("missing")
                        if (!missingInstallmentsReport) {
                          fetchMissingInstallmentsReport(getFilters())
                        }
                      }}
                    >
                      Cuotas Pendientes
                    </Button>
                  </div>
                  <div className="flex-1 min-h-0">
                    {clientSubTab === "general" ? (
                      <ClientReportTable data={reportData?.clients.items || []} />
                    ) : (
                      <MissingInstallmentsReportTable 
                        data={reportData?.missingInstallments.items || []} 
                        onExport={handleMissingInstallmentsExport}
                        includeArchived={includeArchivedLoans}
                        onIncludeArchivedChange={(checked) => {
                          setIncludeArchivedLoans(checked)
                          // Fetch new data when the filter changes
                          setTimeout(() => {
                            fetchMissingInstallmentsReport(getFilters())
                          }, 100)
                        }}
                      />
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="motocicletas" className="mt-0 h-full">
              {loading ? (
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <Skeleton className="h-full w-full" />
                  </CardContent>
                </Card>
              ) : (
                <MotorcycleReportTable data={reportData?.motorcycles.items || []} />
              )}
            </TabsContent>

            <TabsContent value="estado-vehiculos" className="mt-0 h-full">
              {loading ? (
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <Skeleton className="h-full w-full" />
                  </CardContent>
                </Card>
              ) : (
                <VehicleStatusReportTable 
                  data={reportData?.vehicleStatus.items || []} 
                  onExport={handleVehicleStatusExport}
                />
              )}
            </TabsContent>
          </div>

          {/* Charts Sidebar - Takes 1 column */}
          <div className="lg:col-span-1 min-h-0">
            {loading ? (
              <Card className="h-full">
                <CardContent className="pt-6 h-full">
                  <Skeleton className="h-full w-full" />
                </CardContent>
              </Card>
            ) : (
              <ReportCharts data={reportData} activeTab={activeTab} />
            )}
          </div>
        </div>
      </Tabs>

      {/* Export Loading Overlay - Full Page Coverage */}
      {isExporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          
          {/* Loading Dialog */}
          <div className="relative z-10 bg-card border rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 animate-in fade-in zoom-in duration-300">
            <div className="flex flex-col items-center gap-6">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-primary/10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground">
                  Generando Reporte
                </h3>
              </div>

              {/* Spinner Circle */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-4 border-muted flex items-center justify-center">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
                {/* Pulsing ring effect */}
                <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" />
              </div>

              {/* Messages */}
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                  <FileSpreadsheet className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    Formato: {exportFormat}
                  </span>
                </div>
                <p className="text-base font-medium text-foreground">
                  Preparando tu reporte...
                </p>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Por favor espera, esto puede tomar unos segundos dependiendo de la cantidad de datos
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full space-y-2">
                <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-primary/60 animate-pulse rounded-full" 
                    style={{ width: "100%" }} 
                  />
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Procesando información...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
