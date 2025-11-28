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

interface NewsTableDialogsProps {
    deleteDialogOpen: boolean
    onDeleteDialogChange: (open: boolean) => void
    onConfirmDelete: () => void
}

export function NewsTableDialogs({
    deleteDialogOpen,
    onDeleteDialogChange,
    onConfirmDelete,
}: NewsTableDialogsProps) {
    return (
        <AlertDialog open={deleteDialogOpen} onOpenChange={onDeleteDialogChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar novedad?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. La novedad será eliminada
                        permanentemente. Si esta novedad tenía ajustes de cuotas automáticos, 
                        los montos se restaurarán al contrato.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirmDelete}
                        className="bg-destructive hover:bg-destructive/90"
                    >
                        Eliminar
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
