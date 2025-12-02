import { TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { User, Phone, Home, Hash, Calendar, MapPin, Settings } from "lucide-react"

export function UserTableHeaders() {
    return (
        <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50 border-b-2 border-slate-200 dark:border-slate-700">
                <TableHead className="text-slate-700 dark:text-slate-200 font-semibold py-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-blue-100 dark:bg-blue-900/50">
                            <User className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
                        </div>
                        <span>Nombre</span>
                    </div>
                </TableHead>
                <TableHead className="text-slate-700 dark:text-slate-200 font-semibold py-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-indigo-100 dark:bg-indigo-900/50">
                            <Hash className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <span>Identificación</span>
                    </div>
                </TableHead>
                <TableHead className="text-slate-700 dark:text-slate-200 font-semibold py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-violet-100 dark:bg-violet-900/50">
                            <MapPin className="h-3.5 w-3.5 text-violet-500 dark:text-violet-400" />
                        </div>
                        <span>Lugar de expedición</span>
                    </div>
                </TableHead>
                <TableHead className="text-slate-700 dark:text-slate-200 font-semibold py-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-amber-100 dark:bg-amber-900/50">
                            <Calendar className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                        </div>
                        <span>Edad</span>
                    </div>
                </TableHead>
                <TableHead className="text-slate-700 dark:text-slate-200 font-semibold py-4 hidden md:table-cell">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-emerald-100 dark:bg-emerald-900/50">
                            <Phone className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />
                        </div>
                        <span>Teléfono</span>
                    </div>
                </TableHead>
                <TableHead className="text-slate-700 dark:text-slate-200 font-semibold py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-cyan-100 dark:bg-cyan-900/50">
                            <Home className="h-3.5 w-3.5 text-cyan-500 dark:text-cyan-400" />
                        </div>
                        <span>Dirección</span>
                    </div>
                </TableHead>
                <TableHead className="text-slate-700 dark:text-slate-200 font-semibold py-4 hidden lg:table-cell">
                    <div className="flex items-center gap-2">
                        <div className="p-1 rounded bg-rose-100 dark:bg-rose-900/50">
                            <MapPin className="h-3.5 w-3.5 text-rose-500 dark:text-rose-400" />
                        </div>
                        <span>Ciudad</span>
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
