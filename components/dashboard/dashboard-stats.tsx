"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Bike, CreditCard, Receipt, TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react"
import { cn } from "@/lib/utils"
import { useDashboardContext } from "./dashboard-provider"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardStats() {
  const { data, loading } = useDashboardContext()
  const stats = data?.stats || {
    totalUsers: 0,
    totalVehicles: 0,
    totalLoans: 0,
    totalInstallments: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    growthRate: 0,
    defaultRate: 0,
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value)
  }

  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
      <Card className="col-span-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground">Total Usuarios</p>
              {loading ? (
                <>
                  <Skeleton className="h-6 w-12 mt-1" />
                  <Skeleton className="h-3 w-24 mt-1" />
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold mt-1">{stats.totalUsers}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Clientes registrados</p>
                </>
              )}
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary animated-icon" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground">Total Vehículos</p>
              {loading ? (
                <>
                  <Skeleton className="h-6 w-12 mt-1" />
                  <Skeleton className="h-3 w-20 mt-1" />
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold mt-1">{stats.totalVehicles}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">En inventario</p>
                </>
              )}
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Bike className="h-5 w-5 text-primary animated-icon" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground">arrendamientos Activos</p>
              {loading ? (
                <>
                  <Skeleton className="h-6 w-12 mt-1" />
                  <Skeleton className="h-3 w-24 mt-1" />
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold mt-1">{stats.totalLoans}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">arrendamientos en curso</p>
                </>
              )}
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-primary animated-icon" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground">Cuotas Pagadas</p>
              {loading ? (
                <>
                  <Skeleton className="h-6 w-12 mt-1" />
                  <Skeleton className="h-3 w-28 mt-1" />
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold mt-1">{stats.totalInstallments}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Total pagos registrados</p>
                </>
              )}
            </div>
            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Receipt className="h-5 w-5 text-green-500 animated-icon" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground">Ingresos Totales</p>
              {loading ? (
                <>
                  <Skeleton className="h-6 w-16 mt-1" />
                  <Skeleton className="h-3 w-24 mt-1" />
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold mt-1">{formatCurrency(stats.totalRevenue)}</h3>
                  <div className="flex items-center mt-0.5">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <p className="text-xs text-green-500">+{stats.growthRate}% vs mes anterior</p>
                  </div>
                </>
              )}
            </div>
            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-green-500 animated-icon" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground">Pagos Pendientes</p>
              {loading ? (
                <>
                  <Skeleton className="h-6 w-16 mt-1" />
                  <Skeleton className="h-3 w-24 mt-1" />
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold mt-1">{formatCurrency(stats.pendingPayments)}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Deuda total pendiente</p>
                </>
              )}
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-amber-500 animated-icon" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground">Tasa de Crecimiento</p>
              {loading ? (
                <>
                  <Skeleton className="h-6 w-14 mt-1" />
                  <Skeleton className="h-3 w-32 mt-1" />
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold mt-1">{stats.growthRate}%</h3>
                  <div className="flex items-center mt-0.5">
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    <p className="text-xs text-green-500">vs mes anterior</p>
                  </div>
                </>
              )}
            </div>
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary animated-icon" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground">Tasa de Incumplimiento</p>
              {loading ? (
                <>
                  <Skeleton className="h-6 w-12 mt-1" />
                  <Skeleton className="h-3 w-24 mt-1" />
                </>
              ) : (
                <>
                  <h3 className={cn("text-xl font-bold mt-1", stats.defaultRate > 5 ? "text-destructive" : "text-green-500")}>
                    {stats.defaultRate}%
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Arrendamientos incumplidos</p>
                </>
              )}
            </div>
            <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
              <Percent className="h-5 w-5 text-destructive animated-icon" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
