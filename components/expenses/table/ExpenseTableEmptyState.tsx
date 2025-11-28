"use client"

import { TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Receipt } from "lucide-react"

interface ExpenseTableEmptyStateProps {
    hasActiveFilters: boolean
    onClearFilters: () => void
}

export function ExpenseTableEmptyState({ hasActiveFilters, onClearFilters }: ExpenseTableEmptyStateProps) {
    return (
        <TableRow className="border-border">
            <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                    <Receipt className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm">No se encontraron egresos con los criterios de búsqueda.</p>
                    {hasActiveFilters && (
                        <Button variant="link" onClick={onClearFilters} className="text-primary">
                            Limpiar filtros
                        </Button>
                    )}
                </div>
            </TableCell>
        </TableRow>
    )
}
