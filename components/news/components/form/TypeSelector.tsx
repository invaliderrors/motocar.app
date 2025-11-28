"use client"

import { UseFormReturn } from "react-hook-form"
import { NewsType, NewsCategory } from "@/lib/types"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { NewsFormValues } from "../../hooks/form"

interface TypeSelectorProps {
    form: UseFormReturn<NewsFormValues>
}

export function TypeSelector({ form }: TypeSelectorProps) {
    return (
        <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                        onValueChange={(value) => {
                            field.onChange(value)
                            const defaultCategory = value === NewsType.LOAN_SPECIFIC 
                                ? NewsCategory.WORKSHOP 
                                : NewsCategory.DAY_OFF
                            form.setValue("category", defaultCategory)
                        }}
                        value={field.value}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value={NewsType.LOAN_SPECIFIC}>
                                Contrato Específico
                            </SelectItem>
                            <SelectItem value={NewsType.STORE_WIDE}>
                                Todo el Punto
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
