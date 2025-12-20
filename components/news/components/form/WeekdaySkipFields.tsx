"use client"

import { UseFormReturn } from "react-hook-form"
import { NewsFormValues } from "../../hooks/form"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { InfoIcon } from "lucide-react"

interface WeekdaySkipFieldsProps {
    form: UseFormReturn<NewsFormValues>
}

const WEEKDAYS = [
    { value: "0", label: "Domingo" },
    { value: "1", label: "Lunes" },
    { value: "2", label: "Martes" },
    { value: "3", label: "Miércoles" },
    { value: "4", label: "Jueves" },
    { value: "5", label: "Viernes" },
    { value: "6", label: "Sábado" },
]

export function WeekdaySkipFields({ form }: WeekdaySkipFieldsProps) {
    const applyToHistorical = form.watch("applyToHistoricalLoans")

    return (
        <div className="space-y-4">
            {/* Weekday Selector */}
            <FormField
                control={form.control}
                name="skipWeekday"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Día de la semana a excluir *</FormLabel>
                        <Select
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            value={field.value?.toString()}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un día" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {WEEKDAYS.map((day) => (
                                    <SelectItem key={day.value} value={day.value}>
                                        {day.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Apply to Historical Loans Toggle */}
            <FormField
                control={form.control}
                name="applyToHistoricalLoans"
                render={({ field }) => (
                    <FormItem>
                        <div className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <Label htmlFor="applyToHistoricalLoans">
                                    Aplicar a contratos históricos
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    {field.value ? (
                                        <>
                                            <InfoIcon className="inline h-4 w-4 mr-1" />
                                            Se aplicará a TODOS los contratos, incluyendo los existentes
                                        </>
                                    ) : (
                                        <>
                                            <InfoIcon className="inline h-4 w-4 mr-1" />
                                            Solo se aplicará a contratos creados DESPUÉS de esta fecha
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* Information Box */}
            <div className="rounded-lg border bg-blue-50 dark:bg-blue-950 p-4">
                <div className="flex gap-2">
                    <InfoIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                        <p className="font-medium mb-2">¿Cómo funciona esta configuración?</p>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>
                                El día seleccionado NO se contará como cuota vencida en ningún mes
                            </li>
                            <li>
                                Por ejemplo, si seleccionas "Domingo", todos los domingos de todos los meses
                                serán excluidos automáticamente del cálculo de cuotas
                            </li>
                            <li>
                                {applyToHistorical 
                                    ? "Afectará todos los contratos existentes retroactivamente"
                                    : "Solo afectará contratos nuevos creados a partir de hoy"
                                }
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
