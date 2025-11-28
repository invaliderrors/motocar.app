"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import { TransfersTable } from "../tables/TransfersTable"
import { TransferForm } from "../forms/TransferForm"
import { useTransfers } from "../hooks/useTransfers"

export function TransfersTab() {
  const { transfers, loading, refreshing, totalItems, totalPages, query, updateQuery, refetch, handleTransferCreated } =
    useTransfers()

  return (
    <div className="space-y-6">
      <Card className="shadow-md bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-bold">Transferencias entre Cuentas</CardTitle>
              <CardDescription>Gestiona las transferencias de dinero entre tus cuentas</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={refetch} disabled={refreshing} className="h-9 gap-1.5">
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                Actualizar
              </Button>
              <TransferForm onSuccess={handleTransferCreated}>
                <Button size="sm" className="h-9 gap-1.5">
                  <Plus className="h-4 w-4" />
                  Nueva Transferencia
                </Button>
              </TransferForm>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <TransfersTable
            transfers={transfers}
            loading={loading}
            totalItems={totalItems}
            totalPages={totalPages}
            currentPage={query.page || 1}
            onPageChange={(page: number) => updateQuery({ page })}
            onTransferDeleted={handleTransferCreated}
          />
        </CardContent>
      </Card>
    </div>
  )
}
