import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Calculator } from "lucide-react"

interface PaymentSummaryProps {
    loanAmount: number
    paidAmount: number
    remainingAmount: number
    progress: number
    nextPaymentDate?: Date
}

export function PaymentSummaryCard({
    loanAmount = 0,
    paidAmount = 0,
    remainingAmount = 0,
    progress = 0,
    nextPaymentDate,
}: Partial<PaymentSummaryProps>) {
    return (
        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/20 border-amber-200 dark:border-amber-800/30 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-amber-700 dark:text-amber-300">
                    <Calculator className="h-4 w-4" />
                    Resumen de pagos
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <p className="text-xs font-medium text-amber-600/70 dark:text-amber-400/70 mb-1">Monto financiado:</p>
                            <p className="text-base font-semibold text-amber-700 dark:text-amber-300">{formatCurrency(loanAmount)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-amber-600/70 dark:text-amber-400/70 mb-1">Total pagado:</p>
                            <p className="text-base font-semibold text-amber-700 dark:text-amber-300">{formatCurrency(paidAmount)}</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-1">
                            <p className="text-xs font-medium text-amber-600/70 dark:text-amber-400/70">Progreso del préstamo:</p>
                            <p className="text-xs font-medium text-amber-600/70 dark:text-amber-400/70">{Math.round(progress)}%</p>
                        </div>
                        <div className="w-full bg-amber-200/50 dark:bg-amber-800/30 rounded-full h-2.5">
                            <div
                                className="bg-amber-500 dark:bg-amber-400 h-2.5 rounded-full"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs font-medium text-amber-600/70 dark:text-amber-400/70 mb-1">Saldo pendiente:</p>
                        <p className="text-xl font-semibold text-amber-700 dark:text-amber-300">
                            {formatCurrency(remainingAmount)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
