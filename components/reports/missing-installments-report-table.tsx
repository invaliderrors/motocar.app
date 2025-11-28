"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { 
  AlertTriangle, 
  Calendar, 
  Clock, 
  DollarSign, 
  Phone, 
  User, 
  Car,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  FileSpreadsheet,
  FileText,
  Download,
  Loader2,
} from "lucide-react"
import type { MissingInstallmentData } from "@/lib/services/reports.service"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"

interface MissingInstallmentsReportTableProps {
  data: MissingInstallmentData[]
  onExport?: (format: "excel" | "pdf" | "csv", providerFilter?: string) => void
  includeArchived?: boolean
  onIncludeArchivedChange?: (value: boolean) => void
}

type SortField = "userName" | "daysSinceLastPayment" | "missedInstallments" | "totalMissedAmount"
type SortDirection = "asc" | "desc"

export function MissingInstallmentsReportTable({ data, onExport, includeArchived: externalIncludeArchived, onIncludeArchivedChange }: MissingInstallmentsReportTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [sortField, setSortField] = useState<SortField>("daysSinceLastPayment")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [providerFilter, setProviderFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [includeArchived, setIncludeArchived] = useState<boolean>(false)
  const tableContainerRef = useRef<HTMLDivElement>(null)

  // Helper function to calculate business days (excluding Sundays)
  const calculateBusinessDays = (startDate: Date, endDate: Date): number => {
    let count = 0
    const currentDate = new Date(startDate)
    currentDate.setHours(0, 0, 0, 0)
    
    const end = new Date(endDate)
    end.setHours(0, 0, 0, 0)
    
    while (currentDate <= end) {
      // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const dayOfWeek = currentDate.getDay()
      
      // Only count if it's not Sunday (0)
      if (dayOfWeek !== 0) {
        count++
      }
      
      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    // Subtract 1 to get the difference (not inclusive count)
    return Math.max(0, count - 1)
  }

  // Recalculate days excluding Sundays for display
  const getAdjustedDaysSinceLastPayment = (item: MissingInstallmentData): number => {
    if (!item.lastPaymentDate) {
      // Use the provided value as fallback
      return item.daysSinceLastPayment
    }
    
    try {
      const lastPaymentDate = new Date(item.lastPaymentDate)
      const today = new Date()
      return calculateBusinessDays(lastPaymentDate, today)
    } catch {
      return item.daysSinceLastPayment
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Sin pagos"
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getDaysBadgeVariant = (days: number): "destructive" | "default" | "secondary" => {
    if (days > 60) return "destructive"
    if (days > 30) return "default"
    return "secondary"
  }

  const getDaysColor = (days: number) => {
    if (days > 60) return "text-red-600"
    if (days > 30) return "text-amber-600"
    return "text-blue-600"
  }

  const getStatusBadgeVariant = (status: string): "default" | "destructive" | "secondary" => {
    switch (status) {
      case "ACTIVE":
        return "default"
      case "DEFAULTED":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getPaymentFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      DAILY: "Diario",
      WEEKLY: "Semanal",
      BIWEEKLY: "Quincenal",
      MONTHLY: "Mensual",
    }
    return labels[frequency] || frequency
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Get unique providers from data
  const uniqueProviders = useMemo(() => {
    const providerMap = new Map<string, { id: string | null; name: string }>()
    
    data.forEach(item => {
      if (item.providerName && item.providerId) {
        providerMap.set(item.providerId, {
          id: item.providerId,
          name: item.providerName
        })
      }
    })
    
    return Array.from(providerMap.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [data])

  // Filter and sort data
  const sortedData = useMemo(() => {
    let filtered = [...data]

    // Apply provider filter
    if (providerFilter !== "all") {
      filtered = filtered.filter(item => item.providerId === providerFilter)
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(item => 
        item.userName.toLowerCase().includes(searchLower) ||
        item.userDocument.toLowerCase().includes(searchLower) ||
        item.userPhone.toLowerCase().includes(searchLower) ||
        item.vehicle.toLowerCase().includes(searchLower) ||
        item.plate.toLowerCase().includes(searchLower) ||
        (item.contractNumber && item.contractNumber.toLowerCase().includes(searchLower))
      )
    }

    // Sort filtered data
    const sorted = filtered.sort((a, b) => {
      let aValue: number | string = 0
      let bValue: number | string = 0

      switch (sortField) {
        case "userName":
          aValue = a.userName.toLowerCase()
          bValue = b.userName.toLowerCase()
          break
        case "daysSinceLastPayment":
          aValue = a.daysSinceLastPayment
          bValue = b.daysSinceLastPayment
          break
        case "missedInstallments":
          aValue = a.missedInstallments
          bValue = b.missedInstallments
          break
        case "totalMissedAmount":
          aValue = a.totalMissedAmount
          bValue = b.totalMissedAmount
          break
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return sorted
  }, [data, sortField, sortDirection, providerFilter, searchTerm])

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = sortedData.slice(startIndex, endIndex)

  // Reset to page 1 if current page exceeds total pages (can happen when itemsPerPage changes)
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [currentPage, totalPages])

  const goToFirstPage = () => setCurrentPage(1)
  const goToLastPage = () => setCurrentPage(totalPages)
  const goToNextPage = () => setCurrentPage(Math.min(currentPage + 1, totalPages))
  const goToPrevPage = () => setCurrentPage(Math.max(currentPage - 1, 1))

  const handleProviderChange = (value: string) => {
    setProviderFilter(value)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setProviderFilter("all")
    setSearchTerm("")
    if (onIncludeArchivedChange) {
      onIncludeArchivedChange(false)
    }
    setCurrentPage(1)
  }

  const hasActiveFilters = providerFilter !== "all" || searchTerm !== "" || (externalIncludeArchived ?? false)

  const handleIncludeArchivedChange = (checked: boolean) => {
    if (onIncludeArchivedChange) {
      onIncludeArchivedChange(checked)
    }
    setCurrentPage(1)
  }

  const handleExport = (format: "excel" | "pdf" | "csv") => {
    if (onExport) {
      // Pass the provider ID (not name) to the export function if a specific provider is selected
      const exportProviderFilter = providerFilter !== "all" ? providerFilter : undefined
      onExport(format, exportProviderFilter)
    }
  }

  // Get provider name from ID for display
  const getProviderNameById = (id: string) => {
    const provider = uniqueProviders.find(p => p.id === id)
    return provider?.name || id
  }

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {children}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  )

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Clientes con Cuotas Pendientes
            </CardTitle>
            <CardDescription className="mt-1">
              {sortedData.length} {sortedData.length === 1 ? "cliente" : "clientes"} con pagos atrasados
              {providerFilter !== "all" && ` - ${getProviderNameById(providerFilter)}`}
            </CardDescription>
          </div>
          
          {/* Export Buttons */}
          {onExport && data.length > 0 && (
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport("excel")}
                      className="h-8 px-3"
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-1.5 text-green-600" />
                      Excel
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Exportar a Excel{providerFilter !== "all" ? ` (${getProviderNameById(providerFilter)})` : ""}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport("pdf")}
                      className="h-8 px-3"
                    >
                      <FileText className="h-4 w-4 mr-1.5 text-red-600" />
                      PDF
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Exportar a PDF{providerFilter !== "all" ? ` (${getProviderNameById(providerFilter)})` : ""}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport("csv")}
                      className="h-8 px-3"
                    >
                      <Download className="h-4 w-4 mr-1.5 text-blue-600" />
                      CSV
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Exportar a CSV{providerFilter !== "all" ? ` (${getProviderNameById(providerFilter)})` : ""}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>

        {/* Filters Section */}
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1">
            <Input
              placeholder="Buscar por cliente, documento, teléfono, vehículo..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="h-9"
            />
          </div>
          
          {uniqueProviders.length > 0 && (
            <Select value={providerFilter} onValueChange={handleProviderChange}>
              <SelectTrigger className="w-[200px] h-9">
                <SelectValue placeholder="Todos los proveedores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los proveedores</SelectItem>
                {uniqueProviders.map((provider) => (
                  <SelectItem key={provider.id || 'unknown'} value={provider.id || 'unknown'}>
                    {provider.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {onIncludeArchivedChange && (
            <div className="flex items-center gap-2 px-3 py-1.5 border rounded-md bg-background">
              <Switch
                id="include-archived"
                checked={externalIncludeArchived ?? false}
                onCheckedChange={handleIncludeArchivedChange}
                className="h-5"
              />
              <Label htmlFor="include-archived" className="text-sm cursor-pointer whitespace-nowrap">
                Incluir archivados
              </Label>
            </div>
          )}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-9 px-3"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent ref={tableContainerRef} className="flex-1 overflow-hidden p-0 flex flex-col">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4 mb-4">
              <AlertTriangle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">¡Excelente!</h3>
            <p className="text-sm">No hay clientes con cuotas pendientes</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur-sm z-10">
                  <TableRow>
                    <TableHead className="w-[200px]">
                      <SortButton field="userName">Cliente</SortButton>
                    </TableHead>
                    <TableHead className="w-[130px]">Contacto</TableHead>
                    <TableHead className="w-[180px]">Vehículo</TableHead>
                    <TableHead className="w-[140px]">Proveedor</TableHead>
                    <TableHead className="w-[120px]">Último Pago</TableHead>
                    <TableHead className="w-[100px]">
                      <SortButton field="daysSinceLastPayment">Días</SortButton>
                    </TableHead>
                    <TableHead className="w-[120px]">
                      <SortButton field="missedInstallments">Cuotas</SortButton>
                    </TableHead>
                    <TableHead className="w-[140px]">
                      <SortButton field="totalMissedAmount">Monto</SortButton>
                    </TableHead>
                    <TableHead className="w-[100px]">Frecuencia</TableHead>
                    <TableHead className="w-[120px]">Progreso</TableHead>
                    <TableHead className="w-[100px]">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.map((item, index) => {
                    const progress = item.totalInstallments > 0 
                      ? Math.round((item.paidInstallments / item.totalInstallments) * 100)
                      : 0

                    const isEven = index % 2 === 0
                    
                    // Calculate adjusted days excluding Sundays
                    const adjustedDays = getAdjustedDaysSinceLastPayment(item)

                    return (
                      <TableRow 
                        key={item.loanId} 
                        className={`hover:bg-muted/50 transition-colors ${isEven ? "bg-muted/20" : ""}`}
                      >
                        <TableCell>
                          <div className="flex items-start gap-2">
                            <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                              <User className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div>
                              <div className="font-semibold text-sm">{item.userName}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                #{item.contractNumber || "N/A"}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5">
                                {item.userDocument}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span>{item.userPhone}</span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-start gap-2">
                            <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-1.5 mt-0.5">
                              <Car className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <div className="text-sm font-medium">{item.vehicle}</div>
                              <Badge variant="outline" className="text-[10px] mt-1">
                                {item.plate}
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          {item.providerName ? (
                            <Badge variant="secondary" className="text-xs">
                              {item.providerName}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">Sin proveedor</span>
                          )}
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1 text-xs">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span>{formatDate(item.lastPaymentDate)}</span>
                            </div>
                            {item.lastPaymentWasLate && (
                              <Badge variant="destructive" className="text-[10px] w-fit">
                                Atrasado
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge 
                            variant={getDaysBadgeVariant(adjustedDays)}
                            className="font-semibold"
                          >
                            <Clock className="h-3 w-3 mr-1" />
                            {adjustedDays}d
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-2">
                                  <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-1.5">
                                    <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-bold text-red-600">
                                      {item.missedInstallments}
                                    </span>
                                    {item.skippedDates > 0 && (
                                      <span className="text-[10px] text-blue-600 dark:text-blue-400">
                                        -{item.skippedDates} excl.
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </TooltipTrigger>
                              {item.skippedDates > 0 && (
                                <TooltipContent>
                                  <p>{item.skippedDates} fechas excluidas por novedades</p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5">
                              <DollarSign className="h-3.5 w-3.5 text-red-600" />
                              <span className="text-sm font-bold text-red-600">
                                {formatCurrency(item.totalMissedAmount)}
                              </span>
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {formatCurrency(item.installmentAmount)} + {formatCurrency(item.gpsAmount)}
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {getPaymentFrequencyLabel(item.paymentFrequency)}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-medium">{progress}%</span>
                              <span className="text-muted-foreground">
                                {item.paidInstallments}/{item.totalInstallments}
                              </span>
                            </div>
                            <Progress value={progress} className="h-1.5" />
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(item.loanStatus)} className="text-xs">
                            {item.loanStatus === "ACTIVE" ? "Activo" : "Mora"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="border-t bg-muted/30 px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Mostrando <span className="font-medium">{startIndex + 1}</span> a{" "}
                  <span className="font-medium">{Math.min(endIndex, sortedData.length)}</span> de{" "}
                  <span className="font-medium">{sortedData.length}</span> registros
                  <span className="text-xs ml-2 opacity-70">
                    ({itemsPerPage} por página)
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToFirstPage}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevPage}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">
                      Página {currentPage} de {totalPages}
                    </span>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToLastPage}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
