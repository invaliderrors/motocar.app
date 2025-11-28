import React from "react"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from 'lucide-react'
import { CashRegisterDisplay } from "@/lib/types"

interface StatusBadgeProps {
    status: CashRegisterDisplay["status"]
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    switch (status) {
        case "balanced":
            return (
                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/30 flex items-center gap-1 text-xs px-2 py-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                    Cuadrado
                </Badge>
            )
        case "minor-diff":
            return (
                <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800/30 flex items-center gap-1 text-xs px-2 py-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                    Diferencia Menor
                </Badge>
            )
        case "major-diff":
            return (
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800/30 flex items-center gap-1 text-xs px-2 py-0.5">
                    <AlertCircle className="h-3 w-3" />
                    Diferencia Mayor
                </Badge>
            )
    }
}
