"use client"

import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CreditCard, Save } from "lucide-react"
import { LoanFormClientVehicleCard } from "./components/LoanFormClientVehicleCard"
import { LoanFormDetailsCard } from "./components/LoanFormsDetailsCard"
import { LoanFormSummaryCard } from "./components/LoanFormSummaryCard"
import { LoanFormTermsCard } from "./components/LoanFormTermsCard"
import { useLoanForm } from "./hooks/useLoanForm"
import { Loan } from "@/lib/types"

interface LoanFormProps {
  children: React.ReactNode
  loanId?: string
  loanData?: Loan
  onSaved?: (updatedLoan?: any) => void
}

export function LoanForm({ children, loanId, loanData, onSaved }: LoanFormProps) {
  const {
    isOpen,
    loading,
    loadingData,
    availableUsers,
    availableVehicles,
    loanSummary,
    form,
    formValues,
    handleOpenDialog,
    handleCloseDialog,
    handleVehicleChange,
    onSubmit,
    formatCurrency,
    formatNumber,
    parseFormattedNumber,
    getFrequencyText,
    originalUseCalendarDays,
    loanId: formLoanId,
  } = useLoanForm({ loanId, loanData, onSaved })

  return (
    <>
      <div onClick={handleOpenDialog}>{children}</div>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={(open) => (open ? handleOpenDialog() : handleCloseDialog())}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                {loanId ? "Editar contrato" : "Nuevo contrato"}
              </DialogTitle>
              <DialogDescription>
                Complete el formulario para {loanId ? "actualizar el" : "crear un nuevo"} contrato.
                {!loanId && (
                  <span className="block text-sm text-muted-foreground mt-1">
                    Solo se muestran clientes y vehículos disponibles (no asignados a contratos activos).
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            {loadingData ? (
              <div className="py-6 space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                  <LoanFormClientVehicleCard
                    control={form.control}
                    availableUsers={availableUsers}
                    availableVehicles={availableVehicles}
                    onVehicleChange={handleVehicleChange}
                    formatCurrency={formatCurrency}
                  />

                  <LoanFormDetailsCard
                    control={form.control}
                    formatNumber={formatNumber}
                    parseFormattedNumber={parseFormattedNumber}
                  />

                  <LoanFormTermsCard
                    control={form.control}
                    formValues={formValues}
                    formatNumber={formatNumber}
                    parseFormattedNumber={parseFormattedNumber}
                    originalUseCalendarDays={originalUseCalendarDays}
                    loanId={formLoanId}
                  />

                  <LoanFormSummaryCard
                    loanSummary={loanSummary}
                    formValues={formValues}
                    formatCurrency={formatCurrency}
                    getFrequencyText={getFrequencyText}
                  />

                  <div className="flex justify-end gap-4 pt-2">
                    <Button type="button" variant="outline" onClick={handleCloseDialog}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={loading} className="gap-2">
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          {loanId ? "Actualizar" : "Crear"}
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
