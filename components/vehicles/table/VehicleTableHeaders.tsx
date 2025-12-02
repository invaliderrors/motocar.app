import { TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tag, Bike, Hash, Palette, Gauge, MapPin, Building2, Settings, Shield, Wrench } from "lucide-react"

export function VehicleTableHeaders() {
    return (
        <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50 border-b-2 border-slate-200 dark:border-slate-700">
                <TableHead className="text-slate-700 dark:text-slate-200 font-semibold py-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-slate-200/50 dark:bg-slate-700/50">
                            <Tag className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                        </div>
                        <span>Marca</span>
                    </div>
                </TableHead>
                <TableHead className="text-slate-700 dark:text-slate-200 font-semibold py-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-slate-200/50 dark:bg-slate-700/50">
                            <Bike className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                        </div>
                        <span>Modelo</span>
                    </div>
                </TableHead>
                <TableHead className="text-slate-700 dark:text-slate-200 font-semibold py-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-indigo-100 dark:bg-indigo-900/50">
                            <Hash className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <span>Placa</span>
                    </div>
                </TableHead>
                <TableHead className="text-slate-700 dark:text-slate-200 font-semibold py-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-slate-200/50 dark:bg-slate-700/50">
                            <Palette className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                        </div>
                        <span>Color</span>
                    </div>
                </TableHead>
                <TableHead className="text-slate-700 dark:text-slate-200 font-semibold py-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-slate-200/50 dark:bg-slate-700/50">
                            <Gauge className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                        </div>
                        <span>Cilindraje</span>
                    </div>
                </TableHead>
                <TableHead className="text-slate-700 dark:text-slate-200 font-semibold py-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-emerald-100 dark:bg-emerald-900/50">
                            <Shield className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                        </div>
                        <span>SOAT</span>
                    </div>
                </TableHead>
                <TableHead className="text-slate-700 dark:text-slate-200 font-semibold py-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-emerald-100 dark:bg-emerald-900/50">
                            <Wrench className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                        </div>
                        <span>Tecnomecánica</span>
                    </div>
                </TableHead>
                <TableHead className="text-slate-700 dark:text-slate-200 font-semibold py-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-cyan-100 dark:bg-cyan-900/50">
                            <MapPin className="h-3.5 w-3.5 text-cyan-500 dark:text-cyan-400" />
                        </div>
                        <span>GPS</span>
                    </div>
                </TableHead>
                <TableHead className="text-slate-700 dark:text-slate-200 font-semibold py-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-violet-100 dark:bg-violet-900/50">
                            <Building2 className="h-3.5 w-3.5 text-violet-500 dark:text-violet-400" />
                        </div>
                        <span>Proveedor</span>
                    </div>
                </TableHead>
                <TableHead className="text-right text-slate-700 dark:text-slate-200 font-semibold py-4">
                    <div className="flex items-center justify-end gap-2">
                        <div className="p-1 rounded bg-slate-200/50 dark:bg-slate-700/50">
                            <Settings className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                        </div>
                        <span>Acciones</span>
                    </div>
                </TableHead>
            </TableRow>
        </TableHeader>
    )
}

