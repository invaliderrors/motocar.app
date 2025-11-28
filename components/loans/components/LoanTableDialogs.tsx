"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import { Progress } from "@/components/ui/progress"
import { Printer, RefreshCw, CheckCircle2, AlertTriangle, Trash2, Archive, ArchiveRestore } from "lucide-react"

interface LoanTableDialogsProps {
    printingContract: boolean
    printProgress: number
    deleteDialogOpen: boolean
    archiveDialogOpen: boolean
    onPrintingContractChange: (open: boolean) => void
    onDeleteDialogChange: (open: boolean) => void
    onArchiveDialogChange: (open: boolean) => void
    onConfirmDelete: () => void
    onConfirmArchive: () => void
    loanToArchive?: { id: string; archived: boolean } | null
}

export function LoanTableDialogs({
    printingContract,
    printProgress,
    deleteDialogOpen,
    archiveDialogOpen,
    onPrintingContractChange,
    onDeleteDialogChange,
    onArchiveDialogChange,
    onConfirmDelete,
    onConfirmArchive,
    loanToArchive,
}: LoanTableDialogsProps) {
    return (
        <>
            {/* Diálogo de carga para la generación del contrato */}
            <Dialog open={printingContract} onOpenChange={onPrintingContractChange}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Printer className="h-5 w-5 text-blue-500" />
                            Generando contrato
                        </DialogTitle>
                        <DialogDescription>Por favor espere mientras se genera el contrato PDF...</DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                        <Progress value={printProgress} className="w-full" />
                        <p className="text-center mt-2 text-sm text-gray-500 flex items-center justify-center gap-1.5">
                            {printProgress < 100 ? (
                                <>
                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    ¡Completado!
                                </>
                            )}
                        </p>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Diálogo de confirmación para eliminar */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={onDeleteDialogChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                            Confirmar eliminación
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Está seguro que desea eliminar este préstamo? Esta acción no se puede deshacer.
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

            {/* Diálogo de confirmación para archivar/desarchivar */}
            <AlertDialog open={archiveDialogOpen} onOpenChange={onArchiveDialogChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-orange-600">
                            {loanToArchive?.archived ? <ArchiveRestore className="h-5 w-5" /> : <Archive className="h-5 w-5" />}
                            {loanToArchive?.archived ? "Confirmar desarchivado" : "Confirmar archivado"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {loanToArchive?.archived
                                ? "¿Está seguro que desea desarchivar este préstamo? Volverá a aparecer en la lista de préstamos activos."
                                : "¿Está seguro que desea archivar este préstamo? Se moverá a la sección de archivados y no aparecerá en la lista principal."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onConfirmArchive}
                            className={
                                loanToArchive?.archived
                                    ? "bg-green-500 hover:bg-green-600 text-white flex items-center gap-1.5"
                                    : "bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1.5"
                            }
                        >
                            {loanToArchive?.archived ? (
                                <>
                                    <ArchiveRestore className="h-4 w-4" />
                                    Desarchivar
                                </>
                            ) : (
                                <>
                                    <Archive className="h-4 w-4" />
                                    Archivar
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
