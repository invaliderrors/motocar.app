"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus } from "lucide-react"
import { ExpenseModal } from "../expense-modal"
import type { DateRange } from "react-day-picker"
import type { Provider } from "@/lib/types"
import { DateRangePicker } from "@/components/common/date-range-picker"

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
    availableProviders: Provider[]
}

const categoryMap: Record<string, string> = {
    RENT: "Alquiler",
    SERVICES: "Servicios",
    SALARIES: "Salarios",
    TAXES: "Impuestos",
    MAINTENANCE: "Mantenimiento",
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
    availableProviders,
}: ExpenseTableFiltersProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-blue-500/70" />
                <Input
                    type="search"
                    placeholder="Buscar por beneficiario, referencia o descripción..."
                    className="pl-9 border-blue-100 focus:border-blue-300 dark:border-blue-900/50 dark:focus:border-blue-700"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setCurrentPage(1)
                    }}
                />
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <DateRangePicker onRangeChange={onDateRangeChange} className="w-full sm:w-[280px]" />
                <Select
                    value={categoryFilter}
                    onValueChange={(value) => {
                        setCategoryFilter(value)
                        setCurrentPage(1)
                    }}
                >
                    <SelectTrigger className="w-full sm:w-[180px] border-blue-100 focus:border-blue-300 dark:border-blue-900/50 dark:focus:border-blue-700">
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
                    <SelectTrigger className="w-full sm:w-[180px] border-blue-100 focus:border-blue-300 dark:border-blue-900/50 dark:focus:border-blue-700">
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
                <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                        setItemsPerPage(Number(value))
                        setCurrentPage(1)
                    }}
                >
                    <SelectTrigger className="w-full sm:w-[180px] border-blue-100 focus:border-blue-300 dark:border-blue-900/50 dark:focus:border-blue-700">
                        <SelectValue placeholder="Mostrar" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5 por página</SelectItem>
                        <SelectItem value="10">10 por página</SelectItem>
                        <SelectItem value="20">20 por página</SelectItem>
                        <SelectItem value="50">50 por página</SelectItem>
                    </SelectContent>
                </Select>
                <ExpenseModal onSuccess={onRefresh}>
                    <Button className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white shadow-sm hover:shadow-md transition-all">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Egreso
                    </Button>
                </ExpenseModal>
            </div>
        </div>
    )
}
