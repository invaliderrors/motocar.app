"use client"

import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, Hash, MapPin, Phone, Edit, Trash2, CheckCircle2, AlertTriangle, XCircle } from "lucide-react"
import { Store, StoreStatus } from "@/lib/types"

interface StoreTableRowProps {
    store: Store
    onEdit: (store: Store) => void
    onDelete: (store: Store) => void
}

const getStatusBadge = (status: StoreStatus) => {
    switch (status) {
        case "ACTIVE":
            return (
                <Badge
                    variant="default"
                    className="bg-green-500/80 hover:bg-green-500/70 inline-flex items-center justify-center gap-1 px-2.5 py-0.5 text-xs font-medium"
                >
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    <span>Activa</span>
                </Badge>
            )
        case "INACTIVE":
            return (
                <Badge
                    variant="secondary"
                    className="bg-yellow-500/80 hover:bg-yellow-500/70 inline-flex items-center justify-center gap-1 px-2.5 py-0.5 text-xs font-medium"
                >
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    <span>Inactiva</span>
                </Badge>
            )
        case "SUSPENDED":
            return (
                <Badge
                    variant="destructive"
                    className="bg-red-500/80 hover:bg-red-500/70 inline-flex items-center justify-center gap-1 px-2.5 py-0.5 text-xs font-medium"
                >
                    <XCircle className="h-3 w-3 mr-1" />
                    <span>Suspendida</span>
                </Badge>
            )
    }
}

export function StoreTableRow({ store, onEdit, onDelete }: StoreTableRowProps) {
    return (
        <TableRow className="border-border hover:bg-muted/50 transition-colors duration-150">
            <TableCell className="font-medium text-foreground">
                <div className="flex items-center">
                    <Hash className="mr-2 h-4 w-4 text-muted-foreground" />
                    {store.code}
                </div>
            </TableCell>
            <TableCell className="font-medium text-foreground">
                <div className="flex items-center">
                    <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                    {store.name}
                </div>
            </TableCell>
            <TableCell className="hidden md:table-cell text-muted-foreground">
                <div className="flex items-center">
                    <Hash className="mr-2 h-4 w-4 text-muted-foreground" />
                    {store.nit || "—"}
                </div>
            </TableCell>
            <TableCell className="text-foreground">
                <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    {store.city}
                </div>
            </TableCell>
            <TableCell className="hidden lg:table-cell text-muted-foreground max-w-xs truncate">
                <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    {store.address}
                </div>
            </TableCell>
            <TableCell className="hidden md:table-cell text-muted-foreground">
                <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    {store.phone || "—"}
                </div>
            </TableCell>
            <TableCell className="text-center">
                {getStatusBadge(store.status)}
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(store)}
                        title="Editar punto"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(store)}
                        title="Eliminar punto"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    )
}
