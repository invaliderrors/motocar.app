"use client"

import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react"

interface FilterSummaryProps {
    statusFilter: string | null
    totalFiltered: number
    totalItems: number
}

export function FilterSummary({ statusFilter, totalFiltered, totalItems }: FilterSummaryProps) {
    if (!statusFilter) return null

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return <CheckCircle2 className="h-3 w-3 text-green-400" />
            case "INACTIVE":
                return <AlertTriangle className="h-3 w-3 text-yellow-400" />
            case "SUSPENDED":
                return <XCircle className="h-3 w-3 text-red-400" />
            default:
                return null
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "Activas"
            case "INACTIVE":
                return "Inactivas"
            case "SUSPENDED":
                return "Suspendidas"
            default:
                return status
        }
    }

    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Filtros activos:</span>
            <Badge variant="secondary" className="gap-1">
                {getStatusIcon(statusFilter)}
                {getStatusLabel(statusFilter)}
            </Badge>
            <span className="ml-2">
                Mostrando {totalFiltered} de {totalItems} puntos
            </span>
        </div>
    )
}
