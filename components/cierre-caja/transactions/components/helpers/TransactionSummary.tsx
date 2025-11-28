import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { ArrowDownToLine, ArrowUpToLine, Wallet, CheckSquare } from "lucide-react"

interface TransactionSummaryProps {
    totalIncome: number
    totalExpense: number
    netAmount: number
    selectedCount?: number
    selectedSummary?: {
        totalIncome: number
        totalExpense: number
        netAmount: number
    }
}

export function TransactionSummary({
    totalIncome,
    totalExpense,
    netAmount,
    selectedCount = 0,
    selectedSummary,
}: TransactionSummaryProps) {
    // Show selected summary if there are selections, otherwise show total summary
    const displayIncome = selectedCount > 0 ? selectedSummary?.totalIncome || 0 : totalIncome
    const displayExpense = selectedCount > 0 ? selectedSummary?.totalExpense || 0 : totalExpense
    const displayNet = selectedCount > 0 ? selectedSummary?.netAmount || 0 : netAmount
    const isShowingSelected = selectedCount > 0

    return (
        <div className="space-y-4">
            {isShowingSelected && (
                <div className="flex items-center gap-2 text-sm text-primary">
                    <CheckSquare className="h-4 w-4" />
                    <span>Mostrando resumen de {selectedCount} transacciones seleccionadas</span>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                    className={`${isShowingSelected ? "ring-2 ring-primary/30" : ""} bg-card border-border`}
                >
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {isShowingSelected ? "Ingresos Seleccionados" : "Total Ingresos"}
                                </p>
                                <p className="text-2xl font-bold text-green-500">{formatCurrency(displayIncome)}</p>
                            </div>
                            <div className="bg-green-500/10 p-3 rounded-full">
                                <ArrowUpToLine className="h-6 w-6 text-green-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card
                    className={`${isShowingSelected ? "ring-2 ring-primary/30" : ""} bg-card border-border`}
                >
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {isShowingSelected ? "Egresos Seleccionados" : "Total Egresos"}
                                </p>
                                <p className="text-2xl font-bold text-red-500">{formatCurrency(displayExpense)}</p>
                            </div>
                            <div className="bg-red-500/10 p-3 rounded-full">
                                <ArrowDownToLine className="h-6 w-6 text-red-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card
                    className={`${isShowingSelected ? "ring-2 ring-primary/30" : ""} bg-card border-border`}
                >
                    <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">
                                    {isShowingSelected ? "Balance Seleccionado" : "Balance Neto"}
                                </p>
                                <p
                                    className={`text-2xl font-bold ${displayNet >= 0 ? "text-primary" : "text-amber-500"
                                        }`}
                                >
                                    {formatCurrency(displayNet)}
                                </p>
                            </div>
                            <div
                                className={`p-3 rounded-full ${displayNet >= 0 ? "bg-primary/10" : "bg-amber-500/10"
                                    }`}
                            >
                                <Wallet
                                    className={`h-6 w-6 ${displayNet >= 0 ? "text-primary" : "text-amber-500"
                                        }`}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
