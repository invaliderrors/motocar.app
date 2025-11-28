import { TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { User, Shield, Activity, Calendar, Settings } from "lucide-react"

export function UsersTableHeader() {
  return (
    <TableHeader>
      <TableRow className="bg-muted hover:bg-muted">
        <TableHead className="text-foreground font-medium">
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            <span>Usuario</span>
          </div>
        </TableHead>
        <TableHead className="text-foreground font-medium">
          <div className="flex items-center gap-1.5">
            <Shield className="h-4 w-4" />
            <span>Rol</span>
          </div>
        </TableHead>
        <TableHead className="text-foreground font-medium">
          <div className="flex items-center gap-1.5">
            <Activity className="h-4 w-4" />
            <span>Estado</span>
          </div>
        </TableHead>
        <TableHead className="hidden lg:table-cell text-foreground font-medium">
          <div className="flex items-center gap-1.5">
            <Settings className="h-4 w-4" />
            <span>Permisos</span>
          </div>
        </TableHead>
        <TableHead className="hidden md:table-cell text-foreground font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>Último Acceso</span>
          </div>
        </TableHead>
        <TableHead className="hidden md:table-cell text-foreground font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span>Fecha Creación</span>
          </div>
        </TableHead>
        <TableHead className="text-right text-foreground font-medium">Acciones</TableHead>
      </TableRow>
    </TableHeader>
  )
}
