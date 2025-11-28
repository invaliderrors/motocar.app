"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Banknote, ArrowDownToLine, CreditCard, Info, CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { FormState } from "../types"

interface FormInputsProps {
    formState: FormState
    isReadOnly: boolean
    onInputChange: (field: keyof FormState, value: string) => void
}

export const FormInputs: React.FC<FormInputsProps> = ({ formState, isReadOnly, onInputChange }) => {
    const [calendarOpen, setCalendarOpen] = useState(false)
    
    // Convert string date to Date object for calendar
    // Parse the date string as local date to avoid timezone issues
    const selectedDate = formState.closingDate 
        ? new Date(formState.closingDate + 'T00:00:00') 
        : new Date()
    
    return (
        <div className="space-y-6">
            <div className="space-y-3">
                <Label htmlFor="closingDate" className="text-sm font-medium flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-orange-500" />
                    Fecha del Cierre
                </Label>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-full justify-start text-left font-normal transition-all",
                                "hover:border-orange-500 focus-within:border-orange-500 focus-within:ring-orange-500/20",
                                !formState.closingDate && "text-muted-foreground"
                            )}
                        >
                            {formState.closingDate ? (
                                format(selectedDate, "PPP", { locale: es })
                            ) : (
                                <span>Seleccionar fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                                if (date) {
                                    onInputChange("closingDate", format(date, "yyyy-MM-dd"))
                                    setCalendarOpen(false)
                                }
                            }}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-3">
                <Label htmlFor="cashInRegister" className="text-sm font-medium flex items-center gap-2">
                    <Banknote className="h-4 w-4 text-emerald-500" />
                    Efectivo en Caja
                </Label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                        id="cashInRegister"
                        type="number"
                        placeholder="0.00"
                        value={formState.cashInRegister}
                        onChange={(e) => onInputChange("cashInRegister", e.target.value)}
                        readOnly={isReadOnly}
                        className={cn(
                            "pl-8 transition-all focus-within:border-emerald-500 focus-within:ring-emerald-500/20",
                            isReadOnly && "bg-muted text-muted-foreground cursor-not-allowed",
                        )}
                    />
                </div>
            </div>

            <div className="space-y-3">
                <Label htmlFor="cashFromTransfers" className="text-sm font-medium flex items-center gap-2">
                    <ArrowDownToLine className="h-4 w-4 text-blue-500" />
                    Transferencias
                </Label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                        id="cashFromTransfers"
                        type="number"
                        placeholder="0.00"
                        value={formState.cashFromTransfers}
                        onChange={(e) => onInputChange("cashFromTransfers", e.target.value)}
                        readOnly={isReadOnly}
                        className={cn(
                            "pl-8 transition-all focus-within:border-blue-500 focus-within:ring-blue-500/20",
                            isReadOnly && "bg-muted text-muted-foreground cursor-not-allowed",
                        )}
                    />
                </div>
            </div>

            <div className="space-y-3">
                <Label htmlFor="cashFromCards" className="text-sm font-medium flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-purple-500" />
                    Tarjetas
                </Label>
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                        id="cashFromCards"
                        type="number"
                        placeholder="0.00"
                        value={formState.cashFromCards}
                        onChange={(e) => onInputChange("cashFromCards", e.target.value)}
                        readOnly={isReadOnly}
                        className={cn(
                            "pl-8 transition-all focus-within:border-purple-500 focus-within:ring-purple-500/20",
                            isReadOnly && "bg-muted text-muted-foreground cursor-not-allowed",
                        )}
                    />
                </div>
            </div>

            <div className="space-y-3 pt-2">
                <Label htmlFor="notes" className="text-sm font-medium flex items-center gap-2">
                    <Info className="h-4 w-4 text-gray-500" />
                    Notas y Observaciones
                </Label>
                <Textarea
                    id="notes"
                    placeholder="Ingrese cualquier observación relevante para el cierre de caja..."
                    value={formState.notes}
                    onChange={(e) => onInputChange("notes", e.target.value)}
                    rows={4}
                    className="resize-none transition-all focus-within:border-gray-500 focus-within:ring-gray-500/20"
                />
            </div>
        </div>
    )
}
