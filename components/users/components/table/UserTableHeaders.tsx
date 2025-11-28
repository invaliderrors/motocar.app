import { TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { User, Phone, Home, Hash, Calendar, MapPin, Edit } from "lucide-react"

export function UserTableHeaders() {
    return (
        <TableHeader>
            <TableRow className="bg-muted hover:bg-muted/80">
                <TableHead className="text-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        <span>Nombre</span>
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                        <Hash className="h-4 w-4" />
                        <span>Identificación</span>
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium hidden lg:table-cell">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        <span>Lugar de expedición</span>
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>Edad</span>
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                        <Phone className="h-4 w-4" />
                        <span>Teléfono</span>
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium hidden lg:table-cell">
                    <div className="flex items-center gap-1.5">
                        <Home className="h-4 w-4" />
                        <span>Dirección</span>
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium hidden lg:table-cell">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        <span>Ciudad</span>
                    </div>
                </TableHead>
                <TableHead className="text-right text-foreground font-medium">
                    <div className="flex items-center justify-end gap-1.5">
                        <Edit className="h-4 w-4" />
                        <span>Acciones</span>
                    </div>
                </TableHead>
            </TableRow>
        </TableHeader>
    )
}
