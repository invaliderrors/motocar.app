"use client"

import { UseFormReturn } from "react-hook-form"
import { NewsType } from "@/lib/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { NewsFormValues } from "../../hooks/form"

interface DateAndNumberFieldsProps {
    form: UseFormReturn<NewsFormValues>
    newsType: NewsType
    autoCalculate: boolean
}

// Helper to format date to YYYY-MM-DD using local date components (avoids timezone issues)
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

export function DateAndNumberFields({ form, newsType, autoCalculate }: DateAndNumberFieldsProps) {
    return (
        <div className="grid grid-cols-4 gap-4">
            <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Fecha Inicio</FormLabel>
                        <Popover modal={true}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        {field.value ? (
                                            format(parseDateString(field.value)!, "dd/MM/yyyy", { locale: es })
                                        ) : (
                                            <span>Seleccionar</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                                <Calendar
                                    mode="single"
                                    selected={parseDateString(field.value)}
                                    onSelect={(date) => {
                                        if (date) {
                                            field.onChange(formatDateString(date))
                                        }
                                    }}
                                    locale={es}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Fecha Fin</FormLabel>
                        <Popover modal={true}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        {field.value ? (
                                            format(parseDateString(field.value)!, "dd/MM/yyyy", { locale: es })
                                        ) : (
                                            <span>Opcional</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                                <Calendar
                                    mode="single"
                                    selected={parseDateString(field.value)}
                                    onSelect={(date) => {
                                        if (date) {
                                            field.onChange(formatDateString(date))
                                        } else {
                                            field.onChange("")
                                        }
                                    }}
                                    locale={es}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {newsType === NewsType.LOAN_SPECIFIC && (
                <>
                    <FormField
                        control={form.control}
                        name="daysUnavailable"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Días No Disponible</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(parseInt(e.target.value) || 0)
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="installmentsToSubtract"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cuotas a Descontar</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        disabled={autoCalculate}
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(parseInt(e.target.value) || 0)
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </>
            )}
        </div>
    )
}
