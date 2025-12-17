"use client"

import type React from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { Skeleton } from "@/components/ui/skeleton"
import { CreditCard, User } from "lucide-react"

import { PaymentSummaryCard } from "../payment-summary-card"
import { useInstallmentForm } from "../../hooks/useInstallmentForm"
import { ActionButtons } from "./ActionButtons"
import { ClientInformationCard } from "./ClientInformationCard"
import { LoanInformationCard } from "./LoanInformationCard"
import { PaymentBreakdownCard } from "./PaymentBreakdownCard"
import { PaymentDetailsCard } from "./PaymentDetailsCard"
import { PaymentStatusSection } from "./PaymentStatusSection"

export function InstallmentForm({
  children,
  loanId,
  installment,
  onSaved,
}: {
  children?: React.ReactNode
  loanId?: string
  installment?: any
  onSaved?: () => void
}) {
  const {
    open,
    loading,
    loans,
    loadingData,
    selectedLoan,
    paymentBreakdown,
    selectedFile,
    filePreview,
    uploadProgress,
    isUploading,
    isEditing,
    fileInputRef,
    form,
    gps,
    lastInstallmentInfo,
    paymentCoverage,
    loadingCoverage,
    loanNews,
    loadingNews,
    handleLoanChange,
    handleFileChange,
    removeFile,
    onSubmit,
    handleDialogChange,
  } = useInstallmentForm({ loanId, installment, onSaved })

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[1100px] p-0 max-h-[85vh] overflow-hidden">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            {isEditing ? "Editar Cuota" : "Registrar Pago de Cuota"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {isEditing
              ? "Modifique los datos de la cuota existente."
              : "Complete el formulario para registrar un nuevo pago de cuota."}
          </DialogDescription>
        </DialogHeader>

        {loadingData ? (
          <div className="p-4 grid grid-cols-3 gap-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-4 pb-4">
              {/* 3-column layout: Left (Client + Payment) wider | Middle (Summary + Contract + Breakdown) | Right (Status) */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr] gap-3">
                {/* LEFT COLUMN: Client Info + Payment Details (with attachment inside) */}
                <div className="space-y-3">
                  <ClientInformationCard
                    control={form.control}
                    loans={loans}
                    selectedLoan={selectedLoan}
                    onLoanChange={handleLoanChange}
                  />
                  <PaymentDetailsCard 
                    control={form.control} 
                    paymentCoverage={paymentCoverage}
                    loadingCoverage={loadingCoverage}
                    loanNews={loanNews}
                    loadingNews={loadingNews}
                    fileAttachment={{
                      selectedFile,
                      filePreview,
                      uploadProgress,
                      isUploading,
                      fileInputRef,
                      onFileChange: handleFileChange,
                      onRemoveFile: removeFile,
                    }}
                  />
                </div>

                {/* MIDDLE COLUMN: Summary + Contract + Breakdown */}
                <div className="space-y-3">
                  {selectedLoan && paymentBreakdown ? (
                    <>
                      <PaymentSummaryCard
                        loanAmount={selectedLoan.totalAmount}
                        paidAmount={selectedLoan.totalPaid}
                        remainingAmount={selectedLoan.debtRemaining}
                        progress={Math.min(100, (selectedLoan.totalPaid / selectedLoan.totalAmount) * 100)}
                      />
                      <LoanInformationCard loan={selectedLoan} />
                      <PaymentBreakdownCard breakdown={paymentBreakdown} gps={gps} />
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-center text-muted-foreground border rounded-lg">
                      <User className="h-10 w-10 mb-3 opacity-20" />
                      <h3 className="text-sm font-medium mb-1">Seleccione un cliente</h3>
                      <p className="text-xs max-w-[180px]">
                        Para ver información del contrato
                      </p>
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN: Payment Status + Action Buttons */}
                <div className="flex flex-col">
                  <div className="flex-1">
                    {selectedLoan ? (
                      <PaymentStatusSection
                        lastInstallmentInfo={lastInstallmentInfo}
                        payments={selectedLoan.payments || []}
                        paymentCoverage={paymentCoverage}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full py-12 text-center text-muted-foreground border rounded-lg">
                        <p className="text-xs">Estado de pagos</p>
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <ActionButtons
                      loading={loading}
                      isEditing={isEditing}
                      selectedLoan={selectedLoan}
                      onCancel={() => handleDialogChange(false)}
                    />
                  </div>
                </div>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
