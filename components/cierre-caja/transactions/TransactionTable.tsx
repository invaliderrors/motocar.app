"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TransactionList } from "./components/transaction-list"
import { ProviderMismatchDialog } from "./components/helpers/provider-mismatch"
import { TransactionFilters } from "./components/helpers/TransactionFilters"

import type { SelectedTransaction } from "./constants/types"
import { useTransactions } from "./hooks/useTransactions"
import { TransactionHeader } from "./components/helpers/TransactionHeader"
import { TransactionSummary } from "./components/helpers/TransactionSummary"
import { TransactionSelectionSummary } from "./components/helpers/TransactionSelectionSummary"
import { TransactionPagination } from "./components/helpers/TransactionPagination"

interface TransactionTableProps {
  token: string
  onSelect?: (transactions: SelectedTransaction[]) => void
}

export function TransactionTable({ token, onSelect }: TransactionTableProps) {
  const {
    currentItems,
    loading,
    refreshing,
    selectedIds,
    selectedCount,
    selectedSummary,
    totalIncome,
    totalExpense,
    netAmount,
    filters,
    hasActiveFilters,
    currentPage,
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
    totalItems,
    showProviderMismatchDialog,
    currentProviderName,
    attemptedProviderName,
    fetchTransactions,
    handleSearchChange,
    handleTypeFilterChange,
    handleProviderFilterChange,
    handleSort,
    resetFilters,
    handleSelection,
    handleSelectAll,
    handleSelectAllFiltered,
    clearAllSelections,
    handlePageChange,
    setShowProviderMismatchDialog,
  } = useTransactions({
    token,
    onSelect,
  })

  // Export handlers
  const handleExportSelected = () => {
    // TODO: Implement export selected transactions
    console.log("Exporting selected transactions:", selectedCount)
  }

  const handleExportAll = () => {
    // TODO: Implement export all transactions
    console.log("Exporting all transactions")
  }

  return (
    <Card className="shadow-md bg-card border-border">
      <TransactionHeader
        refreshing={refreshing}
        onRefresh={fetchTransactions}
        selectedCount={selectedCount}
        onExportSelected={handleExportSelected}
        onExportAll={handleExportAll}
      />
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <TransactionSummary
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          netAmount={netAmount}
          selectedCount={selectedCount}
          selectedSummary={selectedSummary}
        />

        {/* Selection Summary - Show when transactions are selected */}
        {selectedCount > 0 && (
          <TransactionSelectionSummary
            selectedCount={selectedCount}
            selectedSummary={selectedSummary}
            onSelectAllFiltered={handleSelectAllFiltered}
            onClearAll={clearAllSelections}
            totalFilteredItems={totalItems}
          />
        )}

        {/* Filters */}
        <TransactionFilters
          searchTerm={filters.searchTerm}
          typeFilter={filters.typeFilter}
          providerFilter={filters.providerFilter}
          onSearchChange={handleSearchChange}
          onTypeFilterChange={handleTypeFilterChange}
          onProviderFilterChange={handleProviderFilterChange}
          onResetFilters={resetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Table */}
        <TransactionList
          loading={loading}
          transactions={currentItems}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectItem={handleSelection}
          sortField={filters.sortField}
          sortDirection={filters.sortDirection}
          onSort={handleSort}
        />

        {/* Pagination */}
        {!loading && currentItems.length > 0 && (
          <TransactionPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={10}
            indexOfFirstItem={indexOfFirstItem}
            indexOfLastItem={indexOfLastItem}
            onPageChange={handlePageChange}
          />
        )}
      </CardContent>

      {/* Provider Mismatch Dialog */}
      <ProviderMismatchDialog
        open={showProviderMismatchDialog}
        onOpenChange={setShowProviderMismatchDialog}
        currentProviderName={currentProviderName}
        attemptedProviderName={attemptedProviderName}
      />
    </Card>
  )
}
