"use client"

import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign } from "lucide-react"
import type { Control } from "react-hook-form"

interface LoanFormDetailsCardProps {
    control: Control<any>
    formatNumber: (value: number | string | undefined) => string
    parseFormattedNumber: (value: string) => number
}

export function LoanFormDetailsCard({ control, formatNumber, parseFormattedNumber }: LoanFormDetailsCardProps) {
    return (
        <Card className="border-primary/20 shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Detalles del contrato
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        control={control}
                        name="totalAmount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Precio Total</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                        <Input
                                            type="text"
                                            className="pl-7"
                                            value={formatNumber(field.value)}
                                            onChange={(e) => {
                                                const value = parseFormattedNumber(e.target.value)
                                                field.onChange(value)
                                            }}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="downPayment"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pago Inicial</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                        <Input
                                            type="text"
                                            className="pl-7"
                                            value={formatNumber(field.value)}
                                            onChange={(e) => {
                                                const value = parseFormattedNumber(e.target.value)
                                                field.onChange(value)
                                            }}
                                        />
                                    </div>
                                </FormControl>
                                <FormDescription className="text-xs">Monto que el cliente paga por adelantado</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
