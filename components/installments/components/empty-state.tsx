import { TableRow, TableCell } from "@/components/ui/table"
import { Search } from "lucide-react"

export function EmptyState() {
  return (
    <TableRow className="border-border">
      <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
        <div className="flex flex-col items-center justify-center">
          <Search className="h-8 w-8 mb-2 text-muted-foreground" />
          <p className="text-lg">No se encontraron cuotas</p>
          <p className="text-sm text-muted-foreground">Intenta con otros criterios de búsqueda</p>
        </div>
      </TableCell>
    </TableRow>
  )
}
