import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Wallet, BanknoteIcon, Receipt, CreditCardIcon, DollarSign } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import type { Closing } from "@/lib/types"

interface FinancialSummaryCardProps {
    cashRegister: Closing
    totalIncome: number
    totalExpense: number
    balance: number
}

export const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({
    cashRegister,
    totalIncome,
    totalExpense,
    balance,
}) => {
    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-2 bg-slate-50 dark:bg-slate-900/50 rounded-t-lg">
                <CardTitle className="text-base flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-primary" />
                    Resumen Financiero
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                            <BanknoteIcon className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Efectivo en Caja</p>
                            <p className="font-medium">{formatCurrency(cashRegister.cashInRegister)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full">
                            <Receipt className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Transferencias</p>
                            <p className="font-medium">{formatCurrency(cashRegister.cashFromTransfers)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-100 dark:bg-purple-900/20 p-2 rounded-full">
                            <CreditCardIcon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Tarjetas</p>
                            <p className="font-medium">{formatCurrency(cashRegister.cashFromCards)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-100 dark:bg-amber-900/20 p-2 rounded-full">
                            <DollarSign className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Total Registrado</p>
                            <p className="font-medium">
                                {formatCurrency(
                                    cashRegister.cashInRegister + cashRegister.cashFromTransfers + cashRegister.cashFromCards,
                                )}
                            </p>
                        </div>
                    </div>
                </div>
                <Separator />
                <div className="grid grid-cols-3 gap-2">
                    <div>
                        <p className="text-xs text-muted-foreground">Total Ingresos</p>
                        <p className="font-medium text-green-600">{formatCurrency(totalIncome)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Total Egresos</p>
                        <p className="font-medium text-red-600">{formatCurrency(totalExpense)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">Balance</p>
                        <p className={`font-medium ${balance >= 0 ? "text-blue-600" : "text-amber-600"}`}>
                            {formatCurrency(balance)}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
