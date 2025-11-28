import { TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building, Calendar, Edit, Bike, DollarSign, TrendingUp, Activity } from "lucide-react"

export function ProviderTableHeaders() {
    return (
        <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="text-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                        <Building className="h-4 w-4" />
                        <span>Proveedor</span>
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium text-center">
                    <div className="flex items-center justify-center gap-1.5">
                        <Bike className="h-4 w-4" />
                        <span>Vehículos</span>
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium text-center">
                    <div className="flex items-center justify-center gap-1.5">
                        <Activity className="h-4 w-4" />
                        <span>contratos</span>
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium text-center">
                    <div className="flex items-center justify-center gap-1.5">
                        <TrendingUp className="h-4 w-4" />
                        <span>Ingresos</span>
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium text-center">
                    <div className="flex items-center justify-center gap-1.5">
                        <DollarSign className="h-4 w-4" />
                        <span>Cierres</span>
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>Creación</span>
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
