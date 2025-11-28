"use client"

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { UserIcon, Car, ChevronsUpDownIcon as ChevronUpDown } from "lucide-react"
import type { Control } from "react-hook-form"
import { Vehicle, User } from "@/lib/types"

interface LoanFormClientVehicleCardProps {
    control: Control<any>
    availableUsers: User[]
    availableVehicles: Vehicle[]
    onVehicleChange: (vehicleId: string) => void
    formatCurrency: (amount: number) => string
}

export function LoanFormClientVehicleCard({
    control,
    availableUsers,
    availableVehicles,
    onVehicleChange,
    formatCurrency,
}: LoanFormClientVehicleCardProps) {
    return (
        <Card className="border-primary/20 shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-primary" />
                    Información del Cliente y Vehículo
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                        control={control}
                        name="userId"
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
                                                    ? availableUsers.find((user) => user.id === field.value)?.name || "Seleccionar cliente"
                                                    : "Seleccionar cliente"}
                                                <ChevronUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[300px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Buscar cliente por nombre..." />
                                            <CommandList>
                                                <CommandEmpty>
                                                    {availableUsers.length === 0
                                                        ? "No hay clientes disponibles. Todos están asignados a contratos activos."
                                                        : "No se encontraron clientes."}
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {availableUsers.map((user) => (
                                                        <CommandItem key={user.id} value={user.name} onSelect={() => field.onChange(user.id)}>
                                                            <UserIcon className="mr-2 h-4 w-4" />
                                                            <div className="flex flex-col">
                                                                <span className={user.id === field.value ? "font-medium" : ""}>{user.name}</span>
                                                                <span className="text-xs text-muted-foreground">ID: {user.identification}</span>
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
                    <FormField
                        control={control}
                        name="vehicleId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Vehículo</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className="w-full justify-between bg-background hover:bg-background/80 transition-colors h-10"
                                            >
                                                {field.value
                                                    ? (() => {
                                                        const vehicle = availableVehicles.find((v) => v.id === field.value)
                                                        return vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.plate})` : "Seleccionar vehículo"
                                                    })()
                                                    : "Seleccionar vehículo"}
                                                <ChevronUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[350px] p-0" align="start">
                                        <Command>
                                            <CommandInput placeholder="Buscar por marca, modelo o placa..." />
                                            <CommandList>
                                                <CommandEmpty>
                                                    {availableVehicles.length === 0
                                                        ? "No hay vehículos disponibles. Todos están asignados a contratos activos."
                                                        : "No se encontraron vehículos."}
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {availableVehicles.map((vehicle) => (
                                                        <CommandItem
                                                            key={vehicle.id}
                                                            value={`${vehicle.brand} ${vehicle.model} ${vehicle.plate}`}
                                                            onSelect={() => {
                                                                field.onChange(vehicle.id)
                                                                onVehicleChange(vehicle.id)
                                                            }}
                                                        >
                                                            <Car className="mr-2 h-4 w-4" />
                                                            <div className="flex flex-col">
                                                                <span className={vehicle.id === field.value ? "font-medium" : ""}>
                                                                    {vehicle.brand} {vehicle.model} ({vehicle.plate})
                                                                </span>
                                                                <span className="text-xs text-muted-foreground">{formatCurrency(vehicle.price || 0)}</span>
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
                </div>
            </CardContent>
        </Card>
    )
}
