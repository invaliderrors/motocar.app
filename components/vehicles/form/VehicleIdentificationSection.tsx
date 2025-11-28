import { Card, CardContent } from "@/components/ui/card"

import type { Control } from "react-hook-form"
import { VehicleFormValues } from "../hooks/useVehicleForm"
import { ProviderSelectField } from "./ProviderSelectField"


interface IdentificationSectionProps {
    control: Control<VehicleFormValues>
}

export function IdentificationSection({ control }: IdentificationSectionProps) {
    return (
        <Card className="border border-blue-100 dark:border-blue-900/30 shadow-sm">
            <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    Proveedor
                </h3>
                <ProviderSelectField control={control} name="providerId" />
            </CardContent>
        </Card>
    )
}

