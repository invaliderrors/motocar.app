"use client"

import { TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Edit, Trash2, AlertTriangle, CheckCircle2, Clock, MapPin, Building2, Gauge, Bike } from "lucide-react"
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

// Helper function to get document status
function getDocumentStatus(dueDate: string | null | undefined) {
    if (!dueDate) return { status: 'none', label: 'Sin registro', daysLeft: null }
    
    const now = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - now.getTime()
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (daysLeft < 0) {
        return { status: 'expired', label: 'Vencido', daysLeft: Math.abs(daysLeft) }
    } else if (daysLeft <= 30) {
        return { status: 'warning', label: 'Por vencer', daysLeft }
    } else {
        return { status: 'valid', label: 'Vigente', daysLeft }
    }
}

// Document status badge component
function DocumentBadge({ dueDate, type }: { dueDate: string | null | undefined, type: 'soat' | 'technomech' }) {
    const { status, label, daysLeft } = getDocumentStatus(dueDate)
    
    if (status === 'none') {
        return (
            <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span className="text-xs text-muted-foreground">Sin registro</span>
            </div>
        )
    }
    
    const statusConfig = {
        expired: {
            icon: AlertTriangle,
            bgColor: 'bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/40 dark:to-red-900/30',
            borderColor: 'border-red-200 dark:border-red-800/50',
            textColor: 'text-red-700 dark:text-red-400',
            iconColor: 'text-red-500 dark:text-red-400',
            dotColor: 'bg-red-500',
        },
        warning: {
            icon: Clock,
            bgColor: 'bg-gradient-to-r from-amber-50 to-yellow-100 dark:from-amber-950/40 dark:to-yellow-900/30',
            borderColor: 'border-amber-200 dark:border-amber-800/50',
            textColor: 'text-amber-700 dark:text-amber-400',
            iconColor: 'text-amber-500 dark:text-amber-400',
            dotColor: 'bg-amber-500',
        },
        valid: {
            icon: CheckCircle2,
            bgColor: 'bg-gradient-to-r from-emerald-50 to-green-100 dark:from-emerald-950/40 dark:to-green-900/30',
            borderColor: 'border-emerald-200 dark:border-emerald-800/50',
            textColor: 'text-emerald-700 dark:text-emerald-400',
            iconColor: 'text-emerald-500 dark:text-emerald-400',
            dotColor: 'bg-emerald-500',
        },
    }
    
    const config = statusConfig[status]
    const Icon = config.icon
    const formattedDate = new Date(dueDate!).toLocaleDateString('es-CO', { 
        day: '2-digit', 
        month: 'short',
        year: '2-digit'
    })
    
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className={`
                        inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                        ${config.bgColor} ${config.borderColor} border
                        transition-all duration-200 hover:shadow-sm cursor-default
                    `}>
                        <div className={`w-1.5 h-1.5 rounded-full ${config.dotColor} animate-pulse`} />
                        <span className={`text-xs font-medium ${config.textColor}`}>
                            {formattedDate}
                        </span>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                    <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{type === 'soat' ? 'SOAT' : 'Tecnomecánica'}</span>
                        <span className={config.textColor}>
                            {status === 'expired' 
                                ? `Venció hace ${daysLeft} días`
                                : status === 'warning'
                                ? `Vence en ${daysLeft} días`
                                : `Vigente por ${daysLeft} días`
                            }
                        </span>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
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
                <div className="flex justify-end gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
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
                </div>
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

