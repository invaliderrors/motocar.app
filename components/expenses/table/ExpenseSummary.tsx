"use client"

import { DollarSign, Calendar, Tag } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { DateRange } from "react-day-picker"

interface ExpenseSummaryProps {
    totalAmount: number
    dateRange: DateRange | undefined
    categoryFilter: string
    formatMoney: (amount: number) => string
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

export function ExpenseSummary({ totalAmount, dateRange, categoryFilter, formatMoney }: ExpenseSummaryProps) {
    return (
        <div className="bg-muted border border-border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                    <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <p className="text-sm text-foreground">Total de egresos</p>
                    <p className="text-xl font-bold text-foreground">${formatMoney(totalAmount)}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <p className="text-sm text-foreground">Período</p>
                    <p className="text-md font-medium text-foreground">
                        {dateRange?.from && dateRange?.to ? (
                            <>
                                {format(dateRange.from, "dd MMM", { locale: es })} -{" "}
                                {format(dateRange.to, "dd MMM yyyy", { locale: es })}
                            </>
                        ) : (
                            format(new Date(), "MMMM yyyy", { locale: es }).replace(/^./, (c) => c.toUpperCase())
                        )}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                    <Tag className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <p className="text-sm text-foreground">Categorías</p>
                    <p className="text-md font-medium text-foreground">
                        {categoryFilter === "todos" ? "Todas" : categoryMap[categoryFilter] || categoryFilter}
                    </p>
                </div>
            </div>
        </div>
    )
}
