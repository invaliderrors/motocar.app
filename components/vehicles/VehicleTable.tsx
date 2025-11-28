"use client"

import { Table, TableBody } from "@/components/ui/table"
import { DeleteConfirmationDialog } from "./delete-dialog"
import { useVehicleTable } from "./hooks/useVehicleTable"
import { VehicleTableControls } from "./table/VehicleTableControls"
import { VehicleTableHeaders } from "./table/VehicleTableHeaders"
import { VehicleTablePagination } from "./table/VehicleTablePagination"
import { VehicleTableRow } from "./table/VehicleTableRow"
import { VehicleTableSkeleton } from "./table/VehicleTableSkeleton"
import { VehicleTableEmptyState } from "./table/VehicleTableState"
import type { Vehicle } from "@/lib/types"

export function VehicleTable() {
  const {
    vehicles,
    loading,
    searchTerm,
    setSearchTerm,
    providerFilter,
    setProviderFilter,
    vehicleTypeFilter,
    setVehicleTypeFilter,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleVehicleCreated,
    handleDelete,
    confirmDelete,
    refreshData,
    exportToCSV,
    clearFilters,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    getPageNumbers,
    uniqueProviders,
    uniqueVehicleTypes,
    getProviderLabel,
    getVehicleTypeLabel,
    hasActiveFilters,
  } = useVehicleTable()

  return (
    <div className="h-full flex flex-col space-y-4">
      <VehicleTableControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        providerFilter={providerFilter}
        setProviderFilter={setProviderFilter}
        vehicleTypeFilter={vehicleTypeFilter}
        setVehicleTypeFilter={setVehicleTypeFilter}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        uniqueProviders={uniqueProviders}
        uniqueVehicleTypes={uniqueVehicleTypes}
        getProviderLabel={getProviderLabel}
        getVehicleTypeLabel={getVehicleTypeLabel}
        onVehicleCreated={handleVehicleCreated}
      />

      <div className="flex-1 rounded-lg border border-border overflow-hidden shadow-md">
        <div className="h-full overflow-auto">
          <Table>
            <VehicleTableHeaders />
            <TableBody>
              {loading ? (
                <VehicleTableSkeleton />
              ) : !vehicles || vehicles.length === 0 ? (
                <VehicleTableEmptyState hasActiveFilters={hasActiveFilters} onClearFilters={clearFilters} />
              ) : (
                vehicles.map((vehicle: Vehicle, index: number) => (
                  <VehicleTableRow
                    key={`vehicle-row-${vehicle.id}-${index}`}
                    vehicle={vehicle}
                    index={index}
                    getProviderLabel={getProviderLabel}
                    getVehicleTypeLabel={getVehicleTypeLabel}
                    onEdit={handleVehicleCreated}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {!loading && vehicles && vehicles.length > 0 && (
        <VehicleTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          startIndex={startIndex}
          endIndex={endIndex}
          onPageChange={setCurrentPage}
          getPageNumbers={getPageNumbers}
        />
      )}

      <DeleteConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar eliminación"
        description="¿Está seguro que desea eliminar este vehículo? Esta acción no se puede deshacer."
      />
    </div>
  )
}
