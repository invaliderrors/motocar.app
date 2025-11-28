"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowUpIcon,
  ArrowDownIcon,
  DollarSignIcon,
  CalendarIcon,
  UsersIcon,
  BikeIcon as MotorcycleIcon,
} from "lucide-react"

interface ReportSummaryProps {
  data: any
  activeTab: string
}

export function ReportSummary({ data, activeTab }: ReportSummaryProps) {
  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Determinar qué datos mostrar según la pestaña activa
  const getSummaryData = () => {
    switch (activeTab) {
      case "prestamos":
        return {
          title: "Resumen de contratos",
          description: "Estadísticas generales de contratos",
          stats: [
            {
              title: "Total de contratos",
              value: data.loans.total,
              icon: <CalendarIcon className="h-4 w-4 text-blue-500" />,
              description: `${data.loans.active} activos, ${data.loans.completed} completados`,
            },
            {
              title: "Monto Total Financiado",
              value: formatCurrency(data.loans.totalAmount),
              icon: <DollarSignIcon className="h-4 w-4 text-green-500" />,
              description: `Interés: ${formatCurrency(data.loans.totalInterest)}`,
            },
            {
              title: "contratos en Mora",
              value: data.loans.defaulted,
              icon: <ArrowDownIcon className="h-4 w-4 text-red-500" />,
              description: `${((data.loans.defaulted / data.loans.total) * 100).toFixed(1)}% del total`,
            },
            {
              title: "Tasa de Finalización",
              value: `${((data.loans.completed / data.loans.total) * 100).toFixed(1)}%`,
              icon: <ArrowUpIcon className="h-4 w-4 text-emerald-500" />,
              description: `${data.loans.completed} contratos completados`,
            },
          ],
        }
      case "pagos":
        return {
          title: "Resumen de Pagos",
          description: "Estadísticas generales de pagos y cuotas",
          stats: [
            {
              title: "Total de Pagos",
              value: data.payments.total,
              icon: <CalendarIcon className="h-4 w-4 text-blue-500" />,
              description: `${data.payments.onTime} a tiempo, ${data.payments.late} tardíos`,
            },
            {
              title: "Monto Recaudado",
              value: formatCurrency(data.payments.totalCollected),
              icon: <DollarSignIcon className="h-4 w-4 text-green-500" />,
              description: `Pendiente: ${formatCurrency(data.payments.pendingCollection)}`,
            },
            {
              title: "Pagos Tardíos",
              value: data.payments.late,
              icon: <ArrowDownIcon className="h-4 w-4 text-red-500" />,
              description: `${((data.payments.late / data.payments.total) * 100).toFixed(1)}% del total`,
            },
            {
              title: "Tasa de Pago a Tiempo",
              value: `${((data.payments.onTime / data.payments.total) * 100).toFixed(1)}%`,
              icon: <ArrowUpIcon className="h-4 w-4 text-emerald-500" />,
              description: `${data.payments.onTime} pagos a tiempo`,
            },
          ],
        }
      case "clientes":
        return {
          title: "Resumen de Clientes",
          description: "Estadísticas generales de clientes",
          stats: [
            {
              title: "Total de Clientes",
              value: data.clients.total,
              icon: <UsersIcon className="h-4 w-4 text-blue-500" />,
              description: `${data.clients.active} activos, ${data.clients.inactive} inactivos`,
            },
            {
              title: "Clientes con contratos",
              value: data.clients.active,
              icon: <DollarSignIcon className="h-4 w-4 text-green-500" />,
              description: `${((data.clients.active / data.clients.total) * 100).toFixed(1)}% del total`,
            },
            {
              title: "Clientes en Mora",
              value: data.clients.withDefaultedLoans,
              icon: <ArrowDownIcon className="h-4 w-4 text-red-500" />,
              description: `${((data.clients.withDefaultedLoans / data.clients.total) * 100).toFixed(1)}% del total`,
            },
            {
              title: "Tasa de Retención",
              value: `${((data.clients.active / data.clients.total) * 100).toFixed(1)}%`,
              icon: <ArrowUpIcon className="h-4 w-4 text-emerald-500" />,
              description: `${data.clients.active} clientes activos`,
            },
          ],
        }
      case "motocicletas":
        return {
          title: "Resumen de Vehículos",
          description: "Estadísticas generales de vehículos",
          stats: [
            {
              title: "Total de Vehículos",
              value: data.motorcycles.total,
              icon: <MotorcycleIcon className="h-4 w-4 text-blue-500" />,
              description: `${data.motorcycles.financed} financiados, ${data.motorcycles.available} disponibles`,
            },
            {
              title: "Valor Total",
              value: formatCurrency(data.motorcycles.totalValue),
              icon: <DollarSignIcon className="h-4 w-4 text-green-500" />,
              description: `Promedio: ${formatCurrency(data.motorcycles.totalValue / data.motorcycles.total)}`,
            },
            {
              title: "Vehículos Financiados",
              value: data.motorcycles.financed,
              icon: <ArrowUpIcon className="h-4 w-4 text-emerald-500" />,
              description: `${((data.motorcycles.financed / data.motorcycles.total) * 100).toFixed(1)}% del total`,
            },
            {
              title: "Vehículos Disponibles",
              value: data.motorcycles.available,
              icon: <MotorcycleIcon className="h-4 w-4 text-amber-500" />,
              description: `${((data.motorcycles.available / data.motorcycles.total) * 100).toFixed(1)}% del total`,
            },
          ],
        }
      default:
        return {
          title: "Resumen General",
          description: "Estadísticas generales del sistema",
          stats: [],
        }
    }
  }

  const summaryData = getSummaryData()

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>{summaryData.title}</CardTitle>
        <CardDescription>{summaryData.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryData.stats.map((stat, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-2">
                {stat.icon}
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
