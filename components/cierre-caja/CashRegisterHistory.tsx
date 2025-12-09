"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, RefreshCw, Wallet, FileSpreadsheet } from "lucide-react"
import { FilePen as FilePdf } from "lucide-react"
import { CashRegisterDetailModal } from "./CashRegisterDetailModal"
import { CashRegisterTable } from "./history/components/CashRegisterTable"
import { FiltersSection } from "./history/components/FilterSection"
import { PaginationControls } from "./history/components/PaginationControls"
import { SummaryCards } from "./history/components/SummaryCard"
import { useCashRegisterData } from "./history/hooks/useCashRegisterData"
import { useCashRegisterFilters } from "./history/hooks/useCashRegisterFilter"
import { usePrintPdf } from "./history/hooks/usePrintPDF"
import { useExport } from "./history/hooks/useExport"
import { filterRegisters, calculateSummaryStats } from "./history/utils"
import type { CashRegisterDisplay } from "@/lib/types"
import { useToast } from "@/hooks/useToast"
import { useResourcePermissions } from "@/hooks/useResourcePermissions"
import { Resource } from "@/lib/types/permissions"

export function CashRegisterHistory() {
  const [selectedRegister, setSelectedRegister] = useState<CashRegisterDisplay | null>(null)
  const { registers, loading, refreshing, refetch } = useCashRegisterData()
  const { filters, pagination, updateFilter, updatePagination, resetFilters } = useCashRegisterFilters()
  const { handlePrint, isGenerating } = usePrintPdf()
  const { exportToCSV, exportToPDF, isExporting } = useExport()
  const { toast } = useToast()

  // Permissions (from main branch)
  const closingPermissions = useResourcePermissions(Resource.CLOSING)
  const reportPermissions = useResourcePermissions(Resource.REPORT)

  // Data derivations (single source of truth)
  const filteredRegisters = filterRegisters(registers, filters)
  const summaryStats = calculateSummaryStats(filteredRegisters)
  const itemsPerPageNumber = Number.parseInt(pagination.itemsPerPage)
  const indexOfLastItem = pagination.currentPage * itemsPerPageNumber
  const indexOfFirstItem = indexOfLastItem - itemsPerPageNumber
  const currentItems = filteredRegisters.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredRegisters.length / itemsPerPageNumber)

  const handleExportCSV = () => {
    try {
      exportToCSV(filteredRegisters)
      toast({
        title: "Exportación exitosa",
        description: `Se exportaron ${filteredRegisters.length} registros a CSV.`,
      })
    } catch {
      toast({
        title: "Error al exportar",
        description: "No se pudo exportar a CSV. Intente nuevamente.",
        variant: "destructive",
      })
    }
  }

  const handleExportPDF = () => {
    try {
      exportToPDF(filteredRegisters)
      toast({
        title: "Exportación exitosa",
        description: `Se exportaron ${filteredRegisters.length} registros a PDF.`,
      })
    } catch {
      toast({
        title: "Error al exportar",
        description: "No se pudo exportar a PDF. Intente nuevamente.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="shadow-md bg-card border-border">
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 sm:gap-4">
          <div>
            <CardTitle className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-2">
              <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Historial de Cierres de Caja
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Consulta todos los cierres registrados. "Fecha Cierre" indica el día de las transacciones, "Registrado"
              muestra cuándo se creó el cierre.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              disabled={refreshing}
              className="h-8 sm:h-9 gap-1 sm:gap-1.5 flex-1 md:flex-initial text-xs sm:text-sm bg-transparent"
            >
              <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${refreshing ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </Button>

            {(reportPermissions.canCreate || closingPermissions.canCreate) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 sm:h-9 flex-1 md:flex-initial text-xs sm:text-sm bg-transparent"
                    disabled={isExporting || filteredRegisters.length === 0}
                  >
                    <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                    <span className="hidden sm:inline">Exportar</span>
                    <span className="sm:hidden">Export</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Opciones de exportación</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleExportCSV}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Exportar a Excel (CSV)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportPDF}>
                    <FilePdf className="h-4 w-4 mr-2" />
                    Exportar a PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 md:space-y-6 px-3 sm:px-4 md:px-6">
        <FiltersSection filters={filters} onFilterChange={updateFilter} onResetFilters={resetFilters} />

        <SummaryCards
          totalIncome={summaryStats.totalIncome}
          totalExpense={summaryStats.totalExpense}
          totalBalance={summaryStats.totalBalance}
          totalPayments={summaryStats.totalPayments}
          totalExpenses={summaryStats.totalExpenses}
        />

        <CashRegisterTable
          data={currentItems}
          loading={loading}
          onViewDetails={setSelectedRegister}
          onPrint={handlePrint}
          isGenerating={isGenerating}
        />

        <PaginationControls
          currentPage={pagination.currentPage}
          totalPages={totalPages}
          itemsPerPage={pagination.itemsPerPage}
          totalItems={filteredRegisters.length}
          onPageChange={(page) => updatePagination("currentPage", page)}
          onItemsPerPageChange={(value) => updatePagination("itemsPerPage", value)}
        />
      </CardContent>

      {selectedRegister && (
        <CashRegisterDetailModal
          open={!!selectedRegister}
          onClose={() => setSelectedRegister(null)}
          cashRegister={selectedRegister.raw}
        />
      )}
    </Card>
  )
}
