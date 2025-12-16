"use client"

import { useState } from "react"
import { TableCell, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { formatCurrency, formatDate, cn, calculatePartialInstallmentDebt, calculateDownpaymentCoverageDate } from "@/lib/utils"
import {
    User,
    Bike,
    DollarSign,
    CalendarDays,
    Wallet,
    Hash,
    Tag,
    CalendarIcon,
    Percent,
    Eye,
    CreditCard,
    Printer,
    Edit,
    Trash2,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Archive,
    ArchiveRestore,
    MoreVertical,
    Wrench,
    Gavel,
    Navigation,
    Activity,
    Newspaper,
} from "lucide-react"

import { LoanDetails } from "../loan-details"
import { InstallmentForm } from "../../installments/components/forms/installment-form"
import { LoanForm } from "../LoanForm"
import { UpdateVehicleStatusDialog } from "./UpdateVehicleStatusDialog"
import { ArchivedLoansDialog } from "./ArchivedLoansDialog"
import { ChangeLoanStatusDialog } from "./ChangeLoanStatusDialog"
import { LoanActiveNewsDialog } from "./LoanActiveNewsDialog"
import { Loan } from "@/lib/types"
import { useResourcePermissions } from "@/hooks/useResourcePermissions"
import { Resource } from "@/lib/types/permissions"


interface LoanTableRowProps {
    loan: Loan
    index: number
    newsSummary?: { totalNewsCount: number; activeNewsCount: number; totalInstallmentsExcluded: number; skippedDatesCount: number }
    onDelete: (id: string) => void
    onArchive: (id: string, archived: boolean) => void
    onPrintContract: (loan: Loan) => void
    onStatusUpdated?: () => void
}

export function LoanTableRow({ loan, index, newsSummary, onDelete, onArchive, onPrintContract, onStatusUpdated }: LoanTableRowProps) {
    // Get permissions for loans, installments, and contracts
    const contractPermissions = useResourcePermissions(Resource.CONTRACT)
    const installmentPermissions = useResourcePermissions(Resource.INSTALLMENT)

    // State for news dialog (controlled from dropdown)
    const [newsDialogOpen, setNewsDialogOpen] = useState(false)

    // Use news summary from props (batch loaded from parent)
    const totalNewsCount = newsSummary?.totalNewsCount ?? 0
    const activeNewsCount = newsSummary?.activeNewsCount ?? 0
    const totalInstallmentsExcluded = newsSummary?.totalInstallmentsExcluded ?? 0
    const skippedDatesCount = newsSummary?.skippedDatesCount ?? 0

    const getStatusBadge = (status: string, archived: boolean) => {
        if (archived) {
            return (
                <Badge className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1">
                    <Archive className="h-3 w-3" />
                    <span>Archivado</span>
                </Badge>
            )
        }

        switch (status) {
            case "ACTIVE":
                return (
                    <Badge className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Activo</span>
                    </Badge>
                )
            case "COMPLETED":
                return (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Finalizado</span>
                    </Badge>
                )
            case "RESTARTED_BY_DEFAULT":
                return (
                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>Reiniciado por mora</span>
                    </Badge>
                )
            case "COMPLETED_BY_THEFT":
                return (
                    <Badge className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        <span>Finalizado por Robo</span>
                    </Badge>
                )
            case "COMPLETED_BY_PROSECUTOR":
                return (
                    <Badge className="bg-purple-500 hover:bg-purple-600 text-white flex items-center gap-1">
                        <Gavel className="h-3 w-3" />
                        <span>Finalizado por fiscalía</span>
                    </Badge>
                )
            case "IMMOBILIZED_BY_TRAFFIC":
                return (
                    <Badge className="bg-indigo-500 hover:bg-indigo-600 text-white flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        <span>Inmovilizado por tránsito</span>
                    </Badge>
                )
            case "DEFAULTED":
                return (
                    <Badge className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-1">
                        <XCircle className="h-3 w-3" />
                        <span>Incumplido</span>
                    </Badge>
                )
            case "PENDING":
                return (
                    <Badge className="bg-gray-500 hover:bg-gray-600 text-white flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>Pendiente</span>
                    </Badge>
                )
            default:
                return <Badge>{status}</Badge>
        }
    }

    const getPaymentFrequencyText = (frequency: string) => {
        switch (frequency) {
            case "DAILY":
                return "Diario"
            case "WEEKLY":
                return "Semanal"
            case "BIWEEKLY":
                return "Quincenal"
            case "MONTHLY":
                return "Mensual"
            default:
                return frequency
        }
    }

    const getVehicleStatusBadge = (status?: string) => {
        if (!status) return null

        switch (status) {
            case "IN_CIRCULATION":
                return (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white flex items-center justify-center gap-1 text-xs">
                        <Navigation className="h-3 w-3" />
                        <span>En circulación</span>
                    </Badge>
                )
            case "IN_WORKSHOP":
                return (
                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center gap-1 text-xs">
                        <Wrench className="h-3 w-3" />
                        <span>En taller</span>
                    </Badge>
                )
            case "SEIZED_BY_PROSECUTOR":
                return (
                    <Badge className="bg-red-500 hover:bg-red-600 text-white flex items-center justify-center gap-1 text-xs">
                        <Gavel className="h-3 w-3" />
                        <span>Incautado</span>
                    </Badge>
                )
            default:
                return <Badge variant="outline" className="text-xs flex items-center justify-center">{status}</Badge>
        }
    }

    return (
        <TableRow
            key={`loan-row-${loan.id}-${index}`}
            className={cn(
                "border-border hover:bg-muted/50",
                loan.archived && "bg-amber-50/30 dark:bg-amber-950/10",
            )}
        >
            <TableCell>
                <div className="font-medium flex items-center gap-1.5">
                    <User className="h-4 w-4 text-primary" />
                    {loan.user.name}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Hash className="h-3 w-3" />
                    {loan.user.identification}
                </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5">
                        <Bike className="h-4 w-4 text-primary" />
                        {loan.vehicle?.model || loan.motorcycle?.model || "Sin modelo"}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {loan.vehicle?.plate || loan.motorcycle?.plate || "Sin placa"}
                    </div>
                </div>
            </TableCell>
            <TableCell className="hidden lg:table-cell">
                {getVehicleStatusBadge(loan.vehicle?.status || loan.motorcycle?.status)}
            </TableCell>
            {/* Novedades Column */}
            <TableCell className="hidden lg:table-cell">
                <LoanActiveNewsDialog
                    loanId={loan.id}
                    vehicleInfo={`${loan.vehicle?.model || loan.motorcycle?.model} - ${loan.vehicle?.plate || loan.motorcycle?.plate}`}
                >
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`h-8 px-2 gap-1.5 ${totalNewsCount > 0 ? "hover:bg-amber-500/10" : "hover:bg-muted"}`}
                                >
                                    <Newspaper className={`h-4 w-4 ${totalNewsCount > 0 ? "text-amber-500" : "text-muted-foreground"}`} />
                                    {totalNewsCount > 0 ? (
                                        <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-xs">
                                            {totalNewsCount}
                                        </Badge>
                                    ) : (
                                        <span className="text-muted-foreground text-xs">0</span>
                                    )}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {totalNewsCount > 0 ? (
                                    <>
                                        <p>{totalNewsCount} {totalNewsCount === 1 ? "novedad" : "novedades"}</p>
                                        {activeNewsCount > 0 && (
                                            <p className="text-green-500">{activeNewsCount} activas</p>
                                        )}
                                        {totalInstallmentsExcluded > 0 && (
                                            <p className="text-amber-500">{totalInstallmentsExcluded} cuotas excluidas</p>
                                        )}
                                        {skippedDatesCount > 0 && (
                                            <p className="text-blue-500">{skippedDatesCount} fechas excluidas</p>
                                        )}
                                    </>
                                ) : (
                                    <p>Sin novedades</p>
                                )}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </LoanActiveNewsDialog>
            </TableCell>
            <TableCell className="hidden xl:table-cell">
                {(() => {
                    const archivedCount = loan.vehicle?.archivedLoansCount || loan.motorcycle?.archivedLoansCount || 0
                    const vehicleId = loan.vehicle?.id || loan.motorcycle?.id || ""
                    const vehicleInfo = `${loan.vehicle?.model || loan.motorcycle?.model} - ${loan.vehicle?.plate || loan.motorcycle?.plate}`
                    
                    if (archivedCount === 0) {
                        return (
                            <Badge variant="destructive" className="flex items-center justify-center gap-1 text-xs">
                                <XCircle className="h-3 w-3" />
                                <span>NO</span>
                            </Badge>
                        )
                    }
                    return (
                        <ArchivedLoansDialog vehicleId={vehicleId} vehicleInfo={vehicleInfo}>
                            <Badge className="bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center gap-1 text-xs cursor-pointer transition-colors">
                                <Archive className="h-3 w-3" />
                                <span>{archivedCount}</span>
                            </Badge>
                        </ArchivedLoansDialog>
                    )
                })()}
            </TableCell>
            <TableCell className="hidden md:table-cell font-medium">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <DollarSign className="h-4 w-4" />
                    {formatCurrency(loan.totalAmount)}
                </div>
                <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                    <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {getPaymentFrequencyText(loan.paymentFrequency || "DAILY")}
                    </div>
                    {loan.downPayment > 0 && (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <DollarSign className="h-3 w-3" />
                            Inicial: {formatCurrency(loan.downPayment)}
                        </div>
                    )}
                </div>
            </TableCell>
            <TableCell className="hidden lg:table-cell">
                {(() => {
                    // Calculate installments covered by downpayment
                    const dailyRate = (loan.installmentPaymentAmmount || 0) + (loan.gpsInstallmentPayment || 0)
                    const downPaymentInstallments = loan.downPayment > 0 && dailyRate > 0 
                        ? Math.floor(loan.downPayment / dailyRate) 
                        : 0
                    // Total effective paid = actual payments + downpayment coverage
                    const effectivePaidInstallments = Number(loan.paidInstallments) + downPaymentInstallments
                    const progressPercentage = loan.installments > 0 
                        ? Math.min((effectivePaidInstallments / loan.installments) * 100, 100) 
                        : 0
                    
                    return (
                        <>
                            <div className="flex items-center gap-2">
                                <div className="text-sm flex items-center gap-1.5">
                                    <CalendarDays className="h-4 w-4 text-primary" />
                                    <span className="font-medium">
                                        {effectivePaidInstallments.toFixed(2)} / {Number(loan.installments).toFixed(0)}
                                    </span>
                                </div>
                            </div>
                            {loan.downPayment > 0 && dailyRate > 0 && (
                                <div className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                                    Inicial: {downPaymentInstallments} cuotas cubiertas
                                </div>
                            )}
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-1.5">
                                <div
                                    className={cn(
                                        "h-full rounded-full transition-all",
                                        loan.status === "COMPLETED" ? "bg-green-500" : loan.status === "DEFAULTED" ? "bg-red-500" : "bg-primary",
                                    )}
                                    style={{
                                        width: `${progressPercentage}%`,
                                    }}
                                />
                            </div>
                        </>
                    )
                })()}
            </TableCell>
            <TableCell className="hidden lg:table-cell font-medium">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <DollarSign className="h-4 w-4" />
                    {formatCurrency(loan.totalPaid)}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Percent className="h-3 w-3" />
                    {(() => {
                        const financedAmount = loan.totalAmount - (loan.downPayment || 0)
                        const percentage = financedAmount > 0 ? ((loan.totalPaid / financedAmount) * 100) : 0
                        return `${percentage.toFixed(1)}% del monto financiado`
                    })()}
                </div>
            </TableCell>
            <TableCell className="hidden xl:table-cell">
                {(() => {
                    const coverageDate = calculateDownpaymentCoverageDate(loan.startDate, loan.paidInstallments)
                    
                    if (!coverageDate) {
                        return (
                            <div className="text-sm text-muted-foreground italic">
                                Sin inicial
                            </div>
                        )
                    }

                    const isInFuture = coverageDate > new Date()
                    
                    // Calculate base days and skipped days
                    const totalDaysCovered = Math.floor(loan.paidInstallments)
                    const skippedDaysCount = newsSummary?.skippedDatesCount ?? 0
                    const baseDays = totalDaysCovered - skippedDaysCount
                    
                    return (
                        <div className="space-y-1">
                            <div className={cn(
                                "flex items-center gap-1.5 font-medium text-sm",
                                isInFuture ? "text-emerald-600 dark:text-emerald-400" : "text-orange-600 dark:text-orange-400"
                            )}>
                                <CalendarIcon className="h-4 w-4" />
                                <span>{formatDate(coverageDate, 'd MMM yyyy')}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Hash className="h-3 w-3" />
                                    <span>Total: {totalDaysCovered} {totalDaysCovered === 1 ? 'día' : 'días'}</span>
                                </div>
                                {skippedDaysCount > 0 && (
                                    <div className="text-[10px] text-amber-600 dark:text-amber-400 ml-4 mt-0.5">
                                        ({baseDays} {baseDays === 1 ? 'día' : 'días'} base, +{skippedDaysCount} por novedades)
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })()}
            </TableCell>
            <TableCell className="hidden xl:table-cell">
                <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-primary">
                        <CalendarIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                            {loan.startDate ? formatDate(loan.startDate.split('T')[0], 'd MMM yyyy') : 'No establecida'}
                        </span>
                    </div>
                    {loan.endDate && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <CalendarIcon className="h-4 w-4" />
                            <span className="text-sm font-medium">
                                {formatDate(loan.endDate.split('T')[0], 'd MMM yyyy')}
                            </span>
                        </div>
                    )}
                </div>
            </TableCell>
            <TableCell className="hidden xl:table-cell font-medium">
                <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                    <Wallet className="h-4 w-4" />
                    {formatCurrency(loan.debtRemaining)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                    {(() => {
                        const partialDebt = calculatePartialInstallmentDebt(
                            loan.remainingInstallments || 0,
                            loan.installmentPaymentAmmount || 0
                        )
                        
                        if (partialDebt.fullInstallments > 0 && partialDebt.partialInstallmentAmount > 0) {
                            return (
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-1">
                                        <Percent className="h-3 w-3" />
                                        {partialDebt.fullInstallments} cuotas + {partialDebt.partialInstallmentPercentage.toFixed(0)}%
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                                        ({formatCurrency(partialDebt.partialInstallmentAmount)} parcial)
                                    </div>
                                </div>
                            )
                        } else if (partialDebt.partialInstallmentAmount > 0 && partialDebt.fullInstallments === 0) {
                            return (
                                <div className="flex items-center gap-1">
                                    <Percent className="h-3 w-3" />
                                    {partialDebt.partialInstallmentPercentage.toFixed(0)}% de cuota ({formatCurrency(partialDebt.partialInstallmentAmount)})
                                </div>
                            )
                        } else {
                            return (
                                <div className="flex items-center gap-1">
                                    <Percent className="h-3 w-3" />
                                    {partialDebt.fullInstallments} cuotas
                                </div>
                            )
                        }
                    })()}
                </div>
            </TableCell>
            <TableCell>{getStatusBadge(loan.status, loan.archived)}</TableCell>
            <TableCell className="text-right">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 p-0"
                        >
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Abrir menú</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        {/* View details - available if has any contract permission */}
                        {contractPermissions.hasAnyAccess && (
                            <LoanDetails loanId={loan.id} loanData={loan}>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver detalles
                                </DropdownMenuItem>
                            </LoanDetails>
                        )}

                        {/* Register payment - requires INSTALLMENT.CREATE and loan not archived */}
                        {!loan.archived && installmentPermissions.canCreate && (
                            <InstallmentForm loanId={loan.id}>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Registrar pago
                                </DropdownMenuItem>
                            </InstallmentForm>
                        )}

                        {/* Generate contract - requires CONTRACT.CREATE */}
                        {contractPermissions.canCreate && (
                            <DropdownMenuItem onClick={() => onPrintContract(loan)}>
                                <Printer className="mr-2 h-4 w-4" />
                                Generar contrato
                            </DropdownMenuItem>
                        )}

                        {/* View active news */}
                        <DropdownMenuItem onSelect={() => setNewsDialogOpen(true)}>
                            <Newspaper className="mr-2 h-4 w-4" />
                            Ver novedades
                            {totalNewsCount > 0 && (
                                <Badge variant="secondary" className="ml-auto text-xs bg-amber-500/20 text-amber-500">
                                    {totalNewsCount}
                                </Badge>
                            )}
                        </DropdownMenuItem>

                        {/* Edit loan - requires CONTRACT.EDIT and loan not archived */}
                        {!loan.archived && contractPermissions.canEdit && (
                            <>
                                <DropdownMenuSeparator />
                                <LoanForm loanId={loan.id} loanData={loan} onSaved={onStatusUpdated}>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar contrato
                                    </DropdownMenuItem>
                                </LoanForm>
                                
                                {/* Update vehicle status */}
                                {(loan.vehicle || loan.motorcycle) && (
                                    <UpdateVehicleStatusDialog
                                        vehicleId={loan.vehicle?.id || loan.motorcycle?.id || ""}
                                        currentStatus={loan.vehicle?.status || loan.motorcycle?.status || "IN_CIRCULATION"}
                                        vehicleInfo={`${loan.vehicle?.model || loan.motorcycle?.model} - ${loan.vehicle?.plate || loan.motorcycle?.plate}`}
                                        onStatusUpdated={onStatusUpdated}
                                    >
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            <Activity className="mr-2 h-4 w-4" />
                                            Actualizar estado vehículo
                                        </DropdownMenuItem>
                                    </UpdateVehicleStatusDialog>
                                )}
                                
                                {/* Change loan status */}
                                <ChangeLoanStatusDialog
                                    loanId={loan.id}
                                    currentStatus={loan.status}
                                    onStatusChanged={onStatusUpdated || (() => {})}
                                >
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Cambiar estado contrato
                                    </DropdownMenuItem>
                                </ChangeLoanStatusDialog>
                            </>
                        )}

                        {/* Archive/Unarchive - requires CONTRACT.EDIT */}
                        {contractPermissions.canEdit && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => onArchive(loan.id, loan.archived)}>
                                    {loan.archived ? (
                                        <>
                                            <ArchiveRestore className="mr-2 h-4 w-4" />
                                            Desarchivar
                                        </>
                                    ) : (
                                        <>
                                            <Archive className="mr-2 h-4 w-4" />
                                            Archivar
                                        </>
                                    )}
                                </DropdownMenuItem>
                            </>
                        )}

                        {/* Delete - requires CONTRACT.DELETE */}
                        {contractPermissions.canDelete && (
                            <DropdownMenuItem
                                onClick={() => onDelete(loan.id)}
                                className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                            </DropdownMenuItem>
                        )}

                        {/* Show message if user has no permissions */}
                        {!contractPermissions.hasAnyAccess && !installmentPermissions.hasAnyAccess && (
                            <DropdownMenuItem disabled>
                                <AlertCircle className="mr-2 h-4 w-4" />
                                Sin permisos disponibles
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>

            {/* Controlled News Dialog for dropdown menu */}
            <LoanActiveNewsDialog
                loanId={loan.id}
                vehicleInfo={`${loan.vehicle?.model || loan.motorcycle?.model} - ${loan.vehicle?.plate || loan.motorcycle?.plate}`}
                open={newsDialogOpen}
                onOpenChange={setNewsDialogOpen}
            />
        </TableRow>
    )
}
