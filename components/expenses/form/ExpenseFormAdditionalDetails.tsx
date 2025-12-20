"use client"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { User, Hash, FileText } from "lucide-react"
import type { Control } from "react-hook-form"
import { ExpenseFormValues } from "../hooks/useExpenseForm"

interface ExpenseAdditionalDetailsProps {
    control: Control<ExpenseFormValues>
}

export function ExpenseAdditionalDetails({ control }: ExpenseAdditionalDetailsProps) {
    return (
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Detalles Adicionales</h3>
                    <p className="text-sm text-muted-foreground">Información complementaria</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={control}
                        name="beneficiary"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2 text-sm font-medium after:content-['*'] after:text-destructive after:ml-0.5">
                                    <User className="h-4 w-4" />
                                    Beneficiario
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nombre del beneficiario"
                                        className="h-10"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-xs">Persona o entidad que recibe el pago</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="reference"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                    <Hash className="h-4 w-4" />
                                    Referencia
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Número de factura o referencia"
                                        className="h-10"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-xs">Número de factura o referencia (opcional)</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel className="flex items-center gap-2 text-sm font-medium after:content-['*'] after:text-destructive after:ml-0.5">
                                    <FileText className="h-4 w-4" />
                                    Descripción
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Descripción detallada del egreso"
                                        {...field}
                                        className="min-h-[100px] resize-none"
                                    />
                                </FormControl>
                                <FormDescription className="text-xs">Detalle el propósito del egreso</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
            </div>
        </div>
    )
}
