"use client"

import { TableHeader, TableRow, TableHead } from "@/components/ui/table"
import { ArrowDownUp, Building2, Hash, MapPin, Phone, Shield } from "lucide-react"

type SortField = "name" | "code" | "city" | "status"

interface TableHeaderProps {
    sortField: SortField
    sortDirection: "asc" | "desc"
    onSort: (field: SortField) => void
}

export function StoreTableHeader({ sortField, sortDirection, onSort }: TableHeaderProps) {
    const getSortIcon = (field: SortField) => {
        if (sortField !== field) return <ArrowDownUp className="ml-1 h-4 w-4 text-muted-foreground" />
        return sortDirection === "asc" ? (
            <ArrowDownUp className="ml-1 h-4 w-4 text-primary" />
        ) : (
            <ArrowDownUp className="ml-1 h-4 w-4 text-primary rotate-180" />
        )
    }

    return (
        <TableHeader className="bg-muted sticky top-0">
            <TableRow className="border-border hover:bg-muted">
                <TableHead className="text-foreground font-medium cursor-pointer" onClick={() => onSort("code")}>
                    <div className="flex items-center">
                        <Hash className="mr-2 h-4 w-4" />
                        Código
                        {getSortIcon("code")}
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium cursor-pointer" onClick={() => onSort("name")}>
                    <div className="flex items-center">
                        <Building2 className="mr-2 h-4 w-4" />
                        Nombre
                        {getSortIcon("name")}
                    </div>
                </TableHead>
                <TableHead className="hidden md:table-cell text-foreground font-medium">
                    <div className="flex items-center">
                        <Hash className="mr-2 h-4 w-4" />
                        NIT
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium cursor-pointer" onClick={() => onSort("city")}>
                    <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        Ciudad
                        {getSortIcon("city")}
                    </div>
                </TableHead>
                <TableHead className="hidden lg:table-cell text-foreground font-medium">
                    <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4" />
                        Dirección
                    </div>
                </TableHead>
                <TableHead className="hidden md:table-cell text-foreground font-medium">
                    <div className="flex items-center">
                        <Phone className="mr-2 h-4 w-4" />
                        Teléfono
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium cursor-pointer" onClick={() => onSort("status")}>
                    <div className="flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        Estado
                        {getSortIcon("status")}
                    </div>
                </TableHead>
                <TableHead className="text-right text-foreground font-medium">
                    <div className="flex items-center justify-end">
                        Acciones
                    </div>
                </TableHead>
            </TableRow>
        </TableHeader>
    )
}
