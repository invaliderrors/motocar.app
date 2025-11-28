"use client"

import { useState } from "react"
import { TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Edit, Trash2, Building, Calendar, Bike, DollarSign, Eye, TrendingUp, Activity } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Provider, ProviderStats } from "@/lib/types"
import { ProviderCashRegistersDialog } from "../components/ProvidersCashRegistersDialog"
import { ProviderMotorcyclesDialog } from "../components/ProvidersMotorcyclesDialog"
import { ProviderForm } from "../form/ProviderForm"
import { Skeleton } from "@/components/ui/skeleton"

interface ProviderTableRowProps {
    provider: Provider
    stats?: ProviderStats
    index: number
    onEdit: (provider?: Provider) => void
    onDelete: (id: string) => void
    onViewDetails: (providerId: string) => void
    createProvider: (name: string) => Promise<Provider>
    updateProvider: (id: string, name: string) => Promise<Provider>
}

export function ProviderTableRow({
    provider,
    stats,
    index,
    onEdit,
    onDelete,
    onViewDetails,
    createProvider,
    updateProvider,
}: ProviderTableRowProps) {
    const [motorcyclesDialogOpen, setMotorcyclesDialogOpen] = useState(false)
    const [cashRegistersDialogOpen, setCashRegistersDialogOpen] = useState(false)

    const motorcycleCount = provider.motorcylces?.length || 0
    const cashRegisterCount = provider.cashRegisters?.length || 0

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <>
            <TableRow
                key={`provider-row-${provider.id}-${index}`}
                className="border-border hover:bg-muted/50"
            >
                <TableCell>
                    <div className="font-medium flex items-center gap-1.5">
                        <Building className="h-4 w-4 text-primary" />
                        <Badge
                            variant="outline"
                            className="bg-primary/10 border-primary/30 text-primary"
                        >
                            {provider.name}
                        </Badge>
                    </div>
                </TableCell>

                <TableCell className="text-center">
                    {stats ? (
                        <div className="flex flex-col items-center gap-1">
                            <Badge variant="secondary" className="bg-primary/20 text-primary">
                                {stats.totalVehicles} total
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                                {stats.vehiclesByStatus.RENTED} arrendados
                            </div>
                        </div>
                    ) : (
                        <Skeleton className="h-8 w-20 mx-auto" />
                    )}
                </TableCell>

                <TableCell className="text-center">
                    {stats ? (
                        <div className="flex flex-col items-center gap-1">
                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                {stats.activeLoans} activos
                            </Badge>
                            <div className="text-xs text-muted-foreground">
                                {stats.completedLoans} completados
                            </div>
                        </div>
                    ) : (
                        <Skeleton className="h-8 w-20 mx-auto" />
                    )}
                </TableCell>

                <TableCell className="text-center">
                    {stats ? (
                        <div className="flex flex-col items-center gap-1">
                            <div className="font-medium text-green-600 dark:text-green-400">
                                {formatCurrency(stats.totalRevenue)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {formatCurrency(stats.pendingPayments)} pendiente
                            </div>
                        </div>
                    ) : (
                        <Skeleton className="h-8 w-24 mx-auto" />
                    )}
                </TableCell>

                <TableCell className="text-center">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setCashRegistersDialogOpen(true)}
                                    className="h-8 px-3 text-amber-600 hover:text-amber-800 hover:bg-amber-50 dark:text-amber-400 dark:hover:text-amber-200 dark:hover:bg-amber-900/30"
                                >
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    <Badge
                                        variant="secondary"
                                        className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                    >
                                        {cashRegisterCount}
                                    </Badge>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Ver cierres de caja ({cashRegisterCount})</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </TableCell>

                <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{format(new Date(provider.createdAt), "dd/MM/yyyy", { locale: es })}</span>
                    </div>
                </TableCell>

                <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => onViewDetails(provider.id)}
                                        className="border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span className="sr-only">Ver detalles</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Ver detalles completos</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div key={`edit-wrapper-${provider.id}-${index}`}>
                                        <ProviderForm
                                            providerId={provider.id}
                                            providerData={provider}
                                            onCreated={onEdit}
                                            createProvider={createProvider}
                                            updateProvider={updateProvider}
                                        >
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                                            >
                                                <Edit className="h-4 w-4" />
                                                <span className="sr-only">Editar</span>
                                            </Button>
                                        </ProviderForm>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Editar proveedor</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => onDelete(provider.id)}
                                        className="border-destructive/30 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Eliminar</span>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Eliminar proveedor</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </TableCell>
            </TableRow>

            {/* Dialogs */}
            <ProviderMotorcyclesDialog
                open={motorcyclesDialogOpen}
                onOpenChange={setMotorcyclesDialogOpen}
                provider={provider}
            />

            <ProviderCashRegistersDialog
                open={cashRegistersDialogOpen}
                onOpenChange={setCashRegistersDialogOpen}
                provider={provider}
            />
        </>
    )
}
