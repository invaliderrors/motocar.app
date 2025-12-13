"use client"

import { Table, TableBody } from "@/components/ui/table"
import { useAuditLogTable } from "./hooks/useAuditLogTable"
import { AuditLogTableControls } from "./components/table/AuditLogTableControls"
import { AuditLogTableHeaders } from "./components/table/AuditLogTableHeaders"
import { AuditLogTableSkeleton } from "./components/table/AuditLogTableSkeleton"
import { AuditLogTableEmptyState } from "./components/table/AuditLogTableEmptyState"
import { AuditLogTableRow } from "./components/table/AuditLogTableRow"
import { AuditLogTablePagination } from "./components/table/AuditLogTablePagination"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function AuditLogTable() {
  const {
    logs,
    loading,
    error,
    filters,
    handleFilterChange,
    handlePageChange,
    refreshData,
    exportToCSV,
    totalItems,
    totalPages,
    currentPage,
    itemsPerPage,
  } = useAuditLogTable()

  const hasFilters = Boolean(
    filters.action || 
    filters.entity || 
    filters.entityId || 
    filters.startDate || 
    filters.endDate
  )

  const clearFilters = () => {
    handleFilterChange({
      action: undefined,
      entity: undefined,
      entityId: undefined,
      startDate: undefined,
      endDate: undefined,
    })
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <AuditLogTableControls
        filters={filters}
        onFilterChange={handleFilterChange}
        onRefresh={refreshData}
        onExport={exportToCSV}
      />

      <div className="flex-1 rounded-lg border border-border overflow-hidden shadow-md min-h-0">
        <div className="h-full overflow-auto">
          <Table>
            <AuditLogTableHeaders />
            <TableBody>
              {loading ? (
                <AuditLogTableSkeleton />
              ) : logs.length === 0 ? (
                <AuditLogTableEmptyState hasFilters={hasFilters} onClearFilters={clearFilters} />
              ) : (
                logs.map((log, index) => (
                  <AuditLogTableRow
                    key={`audit-log-${log.id}-${index}`}
                    log={log}
                    index={index}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {!loading && totalItems > 0 && (
        <AuditLogTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}
