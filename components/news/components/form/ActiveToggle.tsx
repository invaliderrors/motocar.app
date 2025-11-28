"use client"

import { UseFormReturn } from "react-hook-form"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { NewsFormValues } from "../../hooks/form"

interface ActiveToggleProps {
    form: UseFormReturn<NewsFormValues>
}

export function ActiveToggle({ form }: ActiveToggleProps) {
    return (
        <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 h-[72px]">
                    <FormLabel className="text-sm">Activa</FormLabel>
                    <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    </FormControl>
                </FormItem>
            )}
        />
    )
}
