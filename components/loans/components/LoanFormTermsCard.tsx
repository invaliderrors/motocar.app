"use client"

import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
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
                <FormField
                    control={control}
                    name="useCalendarDays"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-muted/30">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                    Usar días calendario reales
                                </FormLabel>
                                <FormDescription className="text-xs">
                                    {field.value ? (
                                        <span className="text-primary font-medium">
                                            ✓ Los meses tendrán su duración real (28-31 días)
                                        </span>
                                    ) : (
                                        <span>
                                            Cada mes se calcula como 30 días exactos (modo por defecto)
                                        </span>
                                    )}
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
                                                // If dates are provided, calculate from dates
                                                if (formValues.startDate && formValues.endDate) {
                                                    const calculateInstallmentsFromDates = (startDate: string, endDate: string, frequency: string): number => {
                                                        const start = new Date(startDate)
                                                        const end = new Date(endDate)
                                                        
                                                        if (start >= end) return 0
                                                        
                                                        if (frequency === "DAILY") {
                                                            const diffTime = Math.abs(end.getTime() - start.getTime())
                                                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
                                                            return diffDays
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
                                                
                                                // Calculate installments using exactly 30 days per month
                                                // Example: 18 months = 540 installments (18 * 30)
                                                const DAYS_PER_MONTH = 30
                                                const getInstallments = (months: number, freq: string, startDate?: string) => {
                                                    switch (freq) {
                                                        case "DAILY": return months * DAYS_PER_MONTH
                                                        case "WEEKLY": return Math.round((months * DAYS_PER_MONTH) / 7)
                                                        case "BIWEEKLY": return Math.round((months * DAYS_PER_MONTH) / 14)
                                                        case "MONTHLY": return months
                                                        default: return months
                                                    }
                                                }
                                                const installments = getInstallments(formValues.loanTermMonths, formValues.paymentFrequency, formValues.startDate)
                                                return `${installments} cuotas totales`
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
