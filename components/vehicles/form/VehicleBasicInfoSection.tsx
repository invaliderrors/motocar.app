import { Card, CardContent } from "@/components/ui/card"
import type { Control } from "react-hook-form"
import { VehicleFormValues } from "../hooks/useVehicleForm"
import { VehicleFormField } from "./VehicleFormField"
import { VehicleTypeSelectField } from "./VehicleTypeSelectField"


interface BasicInfoSectionProps {
    control: Control<VehicleFormValues>
}

export function BasicInfoSection({ control }: BasicInfoSectionProps) {
    return (
        <Card className="border border-blue-100 dark:border-blue-900/30 shadow-sm h-full">
            <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    Información básica
                </h3>
                <div className="space-y-4">
                    <VehicleTypeSelectField control={control} name="vehicleType" />

                    <VehicleFormField
                        control={control}
                        name="plate"
                        label="Placa"
                        placeholder="Placa del vehículo"
                        description="Formato: ABC123"
                        className="uppercase"
                    />

                    <VehicleFormField
                        control={control}
                        name="brand"
                        label="Marca"
                        placeholder="Marca del vehículo"
                        description="Ej: Honda, Yamaha, Toyota"
                    />

                    <VehicleFormField
                        control={control}
                        name="model"
                        label="Modelo"
                        placeholder="Modelo del vehículo"
                        description="Ej: CBR 600, Corolla"
                    />

                    <VehicleFormField
                        control={control}
                        name="price"
                        label="Precio"
                        placeholder="Precio del vehículo"
                        description="Valor de compra o venta"
                        type="number"
                        required={false}
                    />
                </div>
            </CardContent>
        </Card>
    )
}

