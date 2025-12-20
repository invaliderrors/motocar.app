"use client"

import type React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react"
import { formatCurrency, cn } from "@/lib/utils"
import { type FormCalculations } from "../types"
import { ProviderBadge } from "@/components/common/ProviderBadge"
import { Provider } from "@/lib/types"

interface ConfirmationDialogProps {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    currentProvider?: Provider
    calculations: FormCalculations
    isSubmitting: boolean
    closingDate?: Date
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
    open,
    onClose,
    onConfirm,
    currentProvider,
    calculations,
    isSubmitting,
    closingDate,
}) => {
    const balance = calculations.totalExpected - calculations.totalExpenses

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        Confirmar Cierre de Caja
                    </DialogTitle>
                    <DialogDescription>
                        Por favor revise los datos antes de registrar el cierre de caja.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="p-4 rounded-lg border bg-muted/30">
                        <div className="space-y-3">
                            {currentProvider && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Proveedor:</span>
                                    <ProviderBadge provider={currentProvider} />
                                </div>
                            )}

                            {closingDate && (
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">Fecha de cierre:</span>
                                    <span className="text-sm">
                                        {new Date(closingDate).toLocaleDateString('es-CO', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            )}

                            <Separator className="my-2" />

                            <div className="flex justify-between items-center">
                                <span className="text-sm">Efectivo en caja:</span>
                                <span className="font-medium">
                                    {formatCurrency(calculations.cashInRegister)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm">Transferencias:</span>
                                <span className="font-medium">
                                    {formatCurrency(calculations.cashFromTransfers)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm">Tarjetas:</span>
                                <span className="font-medium">
                                    {formatCurrency(calculations.cashFromCards)}
                                </span>
                            </div>

                            <Separator className="my-2" />

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium flex items-center gap-1">
                                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                                    Total ingresos:
                                </span>
                                <span className="font-semibold text-emerald-600">
                                    {formatCurrency(calculations.totalExpected)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium flex items-center gap-1">
                                    <TrendingDown className="h-3.5 w-3.5 text-red-600" />
                                    Total egresos:
                                </span>
                                <span className="font-semibold text-red-600">
                                    {formatCurrency(calculations.totalExpenses)}
                                </span>
                            </div>

                            <Separator className="my-2" />

                            <div className="flex justify-between items-center pt-1">
                                <span className="font-semibold">Balance final:</span>
                                <span
                                    className={cn(
                                        "font-bold text-lg",
                                        balance >= 0 ? "text-emerald-600" : "text-red-600",
                                    )}
                                >
                                    {formatCurrency(balance)}
                                </span>
                            </div>

                            {calculations.totalDifference !== 0 && (
                                <div className="flex justify-between items-center pt-1 text-xs text-muted-foreground">
                                    <span>Diferencia registrada:</span>
                                    <span
                                        className={cn(
                                            "font-medium",
                                            calculations.totalDifference > 0
                                                ? "text-emerald-600"
                                                : "text-red-600",
                                        )}
                                    >
                                        {formatCurrency(calculations.totalDifference)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={onConfirm}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                                <span>Procesando...</span>
                            </div>
                        ) : (
                            "Confirmar Cierre"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
