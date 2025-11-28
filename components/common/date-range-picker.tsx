"use client"

import * as React from "react"
import { format, startOfMonth, endOfMonth, isSameDay, subDays } from "date-fns"
import es from "date-fns/locale/es"
import { CalendarIcon, X, ChevronLeft, ChevronRight, Check } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface DateRangePickerProps {
    className?: string
    onRangeChange: (range: DateRange | undefined) => void
    defaultValue?: DateRange
    align?: "start" | "center" | "end"
}

type PresetRange = {
    name: string
    label: string
    range: () => { from: Date; to: Date }
}

export function DateRangePicker({
    className,
    onRangeChange,
    defaultValue = undefined,
    align = "start",
}: DateRangePickerProps) {
    const [date, setDate] = React.useState<DateRange | undefined>(defaultValue)
    const [isOpen, setIsOpen] = React.useState(false)
    const [tempRange, setTempRange] = React.useState<DateRange | undefined>(defaultValue)

    const today = new Date()

    const presets: PresetRange[] = [
        {
            name: "today",
            label: "Hoy",
            range: () => ({ from: today, to: today }),
        },
        {
            name: "yesterday",
            label: "Ayer",
            range: () => {
                const yesterday = subDays(today, 1)
                return { from: yesterday, to: yesterday }
            },
        },
        {
            name: "last7",
            label: "Últimos 7 días",
            range: () => ({ from: subDays(today, 6), to: today }),
        },
        {
            name: "last30",
            label: "Últimos 30 días",
            range: () => ({ from: subDays(today, 29), to: today }),
        },
        {
            name: "thisMonth",
            label: "Este mes",
            range: () => ({ from: startOfMonth(today), to: today }),
        },
        {
            name: "lastMonth",
            label: "Mes anterior",
            range: () => {
                const lastMonth = subDays(startOfMonth(today), 1)
                return {
                    from: startOfMonth(lastMonth),
                    to: endOfMonth(lastMonth),
                }
            },
        },
    ]

    const handleRangeSelect = (range: DateRange | undefined) => {
        // Store the temporary range for preview
        setTempRange(range)

        // If we already have a complete range and user selects a new date,
        // reset the selection and use the new date as the start date
        if (tempRange?.from && tempRange?.to && range?.from && !range.to) {
            const newRange = { from: range.from, to: undefined }
            setTempRange(newRange)
        }
    }

    const handlePresetSelect = (preset: PresetRange) => {
        const range = preset.range()
        setTempRange(range)
    }

    const handleApply = () => {
        setDate(tempRange)
        onRangeChange(tempRange)
        setIsOpen(false)
    }

    const handleCancel = () => {
        setTempRange(date)
        setIsOpen(false)
    }

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation()
        setDate(undefined)
        setTempRange(undefined)
        onRangeChange(undefined)
    }

    // Update tempRange when date changes (for initial load)
    React.useEffect(() => {
        setTempRange(date)
    }, [date])

    return (
        <div className={cn("grid gap-2", className)}>
            <div className="flex items-center gap-2">
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant="outline"
                            className={cn(
                                "w-full justify-start text-left font-normal transition-all duration-200 ease-in-out",
                                "border-slate-200 hover:border-slate-300 focus:border-slate-300",
                                "dark:border-slate-800 dark:hover:border-slate-700 dark:focus:border-slate-700",
                                "shadow-sm hover:shadow",
                                !date && "text-muted-foreground",
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        <span className="font-medium">{format(date.from, "dd MMM", { locale: es })}</span>
                                        <span className="mx-1">-</span>
                                        <span className="font-medium">{format(date.to, "dd MMM yyyy", { locale: es })}</span>
                                    </>
                                ) : (
                                    <span className="font-medium">{format(date.from, "dd MMMM yyyy", { locale: es })}</span>
                                )
                            ) : (
                                <span>Seleccionar rango de fechas</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto p-0 bg-white dark:bg-slate-950 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800"
                        align={align}
                        sideOffset={5}
                    >
                        <div className="flex flex-col sm:flex-row">
                            {/* Presets sidebar */}
                            <div className="p-3 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800 w-full sm:w-48 space-y-2">
                                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Rangos predefinidos</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                                    {presets.map((preset) => (
                                        <Button
                                            key={preset.name}
                                            variant="outline"
                                            size="sm"
                                            className={cn(
                                                "justify-start text-left text-sm font-normal",
                                                tempRange?.from &&
                                                    tempRange?.to &&
                                                    preset.range().from &&
                                                    preset.range().to &&
                                                    isSameDay(tempRange.from, preset.range().from) &&
                                                    isSameDay(tempRange.to, preset.range().to)
                                                    ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800"
                                                    : "text-slate-700 dark:text-slate-300",
                                            )}
                                            onClick={() => handlePresetSelect(preset)}
                                        >
                                            {preset.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Calendar */}
                            <div className="p-3">
                                <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={tempRange?.from || new Date()}
                                    selected={tempRange}
                                    onSelect={handleRangeSelect}
                                    numberOfMonths={2}
                                    locale={es}
                                    classNames={{
                                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                                        month: "space-y-4",
                                        caption: "flex justify-center pt-1 relative items-center",
                                        caption_label: "text-sm font-medium text-slate-700 dark:text-slate-300",
                                        nav: "space-x-1 flex items-center",
                                        nav_button: cn(
                                            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity",
                                            "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md",
                                        ),
                                        nav_button_previous: "absolute left-1",
                                        nav_button_next: "absolute right-1",
                                        table: "w-full border-collapse space-y-1",
                                        head_row: "flex",
                                        head_cell: "text-slate-500 dark:text-slate-400 rounded-md w-9 font-normal text-[0.8rem]",
                                        row: "flex w-full mt-2",
                                        cell: cn(
                                            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-slate-100 dark:[&:has([aria-selected])]:bg-slate-800",
                                            "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                                        ),
                                        day: cn(
                                            "h-9 w-9 p-0 font-normal aria-selected:opacity-100 transition-colors",
                                            "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md",
                                        ),
                                        day_range_end: "day-range-end",
                                        day_selected:
                                            "bg-blue-600 text-white hover:bg-blue-700 hover:text-white focus:bg-blue-600 focus:text-white rounded-md",
                                        day_today: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100",
                                        day_outside: "text-slate-400 dark:text-slate-500 opacity-50",
                                        day_disabled: "text-slate-400 dark:text-slate-500 opacity-50 cursor-not-allowed",
                                        day_range_middle:
                                            "aria-selected:bg-blue-100 aria-selected:text-blue-900 dark:aria-selected:bg-blue-900/30 dark:aria-selected:text-blue-200",
                                        day_hidden: "invisible",
                                    }}
                                    components={{
                                        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                                        IconRight: () => <ChevronRight className="h-4 w-4" />,
                                    }}
                                />

                                {/* Preview of selected range */}
                                {tempRange?.from && (
                                    <div className="px-3 py-2 border-t border-slate-200 dark:border-slate-800 mt-3">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm">
                                                {tempRange.to ? (
                                                    <>
                                                        <Badge
                                                            variant="outline"
                                                            className="mr-2 bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800"
                                                        >
                                                            {format(tempRange.from, "dd MMM", { locale: es })} -{" "}
                                                            {format(tempRange.to, "dd MMM yyyy", { locale: es })}
                                                        </Badge>
                                                        <span className="text-slate-500 dark:text-slate-400 text-xs">
                                                            {Math.round((tempRange.to.getTime() - tempRange.from.getTime()) / (1000 * 60 * 60 * 24)) +
                                                                1}{" "}
                                                            días
                                                        </span>
                                                    </>
                                                ) : (
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800"
                                                    >
                                                        {format(tempRange.from, "dd MMMM yyyy", { locale: es })}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Footer with action buttons */}
                                <div className="flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800 pt-3 mt-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCancel}
                                        className="text-slate-700 dark:text-slate-300"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleApply}
                                        className="bg-blue-600 text-white hover:bg-blue-700"
                                        disabled={!tempRange?.from}
                                    >
                                        <Check className="mr-1 h-3 w-3" />
                                        Aplicar
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>

                {date && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleClear}
                                    className="h-10 w-10 p-0 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors"
                                    aria-label="Limpiar selección de fechas"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Limpiar selección</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>
        </div>
    )
}
