"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DollarSign, Calendar, CreditCard, Banknote, FileText, User } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Provider } from "@/lib/types"

interface ProviderCashRegistersDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    provider: Provider | null
}

export function ProviderCashRegistersDialog({ open, onOpenChange, provider }: ProviderCashRegistersDialogProps) {
    if (!provider) return null

    const formatMoney = (amount: number) => {
        return new Intl.NumberFormat("es-CO", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount)
    }

    const getTotalCash = (register: any) => {
        return register.cashInRegister + register.cashFromTransfers + register.cashFromCards
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[1000px] max-h-[80vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <DollarSign className="h-5 w-5" />
                        Cierres de Caja de {provider.name}
                    </DialogTitle>
                    <DialogDescription>
                        Historial de cierres de caja para este proveedor ({provider.cashRegisters?.length || 0} registros)
                    </DialogDescription>
                </DialogHeader>

                <div className="overflow-y-auto max-h-[60vh]">
                    {provider.cashRegisters && provider.cashRegisters.length > 0 ? (
                        <div className="rounded-lg border border-blue-100 dark:border-blue-900/30 overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-blue-50 dark:bg-blue-950/30">
                                        <TableHead className="text-blue-700 dark:text-blue-300 font-medium">Fecha</TableHead>
                                        <TableHead className="text-blue-700 dark:text-blue-300 font-medium text-right">Efectivo</TableHead>
                                        <TableHead className="text-blue-700 dark:text-blue-300 font-medium text-right">
                                            Transferencias
                                        </TableHead>
                                        <TableHead className="text-blue-700 dark:text-blue-300 font-medium text-right">Tarjetas</TableHead>
                                        <TableHead className="text-blue-700 dark:text-blue-300 font-medium text-right">Total</TableHead>
                                        <TableHead className="text-blue-700 dark:text-blue-300 font-medium">Creado por</TableHead>
                                        <TableHead className="text-blue-700 dark:text-blue-300 font-medium">Notas</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {provider.cashRegisters
                                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                        .map((register) => (
                                            <TableRow key={register.id} className="border-blue-100 dark:border-blue-900/30">
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="h-4 w-4 text-blue-500" />
                                                        <span className="font-medium">
                                                            {format(new Date(register.date), "dd/MM/yyyy", { locale: es })}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Banknote className="h-4 w-4 text-green-500" />
                                                        <span className="font-medium text-green-600 dark:text-green-400">
                                                            ${formatMoney(register.cashInRegister)}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <CreditCard className="h-4 w-4 text-blue-500" />
                                                        <span className="font-medium text-blue-600 dark:text-blue-400">
                                                            ${formatMoney(register.cashFromTransfers)}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <CreditCard className="h-4 w-4 text-purple-500" />
                                                        <span className="font-medium text-purple-600 dark:text-purple-400">
                                                            ${formatMoney(register.cashFromCards)}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-semibold"
                                                    >
                                                        ${formatMoney(getTotalCash(register))}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5">
                                                        <User className="h-4 w-4 text-indigo-500" />
                                                        <span className="text-sm">{register.createdBy?.username || "—"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-[200px]">
                                                        {register.notes ? (
                                                            <div className="flex items-start gap-1.5">
                                                                <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                                                <span
                                                                    className="text-sm text-gray-600 dark:text-gray-300 truncate"
                                                                    title={register.notes}
                                                                >
                                                                    {register.notes}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-muted-foreground">Sin notas</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
                            <DollarSign className="h-12 w-12 mb-4 text-blue-300/50 dark:text-blue-700/30" />
                            <p className="text-sm">No hay cierres de caja registrados para este proveedor</p>
                        </div>
                    )}
                </div>

                <div className="flex justify-end mt-4">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/30"
                    >
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
