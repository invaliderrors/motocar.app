"use client"

import { TableHeader, TableRow, TableHead } from "@/components/ui/table"
import { ArrowDownUp, User, Car, Calendar, CreditCard, Clock, FileText, StickyNote, Navigation } from 'lucide-react'
import { SortField } from "../utils/types"

interface TableHeaderProps {
    sortField: SortField
    sortDirection: "asc" | "desc"
    onSort: (field: SortField) => void
}

export function InstallmentTableHeader({ sortField, sortDirection, onSort }: TableHeaderProps) {
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
                <TableHead className="text-foreground font-medium cursor-pointer" onClick={() => onSort("userName")}>
                    <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Cliente
                        {getSortIcon("userName")}
                    </div>
                </TableHead>
                <TableHead
                    className="hidden md:table-cell text-foreground font-medium cursor-pointer"
                    onClick={() => onSort("vehicleModel")}
                >
                    <div className="flex items-center">
                        <Car className="mr-2 h-4 w-4" />
                        Vehículo
                        {getSortIcon("vehicleModel")}
                    </div>
                </TableHead>
                <TableHead className="hidden md:table-cell text-foreground font-medium">
                    <div className="flex items-center">
                        <Car className="mr-2 h-4 w-4" />
                        Placa
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium cursor-pointer" onClick={() => onSort("amount")}>
                    <div className="flex items-center">
                        <span className="mr-2 text-xs font-semibold">COP</span>
                        Monto
                        {getSortIcon("amount")}
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium">
                    <div className="flex items-center">
                        <Navigation className="mr-2 h-4 w-4" />
                        GPS
                    </div>
                </TableHead>
                <TableHead
                    className="hidden md:table-cell text-foreground font-medium cursor-pointer"
                    onClick={() => onSort("date")}
                >
                    <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Fecha de Pago
                        {getSortIcon("date")}
                    </div>
                </TableHead>
                <TableHead className="hidden lg:table-cell text-foreground font-medium">
                    <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Fecha Vencimiento
                    </div>
                </TableHead>
                <TableHead className="hidden xl:table-cell text-foreground font-medium text-center">
                    <div className="flex items-center justify-center">
                        <Clock className="mr-2 h-4 w-4" />
                        Días
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium">
                    <div className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Método
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium text-center">
                    <div className="flex items-center justify-center">
                        <Clock className="mr-2 h-4 w-4" />
                        Estado
                    </div>
                </TableHead>
                <TableHead className="hidden md:table-cell text-foreground font-medium">
                    <div className="flex items-center">
                        <StickyNote className="mr-2 h-4 w-4" />
                        Notas
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium">
                    <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Registrado por
                    </div>
                </TableHead>
                <TableHead className="text-foreground font-medium text-right">
                    <div className="flex items-center justify-end">
                        <FileText className="mr-2 h-4 w-4" />
                        Acciones
                    </div>
                </TableHead>
            </TableRow>
        </TableHeader>
    )
}
