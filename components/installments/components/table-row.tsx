"use client"

import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

import { User, Car, Calendar, AlertTriangle, CheckCircle2, StickyNote, Clock } from 'lucide-react'
import { CreditCard, FileText } from 'lucide-react'
import { getPaymentMethodIcon, formatSpanishDate, getPaymentMethodLabel } from "../utils/format"
import { ActionsMenu } from "./actions"
import { NoteDisplay } from "./dialogs/note-display"
import { Installment } from "@/lib/types"

interface InstallmentRowProps {
    installment: Installment
    onViewDetails?: (installment: Installment) => void
    onViewAttachment: (installment: Installment) => void
    onSendWhatsapp: (installment: Installment) => void
    onPrint: (installment: Installment) => void
    onEdit: (installment: Installment) => void
    onDelete: (installment: Installment) => void
    onViewNotes?: (notes: string) => void
}

export function InstallmentRow({
    installment,
    onViewDetails,
    onViewAttachment,
    onSendWhatsapp,
    onPrint,
    onEdit,
    onDelete,
    onViewNotes,
}: InstallmentRowProps) {
    const getIcon = (method: string) => {
        const iconName = getPaymentMethodIcon(method)
        switch (iconName) {
            case "Banknote":
                return <FileText className="mr-2 h-4 w-4 text-green-400" />
            case "CreditCard":
                return <CreditCard className="mr-2 h-4 w-4 text-blue-400" />
            case "FileText":
                return <FileText className="mr-2 h-4 w-4 text-purple-400" />
            default:
                return null
        }
    }

    // Calculate days difference for late or advance payments
    // PRIORITY: Use stored backend data (daysBehind, daysAhead) if available
    // BACKFILL: Calculate from dates if backend data doesn't exist yet
    const calculateDays = () => {
        // Use stored backend data if available (new installments)
        if (installment.daysBehind !== undefined && installment.daysBehind !== null) {
            return installment.daysBehind; // Positive for behind
        }
        if (installment.daysAhead !== undefined && installment.daysAhead !== null) {
            return -installment.daysAhead; // Negative for ahead (for compatibility with old logic)
        }
        if (installment.isUpToDate) {
            return 0; // Exactly up to date
        }
        
        // BACKFILL: Calculate from dates for old installments
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        // For late payments, calculate days late based on latePaymentDate
        if (installment.isLate && installment.latePaymentDate) {
            const dueDate = new Date(installment.latePaymentDate)
            dueDate.setHours(0, 0, 0, 0)
            const diffTime = today.getTime() - dueDate.getTime()
            const diffDays = diffTime / (1000 * 60 * 60 * 24)
            return diffDays // Positive for late
        } 
        // For advance payments, calculate days ahead based on advancePaymentDate
        else if (installment.isAdvance && installment.advancePaymentDate) {
            const advanceDate = new Date(installment.advancePaymentDate)
            advanceDate.setHours(0, 0, 0, 0)
            const diffTime = advanceDate.getTime() - today.getTime()
            const diffDays = diffTime / (1000 * 60 * 60 * 24)
            return -diffDays // Negative for advance
        }
        
        return 0 // On time
    }

    const days = calculateDays()

    return (
        <TableRow className="border-border hover:bg-muted/50 transition-colors duration-150">
            <TableCell className="font-medium text-foreground">
                <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    {installment.loan.user.name}
                </div>
            </TableCell>
            <TableCell className="hidden md:table-cell text-muted-foreground">
                <div className="flex items-center">
                    <Car className="mr-2 h-4 w-4 text-muted-foreground" />
                    {installment.loan.vehicle?.model || installment.loan.motorcycle?.model || "—"}
                </div>
            </TableCell>
            <TableCell className="hidden md:table-cell text-muted-foreground">
                <div className="flex items-center">
                    <Car className="mr-2 h-4 w-4 text-muted-foreground" />
                    {installment.loan.vehicle?.plate || installment.loan.motorcycle?.plate || "—"}
                </div>
            </TableCell>
            <TableCell className="text-foreground font-medium">
                <div className="flex items-center">
                    <span className="mr-1 text-xs font-semibold text-green-400">COP</span>
                    {formatCurrency(installment.amount)}
                </div>
            </TableCell>
            <TableCell className="text-foreground font-medium">
                <div className="flex items-center">
                    <span className="mr-1 text-xs font-semibold text-yellow-400">COP</span>
                    {formatCurrency(installment.gps)}
                </div>
            </TableCell>
            <TableCell className="hidden md:table-cell text-foreground">
                <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    {formatSpanishDate(installment.paymentDate)}
                </div>
            </TableCell>
            <TableCell className="hidden lg:table-cell text-foreground">
                {(() => {
                    // Determine which date to display first
                    const displayDate = installment.advancePaymentDate 
                        ? installment.advancePaymentDate
                        : (installment.isLate && installment.latePaymentDate)
                            ? installment.latePaymentDate
                            : installment.paymentDate;
                    
                    // Determine the color based on stored payment status
                    let dateColor = 'text-green-400'; // Default: up to date
                    
                    // PRIORITY 1: Use stored backend status if available
                    if (installment.isUpToDate) {
                        dateColor = 'text-green-400'; // Exactly up to date
                    } else if (installment.daysAhead !== undefined && installment.daysAhead !== null && installment.daysAhead > 0) {
                        dateColor = 'text-blue-400'; // Ahead
                    } else if (installment.daysBehind !== undefined && installment.daysBehind !== null && installment.daysBehind > 0) {
                        dateColor = 'text-red-400'; // Behind
                    }
                    // BACKFILL: For latest installment without stored status, check debt
                    else if (installment.isLatestInstallment) {
                        if (installment.exactInstallmentsOwed !== undefined && installment.exactInstallmentsOwed > 0) {
                            dateColor = 'text-red-400'; // Still has debt
                        } else {
                            dateColor = 'text-green-400'; // Paid up
                        }
                    }
                    // BACKFILL: Historical installments use original status
                    else if (installment.isLate) {
                        dateColor = 'text-red-400';
                    } 
                    else if (installment.isAdvance) {
                        dateColor = 'text-blue-400';
                    }
                    
                    return (
                        <div className={`flex items-center font-medium ${dateColor}`}>
                            <Calendar className="mr-2 h-4 w-4" />
                            {formatSpanishDate(displayDate)}
                        </div>
                    );
                })()}
            </TableCell>
            <TableCell className="hidden xl:table-cell text-center">
                {/* Display payment status using stored backend data with backfill */}
                {(() => {
                    // PRIORITY 1: Use stored backend status if available (new installments)
                    if (installment.isUpToDate) {
                        // Exactly up to date - no debt
                        return (
                            <div className="flex items-center justify-center text-green-400 font-bold">
                                <Clock className="mr-2 h-4 w-4" />
                                0
                            </div>
                        );
                    }
                    
                    if (installment.daysAhead !== undefined && installment.daysAhead !== null && installment.daysAhead > 0) {
                        // Ahead - show negative (blue)
                        return (
                            <div className="flex items-center justify-center font-bold text-blue-400">
                                <Clock className="mr-2 h-4 w-4" />
                                {(-installment.daysAhead).toFixed(1)}
                            </div>
                        );
                    }
                    
                    if (installment.daysBehind !== undefined && installment.daysBehind !== null && installment.daysBehind > 0) {
                        // Behind - show positive (red) with amount
                        const storedAmount = installment.remainingAmountOwed || 0;
                        return (
                            <div className="flex flex-col items-center justify-center">
                                <div className="flex items-center justify-center font-bold text-red-400">
                                    <Clock className="mr-1 h-4 w-4" />
                                    +{Number(installment.daysBehind.toFixed(2))}
                                </div>
                                {storedAmount > 0 && (
                                    <div className="text-xs text-red-400/70 mt-1">
                                        {formatCurrency(storedAmount)}
                                    </div>
                                )}
                            </div>
                        );
                    }
                    
                    // BACKFILL: Use stored snapshot from database (old logic)
                    const storedDebt = installment.exactInstallmentsOwed || 0;
                    const storedAmount = installment.remainingAmountOwed || 0;
                    
                    // Latest installment: show current debt (updated dynamically)
                    if (installment.isLatestInstallment) {
                        if (storedDebt > 0) {
                            return (
                                <div className="flex flex-col items-center justify-center">
                                    <div className="flex items-center justify-center font-bold text-red-400">
                                        <Clock className="mr-1 h-4 w-4" />
                                        +{Number(storedDebt.toFixed(2))}
                                    </div>
                                    <div className="text-xs text-red-400/70 mt-1">
                                        {formatCurrency(storedAmount)}
                                    </div>
                                </div>
                            );
                        } else {
                            // No debt - show 0 in green
                            return (
                                <div className="flex items-center justify-center text-green-400 font-bold">
                                    <Clock className="mr-2 h-4 w-4" />
                                    0
                                </div>
                            );
                        }
                    }
                    
                    // Historical installment: show stored snapshot (immutable)
                    if (storedDebt > 0) {
                        return (
                            <div className="flex flex-col items-center justify-center">
                                <div className="flex items-center justify-center font-bold text-red-400">
                                    <Clock className="mr-1 h-4 w-4" />
                                    +{Number(storedDebt.toFixed(2))}
                                </div>
                                <div className="text-xs text-red-400/70 mt-1">
                                    {formatCurrency(storedAmount)}
                                </div>
                            </div>
                        );
                    }
                    
                    // Historical with no debt - check if advance
                    if (days < 0) {
                        return (
                            <div className="flex items-center justify-center font-bold text-blue-400">
                                <Clock className="mr-2 h-4 w-4" />
                                {days.toFixed(1)}
                            </div>
                        );
                    }
                    
                    // Historical on-time payment
                    return (
                        <div className="flex items-center justify-center text-green-400 font-bold">
                            <Clock className="mr-2 h-4 w-4" />
                            0
                        </div>
                    );
                })()}
            </TableCell>
            <TableCell className="text-foreground">
                <div className="flex items-center whitespace-nowrap">
                    {getIcon(installment.paymentMethod)}
                    {getPaymentMethodLabel(installment.paymentMethod)}
                </div>
            </TableCell>
            <TableCell className="text-center">
                {(() => {
                    // PRIORITY 1: Use stored backend status if available (new installments)
                    if (installment.isUpToDate) {
                        return (
                            <Badge
                                variant="default"
                                className="bg-green-500/80 hover:bg-green-500/70 inline-flex items-center justify-center gap-1 px-2.5 py-0.5 text-xs font-medium"
                            >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                <span>Al día</span>
                            </Badge>
                        )
                    }
                    
                    if (installment.daysAhead !== undefined && installment.daysAhead !== null && installment.daysAhead > 0) {
                        return (
                            <Badge
                                variant="default"
                                className="bg-blue-500/80 hover:bg-blue-500/70 inline-flex items-center justify-center gap-1 px-2.5 py-0.5 text-xs font-medium"
                            >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                <span>Adelantada</span>
                            </Badge>
                        )
                    }
                    
                    if (installment.daysBehind !== undefined && installment.daysBehind !== null && installment.daysBehind > 0) {
                        return (
                            <Badge
                                variant="destructive"
                                className="bg-red-500/80 hover:bg-red-500/70 inline-flex items-center justify-center gap-1 px-2.5 py-0.5 text-xs font-medium"
                            >
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                <span>Atrasada</span>
                            </Badge>
                        )
                    }
                    
                    // BACKFILL: For latest installment without stored status, check debt
                    if (installment.isLatestInstallment) {
                        if (installment.exactInstallmentsOwed !== undefined && installment.exactInstallmentsOwed > 0) {
                            return (
                                <Badge
                                    variant="destructive"
                                    className="bg-red-500/80 hover:bg-red-500/70 inline-flex items-center justify-center gap-1 px-2.5 py-0.5 text-xs font-medium"
                                >
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    <span>Atrasada</span>
                                </Badge>
                            )
                        } else {
                            // Debt is cleared - show "Al día" even if payment was late
                            return (
                                <Badge
                                    variant="default"
                                    className="bg-green-500/80 hover:bg-green-500/70 inline-flex items-center justify-center gap-1 px-2.5 py-0.5 text-xs font-medium"
                                >
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    <span>Al día</span>
                                </Badge>
                            )
                        }
                    }
                    // BACKFILL: Historical installments keep their original status
                    // If this installment was marked as late, keep it as "Atrasada"
                    else if (installment.isLate) {
                        return (
                            <Badge
                                variant="destructive"
                                className="bg-red-500/80 hover:bg-red-500/70 inline-flex items-center justify-center gap-1 px-2.5 py-0.5 text-xs font-medium"
                            >
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                <span>Atrasada</span>
                            </Badge>
                        )
                    } 
                    // If this installment was marked as advance, keep it as "Adelantada"
                    else if (installment.isAdvance) {
                        return (
                            <Badge
                                variant="default"
                                className="bg-blue-500/80 hover:bg-blue-500/70 inline-flex items-center justify-center gap-1 px-2.5 py-0.5 text-xs font-medium"
                            >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                <span>Adelantada</span>
                            </Badge>
                        )
                    }
                    // Historical installment that was on time: keep as "Al día"
                    else {
                        return (
                            <Badge
                                variant="default"
                                className="bg-green-500/80 hover:bg-green-500/70 inline-flex items-center justify-center gap-1 px-2.5 py-0.5 text-xs font-medium"
                            >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                <span>Al día</span>
                            </Badge>
                        )
                    }
                })()}
            </TableCell>
            <TableCell className="hidden md:table-cell text-foreground">
                <div className="flex items-center">
                    <StickyNote className="mr-2 h-4 w-4 text-muted-foreground" />
                    <NoteDisplay
                        notes={installment.notes || ""}
                        maxLength={30}
                        onViewMore={() => onViewNotes && onViewNotes(installment.notes || "")}
                    />
                </div>
            </TableCell>
            <TableCell className="text-foreground">
                <div className="flex items-center">
                    <User className="mr-2 h-4 w-4 text-blue-400" />
                    {installment.createdBy?.name ?? "—"}
                </div>
            </TableCell>
            <TableCell className="text-right">
                <ActionsMenu
                    installment={installment}
                    onViewDetails={onViewDetails}
                    onViewAttachment={onViewAttachment}
                    onSendWhatsapp={onSendWhatsapp}
                    onPrint={onPrint}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </TableCell>
        </TableRow>
    )
}
