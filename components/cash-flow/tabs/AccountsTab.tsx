"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import { AccountsTable } from "../tables/AccountsTable"
import { AccountForm } from "../forms/AccountForm"
import { useAccounts } from "../hooks/useAccounts"
import { AccountStats } from "../stats/AccountStats"

export function AccountsTab() {
  const { accounts, loading, refreshing, refetch, handleAccountCreated } = useAccounts()

  return (
    <div className="space-y-6">
      <AccountStats accounts={accounts} loading={loading} />

      <Card className="shadow-md bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-bold">Cuentas de Flujo de Efectivo</CardTitle>
              <CardDescription>Gestiona tus cuentas bancarias, de efectivo y otras cuentas financieras</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={refetch} disabled={refreshing} className="h-9 gap-1.5">
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                Actualizar
              </Button>
              <AccountForm onSuccess={handleAccountCreated}>
                <Button size="sm" className="h-9 gap-1.5">
                  <Plus className="h-4 w-4" />
                  Nueva Cuenta
                </Button>
              </AccountForm>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AccountsTable accounts={accounts} loading={loading} onAccountUpdated={handleAccountCreated} />
        </CardContent>
      </Card>
    </div>
  )
}
