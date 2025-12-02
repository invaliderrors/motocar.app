"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreditCard, FileText } from "lucide-react"
import { InstallmentForm } from "@/components/installments/components/forms/installment-form"

import {
    ClientInfoCard,
    VehicleInfoCard,
    ContractDetailsCard,
    PaymentHistoryTable,
    LoanDetailsSkeleton,
    LoanNotFound,
    useLoanDetails,
} from "./details"

interface LoanDetailsModalProps {
    children: React.ReactNode
    loanId: string
    loanData?: any
}

export function LoanDetailsModal({ children, loanId, loanData }: LoanDetailsModalProps) {
    const [open, setOpen] = useState(false)
    const { 
        loan, 
        loading, 
        interests, 
        currentPage, 
        setCurrentPage,
        refetchLoan 
    } = useLoanDetails(loanId, open)

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (!newOpen) {
            setCurrentPage(1)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[950px] max-h-[90vh] overflow-y-auto p-0">
                <DialogHeader className="px-6 py-4 border-b border-border/50 bg-gradient-to-r from-primary/5 to-primary/10 sticky top-0 z-10">
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <FileText className="h-5 w-5 text-primary" />
                        Detalles del Contrato
                    </DialogTitle>
                </DialogHeader>

                <div className="px-6 py-4">
                    {loading ? (
                        <LoanDetailsSkeleton />
                    ) : loan ? (
                        <div className="space-y-6">
                            {/* Action Button */}
                            <div className="flex justify-end">
                                <InstallmentForm loanId={loan.id} onSaved={refetchLoan}>
                                    <Button className="gap-2 shadow-sm">
                                        <CreditCard className="h-4 w-4" />
                                        Registrar Pago
                                    </Button>
                                </InstallmentForm>
                            </div>

                            {/* Client & Vehicle Information */}
                            <div className="grid gap-6 md:grid-cols-2">
                                <ClientInfoCard 
                                    user={loan.user} 
                                    loanId={loan.id} 
                                />
                                <VehicleInfoCard 
                                    vehicle={loan.vehicle || loan.motorcycle} 
                                />
                            </div>

                            {/* Contract Details */}
                            <ContractDetailsCard 
                                loan={loan} 
                                interests={interests} 
                            />

                            {/* Payment History */}
                            <PaymentHistoryTable
                                payments={loan.payments}
                                currentPage={currentPage}
                                itemsPerPage={10}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    ) : (
                        <LoanNotFound />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
