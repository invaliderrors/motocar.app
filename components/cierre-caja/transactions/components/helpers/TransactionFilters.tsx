"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bike, Filter, Search, Loader2 } from "lucide-react"
import { FILTER_OPTIONS } from "../../constants"
import { useProviders } from "@/components/providers/hooks/useProviders"

interface TransactionFiltersProps {
    searchTerm: string
    typeFilter: string
    providerFilter: string
    onSearchChange: (value: string) => void
    onTypeFilterChange: (value: string) => void
    onProviderFilterChange: (value: string) => void
    onResetFilters: () => void
    hasActiveFilters: boolean
}

export const TransactionFilters = React.memo(function TransactionFilters({
    searchTerm,
    typeFilter,
    providerFilter,
    onSearchChange,
    onTypeFilterChange,
    onProviderFilterChange,
    onResetFilters,
    hasActiveFilters,
}: TransactionFiltersProps) {
    const { providers, loading: providersLoading, error: providersError } = useProviders()

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Buscar por cliente, descripción o referencia..."
                    className="pl-9 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <Select key={`type-${typeFilter}`} value={typeFilter} onValueChange={onTypeFilterChange}>
                    <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Filtrar por tipo" />
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        {FILTER_OPTIONS.TYPE.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    key={`provider-${providerFilter}`}
                    value={providerFilter}
                    onValueChange={onProviderFilterChange}
                    disabled={providersLoading}
                >
                    <SelectTrigger className="w-full md:w-[180px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2">
                            <Bike className="h-4 w-4 text-muted-foreground" />
                            {providersLoading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Cargando...</span>
                                </div>
                            ) : (
                                <SelectValue placeholder="Filtrar por proveedor" />
                            )}
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los proveedores</SelectItem>
                        {providersError ? (
                            <SelectItem value="error" disabled>
                                Error al cargar proveedores
                            </SelectItem>
                        ) : (
                            providers.map((provider) => (
                                <SelectItem key={provider.id} value={provider.name}>
                                    {provider.name}
                                </SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onResetFilters}
                        className="h-10 px-3 text-muted-foreground hover:text-foreground"
                    >
                        Limpiar filtros
                    </Button>
                )}
            </div>
        </div>
    )
})
