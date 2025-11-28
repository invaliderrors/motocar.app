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
import { FileAttachmentSection } from "./FileAttachmentSection"
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
    isLate,
    isAdvance,
    dueDate,
    lastInstallmentInfo,
    handleLoanChange,
    handleFileChange,
    removeFile,
    onSubmit,
    handleDialogChange,
  } = useInstallmentForm({ loanId, installment, onSaved })

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[900px] p-0 max-h-[90vh] overflow-auto">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            {isEditing ? "Editar Cuota" : "Registrar Pago de Cuota"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifique los datos de la cuota existente."
              : "Complete el formulario para registrar un nuevo pago de cuota."}
          </DialogDescription>
        </DialogHeader>

        {loadingData ? (
          <div className="p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row">
              {/* Left column - Form fields */}
              <div className="flex-1 p-6 pt-0 border-r">
                <div className="space-y-6">
                  <ClientInformationCard
                    control={form.control}
                    loans={loans}
                    selectedLoan={selectedLoan}
                    onLoanChange={handleLoanChange}
                  />

                  <PaymentDetailsCard control={form.control} isLate={isLate} isAdvance={isAdvance} dueDate={dueDate} />

                  <FileAttachmentSection
                    selectedFile={selectedFile}
                    filePreview={filePreview}
                    uploadProgress={uploadProgress}
                    isUploading={isUploading}
                    fileInputRef={fileInputRef}
                    onFileChange={handleFileChange}
                    onRemoveFile={removeFile}
                  />
                </div>
              </div>

              {/* Right column - Summary and data */}
              <div className="flex-1 p-6 pt-0">
                <div className="space-y-6">
                  {selectedLoan ? (
                    <>
                      {/* Payment Status - Most Prominent */}
                      <PaymentStatusSection
                        lastInstallmentInfo={lastInstallmentInfo}
                        payments={selectedLoan.payments || []}
                      />

                      <LoanInformationCard loan={selectedLoan} />

                      {paymentBreakdown && (
                        <>
                          <PaymentBreakdownCard breakdown={paymentBreakdown} gps={gps} />
                          <PaymentSummaryCard
                            loanAmount={selectedLoan.financedAmount}
                            paidAmount={selectedLoan.totalCapitalPaid}
                            remainingAmount={selectedLoan.debtRemaining}
                            progress={(selectedLoan.totalCapitalPaid / selectedLoan.financedAmount) * 100}
                          />
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-center text-muted-foreground">
                      <User className="h-12 w-12 mb-4 opacity-20" />
                      <h3 className="text-lg font-medium mb-2">Seleccione un cliente</h3>
                      <p className="text-sm max-w-xs">
                        Seleccione un cliente para ver la información del contrato y calcular el desglose del pago
                      </p>
                    </div>
                  )}
                </div>

                <ActionButtons
                  loading={loading}
                  isEditing={isEditing}
                  selectedLoan={selectedLoan}
                  onCancel={() => handleDialogChange(false)}
                />
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
