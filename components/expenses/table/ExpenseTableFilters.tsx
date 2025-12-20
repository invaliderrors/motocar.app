"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card } from "@/components/ui/card"
import { Search, Plus, RefreshCw, FileSpreadsheet, Sparkles, DollarSign } from "lucide-react"
import { ExpenseModal } from "../expense-modal"
import type { DateRange } from "react-day-picker"
import type { Provider } from "@/lib/types"
import { DateRangePicker } from "@/components/common/date-range-picker"
import { useResourcePermissions } from "@/hooks/useResourcePermissions"
import { Resource } from "@/lib/types/permissions"

interface ExpenseTableFiltersProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
    categoryFilter: string
    setCategoryFilter: (category: string) => void
    providerFilter: string
    setProviderFilter: (provider: string) => void
    itemsPerPage: number
    setItemsPerPage: (items: number) => void
    setCurrentPage: (page: number) => void
    onDateRangeChange: (range: DateRange | undefined) => void
    onRefresh: () => void
    onExportCSV: () => void
    availableProviders: Provider[]
    totalAmount: number
    dateRange: DateRange | undefined
    formatMoney: (amount: number) => string
}

const categoryMap: Record<string, string> = {
    RENT: "Alquiler",
    SERVICES: "Servicios",
    SALARIES: "Salarios",
    TAXES: "Impuestos",
    MAINTENANCE: "Mantenimiento",
    WORKSHOP: "Taller",
    SPARE_PARTS: "Repuestos",
    PURCHASES: "Compras",
    MARKETING: "Marketing",
    TRANSPORT: "Transporte",
    OTHER: "Otros",
}

export function ExpenseTableFilters({
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    providerFilter,
    setProviderFilter,
    itemsPerPage,
    setItemsPerPage,
    setCurrentPage,
    onDateRangeChange,
    onRefresh,
    onExportCSV,
    availableProviders,
    totalAmount,
    dateRange,
    formatMoney,
}: ExpenseTableFiltersProps) {
    const expensePermissions = useResourcePermissions(Resource.EXPENSE)
    const reportPermissions = useResourcePermissions(Resource.REPORT)

    return (
        <div className="space-y-4">
            {/* Summary Card */}
            <Card className="p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-900/50">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                        <DollarSign className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total de Egresos</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatMoney(totalAmount)}</p>
                        {dateRange?.from && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {categoryFilter !== 'todos' && `${categoryMap[categoryFilter]} • `}
                                {dateRange.from.toLocaleDateString()} - {dateRange.to?.toLocaleDateString() || 'Hoy'}
                            </p>
                        )}
                    </div>
                </div>
            </Card>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Buscar por beneficiario, referencia..."
                            className="pl-9 border-border focus:border-primary"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value)
                                setCurrentPage(1)
                            }}
                        />
                    </div>

                    <DateRangePicker onRangeChange={onDateRangeChange} className="w-full sm:w-[280px]" />

                    <Select
                        value={categoryFilter}
                        onValueChange={(value) => {
                            setCategoryFilter(value)
                            setCurrentPage(1)
                        }}
                    >
                        <SelectTrigger className="w-full sm:w-[180px] border-border focus:border-primary">
                            <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todas las categorías</SelectItem>
                            {Object.entries(categoryMap).map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={providerFilter}
                        onValueChange={(value) => {
                            setProviderFilter(value)
                            setCurrentPage(1)
                        }}
                    >
                        <SelectTrigger className="w-full sm:w-[180px] border-border focus:border-primary">
                            <SelectValue placeholder="Proveedor" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todos">Todos los proveedores</SelectItem>
                            {availableProviders.map((provider) => (
                                <SelectItem key={provider.id} value={provider.name}>
                                    {provider.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onRefresh}
                        className="border-border hover:bg-muted"
                    >
                        <RefreshCw className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Actualizar</span>
                    </Button>
                    {(reportPermissions.canCreate || expensePermissions.canCreate) && (
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
                                            setItemsPerPage(Number(value))
                                            setCurrentPage(1)
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
                                            <SelectItem value="10">10 por página</SelectItem>
                                            <SelectItem value="20">20 por página</SelectItem>
                                            <SelectItem value="50">50 por página</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Número de registros por página</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    {expensePermissions.canCreate && (
                        <ExpenseModal onSuccess={onRefresh}>
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all">
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo Egreso
                            </Button>
                        </ExpenseModal>
                    )}
                </div>
            </div>
        </div>
    )
}
