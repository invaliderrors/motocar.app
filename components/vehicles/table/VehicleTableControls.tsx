"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { Search, Plus, Filter } from "lucide-react"
import type { Vehicle } from "@/lib/types"
import { VehicleForm } from "../VehicleForm"

interface VehicleTableControlsProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
    providerFilter: string
    setProviderFilter: (provider: string) => void
    vehicleTypeFilter: string
    setVehicleTypeFilter: (type: string) => void
    itemsPerPage: number
    setItemsPerPage: (items: number) => void
    setCurrentPage: (page: number) => void
    uniqueProviders: string[]
    uniqueVehicleTypes: any[]
    getProviderLabel: (providerName: string) => string
    getVehicleTypeLabel: (type: any) => string
    onVehicleCreated: (vehicle?: Vehicle) => void
}

export function VehicleTableControls({
    searchTerm,
    setSearchTerm,
    providerFilter,
    setProviderFilter,
    vehicleTypeFilter,
    setVehicleTypeFilter,
    itemsPerPage,
    setItemsPerPage,
    setCurrentPage,
    uniqueProviders,
    uniqueVehicleTypes,
    getProviderLabel,
    getVehicleTypeLabel,
    onVehicleCreated,
}: VehicleTableControlsProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar por marca, modelo, placa, motor o chasis..."
                        className="pl-9 border-border focus:border-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select
                        value={providerFilter}
                        onValueChange={(value) => {
                            setProviderFilter(value)
                            setCurrentPage(1)
                        }}
                    >
                        <SelectTrigger className="w-[180px] border-border focus:border-primary">
                            <SelectValue placeholder="Todos los proveedores" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los proveedores</SelectItem>
                            {uniqueProviders.map((provider) => (
                                <SelectItem key={provider} value={provider}>
                                    {getProviderLabel(provider)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                        setItemsPerPage(Number(value))
                        setCurrentPage(1)
                    }}
                >
                    <SelectTrigger className="w-[130px] border-border focus:border-primary">
                        <SelectValue placeholder="Mostrar" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5 por página</SelectItem>
                        <SelectItem value="10">10 por página</SelectItem>
                        <SelectItem value="20">20 por página</SelectItem>
                        <SelectItem value="50">50 por página</SelectItem>
                    </SelectContent>
                </Select>
                <VehicleForm onCreated={onVehicleCreated}>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all">
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva vehículo
                    </Button>
                </VehicleForm>
            </div>
        </div>
    )
}

