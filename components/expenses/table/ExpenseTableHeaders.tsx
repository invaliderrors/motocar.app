"use client"

import { TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Hash, Calendar, Tag, Bike, DollarSign, CreditCard, User, FileText, FileEdit, ArrowUpDown } from "lucide-react"

interface ExpenseTableHeadersProps {
    sortDirection: "desc" | "asc"
    onToggleSort: () => void
}

export function ExpenseTableHeaders({ sortDirection, onToggleSort }: ExpenseTableHeadersProps) {
    return (
        <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
                <TableHead className="text-left">
                    <div className="flex items-center gap-1.5">
                        <Hash className="h-4 w-4" />
                        <span>ID</span>
                    </div>
                </TableHead>
                <TableHead className="text-left">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>Fecha</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="ml-1 p-0 h-6 w-6 text-primary hover:text-primary"
                            onClick={onToggleSort}
                        >
                            <ArrowUpDown className={`h-4 w-4 ${sortDirection === "desc" ? "" : "rotate-180"}`} />
                            <span className="sr-only">Ordenar</span>
                        </Button>
                    </div>
                </TableHead>
                <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                        <Tag className="h-4 w-4" />
                        <span>Categoría</span>
                    </div>
                </TableHead>
                <TableHead className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                        <Bike className="h-4 w-4" />
                        <span>Proveedor</span>
                    </div>
                </TableHead>
                <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                        <DollarSign className="h-4 w-4" />
                        <span>Monto</span>
                    </div>
                </TableHead>
                <TableHead className="text-left">
                    <div className="flex items-center gap-1.5">
                        <CreditCard className="h-4 w-4" />
                        <span>Método</span>
                    </div>
                </TableHead>
                <TableHead className="text-left">
                    <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        <span>Beneficiario</span>
                    </div>
                </TableHead>
                <TableHead className="text-left hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                        <FileText className="h-4 w-4" />
                        <span>Referencia</span>
                    </div>
                </TableHead>
                <TableHead className="text-left hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4" />
                        <span>Creado por</span>
                    </div>
                </TableHead>
                <TableHead className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                        <FileEdit className="h-4 w-4" />
                        <span>Acciones</span>
                    </div>
                </TableHead>
            </TableRow>
        </TableHeader>
    )
}
