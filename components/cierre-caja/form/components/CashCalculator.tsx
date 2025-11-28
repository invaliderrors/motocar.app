"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Calculator, AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { formatCurrency, cn } from "@/lib/utils"

interface CashCalculatorProps {
    expectedCash: number
    onCashCountChange: (total: number) => void
    currentValue: string
}

interface BillCount {
    denomination: number
    quantity: number
}

const DENOMINATIONS = [100000, 50000, 20000, 10000, 5000, 2000, 1000, 500, 200, 100]

export function CashCalculator({ expectedCash, onCashCountChange, currentValue }: CashCalculatorProps) {
    const [billCounts, setBillCounts] = useState<BillCount[]>(
        DENOMINATIONS.map(d => ({ denomination: d, quantity: 0 }))
    )
    const [calculatedTotal, setCalculatedTotal] = useState(0)

    useEffect(() => {
        const total = billCounts.reduce((sum, bill) => sum + (bill.denomination * bill.quantity), 0)
        setCalculatedTotal(total)
        onCashCountChange(total)
    }, [billCounts]) // Remove onCashCountChange from dependencies to prevent infinite loop

    const handleQuantityChange = (denomination: number, value: string) => {
        const quantity = parseInt(value) || 0
        setBillCounts(prev =>
            prev.map(bill =>
                bill.denomination === denomination
                    ? { ...bill, quantity: Math.max(0, quantity) }
                    : bill
            )
        )
    }

    const resetCalculator = () => {
        setBillCounts(DENOMINATIONS.map(d => ({ denomination: d, quantity: 0 })))
    }

    const difference = calculatedTotal - expectedCash
    const isMatch = Math.abs(difference) < 1 // Tolerance of 1 peso
    const currentInputValue = parseFloat(currentValue) || 0
    const inputMatchesCalculator = Math.abs(currentInputValue - calculatedTotal) < 1

    return (
        <Card className="border-2 border-dashed border-primary/20 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-950/10">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Calculator className="h-5 w-5 text-emerald-600" />
                    Calculadora de Efectivo
                </CardTitle>
                <CardDescription>
                    Cuente los billetes físicos para verificar el efectivo en caja
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Bills counter */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {billCounts.map(({ denomination, quantity }) => {
                        const subtotal = denomination * quantity
                        return (
                            <div
                                key={denomination}
                                className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
                            >
                                <div className="flex-1 grid grid-cols-3 gap-3 items-center">
                                    <Label className="text-sm font-semibold text-foreground whitespace-nowrap">
                                        {formatCurrency(denomination)}
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">×</span>
                                        <Input
                                            type="number"
                                            min="0"
                                            value={quantity || ""}
                                            onChange={(e) => handleQuantityChange(denomination, e.target.value)}
                                            className="h-9 text-center"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="text-right">
                                        <span className={cn(
                                            "text-sm font-medium",
                                            subtotal > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                                        )}>
                                            {formatCurrency(subtotal)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Summary */}
                <div className="pt-4 border-t border-border space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span className="font-semibold text-foreground">Total Contado:</span>
                        <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(calculatedTotal)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                        <span className="font-medium text-muted-foreground">Esperado del Sistema:</span>
                        <span className="text-lg font-semibold text-foreground">
                            {formatCurrency(expectedCash)}
                        </span>
                    </div>

                    {/* Validation Alert */}
                    {calculatedTotal > 0 && (
                        <Alert
                            className={cn(
                                "border-2",
                                isMatch
                                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                                    : "border-destructive bg-destructive/10"
                            )}
                        >
                            {isMatch ? (
                                <>
                                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                    <AlertDescription className="text-emerald-700 dark:text-emerald-400 font-medium">
                                        ✓ El efectivo contado coincide con el sistema
                                    </AlertDescription>
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-5 w-5 text-destructive" />
                                    <AlertDescription className="text-destructive font-medium">
                                        <div>Diferencia: {formatCurrency(Math.abs(difference))}</div>
                                        <div className="text-sm mt-1">
                                            {difference > 0 ? "Sobra" : "Falta"} efectivo
                                        </div>
                                    </AlertDescription>
                                </>
                            )}
                        </Alert>
                    )}

                    {/* Warning if input doesn't match calculator */}
                    {calculatedTotal > 0 && !inputMatchesCalculator && (
                        <Alert className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                            <AlertDescription className="text-amber-700 dark:text-amber-400">
                                El total calculado ({formatCurrency(calculatedTotal)}) no coincide con el valor ingresado arriba ({formatCurrency(currentInputValue)}).
                                El sistema usará el valor de la calculadora.
                            </AlertDescription>
                        </Alert>
                    )}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={resetCalculator}
                        className="w-full"
                        disabled={calculatedTotal === 0}
                    >
                        Limpiar Calculadora
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
