"use client"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Control } from "react-hook-form"
import { VehicleFormValues } from "../hooks/useVehicleForm"
import { VehicleType } from "@/lib/types"

interface VehicleTypeSelectFieldProps {
    control: Control<VehicleFormValues>
    name: "vehicleType"
}

const vehicleTypeLabels: Record<VehicleType, string> = {
    [VehicleType.MOTORCYCLE]: "Motocicleta",
    [VehicleType.CAR]: "Automóvil",
    [VehicleType.TRUCK]: "Camión",
    [VehicleType.VAN]: "Furgoneta",
    [VehicleType.ATV]: "Cuatrimoto",
    [VehicleType.OTHER]: "Otro",
}

export function VehicleTypeSelectField({ control, name }: VehicleTypeSelectFieldProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel className="after:content-['*'] after:text-red-500 after:ml-0.5">
                        Tipo de Vehículo
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                            <SelectTrigger className="border-blue-100 focus:border-blue-300 dark:border-blue-900/50 dark:focus:border-blue-700">
                                <SelectValue placeholder="Selecciona el tipo de vehículo" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {Object.entries(vehicleTypeLabels).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                    {label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">
                        Categoría del vehículo
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
