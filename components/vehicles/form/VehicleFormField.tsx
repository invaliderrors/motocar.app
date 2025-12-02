"use client"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { Control, FieldPath } from "react-hook-form"
import { VehicleFormValues } from "../hooks/useVehicleForm"

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

// Helper to format number with thousand separators
function formatPrice(value: string | number): string {
    const numericValue = String(value).replace(/\D/g, "")
    if (!numericValue) return ""
    return new Intl.NumberFormat("es-CO").format(Number(numericValue))
}

// Helper to parse formatted price back to number
function parsePrice(value: string): string {
    return value.replace(/\D/g, "")
}

interface VehicleFormFieldProps {
    control: Control<VehicleFormValues>
    name: FieldPath<VehicleFormValues>
    label: string
    placeholder: string
    description: string
    type?: string
    required?: boolean
    className?: string
}

export function VehicleFormField({
    control,
    name,
    label,
    placeholder,
    description,
    type = "text",
    required = true,
    className = "",
}: VehicleFormFieldProps) {
    // Date field with Calendar component
    if (type === "date") {
        return (
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                        {label && (
                            <FormLabel className={cn(required && "after:content-['*'] after:text-red-500 after:ml-0.5")}>
                                {label}
                            </FormLabel>
                        )}
                        <Popover modal={true}>
                            <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full pl-3 text-left font-normal border-border hover:bg-muted/50",
                                            !field.value && "text-muted-foreground"
                                        )}
                                    >
                                        {field.value ? (
                                            format(parseDateString(field.value as string)!, "d 'de' MMMM, yyyy", { locale: es })
                                        ) : (
                                            <span>{placeholder}</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                                <Calendar
                                    mode="single"
                                    selected={parseDateString(field.value as string)}
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
                        {description && <FormDescription className="text-xs">{description}</FormDescription>}
                        <FormMessage />
                    </FormItem>
                )}
            />
        )
    }

    // Currency/Price field with formatting
    if (name === "price") {
        return (
            <FormField
                control={control}
                name={name}
                render={({ field }) => {
                    const [displayValue, setDisplayValue] = useState(() => 
                        field.value ? formatPrice(field.value) : ""
                    )

                    useEffect(() => {
                        if (field.value) {
                            setDisplayValue(formatPrice(field.value))
                        }
                    }, [field.value])

                    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                        const rawValue = parsePrice(e.target.value)
                        setDisplayValue(formatPrice(rawValue))
                        field.onChange(rawValue)
                    }

                    return (
                        <FormItem>
                            {label && (
                                <FormLabel className={cn(required && "after:content-['*'] after:text-red-500 after:ml-0.5")}>
                                    {label}
                                </FormLabel>
                            )}
                            <FormControl>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                        $
                                    </span>
                                    <Input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder={placeholder}
                                        value={displayValue}
                                        onChange={handleChange}
                                        className={cn(
                                            "border-border focus:border-primary/50 transition-colors pl-7",
                                            className
                                        )}
                                    />
                                </div>
                            </FormControl>
                            {description && <FormDescription className="text-xs">{description}</FormDescription>}
                            <FormMessage />
                        </FormItem>
                    )
                }}
            />
        )
    }

    // Regular input field
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && (
                        <FormLabel className={cn(required && "after:content-['*'] after:text-red-500 after:ml-0.5")}>
                            {label}
                        </FormLabel>
                    )}
                    <FormControl>
                        <Input
                            type={type}
                            placeholder={placeholder}
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            className={cn(
                                "border-border focus:border-primary/50 transition-colors",
                                className
                            )}
                        />
                    </FormControl>
                    {description && <FormDescription className="text-xs">{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

