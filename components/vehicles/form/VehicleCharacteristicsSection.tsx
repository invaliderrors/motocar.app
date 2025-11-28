import { Card, CardContent } from "@/components/ui/card"

import type { Control } from "react-hook-form"
import { VehicleFormValues } from "../hooks/useVehicleForm"
import { VehicleFormField } from "./VehicleFormField"

interface CharacteristicsSectionProps {
    control: Control<VehicleFormValues>
}

export function CharacteristicsSection({ control }: CharacteristicsSectionProps) {
    return (
        <Card className="border border-blue-100 dark:border-blue-900/30 shadow-sm h-full">
            <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    Características
                </h3>
                <div className="space-y-4">
                    <VehicleFormField
                        control={control}
                        name="color"
                        label="Color"
                        placeholder="Color del vehículo"
                        description="Ej: Rojo, Negro, Azul"
                        required={false}
                    />

                    <VehicleFormField
                        control={control}
                        name="cc"
                        label="Cilindraje (cc)"
                        placeholder="Ej: 150"
                        description="Capacidad del motor en centímetros cúbicos"
                        type="number"
                        required={false}
                    />

                    <VehicleFormField
                        control={control}
                        name="engine"
                        label="Número de Motor"
                        placeholder="Ej: HA11EPR9M01101"
                        description="Número de identificación único del motor"
                        className="font-mono uppercase"
                        required={false}
                    />

                    <VehicleFormField
                        control={control}
                        name="chassis"
                        label="Número de Chasis"
                        placeholder="Número de chasis"
                        description="Número de identificación único del chasis"
                        className="font-mono uppercase"
                        required={false}
                    />

                    <VehicleFormField
                        control={control}
                        name="gps"
                        label="GPS"
                        placeholder="Código GPS"
                        description="Código del dispositivo GPS instalado"
                        type="number"
                        required={false}
                    />

                    <VehicleFormField
                        control={control}
                        name="soatDueDate"
                        label="Vencimiento SOAT"
                        placeholder="Fecha de vencimiento"
                        description="Fecha de vencimiento del Seguro Obligatorio"
                        type="date"
                        required={false}
                    />

                    <VehicleFormField
                        control={control}
                        name="technomechDueDate"
                        label="Vencimiento Tecnomecánica"
                        placeholder="Fecha de vencimiento"
                        description="Fecha de vencimiento de la revisión tecnomecánica"
                        type="date"
                        required={false}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

