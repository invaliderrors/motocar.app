"use client"

import { FileX } from "lucide-react"

export function LoanNotFound() {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <FileX className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Contrato no encontrado</h3>
            <p className="text-sm text-muted-foreground">
                No se encontró información del contrato solicitado
            </p>
        </div>
    )
}
