"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { EnrichedLoan } from "../../hooks/useInstallmentForm"

interface LoanInformationCardProps {
    loan: EnrichedLoan
}

export function LoanInformationCard({ loan }: LoanInformationCardProps) {
    return (
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/20 border-blue-200 dark:border-blue-800/30 shadow-sm">
            <CardHeader className="pb-1 pt-2 px-3">
                <CardTitle className="text-sm flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Info className="h-3.5 w-3.5" />
                    Contrato #{loan.contractNumber}
                </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-2 pt-1">
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    <div>
                        <p className="text-[10px] font-medium text-blue-600/70 dark:text-blue-400/70">Deuda</p>
                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                            {formatCurrency(loan.debtRemaining)}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-medium text-blue-600/70 dark:text-blue-400/70">Cuota diaria</p>
                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                            {formatCurrency(loan.monthlyPayment)}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-medium text-blue-600/70 dark:text-blue-400/70">Interés</p>
                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                            {loan.interestRate}% {loan.interestType === "FIXED" ? "(Fijo)" : "(Comp)"}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-medium text-blue-600/70 dark:text-blue-400/70">Próxima cuota</p>
                        <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">#{loan.nextInstallmentNumber}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
