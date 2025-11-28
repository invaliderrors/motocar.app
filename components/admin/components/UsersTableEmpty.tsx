import { TableCell, TableRow } from "@/components/ui/table"
import { Users } from "lucide-react"

export function UsersTableEmpty() {
  return (
    <TableRow>
      <TableCell colSpan={7} className="h-32">
        <div className="flex flex-col items-center justify-center text-center text-muted-foreground">
          <Users className="h-10 w-10 mb-2 opacity-20" />
          <p className="text-lg font-medium">No se encontraron usuarios</p>
          <p className="text-sm">Intenta ajustar los filtros o crear un nuevo usuario</p>
        </div>
      </TableCell>
    </TableRow>
  )
}
