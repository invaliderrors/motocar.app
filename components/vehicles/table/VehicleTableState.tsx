"use client"

import { TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Bike } from "lucide-react"

interface VehicleTableEmptyStateProps {
    hasActiveFilters: boolean
    onClearFilters: () => void
}

export function VehicleTableEmptyState({ hasActiveFilters, onClearFilters }: VehicleTableEmptyStateProps) {
    return (
        <TableRow className="border-border">
            <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                <div className="flex flex-col items-center justify-center gap-2">
                    <Bike className="h-10 w-10 text-muted-foreground/30" />
                    <p className="text-sm">No se encontraron vehículos</p>
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

