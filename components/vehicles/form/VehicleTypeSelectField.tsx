"use client"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Bike, Truck, Package, HelpCircle } from "lucide-react"
import type { Control } from "react-hook-form"
import { VehicleFormValues } from "../hooks/useVehicleForm"
import { VehicleType } from "@/lib/types"

interface VehicleTypeSelectFieldProps {
    control: Control<VehicleFormValues>
    name: "vehicleType"
    label?: string
    description?: string
    required?: boolean
}

const vehicleTypeConfig: Record<VehicleType, { label: string; icon: typeof Bike }> = {
    [VehicleType.MOTORCYCLE]: { label: "Motocicleta", icon: Bike },
    [VehicleType.MOTOCAR]: { label: "Motocarguero", icon: Truck },
    [VehicleType.MOTOLOAD]: { label: "Motocarro", icon: Package },
    [VehicleType.OTHER]: { label: "Otro", icon: HelpCircle },
}

export function VehicleTypeSelectField({ 
    control, 
    name,
    label,
    description,
    required = true 
}: VehicleTypeSelectFieldProps) {
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
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger className="border-border focus:border-primary/50 transition-colors">
                                <SelectValue placeholder="Selecciona el tipo de vehículo" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {Object.entries(vehicleTypeConfig).map(([value, config]) => {
                                const Icon = config.icon
                                return (
                                    <SelectItem key={value} value={value}>
                                        <div className="flex items-center gap-2">
                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                            {config.label}
                                        </div>
                                    </SelectItem>
                                )
                            })}
                        </SelectContent>
                    </Select>
                    {description && (
                        <FormDescription className="text-xs">
                            {description}
                        </FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
