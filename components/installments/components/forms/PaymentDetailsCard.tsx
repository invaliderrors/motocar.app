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
}

export function PaymentDetailsCard({ control, isLate }: PaymentDetailsCardProps) {
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
                    name="isLate"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={(checked) => {
                                        field.onChange(checked)
                                    }}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel className="cursor-pointer">Pago atrasado</FormLabel>
                                <FormDescription className="text-xs">Marcar si el pago se realizó fuera de fecha</FormDescription>
                            </div>
                        </FormItem>
                    )}
                />
                {isLate && (
                    <FormField
                        control={control}
                        name="latePaymentDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fecha a la que pertenece esta cuota</FormLabel>
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
                                <FormDescription>Fecha de vencimiento original de esta cuota</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
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
