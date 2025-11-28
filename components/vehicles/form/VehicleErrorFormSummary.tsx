"use client"

import { AlertCircle } from "lucide-react"
import type { FieldErrors } from "react-hook-form"
import { VehicleFormValues } from "../hooks/useVehicleForm"

interface FormErrorSummaryProps {
    errors: FieldErrors<VehicleFormValues>
}

export function FormErrorSummary({ errors }: FormErrorSummaryProps) {
    const errorCount = Object.keys(errors).length

    if (errorCount === 0) return null

    return (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-3 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
                <p className="text-sm font-medium text-red-800 dark:text-red-400">
                    Por favor corrige los errores antes de continuar
                </p>
                <ul className="list-disc pl-5 mt-1 text-xs text-red-700 dark:text-red-300">
                    {Object.entries(errors).map(([key, error]) => (
                        <li key={key}>{error?.message as string}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

