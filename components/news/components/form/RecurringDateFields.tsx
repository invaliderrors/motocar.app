"use client"

import { UseFormReturn } from "react-hook-form"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { NewsFormValues } from "../../hooks/form"

interface RecurringDateFieldsProps {
    form: UseFormReturn<NewsFormValues>
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

export function RecurringDateFields({ form }: RecurringDateFieldsProps) {
    const recurringMonths = form.watch("recurringMonths") || []
    const recurringDay = form.watch("recurringDay")

    const toggleMonth = (month: number) => {
        if (recurringMonths.includes(month)) {
            form.setValue("recurringMonths", recurringMonths.filter(m => m !== month))
        } else {
            form.setValue("recurringMonths", [...recurringMonths, month].sort((a, b) => a - b))
        }
    }

    return (
        <div className="space-y-4">
            {/* Recurring Day */}
            <FormField
                control={form.control}
                name="recurringDay"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Día del Mes</FormLabel>
                        <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            value={field.value?.toString() || ""}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar día" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                    <SelectItem key={day} value={day.toString()}>
                                        Día {day}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormDescription className="text-xs">
                            Se omitirá este día desde el inicio de cada préstamo
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Months Selection */}
            <div className="space-y-2">
                <FormLabel>Meses Aplicables</FormLabel>
                <FormDescription className="text-xs">
                    Selecciona los meses en que aplica. Si no seleccionas ninguno, aplica todos los meses.
                </FormDescription>
                <div className="grid grid-cols-4 gap-2 mt-2">
                    {MONTHS.map((month) => (
                        <label 
                            key={month.value} 
                            htmlFor={`month-${month.value}`}
                            className="flex items-center space-x-2 border rounded-md p-2 hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                            <Checkbox
                                id={`month-${month.value}`}
                                checked={recurringMonths.includes(month.value)}
                                onCheckedChange={() => toggleMonth(month.value)}
                            />
                            <span className="text-sm font-medium leading-none flex-1">
                                {month.label.substring(0, 3)}
                            </span>
                        </label>
                    ))}
                </div>

                {recurringMonths.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-sm text-muted-foreground">Aplica en: </span>
                        {recurringMonths.map((m) => (
                            <Badge key={m} variant="outline" className="text-xs">
                                {MONTHS.find(month => month.value === m)?.label}
                            </Badge>
                        ))}
                    </div>
                )}

                {recurringMonths.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">
                        Aplica todos los meses del año
                    </p>
                )}
            </div>

            {/* Preview */}
            {recurringDay && (
                <div className="p-3 bg-muted/50 rounded-lg border">
                    <p className="text-sm">
                        Se omitirá la cuota cada <strong>día {recurringDay}</strong>{" "}
                        {recurringMonths.length > 0
                            ? `de ${recurringMonths.map(m => MONTHS.find(month => month.value === m)?.label).join(", ")}`
                            : "de cada mes"}
                    </p>
                </div>
            )}
        </div>
    )
}
