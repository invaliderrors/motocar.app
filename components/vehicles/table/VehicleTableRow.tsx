"use client"

import { TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useResourcePermissions } from "@/hooks/useResourcePermissions"
import { Resource } from "@/lib/types/permissions"
import { Edit, Trash2, MapPin, Building2, Gauge, Bike } from "lucide-react"
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

type DocumentStatus = 'none' | 'expired' | 'warning' | 'valid'

// Helper function to get document status
function getDocumentStatus(dueDate: string | null | undefined): { status: DocumentStatus; text: string } {
    if (!dueDate || dueDate.trim() === '') return { status: 'none', text: 'Sin registro' }
    return { status: 'valid', text: dueDate }
}

// Document status badge component
function DocumentBadge({ dueDate, type }: { dueDate: string | null | undefined, type: 'soat' | 'technomech' }) {
    const { status, text } = getDocumentStatus(dueDate)
    
    if (status === 'none') {
        return (
            <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span className="text-xs text-muted-foreground">Sin registro</span>
            </div>
        )
    }
    
    return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/40 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700/50 transition-all duration-200 hover:shadow-sm">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {text}
            </span>
        </div>
    )
}

export function VehicleTableRow({
    vehicle: moto,
    index,
    getProviderLabel,
    getVehicleTypeLabel,
    onEdit,
    onDelete,
}: VehicleTableRowProps) {
    const vehiclePermissions = useResourcePermissions(Resource.VEHICLE)

    return (
        <TableRow
            key={`moto-row-${moto.id}-${index}`}
            className="group border-border/50 hover:bg-gradient-to-r hover:from-primary/[0.02] hover:to-primary/[0.05] transition-all duration-200"
        >
            {/* Brand - with subtle emphasis */}
            <TableCell className="py-3.5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center shadow-sm">
                        <Bike className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                    </div>
                    <span className="font-semibold text-foreground">{moto.brand}</span>
                </div>
            </TableCell>
            
            {/* Model */}
            <TableCell className="py-3.5">
                <span className="text-muted-foreground font-medium">{moto.model}</span>
            </TableCell>
            
            {/* Plate - prominent badge */}
            <TableCell className="py-3.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-100 dark:from-indigo-950/40 dark:to-purple-900/30 border border-indigo-200 dark:border-indigo-800/50">
                    <span className="text-xs font-bold tracking-wider text-indigo-700 dark:text-indigo-400">
                        {moto.plate}
                    </span>
                </div>
            </TableCell>
            
            {/* Color - with color indicator */}
            <TableCell className="py-3.5">
                {moto.color ? (
                    <div className="flex items-center gap-2">
                        <div 
                            className="w-3 h-3 rounded-full border border-slate-300 dark:border-slate-600 shadow-inner"
                            style={{ 
                                backgroundColor: getColorHex(moto.color)
                            }}
                        />
                        <span className="text-sm text-muted-foreground capitalize">{moto.color}</span>
                    </div>
                ) : (
                    <span className="text-muted-foreground/50 text-sm">—</span>
                )}
            </TableCell>
            
            {/* CC - with icon */}
            <TableCell className="py-3.5">
                {moto.cc ? (
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800">
                        <Gauge className="w-3.5 h-3.5 text-slate-500" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{moto.cc} cc</span>
                    </div>
                ) : (
                    <span className="text-muted-foreground/50 text-sm">—</span>
                )}
            </TableCell>
            
            {/* SOAT Status */}
            <TableCell className="py-3.5">
                <DocumentBadge dueDate={moto.soatDueDate} type="soat" />
            </TableCell>
            
            {/* Technomech Status */}
            <TableCell className="py-3.5">
                <DocumentBadge dueDate={moto.technomechDueDate} type="technomech" />
            </TableCell>
            
            {/* GPS */}
            <TableCell className="py-3.5">
                {moto.gps ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-50 to-sky-100 dark:from-cyan-950/40 dark:to-sky-900/30 border border-cyan-200 dark:border-cyan-800/50">
                        <MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                        <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400">{moto.gps}</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                        <span className="text-xs text-muted-foreground">Sin GPS</span>
                    </div>
                )}
            </TableCell>
            
            {/* Provider */}
            <TableCell className="py-3.5">
                {moto.provider ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-50 to-purple-100 dark:from-violet-950/40 dark:to-purple-900/30 border border-violet-200 dark:border-violet-800/50">
                        <Building2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                        <span className="text-xs font-medium text-violet-700 dark:text-violet-400">
                            {getProviderLabel(moto.provider.name)}
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                        <span className="text-xs text-muted-foreground">Sin proveedor</span>
                    </div>
                )}
            </TableCell>
            
            {/* Actions */}
            <TableCell className="py-3.5 text-right">
                {(vehiclePermissions.canEdit || vehiclePermissions.canDelete) && (
                    <div className="flex justify-end gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                        {vehiclePermissions.canEdit && (
                            <div key={`edit-wrapper-${moto.id}-${index}`}>
                                <VehicleForm vehicleId={moto.id} vehicleData={moto} onCreated={onEdit}>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                        <Edit className="h-3.5 w-3.5" />
                                        <span className="sr-only">Editar</span>
                                    </Button>
                                </VehicleForm>
                            </div>
                        )}
                        {vehiclePermissions.canDelete && (
                            <TooltipProvider key={`delete-tooltip-${moto.id}-${index}`}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete(moto.id)}
                                            className="h-8 w-8 rounded-lg bg-destructive/5 text-destructive hover:bg-destructive hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            <span className="sr-only">Eliminar</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Eliminar vehículo</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                )}
            </TableCell>
        </TableRow>
    )
}

// Helper function to convert Spanish color names to hex
function getColorHex(colorName: string): string {
    const colorMap: Record<string, string> = {
        'negro': '#1a1a1a',
        'blanco': '#f5f5f5',
        'rojo': '#dc2626',
        'azul': '#2563eb',
        'verde': '#16a34a',
        'amarillo': '#eab308',
        'naranja': '#ea580c',
        'gris': '#6b7280',
        'plateado': '#a8a29e',
        'plata': '#a8a29e',
        'morado': '#9333ea',
        'rosado': '#ec4899',
        'rosa': '#ec4899',
        'café': '#78350f',
        'marrón': '#78350f',
        'dorado': '#ca8a04',
        'beige': '#d4c5a9',
        'celeste': '#38bdf8',
        'turquesa': '#14b8a6',
        'vinotinto': '#7c2d12',
        'vino tinto': '#7c2d12',
    }
    
    const normalizedColor = colorName.toLowerCase().trim()
    return colorMap[normalizedColor] || '#9ca3af'
}

