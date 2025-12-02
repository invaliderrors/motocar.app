"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loan } from "@/lib/types"
import { ContractStatusBadge } from "./ContractStatusBadge"
import { FinancialSummaryGrid } from "./FinancialSummaryGrid"
import { PaymentProgressGrid } from "./PaymentProgressGrid"
import { DatesAndGpsRow } from "./DatesAndGpsRow"
import { FileText } from "lucide-react"

interface ContractDetailsCardProps {
    loan: Loan
    interests: number
}

export function ContractDetailsCard({ loan, interests }: ContractDetailsCardProps) {
    const totalWithInterest = loan.totalAmount + (interests * loan.installments || 0)
    const interestGenerated = (interests || 0) * (loan.paidInstallments || 0)

    return (
        <Card className="overflow-hidden border-border/50 shadow-sm">
            <CardHeader className="pb-3 bg-gradient-to-r from-violet-500/10 to-purple-500/10">
                <CardTitle className="flex items-center text-base">
                    <FileText className="mr-2 h-4 w-4 text-violet-500" />
                    Detalles del Contrato
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                {/* Contract Status */}
                <ContractStatusBadge 
                    status={loan.status} 
                    contractNumber={loan.contractNumber} 
                />
                
                {/* Financial Summary */}
                <FinancialSummaryGrid
                    totalAmount={loan.totalAmount}
                    downPayment={loan.downPayment}
                    totalWithInterest={totalWithInterest}
                    interestRate={loan.interestRate}
                    installmentAmount={loan.installmentPaymentAmmount || 0}
                    paymentFrequency={loan.paymentFrequency || "DAILY"}
                    interestType={loan.interestType || "FIXED"}
                    totalInstallments={loan.installments || 0}
                />
                
                {/* Payment Progress */}
                <PaymentProgressGrid
                    paidInstallments={loan.paidInstallments || 0}
                    totalInstallments={loan.installments || 0}
                    totalPaid={loan.totalPaid || 0}
                    debtRemaining={loan.debtRemaining || 0}
                    remainingInstallments={loan.remainingInstallments || 0}
                    installmentAmount={loan.installmentPaymentAmmount || 0}
                    interestGenerated={interestGenerated}
                    interestRate={loan.interestRate || 0}
                />
                
                {/* Dates and GPS */}
                <DatesAndGpsRow
                    startDate={loan.startDate}
                    endDate={loan.endDate}
                    gpsInstallmentPayment={loan.gpsInstallmentPayment}
                />
            </CardContent>
        </Card>
    )
}
