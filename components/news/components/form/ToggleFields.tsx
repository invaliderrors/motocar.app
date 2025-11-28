"use client"

import { UseFormReturn } from "react-hook-form"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { NewsFormValues } from "../../hooks/form"

interface ToggleFieldsProps {
    form: UseFormReturn<NewsFormValues>
}

export function ToggleFields({ form }: ToggleFieldsProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="autoCalculateInstallments"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0">
                            <FormLabel className="text-sm">Auto-calcular Cuotas</FormLabel>
                            <FormDescription className="text-xs">
                                Calcular según días y frecuencia
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0">
                            <FormLabel className="text-sm">Estado Activo</FormLabel>
                            <FormDescription className="text-xs">
                                Novedad activa o inactiva
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>
    )
}
