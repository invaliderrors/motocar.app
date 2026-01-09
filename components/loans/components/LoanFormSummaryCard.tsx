"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LoanFormSummaryCardProps {
    loanSummary: any
    formValues: any
    formatCurrency: (amount: number) => string
    getFrequencyText: (frequency: string) => string
}

export function LoanFormSummaryCard({
    loanSummary,
    formValues,
    formatCurrency,
    getFrequencyText,
}: LoanFormSummaryCardProps) {
    if (!loanSummary) return null

    return (
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/40 dark:to-blue-900/20 border-blue-200 dark:border-blue-800/30 shadow-sm">
            <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Calculator className="h-4 w-4" />
                    Resumen del contrato
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <p className="text-xs font-medium text-purple-600/70 dark:text-purple-400/70 mb-1">Precio Total del Vehículo:</p>
                        <p className="text-base font-semibold text-purple-700 dark:text-purple-300">
                            {formatCurrency(formValues.totalAmount || 0)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-green-600/70 dark:text-green-400/70 mb-1">Pago Inicial:</p>
                        <p className="text-base font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(formValues.downPayment || 0)}
                        </p>
                        {formValues.downPayment > 0 && loanSummary.paymentAmount > 0 && (
                            <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">
                                ≈ {Math.floor(formValues.downPayment / loanSummary.paymentAmount)} cuotas
                            </p>
                        )}
                    </div>
                    <div>
                        <p className="text-xs font-medium text-blue-600/70 dark:text-blue-400/70 mb-1">Monto Financiado:</p>
                        <p className="text-base font-semibold text-blue-700 dark:text-blue-300">
                            {formatCurrency(loanSummary.financedAmount)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-blue-600/70 dark:text-blue-400/70 mb-1">
                            Total a Pagar (con interés):
                        </p>
                        <p className="text-base font-semibold text-blue-700 dark:text-blue-300">
                            {formatCurrency(loanSummary.totalWithInterest)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-amber-600/70 dark:text-amber-400/70 mb-1">Interés Total:</p>
                        <p className="text-base font-semibold text-amber-600 dark:text-amber-400">
                            {formatCurrency(loanSummary.totalInterest)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-amber-600/70 dark:text-amber-400/70 mb-1">
                            Cuota {getFrequencyText(formValues.paymentFrequency)}:
                        </p>
                        <div className="flex flex-col">
                            <p className="text-base font-semibold text-amber-600 dark:text-amber-400">
                                {formatCurrency(loanSummary.paymentAmount)}
                                {formValues.paymentFrequency === "DAILY" && loanSummary.gpsAmount > 0 && (
                                    <span className="text-sm font-normal ml-1">+ GPS</span>
                                )}
                            </p>
                            {formValues.paymentFrequency === "DAILY" && loanSummary.gpsAmount > 0 && (
                                <div className="flex items-center gap-1 text-xs text-amber-600/70 dark:text-amber-400/70">
                                    <span>GPS: {formatCurrency(loanSummary.gpsAmount)}</span>
                                    <span>|</span>
                                    <span>Total: {formatCurrency(loanSummary.totalPaymentWithGps)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-span-2 pt-2 border-t border-blue-200 dark:border-blue-800/50">
                        <p className="text-xs font-medium text-blue-600/70 dark:text-blue-400/70 mb-1">Total de Pagos:</p>
                        <p className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                            {loanSummary.totalInstallments} pagos {getFrequencyText(formValues.paymentFrequency)}
                            {formValues.paymentFrequency === "DAILY" && loanSummary.totalInstallments && (
                                <span className="text-sm font-normal ml-2">
                                    (aproximadamente {Math.floor(loanSummary.totalInstallments / 30)} meses y {loanSummary.totalInstallments % 30}{" "}
                                    días)
                                </span>
                            )}
                        </p>
                        {loanSummary.downPaymentInstallments > 0 && (
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                Ya cubiertos con pago inicial: {loanSummary.downPaymentInstallments} cuotas
                            </p>
                        )}
                        
                        {/* Show comparison when we have both calculations and dates are set */}
                        {formValues.paymentFrequency === "DAILY" && 
                         formValues.startDate && 
                         formValues.endDate &&
                         loanSummary.totalInstallments30Days !== loanSummary.totalInstallmentsCalendar && (
                            <Alert className="mt-3 border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/20">
                                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <AlertDescription className="text-xs text-blue-700 dark:text-blue-300">
                                    <div className="space-y-1">
                                        <p className="font-semibold mb-2">Comparación de modos de cálculo:</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className={`p-2 rounded ${!formValues.useCalendarDays ? 'bg-blue-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700' : 'bg-blue-50/50 dark:bg-blue-950/10'}`}>
                                                <p className="font-medium">🗓️ Modo 30 días fijos:</p>
                                                <p className="text-sm">{loanSummary.totalInstallments30Days} pagos</p>
                                            </div>
                                            <div className={`p-2 rounded ${formValues.useCalendarDays ? 'bg-blue-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700' : 'bg-blue-50/50 dark:bg-blue-950/10'}`}>
                                                <p className="font-medium">📅 Días calendario reales:</p>
                                                <p className="text-sm">{loanSummary.totalInstallmentsCalendar} pagos</p>
                                            </div>
                                        </div>
                                        <p className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-800">
                                            <span className="font-semibold">Diferencia:</span>{" "}
                                            <span className={loanSummary.totalInstallmentsCalendar > loanSummary.totalInstallments30Days ? "text-amber-600 dark:text-amber-400" : "text-green-600 dark:text-green-400"}>
                                                {Math.abs(loanSummary.totalInstallmentsCalendar - loanSummary.totalInstallments30Days)} pagos
                                                {loanSummary.totalInstallmentsCalendar > loanSummary.totalInstallments30Days ? " más" : " menos"}
                                            </span>
                                            {" con días calendario reales"}
                                        </p>
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
