import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpToLine, ArrowDownToLine, Wallet } from 'lucide-react'
import { formatCurrency } from "@/lib/utils"

interface SummaryCardsProps {
    totalIncome: number
    totalExpense: number
    totalBalance: number
    totalPayments: number
    totalExpenses: number
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
    totalIncome,
    totalExpense,
    totalBalance,
    totalPayments,
    totalExpenses,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
            <Card className="bg-card border-border">
                <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Ingresos</p>
                            <p className="text-2xl font-bold text-green-500">{formatCurrency(totalIncome)}</p>
                        </div>
                        <div className="bg-green-500/10 p-3 rounded-full">
                            <ArrowUpToLine className="h-6 w-6 text-green-500" />
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        {totalPayments} transacciones registradas
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-card border-border">
                <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Egresos</p>
                            <p className="text-2xl font-bold text-red-500">{formatCurrency(totalExpense)}</p>
                        </div>
                        <div className="bg-red-500/10 p-3 rounded-full">
                            <ArrowDownToLine className="h-6 w-6 text-red-500" />
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        {totalExpenses} transacciones registradas
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-card border-border">
                <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">
                                Balance Neto
                            </p>
                            <p
                                className={`text-2xl font-bold ${totalBalance >= 0 ? "text-primary" : "text-amber-500"
                                    }`}
                            >
                                {formatCurrency(totalBalance)}
                            </p>
                        </div>
                        <div
                            className={`p-3 rounded-full ${totalBalance >= 0 ? "bg-primary/10" : "bg-amber-500/10"
                                }`}
                        >
                            <Wallet
                                className={`h-6 w-6 ${totalBalance >= 0 ? "text-primary" : "text-amber-500"
                                    }`}
                            />
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        {totalBalance >= 0 ? "Balance positivo" : "Balance negativo"}
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
