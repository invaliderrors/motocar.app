import { TableCell, TableRow } from "@/components/ui/table"
import { Search, Inbox } from "lucide-react"

export function TransactionListEmpty() {
    return (
        <TableRow className="hover:bg-transparent">
            <TableCell colSpan={11} className="text-center py-16">
                <div className="flex flex-col items-center justify-center">
                    <div className="relative mb-4">
                        <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full"></div>
                        <div className="relative p-4 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full">
                            <Inbox className="h-12 w-12 text-primary/40" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">No hay transacciones disponibles</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                        No se encontraron transacciones para la fecha seleccionada o con los filtros aplicados.
                        Intenta ajustar los criterios de búsqueda.
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <Search className="h-3.5 w-3.5" />
                        <span>Usa los filtros arriba para refinar tu búsqueda</span>
                    </div>
                </div>
            </TableCell>
        </TableRow>
    )
}
