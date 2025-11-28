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
            <TableCell className="font-mono text-xs">
                {moto.engine ? (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="cursor-default">
                                <span className="bg-muted px-2 py-1 rounded border border-border">
                                    {moto.engine}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Número de motor</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ) : (
                    "—"
                )}
            </TableCell>
            <TableCell className="font-mono text-xs">
                {moto.chassis ? (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger className="cursor-default">
                                <span className="bg-muted px-2 py-1 rounded border border-border">
                                    {moto.chassis}
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Número de chasis</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ) : (
                    "—"
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

