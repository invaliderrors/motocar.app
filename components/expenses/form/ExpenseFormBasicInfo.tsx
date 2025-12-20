"use client"

import { Card, CardContent } from "@/components/ui/card"
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
        <Card className="border-border shadow-sm">
            <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-primary">
                    <Tag className="h-5 w-5" />
                    Información del egreso
                </h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                        control={control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1.5 after:content-['*'] after:text-red-500 after:ml-0.5">
                                    <Tag className="h-4 w-4 text-primary" />
                                    Categoría
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione una categoría" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="RENT">Alquiler</SelectItem>
                                        <SelectItem value="SERVICES">Servicios</SelectItem>
                                        <SelectItem value="SALARIES">Salarios</SelectItem>
                                        <SelectItem value="TAXES">Impuestos</SelectItem>
                                        <SelectItem value="MAINTENANCE">Mantenimiento</SelectItem>
                                        <SelectItem value="PURCHASES">Compras</SelectItem>
                                        <SelectItem value="MARKETING">Marketing</SelectItem>
                                        <SelectItem value="TRANSPORT">Transporte</SelectItem>
                                        <SelectItem value="WORKSHOP">Taller</SelectItem>
                                        <SelectItem value="SPARE_PARTS">Repuestos</SelectItem>
                                        <SelectItem value="OTHER">Otros</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription className="text-xs">Seleccione la categoría del egreso</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="flex items-center gap-1.5 after:content-['*'] after:text-red-500 after:ml-0.5">
                                    <Calendar className="h-4 w-4 text-primary" />
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
                                <FormDescription className="text-xs">Fecha en que se realizó el egreso</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1.5 after:content-['*'] after:text-red-500 after:ml-0.5">
                                    <DollarSign className="h-4 w-4 text-primary" />
                                    Monto
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription className="text-xs">Valor del egreso</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="paymentMethod"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1.5 after:content-['*'] after:text-red-500 after:ml-0.5">
                                    <CreditCard className="h-4 w-4 text-primary" />
                                    Método de pago
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccione un método de pago" />
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
                                <FormDescription className="text-xs">Método utilizado para el pago</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="providerId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1.5">
                                    <Tag className="h-4 w-4 text-primary" />
                                    Proveedor
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loading}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={
                                                    loading
                                                        ? "Cargando proveedores..."
                                                        : error
                                                            ? "Error al cargar proveedores"
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
                                        ? "Cargando lista de proveedores..."
                                        : error
                                            ? "Error al cargar proveedores. Intente nuevamente."
                                            : "Proveedor asociado al egreso"}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </CardContent>
        </Card>
    )
}
