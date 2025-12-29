"use client"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Tag, Calendar, DollarSign, CreditCard, Loader2, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { Control } from "react-hook-form"
import { ExpenseFormValues } from "../hooks/useExpenseForm"
import { useProviders } from "@/components/providers/hooks/useProviders"


interface ExpenseBasicInfoProps {
    control: Control<ExpenseFormValues>
}

export function ExpenseBasicInfo({ control }: ExpenseBasicInfoProps) {
    const { providers, loading, error } = useProviders()

    return (
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                    <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold">Información del Egreso</h3>
                    <p className="text-sm text-muted-foreground">Detalles principales del gasto</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                        control={control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2 text-sm font-medium after:content-['*'] after:text-destructive after:ml-0.5">
                                    <Tag className="h-4 w-4" />
                                    Categoría
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Seleccione una categoría" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="RENT">Arriendo</SelectItem>
                                        <SelectItem value="SERVICES">Servicios</SelectItem>
                                        <SelectItem value="SALARIES">Nómina</SelectItem>
                                        <SelectItem value="TAXES">Impuestos</SelectItem>
                                        <SelectItem value="MAINTENANCE">Mantenimiento</SelectItem>
                                        <SelectItem value="WORKSHOP">Taller</SelectItem>
                                        <SelectItem value="SPARE_PARTS">Repuestos</SelectItem>
                                        <SelectItem value="PURCHASES">Compras</SelectItem>
                                        <SelectItem value="MARKETING">Mercadeo</SelectItem>
                                        <SelectItem value="TRANSPORT">Transporte</SelectItem>
                                        <SelectItem value="WORKSHOP_TOOLS">Herramientas de taller</SelectItem>
                                        <SelectItem value="SHOWROOM_EXPENSES">Gastos de sala</SelectItem>
                                        <SelectItem value="WORKER_GASOLINE">Gasolina trabajadores</SelectItem>
                                        <SelectItem value="EMPLOYEE_BONUS">Bonificación empleados</SelectItem>
                                        <SelectItem value="PAYROLL_EXPENSES">Gastos de nómina</SelectItem>
                                        <SelectItem value="BONUS_EXPENSES">Gastos de primas</SelectItem>
                                        <SelectItem value="TRAVEL_ALLOWANCES">Viáticos</SelectItem>
                                        <SelectItem value="MOTORCYCLE_PREP_GASOLINE">Gasolina para alistamiento de motos</SelectItem>
                                        <SelectItem value="TRAFFIC_FINES">Pago de comparendos</SelectItem>
                                        <SelectItem value="OTHER">Otros</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription className="text-xs">Tipo de gasto</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="flex items-center gap-2 text-sm font-medium after:content-['*'] after:text-destructive after:ml-0.5">
                                    <Calendar className="h-4 w-4" />
                                    Fecha
                                </FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(new Date(field.value + 'T12:00:00'), "PPP", { locale: es })
                                                ) : (
                                                    <span>Seleccione una fecha</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
                                            mode="single"
                                            selected={field.value ? new Date(field.value + 'T12:00:00') : undefined}
                                            onSelect={(date) => {
                                                if (date) {
                                                    // Get the date in Colombian timezone to avoid timezone issues
                                                    const year = date.getFullYear()
                                                    const month = String(date.getMonth() + 1).padStart(2, '0')
                                                    const day = String(date.getDate()).padStart(2, '0')
                                                    field.onChange(`${year}-${month}-${day}`)
                                                }
                                            }}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormDescription className="text-xs">Fecha del gasto</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2 text-sm font-medium after:content-['*'] after:text-destructive after:ml-0.5">
                                    <DollarSign className="h-4 w-4" />
                                    Monto
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="h-10"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-xs">Valor en COP</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="paymentMethod"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2 text-sm font-medium after:content-['*'] after:text-destructive after:ml-0.5">
                                    <CreditCard className="h-4 w-4" />
                                    Método de pago
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Seleccione un método" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="CASH">Efectivo</SelectItem>
                                        <SelectItem value="CARD">Tarjeta</SelectItem>
                                        <SelectItem value="TRANSACTION">Transferencia</SelectItem>
                                        <SelectItem value="CHECK">Cheque</SelectItem>
                                        <SelectItem value="OTHER">Otro</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription className="text-xs">Cómo se realizó el pago</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="providerId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                    <Tag className="h-4 w-4" />
                                    Proveedor
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                                    <FormControl>
                                        <SelectTrigger className="h-10">
                                            <SelectValue
                                                placeholder={
                                                    loading
                                                        ? "Cargando..."
                                                        : error
                                                            ? "Error"
                                                            : "Seleccione un proveedor"
                                                }
                                            />
                                            {loading && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {loading ? (
                                            <SelectItem value="__loading__" disabled>
                                                <div className="flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Cargando proveedores...
                                                </div>
                                            </SelectItem>
                                        ) : error ? (
                                            <SelectItem value="__error__" disabled>
                                                Error al cargar proveedores
                                            </SelectItem>
                                        ) : providers.length === 0 ? (
                                            <SelectItem value="__empty__" disabled>
                                                No hay proveedores disponibles
                                            </SelectItem>
                                        ) : (
                                            providers.map((provider) => (
                                                <SelectItem key={provider.id} value={provider.id}>
                                                    {provider.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                <FormDescription className="text-xs">
                                    {loading
                                        ? "Cargando..."
                                        : error
                                            ? "Error al cargar"
                                            : "Proveedor asociado (opcional)"}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
            </div>
        </div>
    )
}
