"use client"

import { UseFormReturn } from "react-hook-form"
import { CalendarDays, Calculator } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { NewsFormValues } from "../../hooks/form"

interface DaysPreviewProps {
    form: UseFormReturn<NewsFormValues>
}

export function DaysPreview({ form }: DaysPreviewProps) {
    const startDate = form.watch("startDate")
    const endDate = form.watch("endDate")

    // Calculate days unavailable (inclusive of both dates)
    const calculateDaysUnavailable = (): number => {
        if (!startDate || !endDate) return 0
        const start = new Date(startDate)
        const end = new Date(endDate)
        const diffTime = end.getTime() - start.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
        return diffDays > 0 ? diffDays : 0
    }

    const daysUnavailable = calculateDaysUnavailable()

    if (!startDate || !endDate || daysUnavailable <= 0) {
        return null
    }

    return (
        <Alert className="border-amber-500/50 bg-amber-500/10">
            <CalendarDays className="h-4 w-4 text-amber-500" />
            <AlertDescription className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                    <strong className="text-amber-500">{daysUnavailable}</strong>
                    <span className="text-muted-foreground">
                        {daysUnavailable === 1 ? "día" : "días"} de novedad
                    </span>
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                        Se descontarán <strong className="text-amber-500">{daysUnavailable}</strong> cuotas del contrato
                    </span>
                </span>
            </AlertDescription>
        </Alert>
    )
}
