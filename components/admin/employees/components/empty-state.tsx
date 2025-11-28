import { Users } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  hasFilters: boolean
  onClearFilters: () => void
}

export function EmptyState({ hasFilters, onClearFilters }: EmptyStateProps) {
  return (
    <tr>
      <td colSpan={7} className="px-4 py-12">
        <div className="flex flex-col items-center justify-center text-center">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {hasFilters ? "No se encontraron empleados" : "No hay empleados"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            {hasFilters
              ? "Intenta ajustar los filtros de búsqueda"
              : "Comienza creando tu primer empleado"}
          </p>
          {hasFilters && (
            <Button variant="outline" onClick={onClearFilters}>
              Limpiar filtros
            </Button>
          )}
        </div>
      </td>
    </tr>
  )
}
