"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Installment } from "@/lib/types"
import { formatCurrency, formatDate, cn } from "@/lib/utils"
import { 
    Receipt, 
    Calendar, 
    Clock, 
    User, 
    CreditCard, 
    Wallet,
    Navigation,
    AlertTriangle,
    CheckCircle,
    FileText,
    Hash,
    CalendarCheck,
    CalendarX,
    CalendarClock,
    Car,
    Link as LinkIcon,
    ExternalLink,
    Timer,
    Banknote,
    ArrowUpCircle,
    Building2
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface InstallmentDetailsModalProps {
    installment: Installment | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

// Payment method labels
const PAYMENT_METHOD_LABELS: Record<string, string> = {
    CASH: "Efectivo",
    TRANSFER: "Transferencia",
    CARD: "Tarjeta",
    CHECK: "Cheque",
    OTHER: "Otro",
}

export function InstallmentDetailsModal({
    installment,
    open,
    onOpenChange,
}: InstallmentDetailsModalProps) {
    if (!installment) return null

    // Calculate total (base + gps)
    const totalAmount = (installment.amount || 0) + (installment.gps || 0)

    // Determine payment status
    const getPaymentStatus = () => {
        if (installment.isAdvance) {
            return {
                label: "Adelanto",
                variant: "outline" as const,
                className: "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400",
                icon: <ArrowUpCircle className="h-4 w-4" />,
            }
        }
        if (installment.isLate) {
            return {
                label: "Atrasado",
                variant: "outline" as const,
                className: "bg-red-500/15 text-red-600 border-red-500/30 dark:bg-red-500/20 dark:text-red-400",
                icon: <AlertTriangle className="h-4 w-4" />,
            }
        }
        return {
            label: "A tiempo",
            variant: "outline" as const,
            className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400",
            icon: <CheckCircle className="h-4 w-4" />,
        }
    }

    const paymentStatus = getPaymentStatus()

    // Get payment timing status (based on isLate flag, not currentDaysBehind)
    const getPaymentTimingStatus = () => {
        if (installment.isAdvance) {
            return {
                label: "Adelanto",
                className: "text-blue-500",
                bgClassName: "bg-blue-500/20",
            }
        }
        if (installment.isLate) {
            return {
                label: "Pago tardío",
                className: "text-amber-500",
                bgClassName: "bg-amber-500/20",
            }
        }
        return {
            label: "A tiempo",
            className: "text-emerald-500",
            bgClassName: "bg-emerald-500/20",
        }
    }

    const paymentTimingStatus = getPaymentTimingStatus()

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="pb-2">
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <Receipt className="h-5 w-5 text-primary" />
                        Detalles del Pago
                        <Badge variant={paymentStatus.variant} className={cn("ml-2", paymentStatus.className)}>
                            {paymentStatus.icon}
                            <span className="ml-1">{paymentStatus.label}</span>
                        </Badge>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Summary Card */}
                    <Card className="border-border/50 bg-gradient-to-br from-primary/5 to-primary/10">
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Monto Total del Pago</p>
                                    <p className="text-3xl font-bold text-primary">
                                        {formatCurrency(totalAmount)}
                                    </p>
                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Wallet className="h-3.5 w-3.5" />
                                            Base: {formatCurrency(installment.amount || 0)}
                                        </span>
                                        {installment.gps > 0 && (
                                            <span className="flex items-center gap-1">
                                                <Navigation className="h-3.5 w-3.5" />
                                                GPS: {formatCurrency(installment.gps)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className={cn("px-3 py-1.5 rounded-full flex items-center gap-2", paymentTimingStatus.bgClassName)}>
                                        <Timer className="h-4 w-4" />
                                        <span className={cn("font-medium text-sm", paymentTimingStatus.className)}>
                                            {paymentTimingStatus.label}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        ID: <span className="font-mono">{installment.id.slice(0, 12)}...</span>
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Payment Info Card */}
                        <Card className="border-border/50">
                            <CardHeader className="py-3 px-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10">
                                <CardTitle className="flex items-center text-sm font-semibold">
                                    <Banknote className="mr-2 h-4 w-4 text-emerald-500" />
                                    Información del Pago
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                <InfoRow
                                    icon={<CreditCard className="h-4 w-4" />}
                                    label="Método de Pago"
                                    value={PAYMENT_METHOD_LABELS[installment.paymentMethod] || installment.paymentMethod}
                                />
                                <InfoRow
                                    icon={<Wallet className="h-4 w-4" />}
                                    label="Pago Base"
                                    value={formatCurrency(installment.amount || 0)}
                                />
                                {installment.gps > 0 && (
                                    <InfoRow
                                        icon={<Navigation className="h-4 w-4" />}
                                        label="Pago GPS"
                                        value={formatCurrency(installment.gps)}
                                    />
                                )}
                                <Separator className="my-2" />
                                <InfoRow
                                    icon={<Receipt className="h-4 w-4" />}
                                    label="Total Pagado"
                                    value={formatCurrency(totalAmount)}
                                    highlight
                                />
                            </CardContent>
                        </Card>

                        {/* Date Info Card */}
                        <Card className="border-border/50">
                            <CardHeader className="py-3 px-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                                <CardTitle className="flex items-center text-sm font-semibold">
                                    <Calendar className="mr-2 h-4 w-4 text-blue-500" />
                                    Fechas del Pago
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3">
                                <InfoRow
                                    icon={<CalendarCheck className="h-4 w-4" />}
                                    label="Fecha de Pago"
                                    value={installment.paymentDate ? formatDate(installment.paymentDate.split("T")[0]) : "N/A"}
                                    highlight
                                />
                                {installment.dueDate && (
                                    <InfoRow
                                        icon={<CalendarClock className="h-4 w-4" />}
                                        label="Fecha de Vencimiento"
                                        value={formatDate(installment.dueDate.split("T")[0])}
                                    />
                                )}
                                {installment.latePaymentDate && (
                                    <InfoRow
                                        icon={<CalendarX className="h-4 w-4" />}
                                        label="Fecha de Pago Tardío"
                                        value={formatDate(installment.latePaymentDate.split("T")[0])}
                                        warning
                                    />
                                )}
                                {installment.advancePaymentDate && (
                                    <InfoRow
                                        icon={<CalendarCheck className="h-4 w-4" />}
                                        label="Fecha de Adelanto"
                                        value={formatDate(installment.advancePaymentDate.split("T")[0])}
                                        success
                                    />
                                )}
                                {installment.lastCoveredDate && (
                                    <InfoRow
                                        icon={<Calendar className="h-4 w-4" />}
                                        label="Última Fecha Cubierta"
                                        value={formatDate(installment.lastCoveredDate.split("T")[0])}
                                    />
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Loan Context Card */}
                    {installment.loan && (
                        <Card className="border-border/50">
                            <CardHeader className="py-3 px-4 bg-gradient-to-r from-violet-500/10 to-purple-500/10">
                                <CardTitle className="flex items-center text-sm font-semibold">
                                    <FileText className="mr-2 h-4 w-4 text-violet-500" />
                                    Información del Préstamo
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <InfoRow
                                        icon={<User className="h-4 w-4" />}
                                        label="Cliente"
                                        value={installment.loan.user?.name || "N/A"}
                                    />
                                    {installment.loan.vehicle && (
                                        <InfoRow
                                            icon={<Car className="h-4 w-4" />}
                                            label="Vehículo"
                                            value={installment.loan.vehicle.plate || "N/A"}
                                        />
                                    )}
                                    {installment.loan.contractNumber && (
                                        <InfoRow
                                            icon={<Hash className="h-4 w-4" />}
                                            label="Contrato"
                                            value={installment.loan.contractNumber}
                                        />
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Metadata Card */}
                    <Card className="border-border/50">
                        <CardHeader className="py-3 px-4 bg-gradient-to-r from-gray-500/10 to-slate-500/10">
                            <CardTitle className="flex items-center text-sm font-semibold">
                                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                                Metadatos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <InfoRow
                                    icon={<User className="h-4 w-4" />}
                                    label="Registrado por"
                                    value={installment.createdBy?.name || installment.createdBy?.username || "N/A"}
                                />
                                <InfoRow
                                    icon={<Clock className="h-4 w-4" />}
                                    label="Fecha de Registro"
                                    value={installment.createdAt ? formatDate(installment.createdAt.split("T")[0]) : "N/A"}
                                />
                                {installment.cashRegisterId && (
                                    <InfoRow
                                        icon={<Building2 className="h-4 w-4" />}
                                        label="ID Caja"
                                        value={installment.cashRegisterId.slice(0, 12) + "..."}
                                    />
                                )}
                                {installment.archived && (
                                    <InfoRow
                                        icon={<FileText className="h-4 w-4" />}
                                        label="Estado"
                                        value="Archivado"
                                        warning
                                    />
                                )}
                            </div>
                            {installment.notes && (
                                <div className="mt-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                                    <p className="text-xs text-muted-foreground mb-1">Notas</p>
                                    <p className="text-sm">{installment.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Attachment */}
                    {installment.attachmentUrl && (
                        <Card className="border-border/50">
                            <CardHeader className="py-3 px-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
                                <CardTitle className="flex items-center text-sm font-semibold">
                                    <LinkIcon className="mr-2 h-4 w-4 text-amber-500" />
                                    Comprobante Adjunto
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() => window.open(installment.attachmentUrl!, "_blank")}
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Ver Comprobante
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

// Info row component
function InfoRow({ 
    icon, 
    label, 
    value, 
    highlight = false,
    warning = false,
    success = false
}: { 
    icon: React.ReactNode
    label: string
    value: string
    highlight?: boolean
    warning?: boolean
    success?: boolean
}) {
    return (
        <div className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {icon}
                <span>{label}</span>
            </div>
            <span className={cn(
                "text-sm font-medium",
                highlight && "text-primary font-semibold",
                warning && "text-amber-500",
                success && "text-emerald-500"
            )}>
                {value}
            </span>
        </div>
    )
}
