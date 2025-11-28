"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useEmployees } from "./hooks/useEmployees"
import { TableHeader } from "./components/table-header"
import { TableRow } from "./components/table-row"
import { LoadingRow } from "./components/loading-row"
import { EmptyState } from "./components/empty-state"
import { Pagination } from "./components/pagination"
import { FilterSummary } from "./components/filter-summary"
import { EmployeeFormDialog } from "./employee-form-dialog"
import { DeleteEmployeeDialog } from "./components/dialogs/delete-dialog"
import { ReassignStoreDialog } from "./components/dialogs/reassign-store-dialog"
import { SuccessDialog } from "./components/dialogs/success-dialog"
import type { Employee } from "./hooks/useEmployees"

export type SortField = "name" | "username" | "storeName" | "status" | "createdAt"
export type SortOrder = "asc" | "desc"

export function EmployeeTable() {
  // Search and filters
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [sortField, setSortField] = useState<SortField>("createdAt")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Dialogs
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showReassignDialog, setShowReassignDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [successMessage, setSuccessMessage] = useState("")

  // Data
  const {
    employees,
    loading,
    searchTerm,
    setSearchTerm,
    deleteEmployee,
    updateEmployeeStatus,
    reassignEmployee,
    refreshEmployees,
  } = useEmployees(statusFilter)

  // Sorting logic
  const sortedEmployees = [...employees].sort((a, b) => {
    let aValue: any
    let bValue: any

    // Handle nested store.name for storeName sort field
    if (sortField === "storeName") {
      aValue = a.store?.name || ""
      bValue = b.store?.name || ""
    } else {
      aValue = a[sortField]
      bValue = b[sortField]
    }

    // Handle null values
    if (aValue === null || aValue === undefined) aValue = ""
    if (bValue === null || bValue === undefined) bValue = ""

    // Convert to strings for comparison
    const aStr = String(aValue).toLowerCase()
    const bStr = String(bValue).toLowerCase()

    if (sortOrder === "asc") {
      return aStr > bStr ? 1 : -1
    } else {
      return aStr < bStr ? 1 : -1
    }
  })

  // Pagination logic
  const totalPages = Math.ceil(sortedEmployees.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEmployees = sortedEmployees.slice(startIndex, startIndex + itemsPerPage)

  // Reset to first page when filters change
  const handleStatusFilterChange = (value: "all" | "active" | "inactive") => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const handleCreateEmployee = () => {
    setSelectedEmployee(null)
    setShowEmployeeDialog(true)
  }

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setShowEmployeeDialog(true)
  }

  const handleDeleteClick = (employee: Employee) => {
    setSelectedEmployee(employee)
    setShowDeleteDialog(true)
  }

  const handleReassignClick = (employee: Employee) => {
    setSelectedEmployee(employee)
    setShowReassignDialog(true)
  }

  const handleToggleStatus = async (employee: Employee) => {
    try {
      const newStatus = employee.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
      await updateEmployeeStatus(employee.id, newStatus)
    } catch (error) {
      // Error handled in hook
    }
  }

  const handleConfirmDelete = async () => {
    if (!selectedEmployee) return

    try {
      await deleteEmployee(selectedEmployee.id)
      setShowDeleteDialog(false)
      setSelectedEmployee(null)
      setSuccessMessage("El empleado ha sido eliminado correctamente")
      setShowSuccessDialog(true)
    } catch (error) {
      // Error handled in hook
    }
  }

  const handleConfirmReassign = async (newStoreId: string) => {
    if (!selectedEmployee) return

    try {
      await reassignEmployee(selectedEmployee.id, newStoreId)
      setShowReassignDialog(false)
      setSelectedEmployee(null)
      setSuccessMessage("El empleado ha sido reasignado correctamente")
      setShowSuccessDialog(true)
    } catch (error) {
      // Error handled in hook
    }
  }

  const handleDialogClose = (success: boolean) => {
    setShowEmployeeDialog(false)
    setSelectedEmployee(null)
    if (success) {
      refreshEmployees()
      setSuccessMessage(
        selectedEmployee 
          ? "El empleado ha sido actualizado correctamente"
          : "El empleado ha sido creado correctamente"
      )
      setShowSuccessDialog(true)
    }
  }

  return (
    <>
      <Card className="w-full">
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Empleados</h3>
            <Button onClick={handleCreateEmployee} size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Empleado
            </Button>
          </div>

          <FilterSummary
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilterChange}
            totalCount={employees.length}
            filteredCount={sortedEmployees.length}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <TableHeader
              sortField={sortField}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
            <tbody>
              {loading ? (
                <LoadingRow />
              ) : paginatedEmployees.length === 0 ? (
                <EmptyState
                  hasFilters={searchTerm !== "" || statusFilter !== "all"}
                  onClearFilters={() => {
                    setSearchTerm("")
                    setStatusFilter("all")
                  }}
                />
              ) : (
                paginatedEmployees.map((employee) => (
                  <TableRow
                    key={employee.id}
                    employee={employee}
                    onEdit={handleEditEmployee}
                    onDelete={handleDeleteClick}
                    onReassign={handleReassignClick}
                    onToggleStatus={handleToggleStatus}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && paginatedEmployees.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={sortedEmployees.length}
            itemsPerPage={itemsPerPage}
          />
        )}
      </Card>

      {showEmployeeDialog && (
        <EmployeeFormDialog
          employee={selectedEmployee}
          onClose={handleDialogClose}
        />
      )}

      {showDeleteDialog && selectedEmployee && (
        <DeleteEmployeeDialog
          employee={selectedEmployee}
          onClose={() => {
            setShowDeleteDialog(false)
            setSelectedEmployee(null)
          }}
          onConfirm={handleConfirmDelete}
        />
      )}

      {showReassignDialog && selectedEmployee && (
        <ReassignStoreDialog
          employee={selectedEmployee}
          onClose={() => {
            setShowReassignDialog(false)
            setSelectedEmployee(null)
          }}
          onConfirm={handleConfirmReassign}
        />
      )}

      {showSuccessDialog && (
        <SuccessDialog
          message={successMessage}
          onClose={() => setShowSuccessDialog(false)}
        />
      )}
    </>
  )
}
