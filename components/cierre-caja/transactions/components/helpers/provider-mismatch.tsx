"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"

interface ProviderMismatchDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentProviderName: string | undefined
    attemptedProviderName: string | undefined
}

export function ProviderMismatchDialog({
    open,
    onOpenChange,
    currentProviderName,
    attemptedProviderName,
}: ProviderMismatchDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-amber-700">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        Proveedores diferentes
                    </DialogTitle>
                    <DialogDescription className="text-amber-600">
                        No es posible seleccionar transacciones de diferentes proveedores en un mismo cierre.
                    </DialogDescription>
                </DialogHeader>

                <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800/30 dark:bg-amber-900/20 my-2">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm">Proveedor actual:</span>
                            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" variant="outline">
                                {currentProviderName || "Ninguno"}
                            </Badge>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-sm">Proveedor intentado:</span>
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" variant="outline">
                                {attemptedProviderName || "Ninguno"}
                            </Badge>
                        </div>
                    </div>
                </div>

                <DialogFooter className="sm:justify-center">
                    <Button type="button" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                        Entendido
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
