"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Calendar, Clock, AlertCircle } from "lucide-react"

type Payment = {
  id: string
  amount: number
  gps: number
  paymentDate: string
  isLate: boolean
}

interface CalendarStatsProps {
  payments: Payment[]
  currentMonth: Date
}

export function CalendarStats({ payments, currentMonth }: CalendarStatsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Filter payments for current month
  const currentMonthPayments = payments.filter((payment) => {
    const paymentDate = new Date(payment.paymentDate)
    return (
      paymentDate.getMonth() === currentMonth.getMonth() &&
      paymentDate.getFullYear() === currentMonth.getFullYear()
    )
  })

  const totalAmount = currentMonthPayments.reduce((sum, p) => sum + p.amount + p.gps, 0)
  const latePayments = currentMonthPayments.filter((p) => p.isLate).length
  const onTimePayments = currentMonthPayments.filter((p) => !p.isLate).length
  const averagePayment = currentMonthPayments.length > 0 ? totalAmount / currentMonthPayments.length : 0

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ]

  if (payments.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Payments This Month */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Pagos en {monthNames[currentMonth.getMonth()]}
            </p>
            <h3 className="text-2xl font-bold mt-1">{currentMonthPayments.length}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              de {payments.length} totales
            </p>
          </div>
          <div className="h-12 w-12 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center">
            <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </Card>

      {/* Total Amount This Month */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Recaudado</p>
            <h3 className="text-2xl font-bold mt-1">{formatCurrency(totalAmount)}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Promedio: {formatCurrency(averagePayment)}
            </p>
          </div>
          <div className="h-12 w-12 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </Card>

      {/* On-Time Payments */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pagos a Tiempo</p>
            <h3 className="text-2xl font-bold mt-1">{onTimePayments}</h3>
            <p className="text-xs text-muted-foreground mt-1">
              {currentMonthPayments.length > 0
                ? `${Math.round((onTimePayments / currentMonthPayments.length) * 100)}%`
                : "0%"}{" "}
              del total
            </p>
          </div>
          <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-950 rounded-full flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </Card>

      {/* Late Payments */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Pagos Tardíos</p>
            <h3 className="text-2xl font-bold mt-1 text-red-600 dark:text-red-400">
              {latePayments}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {currentMonthPayments.length > 0
                ? `${Math.round((latePayments / currentMonthPayments.length) * 100)}%`
                : "0%"}{" "}
              del total
            </p>
          </div>
          <div className="h-12 w-12 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </Card>
    </div>
  )
}
