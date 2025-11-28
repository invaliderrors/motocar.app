"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from "lucide-react"
import type { CashFlowAccount } from "@/lib/types/cash-flow"
import { formatCurrency } from "../utils"
import { Skeleton } from "@/components/ui/skeleton"

interface AccountStatsProps {
  accounts: CashFlowAccount[]
  loading: boolean
}

export function AccountStats({ accounts, loading }: AccountStatsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
  const activeAccounts = accounts.filter((a) => a.isActive).length
  const positiveAccounts = accounts.filter((a) => a.balance > 0).length
  const negativeAccounts = accounts.filter((a) => a.balance < 0).length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cuentas Activas</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeAccounts}</div>
          <p className="text-xs text-muted-foreground">de {accounts.length} totales</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Con Balance Positivo</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{positiveAccounts}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Con Balance Negativo</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{negativeAccounts}</div>
        </CardContent>
      </Card>
    </div>
  )
}
