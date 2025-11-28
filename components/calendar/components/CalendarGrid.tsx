"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type Payment = {
  id: string
  amount: number
  gps: number
  paymentDate: string
  isLate: boolean
  paymentMethod: string
}

interface CalendarGridProps {
  currentDate: Date
  payments: Payment[]
  onDayClick: (date: Date) => void
}

export function CalendarGrid({ currentDate, payments, onDayClick }: CalendarGridProps) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()
  
  // Get days from previous month to fill the grid
  const prevMonthLastDay = new Date(year, month, 0).getDate()
  const prevMonthDays = Array.from(
    { length: startingDayOfWeek },
    (_, i) => prevMonthLastDay - startingDayOfWeek + i + 1
  )
  
  // Current month days
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  
  // Next month days to complete the grid
  const totalCells = prevMonthDays.length + currentMonthDays.length
  const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7)
  const nextMonthDays = Array.from({ length: remainingCells }, (_, i) => i + 1)

  const getPaymentsForDay = (day: number, isCurrentMonth: boolean, isPrevMonth: boolean) => {
    if (!isCurrentMonth) {
      const targetMonth = isPrevMonth ? month - 1 : month + 1
      const targetYear = isPrevMonth ? (month === 0 ? year - 1 : year) : (month === 11 ? year + 1 : year)
      const actualMonth = isPrevMonth ? (month === 0 ? 11 : month - 1) : (month === 11 ? 0 : month + 1)
      
      return payments.filter((payment) => {
        const paymentDate = new Date(payment.paymentDate)
        return (
          paymentDate.getDate() === day &&
          paymentDate.getMonth() === actualMonth &&
          paymentDate.getFullYear() === targetYear
        )
      })
    }

    return payments.filter((payment) => {
      const paymentDate = new Date(payment.paymentDate)
      return (
        paymentDate.getDate() === day &&
        paymentDate.getMonth() === month &&
        paymentDate.getFullYear() === year
      )
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    )
  }

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  return (
    <div className="space-y-2">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Previous month days */}
        {prevMonthDays.map((day, index) => {
          const dayPayments = getPaymentsForDay(day, false, true)
          return (
            <div
              key={`prev-${index}`}
              className={cn(
                "min-h-24 p-2 rounded-lg border border-dashed",
                "bg-muted/30 text-muted-foreground",
                dayPayments.length > 0 && "cursor-pointer hover:bg-muted/50"
              )}
              onClick={() => {
                if (dayPayments.length > 0) {
                  const actualMonth = month === 0 ? 11 : month - 1
                  const actualYear = month === 0 ? year - 1 : year
                  onDayClick(new Date(actualYear, actualMonth, day))
                }
              }}
            >
              <div className="text-xs font-medium mb-1">{day}</div>
              {dayPayments.length > 0 && (
                <div className="space-y-1">
                  {dayPayments.slice(0, 2).map((payment) => (
                    <div
                      key={payment.id}
                      className={cn(
                        "text-xs p-1 rounded",
                        payment.isLate
                          ? "bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-100"
                          : "bg-green-100 dark:bg-green-950 text-green-900 dark:text-green-100"
                      )}
                    >
                      {formatCurrency(payment.amount + payment.gps)}
                    </div>
                  ))}
                  {dayPayments.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayPayments.length - 2} más
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {/* Current month days */}
        {currentMonthDays.map((day) => {
          const dayPayments = getPaymentsForDay(day, true, false)
          const isTodayDay = isToday(day)
          const hasPayments = dayPayments.length > 0

          return (
            <div
              key={`current-${day}`}
              className={cn(
                "min-h-24 p-2 rounded-lg border-2 transition-all",
                isTodayDay && "border-blue-500 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-950/20",
                hasPayments && !isTodayDay && "cursor-pointer hover:bg-accent border-border",
                hasPayments && isTodayDay && "cursor-pointer hover:bg-blue-100/50 dark:hover:bg-blue-950/30",
                !hasPayments && !isTodayDay && "border-border"
              )}
              onClick={() => {
                if (hasPayments) {
                  onDayClick(new Date(year, month, day))
                }
              }}
            >
              <div
                className={cn(
                  "text-sm font-semibold mb-2",
                  isTodayDay && "text-blue-600 dark:text-blue-400 font-bold text-base"
                )}
              >
                {day}
                {isTodayDay && (
                  <span className="ml-1 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                    HOY
                  </span>
                )}
              </div>
              {hasPayments && (
                <div className="space-y-1.5">
                  {dayPayments.slice(0, 2).map((payment) => (
                    <div
                      key={payment.id}
                      className={cn(
                        "text-xs p-2 rounded-md font-medium shadow-sm border transition-transform hover:scale-105",
                        payment.isLate
                          ? "bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-100 border-red-300 dark:border-red-800"
                          : "bg-green-100 dark:bg-green-950 text-green-900 dark:text-green-100 border-green-300 dark:border-green-800"
                      )}
                    >
                      <div className="font-bold">{formatCurrency(payment.amount + payment.gps)}</div>
                      {payment.isLate && (
                        <div className="text-[10px] mt-0.5 font-semibold">⚠️ Tardío</div>
                      )}
                    </div>
                  ))}
                  {dayPayments.length > 2 && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5 w-full justify-center">
                      +{dayPayments.length - 2} más
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {/* Next month days */}
        {nextMonthDays.map((day, index) => {
          const dayPayments = getPaymentsForDay(day, false, false)
          return (
            <div
              key={`next-${index}`}
              className={cn(
                "min-h-24 p-2 rounded-lg border border-dashed",
                "bg-muted/30 text-muted-foreground",
                dayPayments.length > 0 && "cursor-pointer hover:bg-muted/50"
              )}
              onClick={() => {
                if (dayPayments.length > 0) {
                  const actualMonth = month === 11 ? 0 : month + 1
                  const actualYear = month === 11 ? year + 1 : year
                  onDayClick(new Date(actualYear, actualMonth, day))
                }
              }}
            >
              <div className="text-xs font-medium mb-1">{day}</div>
              {dayPayments.length > 0 && (
                <div className="space-y-1">
                  {dayPayments.slice(0, 2).map((payment) => (
                    <div
                      key={payment.id}
                      className={cn(
                        "text-xs p-1 rounded",
                        payment.isLate
                          ? "bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-100"
                          : "bg-green-100 dark:bg-green-950 text-green-900 dark:text-green-100"
                      )}
                    >
                      {formatCurrency(payment.amount + payment.gps)}
                    </div>
                  ))}
                  {dayPayments.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayPayments.length - 2} más
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
