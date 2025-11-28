"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Checkbox } from "@/components/ui/checkbox"
import { formatCurrency } from "@/lib/utils"
import {
    ArrowDownToLine,
    ArrowUpToLine,
    Calendar,
    Download,
    Eye,
    FileText,
    MoreHorizontal,
    Printer,
    DollarSign,
    User,
    CreditCard,
    Clock,
} from "lucide-react"
import { Transaction } from "../constants/types"
import { CATEGORY_DETAILS, PAYMENT_METHOD_ICONS, PROVIDER_DETAILS, TRANSACTION_TYPE_STYLES } from "../constants"
import { formatProviderName } from "../utils/formatters"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { TransactionDetailsModal } from "./TransactionDetailsModal"
import { PrintableReceipt } from "./PrintableReceipt"

interface TransactionItemProps {
    transaction: Transaction
    isSelected: boolean
    onSelect: (id: string, checked: boolean) => void
}

export function TransactionItem({ transaction, isSelected, onSelect }: TransactionItemProps) {
    const [showDetailsModal, setShowDetailsModal] = useState(false)

    // Debug logging for expenses
    if (transaction.type === 'expense') {
        console.log('🔍 TransactionItem - Expense:', {
            id: transaction.id,
            description: transaction.description,
            provider: transaction.provider,
            createdBy: transaction.createdBy
        });
    }

    // Get category details
    const categoryDetails = CATEGORY_DETAILS[transaction.category as keyof typeof CATEGORY_DETAILS] || {
        label: transaction.category,
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
        icon: FileText,
    }

    // Get provider details if available
    const providerDetails = transaction.provider ? {
        label: transaction.provider.name || formatProviderName(transaction.provider.name),
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        icon: FileText,
    } : null

    // Get payment method icon
    const paymentMethodIcon =
        PAYMENT_METHOD_ICONS[transaction.paymentMethod as keyof typeof PAYMENT_METHOD_ICONS] || PAYMENT_METHOD_ICONS.DEFAULT

    // Get transaction type styles
    const typeStyles = TRANSACTION_TYPE_STYLES[transaction.type]

    const CategoryIcon = categoryDetails.icon
    const ProviderIcon = providerDetails?.icon || FileText
    const PaymentIcon = paymentMethodIcon.icon

    const formatSpanishDate = (date: Date) => {
        return format(new Date(date), "d 'de' MMMM, yyyy", { locale: es })
    }

    const getPaymentMethodLabel = (method: string) => {
        const labels: Record<string, string> = {
            CASH: "Efectivo",
            CARD: "Tarjeta",
            TRANSACTION: "Transferencia",
        }
        return labels[method] || method
    }

    return (
        <TableRow
            className={`
                border-b border-border/40 transition-all duration-200
                ${isSelected 
                    ? "bg-primary/10 hover:bg-primary/15 shadow-sm" 
                    : "bg-card hover:bg-muted/30"
                }
            `}
        >
            <TableCell className="py-3">
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => onSelect(transaction.id, !!checked)}
                        aria-label={`Seleccionar transacción ${transaction.id}`}
                        className="border-primary/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                </div>
            </TableCell>
            
            {/* Type */}
            <TableCell className="py-3">
                <Badge
                    className={`
                        flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm
                        ${transaction.type === "income"
                            ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0"
                            : "bg-gradient-to-r from-rose-500 to-red-600 text-white border-0"
                        }
                    `}
                >
                    {transaction.type === "income" ? (
                        <>
                            <ArrowUpToLine className="h-3.5 w-3.5" />
                            <span>Ingreso</span>
                        </>
                    ) : (
                        <>
                            <ArrowDownToLine className="h-3.5 w-3.5" />
                            <span>Egreso</span>
                        </>
                    )}
                </Badge>
            </TableCell>

            {/* Payment Date */}
            <TableCell className="hidden md:table-cell text-foreground py-3">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-950/50">
                        <Calendar className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium">{formatSpanishDate(transaction.date)}</span>
                </div>
            </TableCell>

            {/* Closing Date (Due Date for late payments, Payment Date for on-time) */}
            <TableCell className="hidden lg:table-cell py-3">
                {transaction.isLate && transaction.latePaymentDate ? (
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-amber-100 dark:bg-amber-950/50 ring-2 ring-amber-200 dark:ring-amber-900">
                            <Calendar className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-amber-700 dark:text-amber-500">
                                {formatSpanishDate(transaction.latePaymentDate)}
                            </span>
                            <span className="text-xs text-amber-600/70 dark:text-amber-500/70">Vencimiento</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-md bg-slate-100 dark:bg-slate-900">
                            <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        </div>
                        <span className="text-sm text-muted-foreground">{formatSpanishDate(transaction.date)}</span>
                    </div>
                )}
            </TableCell>

            {/* Creation Date */}
            <TableCell className="hidden xl:table-cell text-foreground py-3">
                <div className="flex items-center gap-2 opacity-60">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{formatSpanishDate(transaction.date)}</span>
                </div>
            </TableCell>

            {/* Description */}
            <TableCell className="font-medium text-foreground py-3">
                <div className="flex flex-col gap-1.5">
                    <span className="line-clamp-1 text-sm font-semibold">{transaction.description}</span>
                    <Badge
                        className={`inline-flex w-fit items-center gap-1 text-xs px-2 py-0.5 rounded-md ${categoryDetails.color} font-medium`}
                        variant="outline"
                    >
                        <CategoryIcon className="h-3 w-3" />
                        <span>{categoryDetails.label}</span>
                    </Badge>
                </div>
            </TableCell>

            {/* Provider */}
            <TableCell className="py-3">
                {providerDetails ? (
                    <Badge
                        className={`flex items-center justify-center gap-1.5 text-xs px-3 py-1.5 rounded-lg ${providerDetails.color} font-semibold shadow-sm`}
                        variant="outline"
                    >
                        <ProviderIcon className="h-3.5 w-3.5" />
                        <span>{providerDetails.label}</span>
                    </Badge>
                ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                )}
            </TableCell>

            {/* Amount */}
            <TableCell className="text-right py-3">
                <div className={`inline-flex flex-col items-end gap-0.5`}>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className={`text-base font-bold ${
                                    transaction.type === "income" 
                                        ? "text-emerald-600 dark:text-emerald-400" 
                                        : "text-rose-600 dark:text-rose-400"
                                }`}>
                                    {transaction.type === "income" ? "+" : "-"}{formatCurrency(transaction.amount)}
                                </span>
                            </TooltipTrigger>
                            {transaction.type === "income" &&
                                transaction.baseAmount !== undefined &&
                                transaction.gpsAmount !== undefined && (
                                    <TooltipContent side="left" className="bg-slate-900 text-white border-slate-700">
                                        <div className="space-y-1.5 text-xs">
                                            <div className="flex justify-between gap-6">
                                                <span className="text-slate-300">Cuota base:</span>
                                                <span className="font-semibold">{formatCurrency(transaction.baseAmount)}</span>
                                            </div>
                                            <div className="flex justify-between gap-6">
                                                <span className="text-slate-300">GPS:</span>
                                                <span className="font-semibold">{formatCurrency(transaction.gpsAmount)}</span>
                                            </div>
                                            <div className="flex justify-between gap-6 border-t border-slate-700 pt-1.5 font-semibold">
                                                <span>Total:</span>
                                                <span className="text-emerald-400">{formatCurrency(transaction.amount)}</span>
                                            </div>
                                        </div>
                                    </TooltipContent>
                                )}
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </TableCell>

            {/* Payment Method */}
            <TableCell className="text-foreground py-3">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${
                        transaction.paymentMethod === "CASH" ? "bg-green-100 dark:bg-green-950/50" :
                        transaction.paymentMethod === "CARD" ? "bg-blue-100 dark:bg-blue-950/50" :
                        "bg-purple-100 dark:bg-purple-950/50"
                    }`}>
                        <PaymentIcon className={`h-3.5 w-3.5 ${paymentMethodIcon.color}`} />
                    </div>
                    <span className="text-sm font-medium">{getPaymentMethodLabel(transaction.paymentMethod)}</span>
                </div>
            </TableCell>

            {/* Created By / Client */}
            <TableCell className="text-foreground py-3">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-md ${
                        transaction.type === "income" 
                            ? "bg-emerald-100 dark:bg-emerald-950/50" 
                            : "bg-blue-100 dark:bg-blue-950/50"
                    }`}>
                        <User className={`h-3.5 w-3.5 ${
                            transaction.type === "income"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-blue-600 dark:text-blue-400"
                        }`} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">
                            {transaction.type === "income" 
                                ? (transaction.client ?? "—")
                                : (transaction.createdBy?.username ?? "—")
                            }
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {transaction.type === "income" ? "Cliente" : "Registrado"}
                        </span>
                    </div>
                </div>
            </TableCell>

            {/* Actions */}
            <TableCell className="text-right py-3">
                <div className="flex items-center justify-end gap-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                                    onClick={() => setShowDetailsModal(true)}
                                >
                                    <Eye className="h-4 w-4" />
                                    <span className="sr-only">Ver detalles</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Ver detalles</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Más opciones</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel className="font-semibold">Opciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer" onClick={() => setShowDetailsModal(true)}>
                                <Eye className="h-4 w-4 mr-2 text-blue-500" />
                                Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => window.print()}>
                                <Printer className="h-4 w-4 mr-2 text-purple-500" />
                                Imprimir recibo
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => {
                                    // TODO: Implement download functionality
                                    console.log("Downloading receipt for:", transaction.id)
                                }}
                            >
                                <Download className="h-4 w-4 mr-2 text-green-500" />
                                Descargar comprobante
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                
                {/* Transaction Details Modal */}
                <TransactionDetailsModal
                    transaction={transaction}
                    open={showDetailsModal}
                    onOpenChange={setShowDetailsModal}
                />
                
                {/* Printable Receipt (hidden, only shows when printing) */}
                <PrintableReceipt transaction={transaction} />
            </TableCell>
        </TableRow>
    )
}
