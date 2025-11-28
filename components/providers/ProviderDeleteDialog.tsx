"use client"

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
import { AlertTriangle, Trash2 } from "lucide-react"

interface ProviderDeleteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
}

export function ProviderDeleteDialog({ open, onOpenChange, onConfirm }: ProviderDeleteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Confirmar eliminación
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        ¿Está seguro que desea eliminar este proveedor? Esta acción no se puede deshacer y puede afectar otros
                        registros relacionados.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-1.5"
                    >
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
