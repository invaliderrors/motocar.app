"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, RefreshCw, CheckCircle2, AlertTriangle, XCircle } from "lucide-react"

interface SearchFiltersProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    statusFilter: string | null
    onStatusFilterChange: (value: string | null) => void
    onResetFilters: () => void
    onRefresh: () => void
    hasActiveFilters: boolean
    actionButton?: React.ReactNode
}

export function SearchFilters({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    onResetFilters,
    onRefresh,
    hasActiveFilters,
    actionButton,
}: SearchFiltersProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {/* Search Input */}
                <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Buscar por nombre, código, ciudad..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 w-full sm:w-[300px]"
                    />
                </div>

                {/* Status Filter */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className={`gap-2 ${statusFilter !== null ? "bg-primary/10 border-primary" : ""}`}
                        >
                            <Filter className="h-4 w-4" />
                            Estado
                            {statusFilter && (
                                <span className="ml-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium">
                                    1
                                </span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuItem onClick={() => onStatusFilterChange(null)}>
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-muted-foreground" />
                                Todos los estados
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusFilterChange("ACTIVE")}>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-400" />
                                Activa
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusFilterChange("INACTIVE")}>
                            <div className="flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                                Inactiva
                            </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusFilterChange("SUSPENDED")}>
                            <div className="flex items-center gap-2">
                                <XCircle className="h-4 w-4 text-red-400" />
                                Suspendida
                            </div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Reset Filters */}
                {hasActiveFilters && (
                    <Button variant="ghost" onClick={onResetFilters} className="gap-2">
                        <XCircle className="h-4 w-4" />
                        Limpiar filtros
                    </Button>
                )}
            </div>

            {/* Right side actions */}
            <div className="flex gap-2 w-full md:w-auto justify-end">
                <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Actualizar
                </Button>
                {actionButton}
            </div>
        </div>
    )
}
