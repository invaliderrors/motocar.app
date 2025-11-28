"use client"

import { TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Edit, Trash2 } from "lucide-react"
import type { Vehicle } from "@/lib/types"
import { VehicleForm } from "../VehicleForm"

interface VehicleTableRowProps {
    vehicle: Vehicle
    index: number
    getProviderLabel: (providerName: string) => string
    getVehicleTypeLabel: (type: any) => string
    onEdit: (vehicle?: Vehicle) => void
    onDelete: (id: string) => void
}

export function VehicleTableRow({
    vehicle: moto,
    index,
    getProviderLabel,
    getVehicleTypeLabel,
    onEdit,
    onDelete,
}: VehicleTableRowProps) {
    return (
        <TableRow
            key={`moto-row-${moto.id}-${index}`}
            className="border-border hover:bg-muted/50"
        >
            <TableCell className="font-medium">{moto.brand}</TableCell>
            <TableCell>{moto.model}</TableCell>
            <TableCell>
                <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary border-primary/30"
                >
                    {moto.plate}
                </Badge>
            </TableCell>
            <TableCell>{moto.color ?? "—"}</TableCell>
            <TableCell>{moto.cc ? `${moto.cc} cc` : "—"}</TableCell>
            <TableCell className="text-xs">
                {moto.soatDueDate ? (
                    <Badge 
                        variant="outline" 
                        className={
                            new Date(moto.soatDueDate) < new Date()
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-300"
                                : new Date(moto.soatDueDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300"
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300"
                        }
                    >
                        {new Date(moto.soatDueDate).toLocaleDateString('es-CO')}
                    </Badge>
                ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                        No registrado
                    </Badge>
                )}
            </TableCell>
            <TableCell className="text-xs">
                {moto.technomechDueDate ? (
                    <Badge 
                        variant="outline" 
                        className={
                            new Date(moto.technomechDueDate) < new Date()
                                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-300"
                                : new Date(moto.technomechDueDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300"
                                : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300"
                        }
                    >
                        {new Date(moto.technomechDueDate).toLocaleDateString('es-CO')}
                    </Badge>
                ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                        No registrado
                    </Badge>
                )}
            </TableCell>
            <TableCell>
                {moto.gps ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50">
                        {moto.gps}
                    </Badge>
                ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                        No asignado
                    </Badge>
                )}
            </TableCell>
            <TableCell>
                {moto.provider ? (
                    <Badge className="bg-primary/20 text-primary hover:bg-primary/30">
                        {getProviderLabel(moto.provider.name)}
                    </Badge>
                ) : (
                    <Badge variant="outline" className="text-muted-foreground">
                        No asignado
                    </Badge>
                )}
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <div key={`edit-wrapper-${moto.id}-${index}`}>
                        <VehicleForm vehicleId={moto.id} vehicleData={moto} onCreated={onEdit}>
                            <Button
                                variant="outline"
                                size="icon"
                                className="border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                            >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Editar</span>
                            </Button>
                        </VehicleForm>
                    </div>
                    <TooltipProvider key={`delete-tooltip-${moto.id}-${index}`}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onDelete(moto.id)}
                                    className="border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Eliminar</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Eliminar vehículo</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </TableCell>
        </TableRow>
    )
}

