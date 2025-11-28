"use client"

import { Table, TableBody } from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { useExpenseTable } from "./hooks/useExpenseTable"
import { ExpenseTableHeader } from "./table/ExpenseTableHeader"
import { ExpenseModal } from "./expense-modal"
import { ExpenseDialogs } from "./table/ExpenseDialogs"
import { ExpenseTableEmptyState } from "./table/ExpenseTableEmptyState"
import { ExpenseTableFilters } from "./table/ExpenseTableFilters"
import { ExpenseTableHeaders } from "./table/ExpenseTableHeaders"
import { ExpenseTablePagination } from "./table/ExpenseTablePagination"
import { ExpenseTableRow } from "./table/ExpenseTableRow"
import { ExpenseTableSkeleton } from "./table/ExpenseTableSkeleton"
import { ExpenseSummary } from "./table/ExpenseSummary"

export function ExpenseTable() {
    const {
        expenses,
        loading,
        searchTerm,
        setSearchTerm,
        categoryFilter,
        setCategoryFilter,
        providerFilter,
        setProviderFilter,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        sortDirection,
        deleteDialogOpen,
        setDeleteDialogOpen,
        viewExpense,
        viewDialogOpen,
        setViewDialogOpen,
        dateRange,
        attachmentDialogOpen,
        setAttachmentDialogOpen,
        selectedAttachmentUrl,
        handleDateRangeChange,
        toggleSortDirection,
        handleDelete,
        confirmDelete,
        handleViewDetails,
        handleEditExpense,
        handleViewAttachment,
        refreshData,
        exportToCSV,
        clearFilters,
        totalItems,
        totalPages,
        startIndex,
        endIndex,
        totalAmount,
        getPageNumbers,
        hasActiveFilters,
        availableProviders,
        filteredExpenses,
        formatMoney,
    } = useExpenseTable()

    return (
        <Card className="bg-card border-border shadow-md">
            <ExpenseTableHeader onRefresh={refreshData} onExport={exportToCSV} />

            <CardContent className="p-6">
                <div className="space-y-6">
                    <ExpenseTableFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        categoryFilter={categoryFilter}
                        setCategoryFilter={setCategoryFilter}
                        providerFilter={providerFilter}
                        setProviderFilter={setProviderFilter}
                        itemsPerPage={itemsPerPage}
                        setItemsPerPage={setItemsPerPage}
                        setCurrentPage={setCurrentPage}
                        onDateRangeChange={handleDateRangeChange}
                        onRefresh={refreshData}
                        availableProviders={availableProviders}
                    />

                    <ExpenseSummary
                        totalAmount={totalAmount}
                        dateRange={dateRange}
                        categoryFilter={categoryFilter}
                        formatMoney={formatMoney}
                    />

                    <div className="rounded-lg border border-border overflow-hidden">
                        <div className="overflow-x-auto">
                            <Table>
                                <ExpenseTableHeaders sortDirection={sortDirection} onToggleSort={toggleSortDirection} />
                                <TableBody>
                                    {loading ? (
                                        <ExpenseTableSkeleton />
                                    ) : expenses.length === 0 ? (
                                        <ExpenseTableEmptyState hasActiveFilters={hasActiveFilters} onClearFilters={clearFilters} />
                                    ) : (
                                        expenses.map((expense) => (
                                            <ExpenseTableRow
                                                key={expense.id}
                                                expense={expense}
                                                formatMoney={formatMoney}
                                                onViewDetails={handleViewDetails}
                                                onEdit={handleEditExpense}
                                                onDelete={handleDelete}
                                                onViewAttachment={handleViewAttachment}
                                            />
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    <ExpenseTablePagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        startIndex={startIndex}
                        endIndex={endIndex}
                        onPageChange={setCurrentPage}
                        getPageNumbers={getPageNumbers}
                    />
                </div>
            </CardContent>

            <ExpenseDialogs
                deleteDialogOpen={deleteDialogOpen}
                setDeleteDialogOpen={setDeleteDialogOpen}
                viewDialogOpen={viewDialogOpen}
                setViewDialogOpen={setViewDialogOpen}
                attachmentDialogOpen={attachmentDialogOpen}
                setAttachmentDialogOpen={setAttachmentDialogOpen}
                viewExpense={viewExpense}
                selectedAttachmentUrl={selectedAttachmentUrl}
                onConfirmDelete={confirmDelete}
                formatMoney={formatMoney}
            />

            {/* Hidden edit modal triggers */}
            {filteredExpenses.map((expense) => (
                <div key={`edit-trigger-${expense.id}`} className="hidden">
                    <ExpenseModal expenseData={expense} isEditing={true} onSuccess={refreshData}>
                        <button id={`edit-expense-trigger-${expense.id}`}>Editar</button>
                    </ExpenseModal>
                </div>
            ))}
        </Card>
    )
}
