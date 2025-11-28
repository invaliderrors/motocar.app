"use client"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { Control, FieldPath } from "react-hook-form"
import { VehicleFormValues } from "../hooks/useVehicleForm"


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
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className={`${required ? "after:content-['*'] after:text-red-500 after:ml-0.5" : ""}`}>
                        {label}
                    </FormLabel>
                    <FormControl>
                        <Input
                            type={type}
                            placeholder={placeholder}
                            value={field.value ?? ""}
                            onChange={field.onChange}
                            className={`border-blue-100 focus:border-blue-300 dark:border-blue-900/50 dark:focus:border-blue-700 ${className}`}
                        />
                    </FormControl>
                    <FormDescription className="text-xs">{description}</FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

