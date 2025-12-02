"use client"

import { Badge } from "@/components/ui/badge"
import { CreditCard, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface ContractStatusBadgeProps {
    status: string
    contractNumber?: string | null
    className?: string
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
    ACTIVE: {
        label: "Activo",
        className: "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400"
    },
    COMPLETED: {
        label: "Completado",
        className: "bg-green-500/15 text-green-600 border-green-500/30 dark:bg-green-500/20 dark:text-green-400"
    },
    DEFAULTED: {
        label: "Incumplido",
        className: "bg-red-500/15 text-red-600 border-red-500/30 dark:bg-red-500/20 dark:text-red-400"
    },
    PENDING: {
        label: "Pendiente",
        className: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-400"
    },
    ARCHIVED: {
        label: "Archivado",
        className: "bg-slate-500/15 text-slate-600 border-slate-500/30 dark:bg-slate-500/20 dark:text-slate-400"
    },
}

export function ContractStatusBadge({ status, contractNumber, className }: ContractStatusBadgeProps) {
    const config = STATUS_CONFIG[status] || { 
        label: status, 
        className: "bg-slate-500/15 text-slate-600 border-slate-500/30" 
    }

    return (
        <div className={cn("flex items-center justify-between gap-3 p-3 rounded-lg bg-gradient-to-r from-muted/50 to-muted/30 border border-border/50", className)}>
            <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-primary" />
                </div>
                <div>
                    <p className="text-[10px] font-medium text-muted-foreground">Estado del contrato</p>
                    <Badge
                        variant="outline"
                        className={cn("px-2 py-0.5 text-xs font-medium", config.className)}
                    >
                        {config.label}
                    </Badge>
                </div>
            </div>
            
            {contractNumber && (
                <div className="text-right">
                    <p className="text-[10px] font-medium text-muted-foreground">Contrato No.</p>
                    <p className="text-base font-bold text-foreground">{contractNumber}</p>
                </div>
            )}
        </div>
    )
}
