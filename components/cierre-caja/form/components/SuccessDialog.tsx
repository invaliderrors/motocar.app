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
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2 } from "lucide-react"
import { formatCurrency, cn } from "@/lib/utils"
import { type FormCalculations } from "../types"
import { ProviderBadge } from "@/components/common/ProviderBadge"
import { Provider } from "@/lib/types"

interface SuccessDialogProps {
    open: boolean
    onClose: () => void
    onNewClosure: () => void
    currentProvider?: Provider
    calculations: FormCalculations
}

export const SuccessDialog: React.FC<SuccessDialogProps> = ({
    open,
    onClose,
    onNewClosure,
    currentProvider,
    calculations,
}) => {
    const balance = calculations.totalExpected - calculations.totalExpenses

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-emerald-700">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        Cierre registrado con éxito
                    </DialogTitle>
                    <DialogDescription className="text-emerald-600">
                        El cierre de caja ha sido registrado correctamente en el sistema.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-4 rounded-lg border my-2">
                    <div className="space-y-3">
                        {currentProvider && (
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Proveedor:</span>
                                <ProviderBadge provider={currentProvider} />
                            </div>
                        )}

                        <div className="flex justify-between items-center">
                            <span className="text-sm">Total ingresos:</span>
                            <span className="font-medium text-emerald-600">
                                {formatCurrency(calculations.totalExpected)}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm">Total egresos:</span>
                            <span className="font-medium text-red-600">
                                {formatCurrency(calculations.totalExpenses)}
                            </span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm">Total registrado:</span>
                            <span className="font-medium text-blue-600">
                                {formatCurrency(calculations.totalRegistered)}
                            </span>
                        </div>

                        <Separator className="my-1" />

                        <div className="flex justify-between items-center">
                            <span className="font-medium">Diferencia (Registrado - Esperado):</span>
                            <span
                                className={cn(
                                    "font-bold text-lg",
                                    calculations.totalDifference === 0
                                        ? "text-emerald-600"
                                        : calculations.totalDifference > 0
                                            ? "text-emerald-600"
                                            : "text-red-600",
                                )}
                            >
                                {formatCurrency(calculations.totalDifference)}
                            </span>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            <span className="font-medium">Balance (Ingresos - Egresos):</span>
                            <span className={cn("font-bold text-lg", balance >= 0 ? "text-emerald-600" : "text-red-600")}>
                                {formatCurrency(balance)}
                            </span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="sm:justify-center">
                    <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                        Cerrar
                    </Button>
                    <Button type="button" className="w-full sm:w-auto" onClick={onNewClosure}>
                        Nuevo Cierre
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}