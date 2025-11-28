"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"
import { useDashboardContext } from "./dashboard-provider"

type PaymentEvent = {
  date: Date
  amount: number
  client: string
  vehiclePlate: string
  loanId: string
  paymentMethod?: string
  isLate?: boolean
  status: "pending" | "late" | "paid"
}

export function PaymentCalendar() {
  const [isMounted, setIsMounted] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const { data, loading } = useDashboardContext()
  
  const upcomingPayments = data?.upcomingPayments || []
  const recentInstallments = data?.recentInstallments || []
  
  // Combine both upcoming payments and recent installments
  const allEvents: PaymentEvent[] = [
    ...upcomingPayments.map(payment => ({
      date: new Date(payment.date),
      amount: payment.amount,
      client: payment.client,
      vehiclePlate: payment.vehiclePlate,
      loanId: payment.loanId,
      status: payment.status as "pending" | "late",
    })),
    ...recentInstallments.map(installment => ({
      date: new Date(installment.date),
      amount: installment.amount,
      client: installment.client,
      vehiclePlate: installment.vehiclePlate,
      loanId: installment.loanId,
      paymentMethod: installment.paymentMethod,
      isLate: installment.isLate,
      status: "paid" as const,
    })),
  ]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const getEventsForDate = (date: Date) => {
    return allEvents.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )
  }

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : []

  // Función para determinar si una fecha tiene eventos
  const hasEvents = (date: Date) => {
    return allEvents.some(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear(),
    )
  }

  // Función para obtener el color del badge según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-500"
      case "late":
        return "bg-red-500"
      case "paid":
        return "bg-green-500"
      default:
        return ""
    }
  }

  // Función para obtener el texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "late":
        return "Atrasado"
      case "paid":
        return "Pagado"
      default:
        return status
    }
  }

  if (!isMounted) {
    return (
      <div className="h-[250px] flex items-center justify-center">
        <div className="space-y-3 w-full">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-[250px] flex items-center justify-center">
        <div className="space-y-3 w-full">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 h-full">
      <div className="md:w-1/2 flex items-center justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border w-full"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4 w-full",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse",
            head_row: "flex w-full",
            head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent w-full",
            day: "h-9 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_hidden: "invisible",
          }}
          modifiers={{
            hasEvent: (date) => hasEvents(date),
          }}
          modifiersClassNames={{
            hasEvent:
              "font-bold text-primary relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-primary after:rounded-full",
          }}
        />
      </div>
      <div className="md:w-1/2">
        <h3 className="font-medium mb-2">
          {selectedDate ? (
            <>Pagos para {selectedDate.toLocaleDateString("es-ES", { day: "numeric", month: "long" })}</>
          ) : (
            "Seleccione una fecha"
          )}
        </h3>

        {selectedEvents.length === 0 ? (
          <p className="text-muted-foreground text-sm">No hay pagos programados para esta fecha.</p>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {selectedEvents.map((event, index) => (
              <Card key={index} className="p-3 hover:bg-accent/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{event.client}</p>
                    <p className="text-xs text-muted-foreground">Placa: {event.vehiclePlate}</p>
                    {event.paymentMethod && (
                      <p className="text-xs text-muted-foreground">Método: {event.paymentMethod}</p>
                    )}
                    <p className="text-sm font-semibold mt-1">{formatCurrency(event.amount)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge className={getStatusColor(event.status)}>{getStatusText(event.status)}</Badge>
                    {event.isLate && event.status === "paid" && (
                      <Badge variant="outline" className="text-xs bg-red-500/10 text-red-500 border-red-500/20">
                        Pago tardío
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
