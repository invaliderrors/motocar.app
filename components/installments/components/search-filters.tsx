"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DateRangePicker } from "@/components/common/date-range-picker"
import {
    Search,
    Filter,
    RefreshCw,
    Banknote,
    CreditCard,
    FileText,
    Clock,
    CheckCircle2,
    AlertTriangle,
} from "lucide-react"
import type { DateRange } from "react-day-picker"

interface SearchFiltersProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    dateRange: DateRange | undefined
    onDateRangeChange: (range: DateRange | undefined) => void
    paymentFilter: string | null
    onPaymentFilterChange: (value: string | null) => void
    statusFilter: boolean | null
    onStatusFilterChange: (value: boolean | null) => void
    onResetFilters: () => void
    onRefresh: () => void
    hasActiveFilters: boolean
    actionButton?: React.ReactNode
}

export function SearchFilters({
    searchTerm,
    onSearchChange,
    dateRange,
    onDateRangeChange,
    paymentFilter,
    onPaymentFilterChange,
    statusFilter,
    onStatusFilterChange,
    onResetFilters,
    onRefresh,
    hasActiveFilters,
    actionButton,
}: SearchFiltersProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary" />
                <Input
                    type="search"
                    placeholder="Buscar por cliente, modelo o placa..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="flex gap-2 flex-wrap">
                {actionButton && actionButton}
                
                <DateRangePicker onRangeChange={onDateRangeChange} className="w-full sm:w-[280px]" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                        >
                            <Filter className="mr-2 h-4 w-4" />
                            Método de Pago
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onPaymentFilterChange(null)}>
                            Todos
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPaymentFilterChange("CASH")}>
                            <Banknote className="mr-2 h-4 w-4 text-green-400" />
                            Efectivo
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPaymentFilterChange("CARD")}>
                            <CreditCard className="mr-2 h-4 w-4 text-blue-400" />
                            Tarjeta
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onPaymentFilterChange("TRANSACTION")}>
                            <FileText className="mr-2 h-4 w-4 text-purple-400" />
                            Transferencia
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="sm"
                        >
                            <Clock className="mr-2 h-4 w-4" />
                            Estado
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onStatusFilterChange(null)}>
                            Todos
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusFilterChange(false)}>
                            <CheckCircle2 className="mr-2 h-4 w-4 text-green-400" />A tiempo
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusFilterChange(true)}>
                            <AlertTriangle className="mr-2 h-4 w-4 text-red-400" />
                            Atrasada
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onResetFilters}
                    >
                        Limpiar filtros
                    </Button>
                )}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRefresh}
                >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Actualizar
                </Button>
            </div>
        </div>
    )
}
