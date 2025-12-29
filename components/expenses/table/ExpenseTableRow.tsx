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
    AlertCircle,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { formatProviderName } from "@/lib/utils"
import type { Expense } from "@/lib/types"
import { useResourcePermissions } from "@/hooks/useResourcePermissions"
import { Resource } from "@/lib/types/permissions"

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
        label: "Arriendo",
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800/30",
        icon: <Home className="h-3 w-3" />,
    },
    SERVICES: {
        label: "Servicios",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/30",
        icon: <FileText className="h-3 w-3" />,
    },
    SALARIES: {
        label: "Nómina",
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
    WORKSHOP: {
        label: "Taller",
        color: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300 border-slate-200 dark:border-slate-800/30",
        icon: <FileText className="h-3 w-3" />,
    },
    SPARE_PARTS: {
        label: "Repuestos",
        color: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300 border-teal-200 dark:border-teal-800/30",
        icon: <FileText className="h-3 w-3" />,
    },
    PURCHASES: {
        label: "Compras",
        color: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 border-pink-200 dark:border-pink-800/30",
        icon: <Wallet className="h-3 w-3" />,
    },
    MARKETING: {
        label: "Mercadeo",
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
    WORKSHOP_TOOLS: {
        label: "Herramientas de taller",
        color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800/30",
        icon: <FileText className="h-3 w-3" />,
    },
    SHOWROOM_EXPENSES: {
        label: "Gastos de sala",
        color: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-200 dark:border-rose-800/30",
        icon: <FileText className="h-3 w-3" />,
    },
    WORKER_GASOLINE: {
        label: "Gasolina trabajadores",
        color: "bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300 border-lime-200 dark:border-lime-800/30",
        icon: <FileText className="h-3 w-3" />,
    },
    EMPLOYEE_BONUS: {
        label: "Bonificación empleados",
        color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/30",
        icon: <FileText className="h-3 w-3" />,
    },
    PAYROLL_EXPENSES: {
        label: "Gastos de nómina",
        color: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300 border-sky-200 dark:border-sky-800/30",
        icon: <FileText className="h-3 w-3" />,
    },
    BONUS_EXPENSES: {
        label: "Gastos de primas",
        color: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300 border-fuchsia-200 dark:border-fuchsia-800/30",
        icon: <FileText className="h-3 w-3" />,
    },
    TRAVEL_ALLOWANCES: {
        label: "Viáticos",
        color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/30",
        icon: <FileText className="h-3 w-3" />,
    },
    MOTORCYCLE_PREP_GASOLINE: {
        label: "Gasolina para alistamiento de motos",
        color: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 border-violet-200 dark:border-violet-800/30",
        icon: <FileText className="h-3 w-3" />,
    },
    TRAFFIC_FINES: {
        label: "Pago de comparendos",
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800/30",
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
                    <ExpenseRowActions
                        expense={expense}
                        onViewDetails={onViewDetails}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onViewAttachment={onViewAttachment}
                    />
                </div>
            </TableCell>
        </TableRow>
    )
}

function ExpenseRowActions({
    expense,
    onViewDetails,
    onEdit,
    onDelete,
    onViewAttachment,
}: {
    expense: Expense
    onViewDetails: (expense: Expense) => void
    onEdit: (expense: Expense) => void
    onDelete: (id: string) => void
    onViewAttachment: (url: string) => void
}) {
    const expensePermissions = useResourcePermissions(Resource.EXPENSE)
    const hasAnyPermission = expensePermissions.hasAnyAccess

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    disabled={!hasAnyPermission}
                >
                    <span className="sr-only">Abrir menú</span>
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                
                {/* View details - available if user has any permission */}
                {hasAnyPermission && (
                    <DropdownMenuItem onClick={() => onViewDetails(expense)}>
                        <Eye className="mr-2 h-4 w-4 text-primary" />
                        <span>Ver detalles</span>
                    </DropdownMenuItem>
                )}
                
                {/* Edit - requires EXPENSE.EDIT */}
                {expensePermissions.canEdit && (
                    <DropdownMenuItem onClick={() => onEdit(expense)}>
                        <FileEdit className="mr-2 h-4 w-4 text-amber-500" />
                        <span>Editar</span>
                    </DropdownMenuItem>
                )}
                
                {/* View attachment - available if user has any permission */}
                {expense.attachmentUrl && hasAnyPermission && (
                    <DropdownMenuItem onClick={() => onViewAttachment(expense.attachmentUrl!)}>
                        <FileDown className="mr-2 h-4 w-4 text-green-500" />
                        <span>Ver comprobante</span>
                    </DropdownMenuItem>
                )}
                
                {/* Delete - requires EXPENSE.DELETE */}
                {expensePermissions.canDelete && (
                    <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 dark:text-red-400" onClick={() => onDelete(expense.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Eliminar</span>
                        </DropdownMenuItem>
                    </>
                )}
                
                {/* Show message if user has no permissions */}
                {!hasAnyPermission && (
                    <DropdownMenuItem disabled className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Sin permisos disponibles
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
