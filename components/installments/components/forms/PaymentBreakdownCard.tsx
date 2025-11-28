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
            <CardHeader className="pb-1 pt-2 px-3">
                <CardTitle className="text-sm flex items-center gap-2 text-green-700 dark:text-green-300">
                    <DollarSign className="h-3.5 w-3.5" />
                    Desglose
                </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-2 pt-1">
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    <div>
                        <p className="text-[10px] font-medium text-green-600/70 dark:text-green-400/70">Capital</p>
                        <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                            {formatCurrency(breakdown.principalAmount)}
                        </p>
                    </div>
                    <div>
                        <p className="text-[10px] font-medium text-green-600/70 dark:text-green-400/70">Interés</p>
                        <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                            {formatCurrency(breakdown.interestAmount)}
                        </p>
                    </div>
                    {gps > 0 && (
                        <div>
                            <p className="text-[10px] font-medium text-green-600/70 dark:text-green-400/70">GPS</p>
                            <p className="text-sm font-semibold text-green-700 dark:text-green-300">{formatCurrency(gps)}</p>
                        </div>
                    )}
                    <div className={gps > 0 ? "" : "col-span-2"}>
                        <p className="text-[10px] font-medium text-green-600/70 dark:text-green-400/70">Total</p>
                        <p className="text-base font-bold text-green-700 dark:text-green-300">
                            {formatCurrency(breakdown.totalAmount)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
