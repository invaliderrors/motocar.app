"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, AlertTriangle, Calendar } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { utcToZonedTime } from "date-fns-tz"

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
}

export function PaymentStatusSection({ lastInstallmentInfo, payments }: PaymentStatusSectionProps) {
    // Compute days difference excluding Sundays between two dates (dates treated in Colombian TZ)
    const diffDaysExcludingSundays = (fromDate: Date | string, toDate: Date | string) => {
        const start = toColombianTime(fromDate)
        const end = toColombianTime(toDate)

        // Normalize to start of day for both dates (in Colombian TZ)
        const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate())
        const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate())

        let count = 0
        const cursor = new Date(startDay)
        while (cursor <= endDay) {
            // getDay(): 0 = Sunday, 1 = Monday, ..., 6 = Saturday
            if (cursor.getDay() !== 0) {
                count++
            }
            cursor.setDate(cursor.getDate() + 1)
        }

        // If start and end are the same day, count should be 0 if it's Sunday, 1 otherwise.
        // But original "days since" semantics likely mean difference, not inclusive count.
        // Convert inclusive day count into a non-inclusive difference by subtracting 1 when start <= end.
        return Math.max(0, count - 1)
    }

    // Get effective days since last payment excluding Sundays, falling back to provided value if absent
    const effectiveDaysSinceLastPayment = (() => {
        if (!lastInstallmentInfo?.lastPaymentDate) return lastInstallmentInfo?.daysSinceLastPayment ?? null
        try {
            const today = new Date()
            return diffDaysExcludingSundays(lastInstallmentInfo.lastPaymentDate, today)
        } catch {
            return lastInstallmentInfo?.daysSinceLastPayment ?? null
        }
    })()

    // Check if last payment was in advance
    const lastPaymentIsAdvance = payments.length > 0 && payments[0].advancePaymentDate
    const daysInAdvance = (() => {
        if (!lastPaymentIsAdvance || !payments[0].advancePaymentDate) return null
        try {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const advanceDate = new Date(payments[0].advancePaymentDate)
            advanceDate.setHours(0, 0, 0, 0)
            const diffTime = advanceDate.getTime() - today.getTime()
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
            return diffDays
        } catch {
            return null
        }
    })()

    const getPaymentStatus = () => {
        if (!lastInstallmentInfo) return { status: "unknown", text: "Sin información", color: "gray" }

        // Check for advance payment first
        if (lastPaymentIsAdvance && daysInAdvance !== null && daysInAdvance > 0) {
            return { status: "advance", text: `${-daysInAdvance} días (adelantado)`, color: "blue" }
        }

        const daysSince = effectiveDaysSinceLastPayment

        if (daysSince === null) return { status: "unknown", text: "Sin información", color: "gray" }

        if (daysSince === 0) {
            return { status: "current", text: "Al día", color: "green" }
        } else if (daysSince === 1) {
            return { status: "due", text: "Vence hoy", color: "yellow" }
        } else {
            return { status: "overdue", text: `+${daysSince} días atrasado`, color: "red" }
        }
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
                            <p className="text-xs text-muted-foreground">Último pago:</p>
                            {lastInstallmentInfo?.lastPaymentDate ? (
                                <p className="text-sm font-medium truncate">
                                    {format(toColombianTime(lastInstallmentInfo.lastPaymentDate), "dd/MM/yyyy", { locale: es })}
                                </p>
                            ) : (
                                <p className="text-sm text-muted-foreground">Sin pagos</p>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground">Días desde última:</p>
                            <p className="text-lg font-bold">{effectiveDaysSinceLastPayment ?? 0}</p>
                        </div>
                    </div>
                </div>

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
