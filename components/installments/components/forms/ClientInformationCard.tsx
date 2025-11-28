"use client"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Bike } from "lucide-react"
import type { Control } from "react-hook-form"
import { Loan } from "@/lib/types"


interface ClientInformationCardProps {
    control: Control<any>
    loans: Loan[]
    selectedLoan: Loan | null
    onLoanChange: (loanId: string) => void
}

export function ClientInformationCard({ control, loans, selectedLoan, onLoanChange }: ClientInformationCardProps) {
    return (
        <Card className="border-primary/20 shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Información del Cliente
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <FormField
                    control={control}
                    name="loanId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cliente</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className="w-full justify-between bg-background hover:bg-background/80 transition-colors h-10"
                                        >
                                            {field.value
                                                ? loans.find((loan) => loan.id === field.value)
                                                    ? `${loans.find((loan) => loan.id === field.value)?.user.name}`
                                                    : "Seleccionar cliente"
                                                : "Seleccionar cliente"}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="ml-2 h-4 w-4 shrink-0 opacity-50"
                                            >
                                                <path d="m7 15 5 5 5-5" />
                                                <path d="m7 9 5-5 5 5" />
                                            </svg>
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder="Buscar por nombre, placa o identificación..." />
                                        <CommandList>
                                            <CommandEmpty>No se encontraron clientes.</CommandEmpty>
                                            <CommandGroup>
                                                {loans.map((loan) => (
                                                    <CommandItem
                                                        key={loan.id}
                                                        value={`${loan.user.name} ${loan.vehicle?.plate || loan.motorcycle?.plate || ""} ${loan.user.identification || ""}`}
                                                        onSelect={() => {
                                                            field.onChange(loan.id)
                                                            onLoanChange(loan.id)
                                                            document.body.click()
                                                        }}
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className={loan.id === field.value ? "font-medium" : ""}>{loan.user.name}</span>
                                                            {(loan.vehicle?.plate || loan.motorcycle?.plate) && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    Placa: {loan.vehicle?.plate || loan.motorcycle?.plate}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </CommandItem>
                                                ))}
                                            </CommandGroup>
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormItem>
                    <FormLabel>Vehículo</FormLabel>
                    <div className="relative h-10">
                        <Bike className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={selectedLoan?.vehicle?.model || selectedLoan?.motorcycle?.model || ""}
                            className="pl-9 bg-muted/50 h-10"
                            disabled
                            placeholder="Seleccione un cliente primero"
                        />
                    </div>
                </FormItem>
                <FormItem>
                    <FormLabel>Placa</FormLabel>
                    <div className="relative h-10">
                        <Bike className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            value={selectedLoan?.vehicle?.plate || selectedLoan?.motorcycle?.plate || ""}
                            className="pl-9 bg-muted/50 h-10"
                            disabled
                            placeholder="Seleccione un cliente primero"
                        />
                    </div>
                </FormItem>
            </CardContent>
        </Card>
    )
}
