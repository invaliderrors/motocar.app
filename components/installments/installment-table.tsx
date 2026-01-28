"use client"

import { useState } from "react"
import { Table, TableBody } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react'
import { InstallmentTableHeader } from "./components/table-header"
import { InstallmentRow } from "./components/table-row"
import { LoadingRow } from "./components/loading-row"
import { EmptyState } from "./components/empty-state"
import { SearchFilters } from "./components/search-filters"
import { Pagination } from "./components/pagination"
import { DateRangeSummary } from "./components/date-range"
import { AttachmentDialog } from "./components/dialogs/attachment"
import { DeleteDialog } from "./components/dialogs/delete"
import { SuccessDialog } from "./components/dialogs/success"
import { FilterSummary } from "./components/filter"
import { InstallmentForm } from "./components/forms/installment-form"
import { LoadingOverlay } from "./components/loading-overlay"
import { useInstallmentActions } from "./hooks/useInstallmentActions"
import { useInstallments } from "./hooks/useInstallments"
import { useTableState } from "./hooks/useTableState"
import { NotesDialog } from "./components/dialogs/note"
import { useResourcePermissions } from "@/hooks/useResourcePermissions"
import { Resource } from "@/lib/types/permissions"
import { InstallmentDetailsModal } from "./modals/InstallmentDetailsModal"
import { Installment } from "@/lib/types"

export function InstallmentTable({ onRefresh }: { onRefresh?: (refreshFn: () => void) => void }) {
  const installmentPermissions = useResourcePermissions(Resource.INSTALLMENT)

  // State for installment details modal
  const [selectedInstallment, setSelectedInstallment] = useState<Installment | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const handleViewDetails = (installment: Installment) => {
    setSelectedInstallment(installment)
    setIsDetailsModalOpen(true)
  }

  const { 
    installments, 
    loading, 
    totalItems,
    totalPages,
    currentPage,
    setCurrentPage,
    fetchInstallments, 
    refreshInstallments 
  } = useInstallments(onRefresh)

  const {
    isGenerating,
    successMessage,
    isSuccessDialogOpen,
    setIsSuccessDialogOpen,
    selectedAttachmentUrl,
    isAttachmentDialogOpen,
    setIsAttachmentDialogOpen,
    deleteConfirmation,
    setDeleteConfirmation,
    isDeleting,
    editingInstallment,
    setEditingInstallment,
    isEditFormOpen,
    setIsEditFormOpen,
    selectedNotes,
    isNotesDialogOpen,
    setIsNotesDialogOpen,
    handlePrint,
    handleSendWhatsapp,
    handleViewAttachment,
    handleViewNotes,
    handleEdit,
    handleDelete,
    confirmDelete,
  } = useInstallmentActions(refreshInstallments)

  const {
    searchTerm,
    setSearchTerm,
    applySearch,
    sortField,
    sortDirection,
    paymentFilter,
    setPaymentFilter,
    statusFilter,
    setStatusFilter,
    itemsPerPage,
    dateRange,
    filteredInstallments,
    paginatedInstallments,
    indexOfFirstItem,
    indexOfLastItem,
    hasActiveFilters,
    handleSort,
    resetFilters,
    handlePageChange,
    handleItemsPerPageChange,
    handleDateRangeChange,
  } = useTableState({
    installments,
    totalItems,
    totalPages,
    currentPage,
    setCurrentPage,
    onFiltersChange: (filters) => {
      fetchInstallments(filters)
    }
  })

  return (
    <>
      <div className="h-full flex flex-col space-y-4">
        <LoadingOverlay isVisible={isGenerating} message="Procesando..." />

        <SearchFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchApply={applySearch}
          dateRange={dateRange}
          onDateRangeChange={(range) => {
            handleDateRangeChange(range)
            if (range === undefined || (range.from && range.to)) {
              fetchInstallments({ dateRange: range })
            }
          }}
          paymentFilter={paymentFilter}
          onPaymentFilterChange={setPaymentFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onResetFilters={resetFilters}
          onRefresh={() => fetchInstallments({ dateRange })}
          hasActiveFilters={hasActiveFilters}
          actionButton={
            installmentPermissions.canCreate ? (
              <InstallmentForm onSaved={refreshInstallments}>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Nueva Cuota
                </Button>
              </InstallmentForm>
            ) : null
          }
        />

        <DateRangeSummary dateRange={dateRange} />

        <div className="flex-1 rounded-lg border border-border overflow-hidden shadow-md">
          <div className="h-full overflow-auto">
            <Table>
              <InstallmentTableHeader sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
              <TableBody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, index) => <LoadingRow key={index} />)
                ) : filteredInstallments.length === 0 ? (
                  <EmptyState />
                ) : (
                  paginatedInstallments.map((installment) => (
                    <InstallmentRow
                      key={installment.id}
                      installment={installment}
                      onViewDetails={handleViewDetails}
                      onViewAttachment={handleViewAttachment}
                      onSendWhatsapp={handleSendWhatsapp}
                      onPrint={handlePrint}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onViewNotes={handleViewNotes}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {!loading && filteredInstallments.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            visibleItems={filteredInstallments.length}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
          />
        )}

        <FilterSummary
          dateRange={dateRange}
          paymentFilter={paymentFilter}
          statusFilter={statusFilter}
          totalFiltered={totalItems}
          totalItems={totalItems}
        />
      </div>

      {/* Dialogs */}
      <AttachmentDialog
        isOpen={isAttachmentDialogOpen}
        onOpenChange={setIsAttachmentDialogOpen}
        attachmentUrl={selectedAttachmentUrl}
      />

      <SuccessDialog isOpen={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen} message={successMessage} />

      <DeleteDialog
        installment={deleteConfirmation}
        isOpen={!!deleteConfirmation}
        onOpenChange={(open) => !open && setDeleteConfirmation(null)}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />

      <NotesDialog
        isOpen={isNotesDialogOpen}
        onOpenChange={setIsNotesDialogOpen}
        notes={selectedNotes}
        title="Notas de la cuota"
      />

      {/* Installment Details Modal */}
      <InstallmentDetailsModal
        installment={selectedInstallment}
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
      />

      {/* Edit Form */}
      <InstallmentForm
        installment={editingInstallment}
        onSaved={() => {
          refreshInstallments()
          setEditingInstallment(null)
        }}
      >
        <button id="edit-form-trigger" className="hidden">
          Editar
        </button>
      </InstallmentForm>
    </>
  )
}
