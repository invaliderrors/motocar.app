"use client"

import React from "react"
import { Table, TableBody } from "@/components/ui/table"
import { TransactionListEmpty } from "./transaction-list-empty"
import { TransactionListHeader } from "./transaction-list-header"
import { TransactionListLoading } from "./transaction-list-loading"
import type { SortField, Transaction } from "../constants/types"
import { TransactionItem } from "./transactions-item"

interface TransactionListProps {
    loading: boolean
    transactions: Transaction[]
    selectedIds: string[]
    onSelectAll: (checked: boolean) => void
    onSelectItem: (id: string, checked: boolean) => void
    sortField: SortField
    sortDirection: string
    onSort: (field: SortField) => void
}

export const TransactionList = React.memo(function TransactionList({
    loading,
    transactions,
    selectedIds,
    onSelectAll,
    onSelectItem,
    sortField,
    sortDirection,
    onSort,
}: TransactionListProps) {
    // Check if all current page items are selected
    const selectedAll =
        transactions.length > 0 && transactions.every((transaction) => selectedIds.includes(transaction.id))
    // Check if some (but not all) current page items are selected
    const indeterminate =
        selectedIds.length > 0 && !selectedAll && transactions.some((transaction) => selectedIds.includes(transaction.id))

    return (
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
            <div className="overflow-x-auto">
                <Table>
                    <TransactionListHeader
                        selectedAll={selectedAll}
                        indeterminate={indeterminate}
                        onSelectAll={onSelectAll}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={onSort}
                    />
                    <TableBody>
                        {loading ? (
                            <TransactionListLoading rowCount={5} />
                        ) : transactions.length === 0 ? (
                            <TransactionListEmpty />
                        ) : (
                            transactions.map((transaction) => (
                                <TransactionItem
                                    key={transaction.id}
                                    transaction={transaction}
                                    isSelected={selectedIds.includes(transaction.id)}
                                    onSelect={onSelectItem}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
})
