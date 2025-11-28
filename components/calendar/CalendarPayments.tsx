"use client"

import { Card } from "@/components/ui/card"
import { CalendarHeader } from "./components/CalendarHeader"
import { CalendarGrid } from "./components/CalendarGrid"
import { CalendarLegend } from "./components/CalendarLegend"
import { CalendarStats } from "./components/CalendarStats"
import { PaymentDetailsDialog } from "./components/PaymentDetailsDialog"
import { useCalendarPayments } from "./hooks/useCalendarPayments"

export function CalendarPayments() {
  const {
    currentDate,
    selectedLoan,
    loans,
    payments,
    loading,
    selectedPayment,
    dialogOpen,
    totalPayments,
    totalAmount,
    setSelectedLoan,
    handlePreviousMonth,
    handleNextMonth,
    handleToday,
    handleDayClick,
    handleRefresh,
    handleExport,
    setDialogOpen,
  } = useCalendarPayments()

  return (
    <div className="h-full flex flex-col space-y-4">
      <CalendarHeader
        currentDate={currentDate}
        selectedLoan={selectedLoan}
        loans={loans}
        loading={loading}
        onLoanSelect={setSelectedLoan}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
        onRefresh={handleRefresh}
        onExport={handleExport}
        totalPayments={totalPayments}
        totalAmount={totalAmount}
      />

      {/* Statistics Cards */}
      {selectedLoan && payments.length > 0 && (
        <CalendarStats payments={payments} currentMonth={currentDate} />
      )}

      <Card className="flex-1 p-6 min-h-0 overflow-auto">
        {!selectedLoan ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-full p-6 mb-4">
              <svg
                className="h-16 w-16 text-blue-500 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              Selecciona un préstamo
            </h3>
            <p className="text-muted-foreground max-w-md">
              Busca por placa del vehículo o selecciona un préstamo del menú desplegable para ver los pagos en el calendario
            </p>
          </div>
        ) : (
          <CalendarGrid
            currentDate={currentDate}
            payments={payments}
            onDayClick={handleDayClick}
          />
        )}
      </Card>

      <CalendarLegend />

      <PaymentDetailsDialog
        open={dialogOpen}
        payment={selectedPayment}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
