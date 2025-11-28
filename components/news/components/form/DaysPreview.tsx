"use client"

import { useMemo } from "react"
import { UseFormReturn } from "react-hook-form"
import { CalendarDays, Calculator, Repeat, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { format, addDays } from "date-fns"
import { es } from "date-fns/locale"
import { NewsFormValues } from "../../hooks/form"

interface DaysPreviewProps {
    form: UseFormReturn<NewsFormValues>
}

// Helper to parse YYYY-MM-DD string to Date (local time)
function parseDateString(dateString: string | undefined): Date | undefined {
    if (!dateString) return undefined
    const [year, month, day] = dateString.split("-").map(Number)
    return new Date(year, month - 1, day)
}

const MONTHS = [
    { value: 1, label: "Enero" },
    { value: 2, label: "Febrero" },
    { value: 3, label: "Marzo" },
    { value: 4, label: "Abril" },
    { value: 5, label: "Mayo" },
    { value: 6, label: "Junio" },
    { value: 7, label: "Julio" },
    { value: 8, label: "Agosto" },
    { value: 9, label: "Septiembre" },
    { value: 10, label: "Octubre" },
    { value: 11, label: "Noviembre" },
    { value: 12, label: "Diciembre" },
]

export function DaysPreview({ form }: DaysPreviewProps) {
    const startDate = form.watch("startDate")
    const endDate = form.watch("endDate")
    const dateSelectionMode = form.watch("dateSelectionMode")
    const skippedDates = form.watch("skippedDates") || []
    const recurringDay = form.watch("recurringDay")
    const recurringMonths = form.watch("recurringMonths") || []

    // Calculate days for range mode
    const rangeDays = useMemo(() => {
        if (dateSelectionMode !== "range" || !startDate || !endDate) return 0
        const start = new Date(startDate)
        const end = new Date(endDate)
        const diffTime = end.getTime() - start.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
        return diffDays > 0 ? diffDays : 0
    }, [dateSelectionMode, startDate, endDate])

    // Generate preview dates for range mode (limited to 10)
    const previewDates = useMemo(() => {
        if (dateSelectionMode !== "range" || !startDate || !endDate) return []
        const start = parseDateString(startDate)
        const end = parseDateString(endDate)
        if (!start || !end || end < start) return []

        const dates: Date[] = []
        let current = new Date(start)
        while (current <= end && dates.length <= 10) {
            dates.push(new Date(current))
            current = addDays(current, 1)
        }
        return dates
    }, [dateSelectionMode, startDate, endDate])

    // Single date mode
    if (dateSelectionMode === "single" && startDate) {
        return (
            <Alert className="border-blue-500/50 bg-blue-500/10">
                <Info className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-sm">
                    Se omitirá <strong className="text-blue-500">1 cuota</strong> para el día{" "}
                    <strong>{format(parseDateString(startDate)!, "EEEE d 'de' MMMM", { locale: es })}</strong>
                </AlertDescription>
            </Alert>
        )
    }

    // Range mode
    if (dateSelectionMode === "range" && rangeDays > 0) {
        return (
            <Alert className="border-amber-500/50 bg-amber-500/10">
                <CalendarDays className="h-4 w-4 text-amber-500" />
                <AlertDescription className="space-y-2">
                    <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-2">
                            <strong className="text-amber-500">{rangeDays}</strong>
                            <span className="text-muted-foreground">
                                {rangeDays === 1 ? "día" : "días"} de novedad
                            </span>
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="flex items-center gap-2">
                            <Calculator className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                                Se descontarán <strong className="text-amber-500">{rangeDays}</strong> cuotas
                            </span>
                        </span>
                    </div>
                    {previewDates.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {previewDates.map((date, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                    {format(date, "EEE d", { locale: es })}
                                </Badge>
                            ))}
                            {rangeDays > 10 && (
                                <Badge variant="outline" className="text-xs">
                                    +{rangeDays - 10} más
                                </Badge>
                            )}
                        </div>
                    )}
                </AlertDescription>
            </Alert>
        )
    }

    // Multiple dates mode
    if (dateSelectionMode === "multiple" && skippedDates.length > 0) {
        return (
            <Alert className="border-purple-500/50 bg-purple-500/10">
                <CalendarDays className="h-4 w-4 text-purple-500" />
                <AlertDescription className="text-sm">
                    Se omitirán <strong className="text-purple-500">{skippedDates.length}</strong>{" "}
                    {skippedDates.length === 1 ? "cuota" : "cuotas"} en las fechas seleccionadas
                </AlertDescription>
            </Alert>
        )
    }

    // Recurring mode
    if (dateSelectionMode === "recurring" && recurringDay) {
        return (
            <Alert className="border-green-500/50 bg-green-500/10">
                <Repeat className="h-4 w-4 text-green-500" />
                <AlertDescription className="text-sm">
                    Se omitirá la cuota cada <strong className="text-green-500">día {recurringDay}</strong>{" "}
                    {recurringMonths.length > 0 
                        ? `de ${recurringMonths.map(m => MONTHS.find(month => month.value === m)?.label).join(", ")}`
                        : "de cada mes"}
                    {" "}<span className="text-muted-foreground">(afecta todos los contratos del punto)</span>
                </AlertDescription>
            </Alert>
        )
    }

    return null
}
