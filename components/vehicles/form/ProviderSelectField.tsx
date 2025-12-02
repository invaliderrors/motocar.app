"use client"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import type { Control } from "react-hook-form"
import { VehicleFormValues } from "../hooks/useVehicleForm"
import { useProviders } from "@/components/providers/hooks/useProviders"


interface ProviderSelectFieldProps {
    control: Control<VehicleFormValues>
    name: "providerId"
    label?: string
    description?: string
    required?: boolean
}

export function ProviderSelectField({
    control,
    name,
    label,
    description,
    required = true,
}: ProviderSelectFieldProps) {
    const { providers, loading, error } = useProviders()

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
                    <Select value={field.value} onValueChange={field.onChange} disabled={loading}>
                        <FormControl>
                            <SelectTrigger className="border-border focus:border-primary/50 transition-colors">
                                <SelectValue
                                    placeholder={
                                        loading ? (
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Cargando proveedores...
                                            </div>
                                        ) : error ? (
                                            "Error al cargar proveedores"
                                        ) : (
                                            "Selecciona un proveedor"
                                        )
                                    }
                                />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {providers.map((provider) => (
                                <SelectItem key={provider.id} value={provider.id}>
                                    {provider.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {description && <FormDescription className="text-xs">{description}</FormDescription>}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

