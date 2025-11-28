"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface PaymentBreakdown {
    principalAmount: number
    interestAmount: number
    totalAmount: number
}

interface PaymentBreakdownCardProps {
    breakdown: PaymentBreakdown
    gps: number
}

export function PaymentBreakdownCard({ breakdown, gps }: PaymentBreakdownCardProps) {
    return (
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/20 border-green-200 dark:border-green-800/30 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-green-700 dark:text-green-300">
                    <DollarSign className="h-4 w-4" />
                    Desglose del pago
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <p className="text-xs font-medium text-green-600/70 dark:text-green-400/70 mb-1">Capital:</p>
                            <p className="text-base font-semibold text-green-700 dark:text-green-300">
                                {formatCurrency(breakdown.principalAmount)}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-green-600/70 dark:text-green-400/70 mb-1">Interés:</p>
                            <p className="text-base font-semibold text-green-700 dark:text-green-300">
                                {formatCurrency(breakdown.interestAmount)}
                            </p>
                        </div>
                    </div>
                    {gps > 0 && (
                        <div>
                            <p className="text-xs font-medium text-green-600/70 dark:text-green-400/70 mb-1">GPS:</p>
                            <p className="text-base font-semibold text-green-700 dark:text-green-300">{formatCurrency(gps)}</p>
                        </div>
                    )}
                    <div className="pt-3 mt-3 border-t border-green-200 dark:border-green-800/50">
                        <p className="text-xs font-medium text-green-600/70 dark:text-green-400/70 mb-1">Total a pagar:</p>
                        <p className="text-xl font-semibold text-green-700 dark:text-green-300">
                            {formatCurrency(breakdown.totalAmount)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
