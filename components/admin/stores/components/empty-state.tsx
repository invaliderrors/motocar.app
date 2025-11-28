"use client"

import { TableRow, TableCell } from "@/components/ui/table"
import { Building2 } from "lucide-react"

export function EmptyState() {
    return (
        <TableRow>
            <TableCell colSpan={8} className="h-64 text-center">
                <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Building2 className="h-12 w-12 opacity-40" />
                    <p className="text-lg font-medium">No se encontraron puntos</p>
                    <p className="text-sm">Intenta ajustar los filtros o crea un nuevo punto</p>
                </div>
            </TableCell>
        </TableRow>
    )
}
