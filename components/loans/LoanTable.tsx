"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DollarSign, User, Bike, CalendarDays, Wallet, Activity, Settings, Newspaper } from "lucide-react"
import { LoanTableControls } from "./components/LoanTableControls"
import { LoanTableDialogs } from "./components/LoanTableDialogs"
import { LoanTablePagination } from "./components/LoanTablePagination"
import { LoanTableRow } from "./components/LoanTableRow"
import { useLoanTable } from "./hooks/useLoanTable"

export function LoanTable() {
  const {
    loading,
    newsSummary,
    searchTerm,
    currentPage,
    itemsPerPage,
    printingContract,
    printProgress,
    deleteDialogOpen,
    archiveDialogOpen,
    showArchived,
    statusFilter,
    totalItems,
    totalPages,
    startIndex,   
    endIndex,
    currentItems,
    setSearchTerm,
    setCurrentPage,
    setItemsPerPage,
    setPrintingContract,
    setDeleteDialogOpen,
    setArchiveDialogOpen,
    setShowArchived,
    setStatusFilter,
    handleDelete,
    handleArchive,
    confirmDelete,
    confirmArchive,
    handlePrintContract,
    refreshData,
    exportToCSV,
  } = useLoanTable()

  return (
    <div className="h-full flex flex-col space-y-4">
      <LoanTableControls
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        onPageChange={setCurrentPage}
        showArchived={showArchived}
        onShowArchivedChange={setShowArchived}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onRefresh={refreshData}
        onExportCSV={exportToCSV}
      />

      <div className="flex-1 rounded-lg border border-border overflow-hidden shadow-sm">
        <div className="h-full overflow-auto">
          <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted">
                    <TableHead className="text-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        <span>Cliente</span>
                      </div>
                    </TableHead>
                    <TableHead className="hidden md:table-cell text-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <Bike className="h-4 w-4" />
                        <span>Vehículo</span>
                      </div>
                    </TableHead>
                    <TableHead className="hidden lg:table-cell text-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <Activity className="h-4 w-4" />
                        <span>Estado Vehículo</span>
                      </div>
                    </TableHead>
                    <TableHead className="hidden lg:table-cell text-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <Newspaper className="h-4 w-4" />
                        <span>Novedades</span>
                      </div>
                    </TableHead>
                    <TableHead className="hidden xl:table-cell text-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <Activity className="h-4 w-4" />
                        <span>Reinicios</span>
                      </div>
                    </TableHead>
                    <TableHead className="hidden md:table-cell text-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="h-4 w-4" />
                        <span>Monto Total</span>
                      </div>
                    </TableHead>
                    <TableHead className="hidden lg:table-cell text-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4" />
                        <span>Cuotas</span>
                      </div>
                    </TableHead>
                    <TableHead className="hidden lg:table-cell text-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="h-4 w-4" />
                        <span>Total Abonado</span>
                      </div>
                    </TableHead>
                    <TableHead className="hidden xl:table-cell text-foreground font-medium">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="h-4 w-4" />
                          <span>Fechas</span>
                        </div>
                        <span className="text-xs font-normal text-muted-foreground">Inicio / Fin</span>
                      </div>
                    </TableHead>
                    <TableHead className="hidden xl:table-cell text-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <Wallet className="h-4 w-4" />
                        <span>Deuda Restante</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <Activity className="h-4 w-4" />
                        <span>Estado contrato</span>
                      </div>
                    </TableHead>
                    <TableHead className="text-right text-foreground font-medium">
                      <div className="flex items-center justify-end gap-1.5">
                        <Settings className="h-4 w-4" />
                        <span>Acciones</span>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                      <TableRow
                        key={`skeleton-${index}`}
                        className="border-border hover:bg-muted/50"
                      >
                        <TableCell>
                          <Skeleton className="h-5 w-[150px]" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Skeleton className="h-5 w-[120px]" />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Skeleton className="h-5 w-[100px]" />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Skeleton className="h-5 w-[60px]" />
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          <Skeleton className="h-5 w-[80px]" />
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Skeleton className="h-5 w-[100px]" />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Skeleton className="h-5 w-[80px]" />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Skeleton className="h-5 w-[100px]" />
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          <Skeleton className="h-5 w-[100px]" />
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          <Skeleton className="h-5 w-[100px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-5 w-[80px]" />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                              <Skeleton
                                key={`action-skeleton-${index}-${i}`}
                                className="h-8 w-8 rounded-md"
                              />
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : currentItems.length === 0 ? (
                    <TableRow className="border-border">
                      <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <DollarSign className="h-10 w-10 text-muted-foreground/30" />
                          <p className="text-sm">
                            {showArchived
                              ? "No se encontraron contratos archivados"
                              : "No se encontraron contratos"}
                          </p>
                          {searchTerm && (
                            <Button
                              variant="link"
                              onClick={() => setSearchTerm("")}
                              className="text-primary"
                            >
                              Limpiar búsqueda
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentItems.map((loan, index) => (
                      <LoanTableRow
                        key={`loan-row-${loan.id}-${index}`}
                        loan={loan}
                        index={index}
                        newsSummary={newsSummary[loan.id]}
                        onDelete={handleDelete}
                        onArchive={handleArchive}
                        onPrintContract={handlePrintContract}
                        onStatusUpdated={refreshData}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

      <LoanTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={setCurrentPage}
      />

      <LoanTableDialogs
        printingContract={printingContract}
        printProgress={printProgress}
        deleteDialogOpen={deleteDialogOpen}
        archiveDialogOpen={archiveDialogOpen}
        onPrintingContractChange={setPrintingContract}
        onDeleteDialogChange={setDeleteDialogOpen}
        onArchiveDialogChange={setArchiveDialogOpen}
        onConfirmDelete={confirmDelete}
        onConfirmArchive={confirmArchive}
      />
    </div>
  )
}
