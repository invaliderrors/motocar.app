import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, AlertCircle, ArrowDownToLine, ArrowUpFromLine, Banknote, CreditCard } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { ProviderBadge } from "@/components/common/ProviderBadge"
import { SelectedTransaction } from "../types"

interface TransactionsTabProps {
    incomes: SelectedTransaction[]
    expenses: SelectedTransaction[]
}
export const TransactionsTab: React.FC<TransactionsTabProps> = ({ incomes, expenses }) => {
    if (incomes.length === 0 && expenses.length === 0) {
        return (
            <Card className="border shadow-sm">
                <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-xl flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Transacciones Seleccionadas
                    </CardTitle>
                    <CardDescription>Detalle de las transacciones incluidas en este cierre</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <AlertCircle className="h-10 w-10 text-amber-500 mb-2" />
                        <h3 className="text-lg font-medium text-amber-800">No hay transacciones seleccionadas</h3>
                        <p className="text-sm text-amber-700 max-w-md mt-1">
                            Seleccione al menos una transacción para poder registrar el cierre de caja y ver los detalles aquí.
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border shadow-sm">
            <CardHeader className="pb-3 border-b">
                <CardTitle className="text-xl flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Transacciones Seleccionadas
                </CardTitle>
                <CardDescription>Detalle de las transacciones incluidas en este cierre</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="space-y-6">
                    {incomes.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium flex items-center gap-2">
                                <ArrowDownToLine className="h-4 w-4 text-emerald-500" />
                                Ingresos ({incomes.length})
                            </h3>
                            <TransactionList transactions={incomes} isIncome />
                        </div>
                    )}
                    {expenses.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium flex items-center gap-2">
                                <ArrowUpFromLine className="h-4 w-4 text-red-500" />
                                Egresos ({expenses.length})
                            </h3>
                            <TransactionList transactions={expenses} isIncome={false} />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

const TransactionList: React.FC<{ transactions: SelectedTransaction[]; isIncome: boolean }> = ({
    transactions,
    isIncome,
}) => (
    <div className="border rounded-md overflow-hidden">
        <div className="grid grid-cols-4 gap-4 p-3 bg-muted/50 text-xs font-medium text-muted-foreground">
            <div>ID</div>
            <div>Método de Pago</div>
            <div>Proveedor</div>
            <div className="text-right">Monto</div>
        </div>
        <div className="divide-y">
            {transactions.map((tx) => (
                <div key={tx.id} className="grid grid-cols-4 gap-4 p-3 text-sm hover:bg-muted/20 transition-colors">
                    <div className="truncate">{tx.id}</div>
                    <div>
                        {tx.paymentMethod === "CASH" && (
                            <span className="flex items-center gap-1">
                                <Banknote className="h-3 w-3 text-emerald-500" />
                                Efectivo
                            </span>
                        )}
                        {tx.paymentMethod === "TRANSACTION" && (
                            <span className="flex items-center gap-1">
                                <ArrowDownToLine className="h-3 w-3 text-blue-500" />
                                Transferencia
                            </span>
                        )}
                        {tx.paymentMethod === "CARD" && (
                            <span className="flex items-center gap-1">
                                <CreditCard className="h-3 w-3 text-purple-500" />
                                Tarjeta
                            </span>
                        )}
                    </div>
                    <div>
                        {tx.provider ? (
                            <ProviderBadge provider={tx.provider} />
                        ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                        )}
                    </div>
                    <div
                        className={`text-right font-medium ${isIncome ? "text-emerald-600" : "text-red-600"}`}
                    >
                        {formatCurrency(tx.amount)}
                    </div>
                </div>
            ))}
        </div>
    </div>
)