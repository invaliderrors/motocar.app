"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import { TransactionsTable } from "../tables/TransactionsTable"
import { TransactionForm } from "../forms/TransactionForm"
import { TransactionFilters } from "../filters/TransactionFilters"
import { useTransactions } from "../hooks/useTransactions"

export function TransactionsTab() {
  const { transactions, loading, refreshing, totalItems, totalPages, query, updateQuery, refetch, handleTransactionCreated } =
    useTransactions()

  return (
    <div className="space-y-6">
      <Card className="shadow-md bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-bold">Transacciones de Flujo de Efectivo</CardTitle>
              <CardDescription>Registra y gestiona todas las entradas y salidas de efectivo</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={refetch} disabled={refreshing} className="h-9 gap-1.5">
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                Actualizar
              </Button>
              <TransactionForm onSuccess={handleTransactionCreated}>
                <Button size="sm" className="h-9 gap-1.5">
                  <Plus className="h-4 w-4" />
                  Nueva Transacción
                </Button>
              </TransactionForm>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <TransactionFilters query={query} updateQuery={updateQuery} />
          <TransactionsTable
            transactions={transactions}
            loading={loading}
            totalItems={totalItems}
            totalPages={totalPages}
            currentPage={query.page || 1}
            onPageChange={(page: number) => updateQuery({ page })}
            onTransactionUpdated={handleTransactionCreated}
          />
        </CardContent>
      </Card>
    </div>
  )
}
