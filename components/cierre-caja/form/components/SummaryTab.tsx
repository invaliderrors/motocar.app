import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { TrendingUp, Banknote, ArrowDownToLine, CreditCard, AlertCircle } from "lucide-react"
import { formatCurrency, cn } from "@/lib/utils"
import { ProviderBadge } from "@/components/common/ProviderBadge"
import { FormCalculations } from "../types"
import { Expense, Installment, Provider } from "@/lib/types"

interface SummaryTabProps {
    calculations: FormCalculations
    incomes: any[]
    expenses: any[]
    currentProvider?: Provider
}

export const SummaryTab: React.FC<SummaryTabProps> = ({ calculations, incomes, expenses, currentProvider }) => {
    return (
        <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-xl flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Resumen del Cierre
                </CardTitle>
                <CardDescription>Información detallada sobre las transacciones seleccionadas</CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
                {/* Income Breakdown */}
                <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border-2 border-emerald-200 dark:border-emerald-800">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Desglose de Recaudos
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground mb-1">Recaudo Base Vehículos</p>
                            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                {formatCurrency(incomes.reduce((acc, i) => acc + (i.baseAmount || i.amount), 0))}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{incomes.length} pago{incomes.length !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="text-center border-l border-r border-emerald-300 dark:border-emerald-700">
                            <p className="text-xs text-muted-foreground mb-1">Recaudo GPS</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {formatCurrency(incomes.reduce((acc, i) => acc + (i.gpsAmount || 0), 0))}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Adicional</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground mb-1">Total Ingresos</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(calculations.totalExpected)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">Base + GPS</p>
                        </div>
                    </div>
                </div>

                {/* Totales */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <SummaryCard
                        title="Total Egresos"
                        amount={calculations.totalExpenses}
                        color="red"
                        count={expenses.length}
                    />
                    <SummaryCard
                        title="Total Registrado"
                        amount={calculations.totalRegistered}
                        color="blue"
                        count={undefined}
                    />
                </div>

                {/* Métodos de pago */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Desglose por Método de Pago</h3>
                    <div className="space-y-3">
                        <PaymentLine
                            icon={<Banknote className="h-4 w-4 text-emerald-500" />}
                            label="Efectivo"
                            value={calculations.cashInRegister}
                            textColor="text-emerald-600"
                        />
                        <PaymentLine
                            icon={<ArrowDownToLine className="h-4 w-4 text-blue-500" />}
                            label="Transferencias"
                            value={calculations.cashFromTransfers}
                            textColor="text-blue-600"
                        />
                        <PaymentLine
                            icon={<CreditCard className="h-4 w-4 text-purple-500" />}
                            label="Tarjetas"
                            value={calculations.cashFromCards}
                            textColor="text-purple-600"
                        />
                    </div>
                </div>

                {/* Información proveedor */}
                <div className="space-y-4 mt-6">
                    <h3 className="text-sm font-medium text-muted-foreground">Información del Proveedor</h3>
                    {currentProvider ? (
                        <div className="flex justify-between items-center p-3 border border-border rounded-md bg-muted/50">
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Proveedor</span>
                            </div>
                            <ProviderBadge provider={currentProvider} />
                        </div>
                    ) : (
                        <div className="flex justify-between items-center p-3 border border-border rounded-md bg-muted/50">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-amber-500" />
                                <span className="font-medium">Proveedor</span>
                            </div>
                            <span className="text-amber-500 text-sm">No seleccionado</span>
                        </div>
                    )}
                </div>

                <Separator className="my-6" />

                {/* Diferencia */}
                <div className="flex justify-between items-center">
                    <div>
                        <span className="font-medium text-lg">Diferencia</span>
                        <p className="text-xs text-muted-foreground mt-1">
                            {calculations.totalDifference === 0
                                ? "Los montos coinciden exactamente"
                                : calculations.totalDifference > 0
                                    ? "Hay un excedente en el registro"
                                    : "Hay un faltante en el registro"}
                        </p>
                    </div>
                    <span
                        className={cn(
                            "font-bold text-2xl",
                            calculations.totalDifference === 0
                                ? "text-emerald-600"
                                : calculations.totalDifference > 0
                                    ? "text-emerald-600"
                                    : "text-red-600",
                        )}
                    >
                        {formatCurrency(calculations.totalDifference)}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}

// Subcomponentes para mejor organización:

const SummaryCard = ({
    title,
    amount,
    color,
    count,
}: {
    title: string
    amount: number
    color: "emerald" | "red" | "blue"
    count?: number
}) => (
    <div className="rounded-lg p-4 flex flex-col items-center justify-center border relative overflow-hidden">
        <div className={`absolute inset-0 bg-${color}-50 opacity-20`} />
        <div className="relative z-10">
            <span className={`text-${color}-600 font-medium text-sm`}>{title}</span>
            <div className="flex items-center justify-center gap-2 mt-1">
                <span className={`text-2xl font-bold text-${color}-700`}>{formatCurrency(amount)}</span>
            </div>
            {typeof count === "number" && (
                <span className="text-xs text-muted-foreground mt-1 block">{count} transacciones</span>
            )}
        </div>
    </div>
)

const PaymentLine = ({
    icon,
    label,
    value,
    textColor,
}: {
    icon: React.ReactNode
    label: string
    value: number
    textColor: string
}) => (
    <div className="flex justify-between items-center p-3 border rounded-md bg-muted/20">
        <div className="flex items-center gap-2">
            {icon}
            <span className="font-medium">{label}</span>
        </div>
        <span className={`font-bold ${textColor}`}>{formatCurrency(value)}</span>
    </div>
)
