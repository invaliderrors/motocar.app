"use client"

import { Button } from "@/components/ui/button"
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RefreshCw, MoreHorizontal, FileSpreadsheet, SlidersHorizontal, Bike } from "lucide-react"

interface VehicleTableHeaderProps {
    onRefresh: () => void
    onExport: () => void
}

export function VehicleTableHeader({ onRefresh, onExport }: VehicleTableHeaderProps) {
    return (
        <CardHeader className="bg-primary text-primary-foreground p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-primary-foreground/20 backdrop-blur-sm p-2 rounded-full">
                        <Bike className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                        <CardTitle className="text-xl font-bold">Gestión de vehículos</CardTitle>
                        <CardDescription className="text-primary-foreground/80">Administra el inventario de vehículos</CardDescription>
                    </div>
                </div>
                <div className="flex gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onRefresh}
                                    className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Actualizar datos</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={onExport}>
                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                Exportar a CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                Configuración
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </CardHeader>
    )
}

