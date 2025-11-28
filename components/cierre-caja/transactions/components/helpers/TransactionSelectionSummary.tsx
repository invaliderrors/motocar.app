"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Square, X, ReplaceAllIcon as SelectAll } from 'lucide-react'
import { formatCurrency } from "@/lib/utils"

interface TransactionSelectionSummaryProps {
    selectedCount: number
    selectedSummary: {
        totalIncome: number
        totalExpense: number
        netAmount: number
        count: number
    }
    onSelectAllFiltered: (checked: boolean) => void
    onClearAll: () => void
    totalFilteredItems: number
}

export function TransactionSelectionSummary({
    selectedCount,
    selectedSummary,
    onSelectAllFiltered,
    onClearAll,
    totalFilteredItems,
}: TransactionSelectionSummaryProps) {
    const allFilteredSelected = selectedCount === totalFilteredItems && totalFilteredItems > 0

    return (
        <Card className="bg-muted border-border">
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <CheckSquare className="h-5 w-5 text-primary" />
                            <span className="font-medium text-foreground">
                                {selectedCount} transacción{selectedCount !== 1 ? "es" : ""} seleccionada
                                {selectedCount !== 1 ? "s" : ""}
                            </span>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                            <Badge
                                variant="secondary"
                                className="bg-green-500/10 text-green-500 border-green-500/20"
                            >
                                Ingresos: {formatCurrency(selectedSummary.totalIncome)}
                            </Badge>
                            <Badge variant="secondary" className="bg-red-500/10 text-red-500 border-red-500/20">
                                Egresos: {formatCurrency(selectedSummary.totalExpense)}
                            </Badge>
                            <Badge
                                variant="secondary"
                                className={`${selectedSummary.netAmount >= 0
                                        ? "bg-primary/10 text-primary border-primary/20"
                                        : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                    }`}
                            >
                                Neto: {formatCurrency(selectedSummary.netAmount)}
                            </Badge>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onSelectAllFiltered(!allFilteredSelected)}
                            className="text-primary border-border hover:bg-muted"
                        >
                            {allFilteredSelected ? (
                                <>
                                    <Square className="mr-2 h-4 w-4" />
                                    Deseleccionar todas
                                </>
                            ) : (
                                <>
                                    <SelectAll className="mr-2 h-4 w-4" />
                                    Seleccionar todas ({totalFilteredItems})
                                </>
                            )}
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onClearAll}
                            className="text-destructive border-border hover:bg-muted bg-transparent"
                        >
                            <X className="mr-2 h-4 w-4" />
                            Limpiar selección
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
