"use client"

import { Button } from "@/components/ui/button"
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, Download, FileText, Printer, RefreshCw } from "lucide-react"
import { useResourcePermissions } from "@/hooks/useResourcePermissions"
import { Resource } from "@/lib/types/permissions"

interface TransactionHeaderProps {
    refreshing: boolean
    onRefresh: () => void
    selectedCount?: number
    onExportSelected?: () => void
    onExportAll?: () => void
}

export function TransactionHeader({
    refreshing,
    onRefresh,
    selectedCount = 0,
    onExportSelected,
    onExportAll,
}: TransactionHeaderProps) {
    const reportPermissions = useResourcePermissions(Resource.REPORT)
    const closingPermissions = useResourcePermissions(Resource.CLOSING)

    return (
        <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        Registro de Transacciones
                        {selectedCount > 0 && (
                            <span className="text-sm font-normal text-muted-foreground">({selectedCount} seleccionadas)</span>
                        )}
                    </CardTitle>
                    <CardDescription>
                        Gestiona y visualiza todas las transacciones del sistema
                        {selectedCount > 0 && (
                            <span className="block text-primary mt-1">
                                {selectedCount} transacciones seleccionadas para exportar
                            </span>
                        )}
                    </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        disabled={refreshing}
                        className="h-9 gap-1.5 bg-transparent"
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                        Actualizar
                    </Button>
                    {(reportPermissions.canExport || closingPermissions.canExport) && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-9 bg-transparent">
                                    <Download className="h-4 w-4 mr-1.5" />
                                    Exportar
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Opciones de exportación</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {selectedCount > 0 && (
                                    <>
                                        <DropdownMenuItem onClick={onExportSelected}>
                                            <FileText className="h-4 w-4 mr-2" />
                                            Exportar seleccionadas ({selectedCount})
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                    </>
                                )}
                                <DropdownMenuItem onClick={onExportAll}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Exportar todas a CSV
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={onExportAll}>
                                    <FileText className="h-4 w-4 mr-2" />
                                    Exportar todas a Excel
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Printer className="h-4 w-4 mr-2" />
                                    Imprimir
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </CardHeader>
    )
}
