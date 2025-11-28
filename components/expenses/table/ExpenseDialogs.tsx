"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    AlertTriangle,
    Trash2,
    Receipt,
    Calendar,
    DollarSign,
    User,
    Hash,
    FileText,
    Download,
    Wallet,
    Home,
    Bike,
    Building,
    Percent,
    CreditCard,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { formatProviderName } from "@/lib/utils"
import type { Expense } from "@/lib/types"

interface ExpenseDialogsProps {
    deleteDialogOpen: boolean
    setDeleteDialogOpen: (open: boolean) => void
    viewDialogOpen: boolean
    setViewDialogOpen: (open: boolean) => void
    attachmentDialogOpen: boolean
    setAttachmentDialogOpen: (open: boolean) => void
    viewExpense: Expense | null
    selectedAttachmentUrl: string
    onConfirmDelete: () => void
    formatMoney: (amount: number) => string
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

export function ExpenseDialogs({
    deleteDialogOpen,
    setDeleteDialogOpen,
    viewDialogOpen,
    setViewDialogOpen,
    attachmentDialogOpen,
    setAttachmentDialogOpen,
    viewExpense,
    selectedAttachmentUrl,
    onConfirmDelete,
    formatMoney,
}: ExpenseDialogsProps) {
    return (
        <>
            {/* Delete confirmation dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                            Confirmar eliminación
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Está seguro que desea eliminar este egreso? Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onConfirmDelete}
                            className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-1.5"
                        >
                            <Trash2 className="h-4 w-4" />
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* View details dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-primary">
                            <Receipt className="h-5 w-5" />
                            Detalles del Egreso
                        </DialogTitle>
                        <DialogDescription>Información completa del egreso seleccionado</DialogDescription>
                    </DialogHeader>
                    {viewExpense && (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">ID</p>
                                    <p className="font-mono text-sm">{viewExpense.id}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Fecha</p>
                                    <p className="font-medium flex items-center gap-1.5">
                                        <Calendar className="h-4 w-4 text-primary" />
                                        {format(new Date(viewExpense.date), "dd MMMM yyyy", { locale: es })}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Categoría</p>
                                    <Badge
                                        className={`${categoryMap[viewExpense.category]?.color ||
                                            "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                                            } flex items-center gap-1.5`}
                                        variant="outline"
                                    >
                                        {categoryMap[viewExpense.category]?.icon || <FileText className="h-3 w-3" />}
                                        <span>{categoryMap[viewExpense.category]?.label || viewExpense.category}</span>
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Proveedor</p>
                                    {viewExpense.provider ? (
                                        <Badge
                                            className={`${providerMap[viewExpense.provider.name]?.color ||
                                                "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
                                                } flex items-center gap-1.5`}
                                            variant="outline"
                                        >
                                            {providerMap[viewExpense.provider.name]?.icon || <FileText className="h-3 w-3" />}
                                            <span>{formatProviderName(viewExpense.provider.name)}</span>
                                        </Badge>
                                    ) : (
                                        <span className="text-muted-foreground">No asignado</span>
                                    )}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Monto</p>
                                    <p className="font-medium text-lg text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                                        <DollarSign className="h-5 w-5" />
                                        {formatMoney(viewExpense.amount)}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Método de Pago</p>
                                    <p className="flex items-center gap-1.5">
                                        {paymentMethodMap[viewExpense.paymentMethod]?.icon || (
                                            <FileText className="h-4 w-4 text-gray-500" />
                                        )}
                                        <span>{paymentMethodMap[viewExpense.paymentMethod]?.label || viewExpense.paymentMethod}</span>
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Beneficiario</p>
                                    <p className="flex items-center gap-1.5">
                                        <User className="h-4 w-4 text-indigo-500" />
                                        {viewExpense.beneficiary}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Referencia</p>
                                    <p className="flex items-center gap-1.5">
                                        <Hash className="h-4 w-4 text-gray-400" />
                                        {viewExpense.reference}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Creado por</p>
                                    <p className="flex items-center gap-1.5">
                                        <User className="h-4 w-4 text-purple-500" />
                                        {viewExpense.createdBy?.username || "—"}
                                    </p>
                                </div>
                                <div className="space-y-1 col-span-1 md:col-span-2">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Descripción</p>
                                    <p className="text-sm border border-gray-200 dark:border-gray-800 rounded-md p-3 bg-gray-50 dark:bg-gray-900/50">
                                        {viewExpense.description}
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <Button
                                    variant="outline"
                                    className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/30 bg-transparent"
                                    onClick={() => setViewDialogOpen(false)}
                                >
                                    Cerrar
                                </Button>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5">
                                    <Download className="h-4 w-4" />
                                    Descargar Comprobante
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Attachment dialog */}
            <Dialog open={attachmentDialogOpen} onOpenChange={setAttachmentDialogOpen}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                            <FileText className="h-5 w-5" />
                            Comprobante de Egreso
                        </DialogTitle>
                        <DialogDescription>Imagen del comprobante adjunto</DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center p-4">
                        {selectedAttachmentUrl ? (
                            <img
                                src={selectedAttachmentUrl || "/placeholder.svg"}
                                alt="Comprobante de egreso"
                                className="max-h-[70vh] object-contain rounded-md border border-gray-200 dark:border-gray-800"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
                                <AlertTriangle className="h-10 w-10 mb-2 text-amber-500" />
                                <p>No se pudo cargar la imagen del comprobante</p>
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setAttachmentDialogOpen(false)}
                            className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/30"
                        >
                            Cerrar
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
