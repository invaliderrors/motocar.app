"use client"
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { DollarSign, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Control } from "react-hook-form"

interface PaymentDetailsCardProps {
    control: Control<any>
    isLate: boolean
    isAdvance: boolean
    dueDate: Date | null | undefined
}

export function PaymentDetailsCard({ control, isLate, isAdvance, dueDate }: PaymentDetailsCardProps) {
    return (
        <Card className="border-primary/20 shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-primary" />
                    Detalles del Pago
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Monto</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                        <Input
                                            type="text"
                                            className="pl-7"
                                            value={field.value ? field.value.toLocaleString() : ""}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/[^\d]/g, "")
                                                field.onChange(value ? Number.parseInt(value) : 0)
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
                        name="gps"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>GPS</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                                        <Input
                                            type="text"
                                            className="pl-7"
                                            value={field.value ? field.value.toLocaleString() : ""}
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/[^\d]/g, "")
                                                field.onChange(value ? Number.parseInt(value) : 0)
                                            }}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={control}
                    name="paymentMethod"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Método de pago</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar método" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="CASH">Efectivo</SelectItem>
                                    <SelectItem value="TRANSACTION">Transferencia</SelectItem>
                                    <SelectItem value="CARD">Tarjeta</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="paymentDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fecha de la cuota</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                        >
                                            {field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <CalendarComponent
                                        mode="single"
                                        selected={field.value || undefined}
                                        onSelect={(date) => {
                                            field.onChange(date)
                                        }}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>Fecha en que se realizó el pago</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fecha de Vencimiento (Opcional)</FormLabel>
                            <div className="relative flex gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <button
                                            type="button"
                                            className={`flex-1 h-10 px-3 py-2 text-left text-sm font-normal rounded-md border border-input bg-background transition-colors
                                                inline-flex items-center justify-between gap-2
                                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                                                disabled:pointer-events-none disabled:opacity-50
                                                ${!field.value && "text-muted-foreground"}`}
                                        >
                                            <span>{field.value ? format(field.value, "PPP", { locale: es }) : "Pago de hoy"}</span>
                                            <CalendarIcon className="h-4 w-4 opacity-50" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <CalendarComponent
                                            mode="single"
                                            selected={field.value || undefined}
                                            onSelect={(date) => {
                                                field.onChange(date)
                                            }}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {field.value && (
                                    <button
                                        type="button"
                                        className="h-10 w-10 shrink-0 rounded-md border border-input bg-background inline-flex items-center justify-center
                                            hover:bg-accent hover:text-accent-foreground
                                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        onClick={() => field.onChange(null)}
                                        title="Limpiar fecha"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M18 6 6 18" />
                                            <path d="m6 6 12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <FormDescription className="text-xs">
                                {!dueDate && "Si no selecciona fecha, el pago se registra para hoy"}
                                {isLate && <span className="text-red-600 font-medium">⚠️ Pago atrasado</span>}
                                {isAdvance && <span className="text-blue-600 font-medium">🚀 Pago adelantado</span>}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notas</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Agregue notas o comentarios sobre este pago..."
                                    className="resize-none min-h-[80px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>Información adicional sobre el pago (opcional)</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    )
}
