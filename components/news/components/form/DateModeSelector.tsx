"use client"

import { UseFormReturn } from "react-hook-form"
import { Calendar, CalendarRange, CalendarDays, Repeat, CalendarX } from "lucide-react"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { NewsFormValues } from "../../hooks/form"

interface DateModeSelectorProps {
    form: UseFormReturn<NewsFormValues>
}

export function DateModeSelector({ form }: DateModeSelectorProps) {
    return (
        <FormField
            control={form.control}
            name="dateSelectionMode"
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel>Tipo de Fechas</FormLabel>
                    <FormControl>
                        <RadioGroup
                            onValueChange={(value) => {
                                field.onChange(value)
                                // Clear skipped dates when changing mode
                                if (value !== "multiple") {
                                    form.setValue("skippedDates", [])
                                }
                                // Set isRecurring based on mode
                                form.setValue("isRecurring", value === "recurring")
                                // Clear endDate if not range mode
                                if (value !== "range") {
                                    form.setValue("endDate", "")
                                }
                                // Clear skipWeekday if not weekday mode
                                if (value !== "weekday") {
                                    form.setValue("skipWeekday", undefined)
                                    form.setValue("applyToHistoricalLoans", false)
                                }
                            }}
                            value={field.value}
                            className="grid grid-cols-5 gap-3"
                        >
                            <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                                <RadioGroupItem value="single" id="single" />
                                <Label htmlFor="single" className="flex items-center gap-2 cursor-pointer flex-1">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium text-sm">Única</p>
                                        <p className="text-xs text-muted-foreground">Un día</p>
                                    </div>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                                <RadioGroupItem value="range" id="range" />
                                <Label htmlFor="range" className="flex items-center gap-2 cursor-pointer flex-1">
                                    <CalendarRange className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium text-sm">Rango</p>
                                        <p className="text-xs text-muted-foreground">Desde - hasta</p>
                                    </div>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                                <RadioGroupItem value="multiple" id="multiple" />
                                <Label htmlFor="multiple" className="flex items-center gap-2 cursor-pointer flex-1">
                                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium text-sm">Múltiples</p>
                                        <p className="text-xs text-muted-foreground">Manual</p>
                                    </div>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                                <RadioGroupItem value="recurring" id="recurring" />
                                <Label htmlFor="recurring" className="flex items-center gap-2 cursor-pointer flex-1">
                                    <Repeat className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium text-sm">Recurrente</p>
                                        <p className="text-xs text-muted-foreground">Cada mes</p>
                                    </div>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors">
                                <RadioGroupItem value="weekday" id="weekday" />
                                <Label htmlFor="weekday" className="flex items-center gap-2 cursor-pointer flex-1">
                                    <CalendarX className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="font-medium text-sm">Día Semanal</p>
                                        <p className="text-xs text-muted-foreground">Excluir día</p>
                                    </div>
                                </Label>
                            </div>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
