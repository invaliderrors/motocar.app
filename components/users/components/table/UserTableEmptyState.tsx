"use client"

import { TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Users } from "lucide-react"

interface TableEmptyStateProps {
    searchTerm: string
    onClearSearch: () => void
}

export function UserTableEmptyState({ searchTerm, onClearSearch }: TableEmptyStateProps) {
    return (
        <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                    <Users className="h-10 w-10 text-muted-foreground/50" />
                    <p className="text-sm">No se encontraron usuarios</p>
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
