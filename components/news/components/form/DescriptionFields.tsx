"use client"

import { UseFormReturn } from "react-hook-form"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { NewsFormValues } from "../../hooks/form"

interface DescriptionFieldsProps {
    form: UseFormReturn<NewsFormValues>
}

export function DescriptionFields({ form }: DescriptionFieldsProps) {
    return (
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Descripción detallada"
                                {...field}
                                rows={2}
                                className="resize-none"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Notas (Opcional)</FormLabel>
                        <FormControl>
                            <Textarea
                                placeholder="Notas adicionales"
                                {...field}
                                rows={2}
                                className="resize-none"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
