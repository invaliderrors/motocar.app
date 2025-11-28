"use client"

import { Table, TableBody } from "@/components/ui/table"
import { useUserTable } from "./hooks/useUserTable"
import { UserTableControls } from "./components/table/UserTableControls"
import { UserTableHeaders } from "./components/table/UserTableHeaders"
import { UserTableSkeleton } from "./components/table/UserTableSkeleton"
import { UserTableEmptyState } from "./components/table/UserTableEmptyState"
import { UserTableRow } from "./components/table/UserTableRow"
import { UserTablePagination } from "./components/table/UserTablePagination"
import { UserDeleteConfirmDialog } from "./components/table/UserDeleteConfirmDialog"

export function UserTable() {
  const {
    users,
    loading,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleUserCreated,
    handleDelete,
    confirmDelete,
    refreshData,
    exportToCSV,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    getPageNumbers,
  } = useUserTable()

  return (
    <div className="h-full flex flex-col space-y-4">
      <UserTableControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        setCurrentPage={setCurrentPage}
        onUserCreated={handleUserCreated}
      />

      <div className="flex-1 rounded-lg border border-border overflow-hidden shadow-md">
        <div className="h-full overflow-auto">
          <Table>
            <UserTableHeaders />
            <TableBody>
              {loading ? (
                <UserTableSkeleton />
              ) : users.length === 0 ? (
                <UserTableEmptyState searchTerm={searchTerm} onClearSearch={() => setSearchTerm("")} />
              ) : (
                users.map((user, index) => (
                  <UserTableRow
                    key={`user-row-${user.id}-${index}`}
                    user={user}
                    index={index}
                    onEdit={handleUserCreated}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <UserTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        onPageChange={setCurrentPage}
        getPageNumbers={getPageNumbers}
      />

      <UserDeleteConfirmDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} onConfirm={confirmDelete} />
    </div>
  )
}
