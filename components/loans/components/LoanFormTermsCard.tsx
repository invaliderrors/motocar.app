"use client"

import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Calculator, Calendar, Clock, Percent, CalendarDays, Navigation } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Control } from "react-hook-form"

interface LoanFormTermsCardProps {
    control: Control<any>
    formValues: any
    formatNumber: (value: number | string | undefined) => string
    parseFormattedNumber: (value: string) => number
}

export function LoanFormTermsCard({ control, formValues, formatNumber, parseFormattedNumber }: LoanFormTermsCardProps) {
    return (
        <Card className="border-primary/20 shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-primary" />
                    Términos del contrato
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        control={control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Fecha de Inicio</FormLabel>
                                <Popover modal={true}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarDays className="mr-2 h-4 w-4" />
                                                {field.value ? (
                                                    format(new Date(field.value + "T12:00:00"), "PPP", { locale: es })
                                                ) : (
                                                    <span>Seleccionar fecha</span>
                                                )}
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                                        <CalendarComponent
                                            mode="single"
                                            selected={field.value ? new Date(field.value + "T12:00:00") : undefined}
                                            onSelect={(date) => {
                                                if (date) {
                                                    // Format as YYYY-MM-DD without timezone conversion
                                                    const year = date.getFullYear()
                                                    const month = String(date.getMonth() + 1).padStart(2, '0')
                                                    const day = String(date.getDate()).padStart(2, '0')
                                                    field.onChange(`${year}-${month}-${day}`)
                                                }
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormDescription className="text-xs">Fecha de inicio del contrato</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Fecha de Finalización</FormLabel>
                                <FormControl>
                                    <Button
                                        variant="outline"
                                        className="w-full pl-3 text-left font-normal bg-muted cursor-not-allowed"
                                        disabled
                                    >
                                        <CalendarDays className="mr-2 h-4 w-4" />
                                        {field.value ? (
                                            format(new Date(field.value), "PPP", { locale: es })
                                        ) : (
                                            <span className="text-muted-foreground">Se calculará automáticamente</span>
                                        )}
                                    </Button>
                                </FormControl>
                                <FormDescription className="text-xs">
                                    Calculada automáticamente según el plazo
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="loanTermMonths"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Plazo del contrato (meses)</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            className="pl-9"
                                            value={formatNumber(field.value)}
                                            onChange={(e) => {
                                                const value = parseFormattedNumber(e.target.value)
                                                field.onChange(value)
                                            }}
                                        />
                                    </div>
                                </FormControl>
                                <FormDescription className="text-xs">
                                    Duración total del contrato en meses
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="paymentFrequency"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Frecuencia de Pago</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-10">
                                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <SelectValue placeholder="Seleccionar frecuencia" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="DAILY">Diario</SelectItem>
                                        <SelectItem value="WEEKLY">Semanal</SelectItem>
                                        <SelectItem value="BIWEEKLY">Quincenal</SelectItem>
                                        <SelectItem value="MONTHLY">Mensual</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription className="text-xs">
                                    {formValues.paymentFrequency === "DAILY" && "Pagos todos los días"}
                                    {formValues.paymentFrequency === "WEEKLY" && "Pagos una vez por semana"}
                                    {formValues.paymentFrequency === "BIWEEKLY" && "Pagos cada dos semanas"}
                                    {formValues.paymentFrequency === "MONTHLY" && "Pagos una vez al mes"}
                                    {formValues.loanTermMonths > 0 && formValues.paymentFrequency && (
                                        <span className="block mt-1 font-medium text-primary">
                                            {(() => {
                                                const method = formValues.dayCalculationMethod || "THIRTY_DAYS"
                                                const DAYS_PER_MONTH = 30
                                                
                                                // If dates are provided, calculate from dates
                                                if (formValues.startDate && formValues.endDate) {
                                                    const calculateInstallmentsFromDates = (startDate: string, endDate: string, frequency: string, calcMethod: string): number => {
                                                        const start = new Date(startDate)
                                                        const end = new Date(endDate)
                                                        
                                                        if (start >= end) return 0
                                                        
                                                        if (frequency === "DAILY") {
                                                            if (calcMethod === "ACTUAL_DAYS") {
                                                                // Use actual calendar days
                                                                const diffTime = Math.abs(end.getTime() - start.getTime())
                                                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                                                                return diffDays
                                                            } else {
                                                                // THIRTY_DAYS: Use 30-day month calculation
                                                                const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
                                                                const daysDiff = end.getDate() - start.getDate()
                                                                if (daysDiff < 0) {
                                                                    return (monthsDiff - 1) * DAYS_PER_MONTH + (DAYS_PER_MONTH + daysDiff)
                                                                } else {
                                                                    return monthsDiff * DAYS_PER_MONTH + daysDiff
                                                                }
                                                            }
                                                        } else {
                                                            const diffTime = Math.abs(end.getTime() - start.getTime())
                                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                                                            
                                                            switch (frequency) {
                                                                case "WEEKLY": return Math.ceil(diffDays / 7)
                                                                case "BIWEEKLY": return Math.ceil(diffDays / 14)
                                                                case "MONTHLY":
                                                                    if (calcMethod === "ACTUAL_DAYS") {
                                                                        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
                                                                        return Math.max(1, months)
                                                                    } else {
                                                                        // THIRTY_DAYS
                                                                        const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
                                                                        return Math.max(1, monthsDiff)
                                                                    }
                                                                default: return 0
                                                            }
                                                        }
                                                    }
                                                    
                                                    const installments = calculateInstallmentsFromDates(
                                                        formValues.startDate, 
                                                        formValues.endDate, 
                                                        formValues.paymentFrequency,
                                                        method
                                                    )
                                                    const methodLabel = method === "ACTUAL_DAYS" ? "días reales" : "30 días/mes"
                                                    return `${installments} cuotas totales (${methodLabel})`
                                                }
                                                
                                                // Calculate installments from loan term months
                                                // If we have a start date, calculate the actual end date and use that
                                                if (formValues.startDate && formValues.loanTermMonths > 0) {
                                                    const start = new Date(formValues.startDate)
                                                    let end: Date
                                                    
                                                    if (method === "ACTUAL_DAYS") {
                                                        // Add actual months to get the real end date
                                                        end = new Date(start)
                                                        end.setMonth(end.getMonth() + formValues.loanTermMonths)
                                                    } else {
                                                        // THIRTY_DAYS: add exactly loanTermMonths * 30 days
                                                        end = new Date(start)
                                                        end.setDate(end.getDate() + (formValues.loanTermMonths * DAYS_PER_MONTH))
                                                    }
                                                    
                                                    // Now calculate installments based on these dates
                                                    if (formValues.paymentFrequency === "DAILY") {
                                                        if (method === "ACTUAL_DAYS") {
                                                            const diffTime = Math.abs(end.getTime() - start.getTime())
                                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                                                            const installments = diffDays
                                                            const methodLabel = "días reales"
                                                            return `${installments} cuotas totales (${methodLabel})`
                                                        } else {
                                                            // THIRTY_DAYS
                                                            const installments = formValues.loanTermMonths * DAYS_PER_MONTH
                                                            const methodLabel = "30 días/mes"
                                                            return `${installments} cuotas totales (${methodLabel})`
                                                        }
                                                    } else if (formValues.paymentFrequency === "MONTHLY") {
                                                        const installments = formValues.loanTermMonths
                                                        const methodLabel = method === "ACTUAL_DAYS" ? "días reales" : "30 días/mes"
                                                        return `${installments} cuotas totales (${methodLabel})`
                                                    } else {
                                                        // WEEKLY or BIWEEKLY
                                                        const divisor = formValues.paymentFrequency === "WEEKLY" ? 7 : 14
                                                        const installments = Math.round((formValues.loanTermMonths * DAYS_PER_MONTH) / divisor)
                                                        const methodLabel = method === "ACTUAL_DAYS" ? "días reales" : "30 días/mes"
                                                        return `${installments} cuotas totales (${methodLabel})`
                                                    }
                                                }
                                                
                                                // Fallback if no start date
                                                const getInstallments = (months: number, freq: string, calcMethod: string) => {
                                                    if (freq === "DAILY") {
                                                        return months * DAYS_PER_MONTH
                                                    }
                                                    
                                                    switch (freq) {
                                                        case "WEEKLY": return Math.round((months * DAYS_PER_MONTH) / 7)
                                                        case "BIWEEKLY": return Math.round((months * DAYS_PER_MONTH) / 14)
                                                        case "MONTHLY": return months
                                                        default: return months
                                                    }
                                                }
                                                const installments = getInstallments(formValues.loanTermMonths, formValues.paymentFrequency, method)
                                                const methodLabel = method === "ACTUAL_DAYS" ? "días reales" : "30 días/mes"
                                                return `${installments} cuotas totales (${methodLabel})`
                                            })()}
                                        </span>
                                    )}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="dayCalculationMethod"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Método de Cálculo de Días</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value || "THIRTY_DAYS"}>
                                    <FormControl>
                                        <SelectTrigger className="h-10">
                                            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                                            <SelectValue placeholder="Seleccionar método" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="THIRTY_DAYS">30 días por mes (estándar)</SelectItem>
                                        <SelectItem value="ACTUAL_DAYS">Días reales del calendario</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription className="text-xs">
                                    {field.value === "THIRTY_DAYS" && "Todos los meses se calculan como 30 días (360 días/año)"}
                                    {field.value === "ACTUAL_DAYS" && "Respeta los días reales de cada mes (28, 29, 30, 31)"}
                                    {!field.value && "Todos los meses se calculan como 30 días (360 días/año)"}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="interestRate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tasa de Interés (%)</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Percent className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            step="0.01"
                                            className="pl-9 bg-muted cursor-not-allowed"
                                            value="0"
                                            disabled
                                            readOnly
                                        />
                                    </div>
                                </FormControl>
                                <FormDescription className="text-xs">Tasa de interés fija al 0%</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="interestType"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Tipo de Interés</FormLabel>
                                <FormControl>
                                    <div className="flex items-center space-x-2 h-10 px-3 rounded-md border bg-muted cursor-not-allowed">
                                        <span className="text-sm text-muted-foreground">Fijo (Simple)</span>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {formValues.paymentFrequency === "DAILY" && (
                        <>
                            <FormField
                                control={control}
                                name="installmentPaymentAmmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Monto de Pago Diario</FormLabel>
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
                                        <FormDescription className="text-xs">Cantidad fija a pagar por día</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="gpsAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Monto de GPS Diario</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                                <Navigation className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    type="text"
                                                    className="pl-7 pr-9"
                                                    value={formatNumber(field.value)}
                                                    onChange={(e) => {
                                                        const value = parseFormattedNumber(e.target.value)
                                                        field.onChange(value)
                                                    }}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormDescription className="text-xs">Monto adicional para GPS por día</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
