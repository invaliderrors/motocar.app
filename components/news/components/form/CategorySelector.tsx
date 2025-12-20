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

interface CategorySelectorProps {
    form: UseFormReturn<NewsFormValues>
    newsType: NewsType
}

export function CategorySelector({ form, newsType }: CategorySelectorProps) {
    return (
        <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
                <FormItem className="flex flex-col space-y-2">
                    <FormLabel>Categoría</FormLabel>
                    <Select
                        onValueChange={field.onChange}
                        value={field.value}
                    >
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {newsType === NewsType.LOAN_SPECIFIC ? (
                                <>
                                    <SelectItem value={NewsCategory.WORKSHOP}>Taller</SelectItem>
                                    <SelectItem value={NewsCategory.MAINTENANCE}>Mantenimiento</SelectItem>
                                    <SelectItem value={NewsCategory.ACCIDENT}>Accidente</SelectItem>
                                    <SelectItem value={NewsCategory.THEFT}>Robo</SelectItem>
                                </>
                            ) : (
                                <>
                                    <SelectItem value={NewsCategory.DAY_OFF}>Día Libre</SelectItem>
                                    <SelectItem value={NewsCategory.HOLIDAY}>Festivo</SelectItem>
                                    <SelectItem value={NewsCategory.WEEKLY_SKIP}>Exclusión Semanal</SelectItem>
                                    <SelectItem value={NewsCategory.SYSTEM_MAINTENANCE}>
                                        Mant. Sistema
                                    </SelectItem>
                                    <SelectItem value={NewsCategory.OTHER}>Otro</SelectItem>
                                </>
                            )}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
