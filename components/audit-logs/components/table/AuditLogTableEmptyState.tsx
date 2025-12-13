"use client"

import { TableRow } from "@/components/ui/table"
import { FileSearch } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  hasFilters: boolean
  onClearFilters: () => void
}

export function AuditLogTableEmptyState({ hasFilters, onClearFilters }: EmptyStateProps) {
  return (
    <TableRow>
      <td colSpan={6} className="h-[400px] text-center">
        <div className="flex flex-col items-center justify-center text-muted-foreground py-12">
          <FileSearch className="h-16 w-16 mb-4 opacity-20" />
          <h3 className="text-lg font-semibold mb-2">No se encontraron registros de auditoría</h3>
          {hasFilters ? (
            <>
              <p className="text-sm mb-4">Intenta ajustar los filtros</p>
              <Button variant="outline" onClick={onClearFilters}>
                Limpiar filtros
              </Button>
            </>
          ) : (
            <p className="text-sm">Los registros de auditoría aparecerán aquí cuando se realicen acciones</p>
          )}
        </div>
      </td>
    </TableRow>
  )
}
