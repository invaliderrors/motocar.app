import type { Transaction, TransactionFiltersState, TransactionSummary } from "../constants/types"

/**
 * Checks if a date is today in Colombian time (America/Bogota timezone)
 */
function isToday(date: Date): boolean {
  const colombianTime = new Date(date.toLocaleString('en-US', { timeZone: 'America/Bogota' }))
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' }))
  
  return (
    colombianTime.getFullYear() === today.getFullYear() &&
    colombianTime.getMonth() === today.getMonth() &&
    colombianTime.getDate() === today.getDate()
  )
}

/**
 * Checks if a date is today or in the future in Colombian time (America/Bogota timezone)
 */
function isTodayOrFuture(date: Date): boolean {
  const colombianTime = new Date(date.toLocaleString('en-US', { timeZone: 'America/Bogota' }))
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' }))
  
  // Set time to start of day for both dates to compare dates only
  colombianTime.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  
  // Return true if the transaction date is today or in the future
  return colombianTime >= today
}

export function filterAndSortTransactions(
  transactions: Transaction[],
  filters: TransactionFiltersState,
): Transaction[] {
  let filtered = [...transactions]

  // NOTE: Show all unassigned transactions regardless of date
  // This is needed for closing system to include past unassigned expenses and incomes
  // The date filter is removed to show all available transactions

  // Apply search filter
  if (filters.searchTerm) {
    const searchLower = filters.searchTerm.toLowerCase()
    filtered = filtered.filter(
      (transaction) =>
        transaction.description?.toLowerCase().includes(searchLower) ||
        transaction.reference?.toLowerCase().includes(searchLower) ||
        transaction.amount.toString().includes(searchLower),
    )
  }

  // Apply type filter
  if (filters.typeFilter !== "all") {
    filtered = filtered.filter((transaction) => transaction.type === filters.typeFilter)
  }

  // Apply provider filter
  if (filters.providerFilter !== "all") {
    filtered = filtered.filter((transaction) => transaction.provider?.name === filters.providerFilter)
  }

  // Apply sorting
  if (filters.sortField) {
    filtered.sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (filters.sortField) {
        case "date":
          aValue = new Date(a.date)
          bValue = new Date(b.date)
          break
        case "amount":
          aValue = a.amount
          bValue = b.amount
          break
        case "type":
          aValue = a.type
          bValue = b.type
          break
        case "provider":
          aValue = a.provider
          bValue = b.provider
          break
        default:
          aValue = a.date
          bValue = b.date
      }

      if (filters.sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

  return filtered
}

export function calculateTransactionSummary(transactions: Transaction[]): TransactionSummary {
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  return {
    totalIncome,
    totalExpense,
    netAmount: totalIncome - totalExpense,
  }
}

export function calculatePagination(totalItems: number, currentPage: number, itemsPerPage: number) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage

  return {
    totalPages,
    indexOfFirstItem,
    indexOfLastItem,
  }
}
