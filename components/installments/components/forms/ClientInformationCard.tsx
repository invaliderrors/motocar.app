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
            <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Cliente
                </CardTitle>
            </CardHeader>
            <CardContent className="px-3 pb-3 pt-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                    <FormField
                        control={control}
                        name="loanId"
                        render={({ field }) => (
                            <FormItem className="space-y-1">
                                <FormLabel className="text-xs">Nombre</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className="w-full justify-between bg-background hover:bg-background/80 transition-colors h-8 text-sm"
                                            >
                                                <span className="truncate">
                                                    {field.value
                                                        ? loans.find((loan) => loan.id === field.value)?.user.name || "Seleccionar"
                                                        : "Seleccionar cliente"}
                                                </span>
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
                                                    className="ml-1 h-3 w-3 shrink-0 opacity-50"
                                                >
                                                    <path d="m7 15 5 5 5-5" />
                                                    <path d="m7 9 5-5 5 5" />
                                                </svg>
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Buscar por nombre, placa..." />
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
                    <FormItem className="space-y-1">
                        <FormLabel className="text-xs">Vehículo</FormLabel>
                        <Input
                            value={selectedLoan?.vehicle?.model || selectedLoan?.motorcycle?.model || "-"}
                            className="bg-muted/50 h-8 text-sm"
                            disabled
                        />
                    </FormItem>
                    <FormItem className="space-y-1">
                        <FormLabel className="text-xs">Placa</FormLabel>
                        <Input
                            value={selectedLoan?.vehicle?.plate || selectedLoan?.motorcycle?.plate || "-"}
                            className="bg-muted/50 h-8 text-sm"
                            disabled
                        />
                    </FormItem>
                </div>
            </CardContent>
        </Card>
    )
}
