"use client"

import type React from "react"

import { TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Eye,
    FileEdit,
    MoreVertical,
    Trash2,
    FileDown,
    Calendar,
    DollarSign,
    CreditCard,
    User,
    Hash,
    FileText,
    Wallet,
    Home,
    Bike,
    Building,
    Percent,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { formatProviderName } from "@/lib/utils"
import type { Expense } from "@/lib/types"

interface ExpenseTableRowProps {
    expense: Expense
    formatMoney: (amount: number) => string
    onViewDetails: (expense: Expense) => void
    onEdit: (expense: Expense) => void
    onDelete: (id: string) => void
    onViewAttachment: (url: string) => void
}

const categoryMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    RENT: {
        label: "Alquiler",
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800/30",
        icon: <Home className="h-3 w-3" />,
    },
    SERVICES: {
        label: "Servicios",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/30",
        icon: <FileText className="h-3 w-3" />,
    },
    SALARIES: {
        label: "Salarios",
        color:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800/30",
        icon: <User className="h-3 w-3" />,
    },
    TAXES: {
        label: "Impuestos",
        color:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800/30",
        icon: <FileText className="h-3 w-3" />,
    },
    MAINTENANCE: {
        label: "Mantenimiento",
        color:
            "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800/30",
        icon: <FileText className="h-3 w-3" />,
    },
    PURCHASES: {
        label: "Compras",
        color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 border-pink-200 dark:border-pink-800/30",
        icon: <Wallet className="h-3 w-3" />,
    },
    MARKETING: {
        label: "Marketing",
        color:
            "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/30",
        icon: <FileText className="h-3 w-3" />,
    },
    TRANSPORT: {
        label: "Transporte",
        color:
            "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800/30",
        icon: <FileText className="h-3 w-3" />,
    },
    OTHER: {
        label: "Otros",
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800/30",
        icon: <FileText className="h-3 w-3" />,
    },
}

const paymentMethodMap: Record<string, { label: string; icon: React.ReactNode }> = {
    CASH: { label: "Efectivo", icon: <DollarSign className="h-4 w-4 text-green-500" /> },
    TRANSACTION: { label: "Transferencia", icon: <CreditCard className="h-4 w-4 text-primary" /> },
    CARD: { label: "Tarjeta", icon: <CreditCard className="h-4 w-4 text-purple-500" /> },
    CHECK: { label: "Cheque", icon: <FileText className="h-4 w-4 text-amber-500" /> },
    OTHER: { label: "Otro", icon: <FileText className="h-4 w-4 text-muted-foreground" /> },
}

const providerMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    MOTOFACIL: {
        label: "Moto Facil",
        color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/30",
        icon: <Bike className="h-3 w-3" />,
    },
    OBRASOCIAL: {
        label: "Obra Social",
        color:
            "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/30",
        icon: <Building className="h-3 w-3" />,
    },
    PORCENTAJETITO: {
        label: "Tito",
        color:
            "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200 dark:border-violet-800/30",
        icon: <Percent className="h-3 w-3" />,
    },
}

export function ExpenseTableRow({
    expense,
    formatMoney,
    onViewDetails,
    onEdit,
    onDelete,
    onViewAttachment,
}: ExpenseTableRowProps) {
    return (
        <TableRow className="border-border hover:bg-muted/50">
            <TableCell className="font-mono text-xs text-muted-foreground">{expense.id}</TableCell>
            <TableCell>
                <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">{format(new Date(expense.date), "dd/MM/yyyy", { locale: es })}</span>
                </div>
            </TableCell>
            <TableCell>
                <Badge
                    className={`flex items-center justify-center gap-1.5 text-sm px-3 py-1 rounded-full ${categoryMap[expense.category]?.color || "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                        }`}
                    variant="outline"
                >
                    {categoryMap[expense.category]?.icon || <FileText className="h-3 w-3" />}
                    <span>{categoryMap[expense.category]?.label || expense.category}</span>
                </Badge>
            </TableCell>
            <TableCell>
                {expense.provider ? (
                    <Badge
                        className={`flex items-center justify-center gap-1.5 text-sm px-3 py-1 rounded-full ${providerMap[expense.provider.name]?.color ||
                            "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                            }`}
                        variant="outline"
                    >
                        {providerMap[expense.provider.name]?.icon || <FileText className="h-3 w-3" />}
                        <span>{formatProviderName(expense.provider.name)}</span>
                    </Badge>
                ) : (
                    <span className="text-muted-foreground text-center block">—</span>
                )}
            </TableCell>
            <TableCell className="text-right font-medium text-emerald-600 dark:text-emerald-400">
                ${formatMoney(expense.amount)}
            </TableCell>
            <TableCell>
                <div className="flex items-center gap-1.5">
                    {paymentMethodMap[expense.paymentMethod]?.icon || <FileText className="h-4 w-4 text-muted-foreground" />}
                    <span>{paymentMethodMap[expense.paymentMethod]?.label || expense.paymentMethod}</span>
                </div>
            </TableCell>
            <TableCell className="max-w-[150px] truncate" title={expense.beneficiary}>
                <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                    <span className="truncate">{expense.beneficiary}</span>
                </div>
            </TableCell>
            <TableCell className="hidden md:table-cell max-w-[150px] truncate" title={expense.reference || "—"}>
                <div className="flex items-center gap-1.5">
                    <Hash className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{expense.reference}</span>
                </div>
            </TableCell>
            <TableCell className="hidden md:table-cell max-w-[150px] truncate">
                <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <span className="truncate">{expense.createdBy?.username || "—"}</span>
                </div>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                    {expense.attachmentUrl && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onViewAttachment(expense.attachmentUrl!)}
                            className="h-8 w-8 p-0"
                            title="Ver comprobante"
                        >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Ver comprobante</span>
                        </Button>
                    )}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0"
                            >
                                <span className="sr-only">Abrir menú</span>
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onViewDetails(expense)}>
                                <Eye className="mr-2 h-4 w-4 text-primary" />
                                <span>Ver detalles</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onEdit(expense)}>
                                <FileEdit className="mr-2 h-4 w-4 text-amber-500" />
                                <span>Editar</span>
                            </DropdownMenuItem>
                            {expense.attachmentUrl && (
                                <DropdownMenuItem onClick={() => onViewAttachment(expense.attachmentUrl!)}>
                                    <FileDown className="mr-2 h-4 w-4 text-green-500" />
                                    <span>Ver comprobante</span>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => onDelete(expense.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Eliminar</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </TableCell>
        </TableRow>
    )
}
