import { TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tag, Bike, Hash, Palette, Gauge, Cog, Frame, MapPin, Building2, Settings } from "lucide-react"

export function VehicleTableHeaders() {
    return (
        <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="text-foreground font-medium">
                    <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        <span>Marca</span>
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium">
                    <div className="flex items-center gap-2">
                        <Bike className="h-4 w-4" />
                        <span>Modelo</span>
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium">
                    <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        <span>Placa</span>
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium">
                    <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        <span>Color</span>
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium">
                    <div className="flex items-center gap-2">
                        <Gauge className="h-4 w-4" />
                        <span>Cilindraje</span>
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium">
                    <div className="flex items-center gap-2">
                        <Cog className="h-4 w-4" />
                        <span>Motor</span>
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium">
                    <div className="flex items-center gap-2">
                        <Frame className="h-4 w-4" />
                        <span>Chasis</span>
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>GPS</span>
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        <span>Proveedor</span>
                    </div>
                </TableHead>
                <TableHead className="text-right text-foreground font-medium">
                    <div className="flex items-center justify-end gap-2">
                        <Settings className="h-4 w-4" />
                        <span>Acciones</span>
                    </div>
                </TableHead>
            </TableRow>
        </TableHeader>
    )
}

