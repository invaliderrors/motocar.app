"use client"

import { TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Building } from "lucide-react"

interface ProviderTableEmptyStateProps {
    searchTerm: string
    onClearSearch: () => void
}

export function ProviderTableEmptyState({ searchTerm, onClearSearch }: ProviderTableEmptyStateProps) {
    return (
        <TableRow className="border-border">
            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                    <Building className="h-10 w-10 text-muted-foreground/30" />
                    <p className="text-sm">No se encontraron proveedores</p>
                    {searchTerm && (
                        <Button variant="link" onClick={onClearSearch} className="text-primary">
                            Limpiar búsqueda
                        </Button>
                    )}
                </div>
            </TableCell>
        </TableRow>
    )
}
