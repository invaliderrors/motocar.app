"use client"

import { UseFormReturn } from "react-hook-form"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { NewsFormValues } from "../../hooks/form"

interface TitleFieldProps {
    form: UseFormReturn<NewsFormValues>
}

export function TitleField({ form }: TitleFieldProps) {
    return (
        <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                        <Input placeholder="Título de la novedad" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
