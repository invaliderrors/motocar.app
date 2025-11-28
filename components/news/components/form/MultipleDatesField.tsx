"use client"

import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Plus, X } from "lucide-react"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { NewsFormValues } from "../../hooks/form"

interface MultipleDatesFieldProps {
    form: UseFormReturn<NewsFormValues>
}

// Helper to format date to YYYY-MM-DD using local date components
function formatDateString(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

// Helper to parse YYYY-MM-DD string to Date (local time)
function parseDateString(dateString: string | undefined): Date | undefined {
    if (!dateString) return undefined
    const [year, month, day] = dateString.split("-").map(Number)
    return new Date(year, month - 1, day)
}

export function MultipleDatesField({ form }: MultipleDatesFieldProps) {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>()
    const [popoverOpen, setPopoverOpen] = useState(false)
    const skippedDates = form.watch("skippedDates") || []

    const addDate = () => {
        if (!selectedDate) return
        const dateStr = formatDateString(selectedDate)
        if (!skippedDates.includes(dateStr)) {
            form.setValue("skippedDates", [...skippedDates, dateStr].sort())
            // Also set startDate to the first date for reference
            if (skippedDates.length === 0) {
                form.setValue("startDate", dateStr)
            }
        }
        setSelectedDate(undefined)
        setPopoverOpen(false)
    }

    const removeDate = (index: number) => {
        const newDates = skippedDates.filter((_, i) => i !== index)
        form.setValue("skippedDates", newDates)
        // Update startDate to the first remaining date
        if (newDates.length > 0) {
            form.setValue("startDate", newDates[0])
        }
    }

    return (
        <FormField
            control={form.control}
            name="skippedDates"
            render={() => (
                <FormItem>
                    <FormLabel>Fechas Específicas</FormLabel>
                    <FormDescription>
                        Agrega las fechas individuales que deseas omitir
                    </FormDescription>
                    <div className="flex gap-2">
                        <Popover modal={true} open={popoverOpen} onOpenChange={setPopoverOpen}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "flex-1 pl-3 text-left font-normal",
                                            !selectedDate && "text-muted-foreground"
                                        )}
                                    >
                                        {selectedDate ? (
                                            format(selectedDate, "EEEE d 'de' MMMM", { locale: es })
                                        ) : (
                                            <span>Seleccionar fecha</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    disabled={(date) => {
                                        const dateStr = formatDateString(date)
                                        return skippedDates.includes(dateStr)
                                    }}
                                    locale={es}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={addDate}
                            disabled={!selectedDate}
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>

                    {skippedDates.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {skippedDates.map((date, index) => (
                                <Badge key={index} variant="secondary" className="flex items-center gap-1 py-1">
                                    {format(parseDateString(date)!, "EEE d MMM", { locale: es })}
                                    <button
                                        type="button"
                                        onClick={() => removeDate(index)}
                                        className="ml-1 hover:text-destructive transition-colors"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}

                    {skippedDates.length === 0 && (
                        <p className="text-sm text-muted-foreground italic mt-2">
                            No hay fechas seleccionadas
                        </p>
                    )}

                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
