"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
    ArrowDownToLine,
    ArrowUpToLine,
    Calendar,
    CreditCard,
    DollarSign,
    FileText,
    Hash,
    MapPin,
    Phone,
    User,
    Building2,
    Clock,
    AlertCircle,
    CheckCircle,
    Car,
    Receipt,
} from "lucide-react"
import { Transaction } from "../constants/types"
import { CATEGORY_DETAILS, PAYMENT_METHOD_ICONS, PROVIDER_DETAILS } from "../constants"
import { formatProviderName } from "../utils/formatters"

interface TransactionDetailsModalProps {
    transaction: Transaction | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function TransactionDetailsModal({ transaction, open, onOpenChange }: TransactionDetailsModalProps) {
    if (!transaction) return null

    const categoryDetails = CATEGORY_DETAILS[transaction.category as keyof typeof CATEGORY_DETAILS] || {
        label: transaction.category,
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
        icon: FileText,
    }

    const providerDetails = transaction.provider
        ? PROVIDER_DETAILS[transaction.provider.name as unknown as keyof typeof PROVIDER_DETAILS] || {
              label: formatProviderName(transaction.provider.name),
              color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
              icon: Building2,
          }
        : null

    const paymentMethodIcon =
        PAYMENT_METHOD_ICONS[transaction.paymentMethod as keyof typeof PAYMENT_METHOD_ICONS] ||
        PAYMENT_METHOD_ICONS.DEFAULT

    const CategoryIcon = categoryDetails.icon
    const ProviderIcon = providerDetails?.icon || Building2
    const PaymentIcon = paymentMethodIcon.icon

    const formatSpanishDate = (date: Date) => {
        return format(new Date(date), "d 'de' MMMM 'de' yyyy", { locale: es })
    }

    const formatSpanishTime = (date: Date) => {
        return format(new Date(date), "HH:mm:ss", { locale: es })
    }

    const getPaymentMethodLabel = (method: string) => {
        const labels: Record<string, string> = {
            CASH: "Efectivo",
            CARD: "Tarjeta",
            TRANSACTION: "Transferencia",
        }
        return labels[method] || method
    }

    const isIncome = transaction.type === "income"

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh]">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <Receipt className="h-6 w-6 text-primary" />
                            Detalles de Transacción
                        </DialogTitle>
                        <Badge
                            className={`flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 ${
                                isIncome
                                    ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white"
                                    : "bg-gradient-to-r from-rose-500 to-red-600 text-white"
                            }`}
                        >
                            {isIncome ? (
                                <>
                                    <ArrowUpToLine className="h-4 w-4" />
                                    <span>Ingreso</span>
                                </>
                            ) : (
                                <>
                                    <ArrowDownToLine className="h-4 w-4" />
                                    <span>Egreso</span>
                                </>
                            )}
                        </Badge>
                    </div>
                    <DialogDescription>
                        {isIncome
                            ? "Detalles completos del pago de cuota registrado"
                            : "Detalles completos del egreso registrado"}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
                    <div className="space-y-6">
                        {/* Amount Section */}
                        <div
                            className={`rounded-lg p-4 ${
                                isIncome
                                    ? "bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-900"
                                    : "bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-200 dark:border-rose-900"
                            }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">Monto Total</p>
                                    <p
                                        className={`text-3xl font-bold ${
                                            isIncome
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : "text-rose-600 dark:text-rose-400"
                                        }`}
                                    >
                                        {isIncome ? "+" : "-"}
                                        {formatCurrency(transaction.amount)}
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-white dark:bg-slate-900 shadow-sm">
                                    <DollarSign
                                        className={`h-8 w-8 ${
                                            isIncome
                                                ? "text-emerald-600 dark:text-emerald-400"
                                                : "text-rose-600 dark:text-rose-400"
                                        }`}
                                    />
                                </div>
                            </div>

                            {/* Amount Breakdown for Income */}
                            {isIncome &&
                                transaction.baseAmount !== undefined &&
                                transaction.gpsAmount !== undefined && (
                                    <div className="mt-4 pt-4 border-t border-emerald-200 dark:border-emerald-900 space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Cuota base:</span>
                                            <span className="font-semibold">
                                                {formatCurrency(transaction.baseAmount)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">GPS:</span>
                                            <span className="font-semibold">{formatCurrency(transaction.gpsAmount)}</span>
                                        </div>
                                    </div>
                                )}
                        </div>

                        {/* Payment Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-primary" />
                                Información de Pago
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4" />
                                        Fecha de Pago
                                    </p>
                                    <p className="font-semibold">{formatSpanishDate(transaction.date)}</p>
                                    <p className="text-sm text-muted-foreground">{formatSpanishTime(transaction.date)}</p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                        <CreditCard className="h-4 w-4" />
                                        Método de Pago
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`p-1.5 rounded-md ${
                                                transaction.paymentMethod === "CASH"
                                                    ? "bg-green-100 dark:bg-green-950/50"
                                                    : transaction.paymentMethod === "CARD"
                                                      ? "bg-blue-100 dark:bg-blue-950/50"
                                                      : "bg-purple-100 dark:bg-purple-950/50"
                                            }`}
                                        >
                                            <PaymentIcon className={`h-4 w-4 ${paymentMethodIcon.color}`} />
                                        </div>
                                        <span className="font-semibold">
                                            {getPaymentMethodLabel(transaction.paymentMethod)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Late Payment Info */}
                            {transaction.isLate && transaction.latePaymentDate && (
                                <div className="rounded-lg p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
                                    <div className="flex items-center gap-2 mb-2">
                                        <AlertCircle className="h-4 w-4 text-amber-600" />
                                        <p className="text-sm font-semibold text-amber-700 dark:text-amber-500">
                                            Pago con Mora
                                        </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Fecha de vencimiento original:{" "}
                                        <span className="font-semibold text-amber-700 dark:text-amber-500">
                                            {formatSpanishDate(transaction.latePaymentDate)}
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>

                        <Separator />

                        {/* Transaction Details */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <FileText className="h-5 w-5 text-primary" />
                                Detalles de la Transacción
                            </h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                        <FileText className="h-4 w-4" />
                                        Descripción
                                    </p>
                                    <p className="font-semibold">{transaction.description}</p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                        <Hash className="h-4 w-4" />
                                        Categoría
                                    </p>
                                    <Badge
                                        className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 ${categoryDetails.color}`}
                                        variant="outline"
                                    >
                                        <CategoryIcon className="h-4 w-4" />
                                        <span>{categoryDetails.label}</span>
                                    </Badge>
                                </div>

                                {transaction.reference && (
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                            <Hash className="h-4 w-4" />
                                            Referencia
                                        </p>
                                        <p className="font-mono text-sm bg-muted px-3 py-2 rounded-md">
                                            {transaction.reference}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* People Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Información de Personas
                            </h3>

                            <div className="grid grid-cols-1 gap-4">
                                {/* Client or Created By */}
                                {isIncome ? (
                                    transaction.client && (
                                        <div className="space-y-2">
                                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                                <User className="h-4 w-4" />
                                                Cliente
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 rounded-md bg-emerald-100 dark:bg-emerald-950/50">
                                                    <User className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <span className="font-semibold">{transaction.client}</span>
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    transaction.createdBy && (
                                        <div className="space-y-2">
                                            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                                <User className="h-4 w-4" />
                                                Registrado Por
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-950/50">
                                                    <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <span className="font-semibold">{transaction.createdBy.username}</span>
                                            </div>
                                        </div>
                                    )
                                )}

                                {/* Provider */}
                                {providerDetails && (
                                    <div className="space-y-2">
                                        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                            <Building2 className="h-4 w-4" />
                                            Proveedor
                                        </p>
                                        <Badge
                                            className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 ${providerDetails.color}`}
                                            variant="outline"
                                        >
                                            <ProviderIcon className="h-4 w-4" />
                                            <span>{providerDetails.label}</span>
                                        </Badge>
                                    </div>
                                )}
                            </div>
                        </div>

                        <Separator />

                        {/* System Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                Información del Sistema
                            </h3>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                        <Hash className="h-4 w-4" />
                                        ID de Transacción
                                    </p>
                                    <p className="font-mono text-sm bg-muted px-3 py-2 rounded-md break-all">
                                        {transaction.id}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        Hora de Registro
                                    </p>
                                    <p className="font-semibold">{transaction.time}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
