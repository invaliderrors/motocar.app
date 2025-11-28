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

    const getPaymentStatus = () => {
        if (!lastInstallmentInfo) return { status: "unknown", text: "Sin información", color: "gray" }

        const daysSince = effectiveDaysSinceLastPayment

        if (daysSince === null) return { status: "unknown", text: "Sin información", color: "gray" }

        if (daysSince === 0) {
            return { status: "current", text: "Al día", color: "green" }
        } else if (daysSince === 1) {
            return { status: "due", text: "Vence hoy", color: "yellow" }
        } else {
            return { status: "overdue", text: `${daysSince} días atrasado`, color: "red" }
        }
    }

    const paymentStatus = getPaymentStatus()

    const getStatusIcon = () => {
        switch (paymentStatus.status) {
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

    // Get last 5 payments for history
    const recentPayments = payments
        .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
        .slice(0, 5)

    return (
        <Card className="border-2 border-primary/30 shadow-md">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Estado de Pagos
                    </span>
                    <Badge variant={getStatusBadgeVariant()} className="text-sm font-semibold px-3 py-1">
                        {getStatusIcon()}
                        <span className="ml-1">{paymentStatus.text}</span>
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Current Status Details */}
                <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Último pago:</p>
                            {lastInstallmentInfo?.lastPaymentDate ? (
                                <p className="text-base font-semibold">
                                    {format(toColombianTime(lastInstallmentInfo.lastPaymentDate), "PPP", { locale: es })}
                                </p>
                            ) : (
                                <p className="text-base font-semibold text-muted-foreground">Sin pagos registrados</p>
                            )}
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-muted-foreground">Días desde última cuota:</p>
                            <p className="text-2xl font-bold">{effectiveDaysSinceLastPayment ?? 0}</p>
                        </div>
                    </div>
                </div>

                {/* Payment History */}
                {recentPayments.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Historial Reciente
                        </h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                            {recentPayments.map((payment, index) => {
                                // Use latePaymentDate if it exists (for late payments), otherwise use paymentDate
                                const displayDate = payment.latePaymentDate 
                                    ? toColombianTime(payment.latePaymentDate)
                                    : toColombianTime(payment.paymentDate)
                                
                                return (
                                    <div
                                        key={payment.id}
                                        className={`flex items-center justify-between p-2 rounded-md text-sm ${index === 0 ? "bg-primary/10 border border-primary/20" : "bg-muted/20"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${payment.isLate ? "bg-red-500" : "bg-green-500"}`} />
                                            <span className="font-medium">
                                                {format(displayDate, "dd/MM/yyyy", { locale: es })}
                                            </span>
                                            {payment.isLate && (
                                                <Badge variant="destructive" className="text-xs px-1 py-0">
                                                    Tardío
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">${payment.amount.toLocaleString()}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {PAYMENT_METHOD_TRANSLATIONS[payment.paymentMethod] || payment.paymentMethod}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* No payments message */}
                {recentPayments.length === 0 && (
                    <div className="text-center py-4 text-muted-foreground">
                        <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No hay pagos registrados</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
