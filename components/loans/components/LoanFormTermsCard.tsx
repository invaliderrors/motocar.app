"use client"

import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, Calendar, Clock, Percent, Navigation, CalendarDays } from "lucide-react"
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
                    Términos del Préstamo
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        control={control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fecha de Inicio</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <CalendarDays className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="date"
                                            className="pl-9"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormDescription className="text-xs">Fecha de inicio del préstamo</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fecha de Finalización (Opcional)</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <CalendarDays className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            type="date"
                                            className="pl-9"
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormDescription className="text-xs">
                                    Si no se proporciona, se calculará automáticamente
                                    {formValues.paymentFrequency === "DAILY" && " (excluye domingos)"}
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
                                <FormLabel>Plazo del Préstamo (meses)</FormLabel>
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
                                            readOnly={!!(formValues.startDate && formValues.endDate)}
                                        />
                                    </div>
                                </FormControl>
                                <FormDescription className="text-xs">
                                    {formValues.startDate && formValues.endDate 
                                        ? "Calculado automáticamente desde las fechas" 
                                        : "Duración total del préstamo en meses"}
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
                                    {formValues.paymentFrequency === "DAILY" && "Pagos todos los días (lunes a sábado)"}
                                    {formValues.paymentFrequency === "WEEKLY" && "Pagos una vez por semana"}
                                    {formValues.paymentFrequency === "BIWEEKLY" && "Pagos cada dos semanas"}
                                    {formValues.paymentFrequency === "MONTHLY" && "Pagos una vez al mes"}
                                    {formValues.loanTermMonths > 0 && formValues.paymentFrequency && (
                                        <span className="block mt-1 font-medium text-primary">
                                            {(() => {
                                                // If dates are provided, calculate from dates
                                                if (formValues.startDate && formValues.endDate) {
                                                    const calculateInstallmentsFromDates = (startDate: string, endDate: string, frequency: string): number => {
                                                        const start = new Date(startDate)
                                                        const end = new Date(endDate)
                                                        
                                                        if (start >= end) return 0
                                                        
                                                        if (frequency === "DAILY") {
                                                            let businessDays = 0
                                                            const currentDate = new Date(start)
                                                            
                                                            while (currentDate <= end) {
                                                                if (currentDate.getDay() !== 0) {
                                                                    businessDays++
                                                                }
                                                                currentDate.setDate(currentDate.getDate() + 1)
                                                            }
                                                            
                                                            return businessDays
                                                        } else {
                                                            const diffTime = Math.abs(end.getTime() - start.getTime())
                                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                                                            
                                                            switch (frequency) {
                                                                case "WEEKLY": return Math.ceil(diffDays / 7)
                                                                case "BIWEEKLY": return Math.ceil(diffDays / 14)
                                                                case "MONTHLY":
                                                                    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
                                                                    return Math.max(1, months)
                                                                default: return 0
                                                            }
                                                        }
                                                    }
                                                    
                                                    const installments = calculateInstallmentsFromDates(
                                                        formValues.startDate, 
                                                        formValues.endDate, 
                                                        formValues.paymentFrequency
                                                    )
                                                    return `${installments} cuotas (calculado desde fechas)`
                                                }
                                                
                                                // Otherwise use month-based calculation
                                                const getInstallments = (months: number, freq: string) => {
                                                    switch (freq) {
                                                        case "DAILY": return months * 30
                                                        case "WEEKLY": return months * 4
                                                        case "BIWEEKLY": return months * 2
                                                        case "MONTHLY": return months
                                                        default: return months
                                                    }
                                                }
                                                return `≈ ${getInstallments(formValues.loanTermMonths, formValues.paymentFrequency)} cuotas totales`
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
                                            className="pl-9"
                                            value={formatNumber(field.value)}
                                            onChange={(e) => {
                                                const value = parseFormattedNumber(e.target.value)
                                                field.onChange(value)
                                            }}
                                        />
                                    </div>
                                </FormControl>
                                <FormDescription className="text-xs">Tasa de interés anual</FormDescription>
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
                                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="FIXED" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Fijo (Simple)</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="COMPOUND" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Compuesto</FormLabel>
                                        </FormItem>
                                    </RadioGroup>
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
