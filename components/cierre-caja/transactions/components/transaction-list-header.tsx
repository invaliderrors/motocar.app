"use client"

import { TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ArrowUp, ArrowDown, Calendar, DollarSign, CreditCard, User, FileText, Clock, Tag } from "lucide-react"
import type { SortField } from "../constants/types"

interface TransactionListHeaderProps {
    selectedAll: boolean
    indeterminate?: boolean
    onSelectAll: (checked: boolean) => void
    sortField: SortField
    sortDirection: string
    onSort: (field: SortField) => void
}

export function TransactionListHeader({
    selectedAll,
    indeterminate = false,
    onSelectAll,
    sortField,
    sortDirection,
    onSort,
}: TransactionListHeaderProps) {
    const getSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return <ArrowUpDown className="ml-1 h-3.5 w-3.5 opacity-50" />
        }
        return sortDirection === "asc" ? (
            <ArrowUp className="ml-1 h-3.5 w-3.5 text-primary" />
        ) : (
            <ArrowDown className="ml-1 h-3.5 w-3.5 text-primary" />
        )
    }

    return (
        <TableHeader>
            <TableRow className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b-2 border-primary/20 hover:bg-gradient-to-r hover:from-primary/10 hover:via-primary/15 hover:to-primary/10">
                <TableHead className="w-12">
                    <Checkbox
                        checked={indeterminate ? "indeterminate" : selectedAll}
                        onCheckedChange={(checked) => onSelectAll(!!checked)}
                        aria-label="Seleccionar todas las transacciones"
                        className="border-primary/50"
                    />
                </TableHead>
                <TableHead className="font-semibold">
                    <Button
                        variant="ghost"
                        onClick={() => onSort("type")}
                        className="h-auto p-0 font-semibold hover:bg-transparent hover:text-primary transition-colors"
                    >
                        <div className="flex items-center">
                            <Tag className="mr-1.5 h-3.5 w-3.5" />
                            Tipo
                            {getSortIcon("type")}
                        </div>
                    </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell font-semibold">
                    <Button
                        variant="ghost"
                        onClick={() => onSort("date")}
                        className="h-auto p-0 font-semibold hover:bg-transparent hover:text-primary transition-colors"
                    >
                        <div className="flex items-center">
                            <Calendar className="mr-1.5 h-3.5 w-3.5" />
                            Fecha de Pago
                            {getSortIcon("date")}
                        </div>
                    </Button>
                </TableHead>
                <TableHead className="hidden lg:table-cell font-semibold">
                    <div className="flex items-center text-amber-700 dark:text-amber-500">
                        <Calendar className="mr-1.5 h-3.5 w-3.5" />
                        Fecha Cierre
                    </div>
                </TableHead>
                <TableHead className="hidden xl:table-cell font-semibold">
                    <div className="flex items-center">
                        <Clock className="mr-1.5 h-3.5 w-3.5 opacity-60" />
                        <span className="text-muted-foreground">Creación</span>
                    </div>
                </TableHead>
                <TableHead className="font-semibold">
                    <Button
                        variant="ghost"
                        onClick={() => onSort("description")}
                        className="h-auto p-0 font-semibold hover:bg-transparent hover:text-primary transition-colors"
                    >
                        <div className="flex items-center">
                            <FileText className="mr-1.5 h-3.5 w-3.5" />
                            Descripción
                            {getSortIcon("description")}
                        </div>
                    </Button>
                </TableHead>
                <TableHead className="font-semibold">
                    <Button
                        variant="ghost"
                        onClick={() => onSort("provider")}
                        className="h-auto p-0 font-semibold hover:bg-transparent hover:text-primary transition-colors"
                    >
                        <div className="flex items-center">
                            <User className="mr-1.5 h-3.5 w-3.5" />
                            Proveedor
                            {getSortIcon("provider")}
                        </div>
                    </Button>
                </TableHead>
                <TableHead className="text-right font-semibold">
                    <Button
                        variant="ghost"
                        onClick={() => onSort("amount")}
                        className="h-auto p-0 font-semibold hover:bg-transparent hover:text-primary transition-colors"
                    >
                        <div className="flex items-center justify-end">
                            <DollarSign className="mr-1.5 h-4 w-4" />
                            Monto
                            {getSortIcon("amount")}
                        </div>
                    </Button>
                </TableHead>
                <TableHead className="font-semibold">
                    <div className="flex items-center">
                        <CreditCard className="mr-1.5 h-3.5 w-3.5" />
                        Método
                    </div>
                </TableHead>
                <TableHead className="font-semibold">
                    <div className="flex items-center">
                        <User className="mr-1.5 h-3.5 w-3.5" />
                        Cliente/Registrado
                    </div>
                </TableHead>
                <TableHead className="text-right font-semibold">Acciones</TableHead>
            </TableRow>
        </TableHeader>
    )
}
