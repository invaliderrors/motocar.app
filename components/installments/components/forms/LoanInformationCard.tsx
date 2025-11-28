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
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Info className="h-4 w-4" />
                    Información del contrato
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3 mb-3">
                    <div>
                        <p className="text-xs font-medium text-blue-600/70 dark:text-blue-400/70 mb-1">Contrato:</p>
                        <p className="text-base font-semibold text-blue-700 dark:text-blue-300">#{loan.contractNumber}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-xs font-medium text-blue-600/70 dark:text-blue-400/70 mb-1">Deuda restante:</p>
                        <p className="text-base font-semibold text-blue-700 dark:text-blue-300">
                            {formatCurrency(loan.debtRemaining)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-blue-600/70 dark:text-blue-400/70 mb-1">Cuota diaria:</p>
                        <p className="text-base font-semibold text-blue-700 dark:text-blue-300">
                            {formatCurrency(loan.monthlyPayment)}
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-xs font-medium text-blue-600/70 dark:text-blue-400/70 mb-1">Tasa de interés:</p>
                        <p className="text-base font-semibold text-blue-700 dark:text-blue-300">
                            {loan.interestRate}%
                            <span className="text-xs ml-1 font-normal">({loan.interestType === "FIXED" ? "Fijo" : "Compuesto"})</span>
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-blue-600/70 dark:text-blue-400/70 mb-1">Próxima cuota:</p>
                        <p className="text-base font-semibold text-blue-700 dark:text-blue-300">#{loan.nextInstallmentNumber}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
