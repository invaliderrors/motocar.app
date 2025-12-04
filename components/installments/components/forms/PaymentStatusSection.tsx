"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertTriangle, Calendar, DollarSign, CalendarX } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { utcToZonedTime } from "date-fns-tz"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

// Payment method translations
const PAYMENT_METHOD_TRANSLATIONS: Record<string, string> = {
    CASH: "Efectivo",
    TRANSACTION: "Transferencia",
    CARD: "Tarjeta"
}

// Colombian timezone
const COLOMBIA_TZ = "America/Bogota"

// Helper function to convert date to Colombian time
const toColombianTime = (date: Date | string) => {
    return utcToZonedTime(new Date(date), COLOMBIA_TZ)
}

// Payment coverage response type from API
interface PaymentCoverageInfo {
    dailyRate: number
    daysBehind: number
    amountNeededToCatchUp: number
    isLate: boolean
    daysAheadAfterPayment: number
    coverageEndDate: string
    skippedDatesCount?: number
    skippedDates?: string[]
}

interface PaymentStatusSectionProps {
    lastInstallmentInfo: {
        lastPaymentDate: Date | null
        daysSinceLastPayment: number | null
    } | null
    payments: Array<{
        id: string
        amount: number
        paymentDate: string
        latePaymentDate: string | null
        advancePaymentDate: string | null
        paymentMethod: string
        isLate: boolean
    }>
    paymentCoverage?: PaymentCoverageInfo | null
}

export function PaymentStatusSection({ lastInstallmentInfo, payments, paymentCoverage }: PaymentStatusSectionProps) {
    // Format currency
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value)
    }

    // Calculate installments owed/ahead based on payment coverage
    // daysAheadAfterPayment > 0 means coverage extends BEYOND today (truly ahead)
    // daysAheadAfterPayment === 0 means coverage ends exactly today (up to date)
    // daysAheadAfterPayment < 0 means coverage doesn't reach today (still behind)
    const willBeAhead = paymentCoverage ? paymentCoverage.daysAheadAfterPayment > 0 : false
    const isAdvance = willBeAhead
    const willBeUpToDate = paymentCoverage ? paymentCoverage.daysAheadAfterPayment === 0 : false
    const isLate = paymentCoverage ? paymentCoverage.daysAheadAfterPayment < 0 : false
    
    // For late payments, show installments owed
    const installmentsOwed = isLate && paymentCoverage?.dailyRate && paymentCoverage?.amountNeededToCatchUp 
        ? Math.ceil(paymentCoverage.amountNeededToCatchUp / paymentCoverage.dailyRate)
        : 0
    
    // For advance payments, show installments ahead
    const installmentsAhead = isAdvance && paymentCoverage?.dailyRate && paymentCoverage?.daysAheadAfterPayment
        ? Math.floor(paymentCoverage.daysAheadAfterPayment)
        : 0
    
    const amountOwed = isLate ? (paymentCoverage?.amountNeededToCatchUp ?? 0) : 0

    const getPaymentStatus = () => {
        if (!lastInstallmentInfo && !paymentCoverage) return { status: "unknown", text: "Sin información", color: "gray" }

        // Check for advance payment first (covers days BEYOND today)
        if (isAdvance && paymentCoverage && paymentCoverage.daysAheadAfterPayment > 0) {
            return { status: "advance", text: `Adelantado`, color: "blue" }
        }

        // Check for up to date (covers exactly through today)
        if (willBeUpToDate) {
            return { status: "current", text: "Al día", color: "green" }
        }

        if (isLate && installmentsOwed > 0) {
            return { status: "overdue", text: `${installmentsOwed} cuota${installmentsOwed > 1 ? 's' : ''} atrasada${installmentsOwed > 1 ? 's' : ''}`, color: "red" }
        }

        return { status: "current", text: "Al día", color: "green" }
    }

    const paymentStatus = getPaymentStatus()

    const getStatusIcon = () => {
        switch (paymentStatus.status) {
            case "advance":
                return <CheckCircle className="h-4 w-4" />
            case "current":
                return <CheckCircle className="h-4 w-4" />
            case "due":
                return <Clock className="h-4 w-4" />
            case "overdue":
                return <AlertTriangle className="h-4 w-4" />
            default:
                return <Calendar className="h-4 w-4" />
        }
    }

    const getStatusBadgeVariant = () => {
        switch (paymentStatus.status) {
            case "advance":
                return "default" // Blue (we'll customize with className)
            case "current":
                return "default" // Green
            case "due":
                return "secondary" // Yellow
            case "overdue":
                return "destructive" // Red
            default:
                return "outline" // Gray
        }
    }

    const getStatusBadgeClassName = () => {
        if (paymentStatus.status === "advance") {
            return "bg-blue-500 hover:bg-blue-600 text-white"
        }
        return ""
    }

    // Get last 5 payments for history
    const recentPayments = payments
        .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
        .slice(0, 5)

    return (
        <Card className="border-primary/20 shadow-sm">
            <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-sm flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        Estado de Pagos
                    </span>
                    <Badge variant={getStatusBadgeVariant()} className={`text-xs font-semibold px-2 py-0.5 ${getStatusBadgeClassName()}`}>
                        {getStatusIcon()}
                        <span className="ml-1">{paymentStatus.text}</span>
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 pt-0 space-y-2">
                {/* Current Status Details */}
                <div className="bg-muted/30 rounded-md p-2">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">
                                {isAdvance ? 'Cuotas adelantadas:' : 'Cuotas atrasadas:'}
                            </p>
                            <p className={`text-lg font-bold ${isAdvance ? 'text-blue-600' : installmentsOwed > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {isAdvance ? installmentsAhead : installmentsOwed}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                                {isAdvance ? 'Cubierto hasta:' : 'Total adeudado:'}
                            </p>
                            <p className={`text-sm font-bold ${isAdvance ? 'text-blue-600' : amountOwed > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {isAdvance && paymentCoverage 
                                    ? format(new Date(paymentCoverage.coverageEndDate), "dd/MM/yyyy", { locale: es })
                                    : formatCurrency(amountOwed)
                                }
                            </p>
                        </div>
                    </div>
                </div>

                {/* Skipped Dates Info */}
                {paymentCoverage && paymentCoverage.skippedDatesCount && paymentCoverage.skippedDatesCount > 0 && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md p-2 cursor-help">
                                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                        <CalendarX className="h-3.5 w-3.5" />
                                        <span className="text-xs font-medium">
                                            {paymentCoverage.skippedDatesCount} fecha{paymentCoverage.skippedDatesCount > 1 ? 's' : ''} excluida{paymentCoverage.skippedDatesCount > 1 ? 's' : ''} (no se cobran)
                                        </span>
                                    </div>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="max-w-xs">
                                <div className="text-xs">
                                    <p className="font-semibold mb-1">Fechas excluidas por novedades:</p>
                                    {paymentCoverage.skippedDates && paymentCoverage.skippedDates.length > 0 ? (
                                        <div className="space-y-0.5">
                                            {paymentCoverage.skippedDates.slice(0, 5).map((date, idx) => (
                                                <p key={idx} className="text-muted-foreground">
                                                    {format(new Date(date), "EEE dd MMM", { locale: es })}
                                                </p>
                                            ))}
                                            {paymentCoverage.skippedDates.length > 5 && (
                                                <p className="text-muted-foreground">
                                                    +{paymentCoverage.skippedDates.length - 5} más...
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground">Días festivos o cierres de tienda</p>
                                    )}
                                </div>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}

                {/* Last payment info */}
                {lastInstallmentInfo?.lastPaymentDate && (
                    <div className="bg-muted/20 rounded-md p-2">
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-xs text-muted-foreground">Último pago:</p>
                            <p className="text-xs font-medium">
                                {format(toColombianTime(lastInstallmentInfo.lastPaymentDate), "dd/MM/yyyy", { locale: es })}
                            </p>
                        </div>
                    </div>
                )}

                {/* Payment History - Compact */}
                {recentPayments.length > 0 && (
                    <div>
                        <h4 className="text-xs font-medium mb-1 flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Historial
                        </h4>
                        <div className="space-y-1 max-h-20 overflow-y-auto">
                            {recentPayments.slice(0, 3).map((payment, index) => {
                                // Determine the display date: latePaymentDate for late, advancePaymentDate for advance, otherwise paymentDate
                                const displayDate = payment.latePaymentDate 
                                    ? toColombianTime(payment.latePaymentDate)
                                    : payment.advancePaymentDate
                                        ? toColombianTime(payment.advancePaymentDate)
                                        : toColombianTime(payment.paymentDate)
                                
                                const isAdvance = !payment.isLate && !!payment.advancePaymentDate
                                
                                return (
                                    <div
                                        key={payment.id}
                                        className={`flex items-center justify-between p-1.5 rounded text-xs ${index === 0 ? "bg-primary/10" : "bg-muted/20"}`}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${
                                                payment.isLate ? "bg-red-500" : isAdvance ? "bg-blue-500" : "bg-green-500"
                                            }`} />
                                            <span className="font-medium">
                                                {format(displayDate, "dd/MM/yy", { locale: es })}
                                            </span>
                                        </div>
                                        <span className="font-semibold">${payment.amount.toLocaleString()}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* No payments message */}
                {recentPayments.length === 0 && (
                    <div className="text-center py-2 text-muted-foreground">
                        <Calendar className="h-5 w-5 mx-auto mb-1 opacity-50" />
                        <p className="text-xs">Sin pagos registrados</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
