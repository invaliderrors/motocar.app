"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Search, Plus, Archive, ArchiveRestore, RefreshCw, FileSpreadsheet, Sparkles } from "lucide-react"
import { LoanForm } from "../LoanForm"
import { useResourcePermissions } from "@/hooks/useResourcePermissions"
import { Resource } from "@/lib/types/permissions"

interface LoanTableControlsProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    itemsPerPage: number
    onItemsPerPageChange: (value: number) => void
    onPageChange: (page: number) => void
    showArchived: boolean
    onShowArchivedChange: (value: boolean) => void
    statusFilter: string
    onStatusFilterChange: (value: string) => void
    onRefresh?: () => void
    onExportCSV?: () => void
}

export function LoanTableControls({
    searchTerm,
    onSearchChange,
    itemsPerPage,
    onItemsPerPageChange,
    onPageChange,
    showArchived,
    onShowArchivedChange,
    statusFilter,
    onStatusFilterChange,
    onRefresh,
    onExportCSV,
}: LoanTableControlsProps) {
    const loanPermissions = useResourcePermissions(Resource.LOAN)
    const reportPermissions = useResourcePermissions(Resource.REPORT)

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar por cliente, identificación o modelo..."
                        className="pl-9 border-border focus:border-primary"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                <Select
                    value={statusFilter}
                    onValueChange={(value) => {
                        onStatusFilterChange(value)
                        onPageChange(1)
                    }}
                >
                    <SelectTrigger className="w-[200px] border-border focus:border-primary">
                        <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">- Todos -</SelectItem>
                        <SelectItem value="ACTIVE">Activo</SelectItem>
                        <SelectItem value="COMPLETED">Finalizado</SelectItem>
                        <SelectItem value="RESTARTED_BY_DEFAULT">Reiniciado por mora</SelectItem>
                        <SelectItem value="COMPLETED_BY_THEFT">Finalizado por Robo de vehículo</SelectItem>
                        <SelectItem value="COMPLETED_BY_PROSECUTOR">Contrato finalizado por fiscalía</SelectItem>
                        <SelectItem value="IMMOBILIZED_BY_TRAFFIC">Inmovilizado por tránsito</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex items-center gap-2">
                    <Button
                        variant={showArchived ? "default" : "outline"}
                        size="sm"
                        onClick={() => onShowArchivedChange(!showArchived)}
                        className={
                            showArchived
                                ? "bg-amber-500 hover:bg-amber-600 text-white"
                                : "border-amber-200 text-amber-600"
                        }
                    >
                        {showArchived ? (
                            <>
                                <ArchiveRestore className="mr-2 h-4 w-4" />
                                Ver Activos
                            </>
                        ) : (
                            <>
                                <Archive className="mr-2 h-4 w-4" />
                                Ver Archivados
                            </>
                        )}
                    </Button>
                    {showArchived && (
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            Archivados
                        </Badge>
                    )}
                </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
                {onRefresh && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        className="border-border hover:bg-muted"
                    >
                        <RefreshCw className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Actualizar</span>
                    </Button>
                )}
                {/* Export requires REPORT.EXPORT or LOAN.EXPORT */}
                {onExportCSV && (reportPermissions.canExport || loanPermissions.canExport) && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onExportCSV}
                        className="border-border hover:bg-muted"
                    >
                        <FileSpreadsheet className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Exportar</span>
                    </Button>
                )}
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="relative">
                                <Select
                                    value={itemsPerPage.toString()}
                                    onValueChange={(value) => {
                                        onItemsPerPageChange(Number(value))
                                        onPageChange(1)
                                    }}
                                >
                                    <SelectTrigger className="w-[150px] border-border focus:border-primary">
                                        <div className="flex items-center gap-1.5">
                                            <Sparkles className="h-3.5 w-3.5 text-primary" />
                                            <SelectValue placeholder="Mostrar" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">5 por página</SelectItem>
                                        <SelectItem value="8">8 por página</SelectItem>
                                        <SelectItem value="10">10 por página</SelectItem>
                                        <SelectItem value="15">15 por página</SelectItem>
                                        <SelectItem value="20">20 por página</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Ajustado automáticamente según el tamaño de pantalla</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                {/* Create new loan requires LOAN.CREATE */}
                {loanPermissions.canCreate && (
                    <LoanForm onSaved={onRefresh}>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all">
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo contrato
                        </Button>
                    </LoanForm>
                )}
            </div>
        </div>
    )
}
