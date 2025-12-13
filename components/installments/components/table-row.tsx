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
    // Use currentDaysBehind from API if available (shows CURRENT loan status with fractional precision)
    // Otherwise fall back to calculating from latePaymentDate (legacy behavior)
    const calculateDays = () => {
        // If the API provides currentDaysBehind, use it directly - it's already accurate with fractional values
        // Negative = ahead, Positive = behind, Zero = up to date
        if (typeof (installment as any).currentDaysBehind === 'number') {
            console.log('📊 Using currentDaysBehind from API:', (installment as any).currentDaysBehind, 'for loan:', installment.loanId);
            return (installment as any).currentDaysBehind;
        }

        console.log('⚠️ No currentDaysBehind, using fallback calculation for installment:', installment.id);
        
        // Fallback to old calculation if currentDaysBehind not available
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        if (installment.isLate && installment.latePaymentDate) {
            const dueDate = new Date(installment.latePaymentDate)
            dueDate.setHours(0, 0, 0, 0)
            const diffTime = today.getTime() - dueDate.getTime()
            const diffDays = diffTime / (1000 * 60 * 60 * 24)
            return diffDays // Positive for late
        } else if (installment.advancePaymentDate) {
            const advanceDate = new Date(installment.advancePaymentDate)
            advanceDate.setHours(0, 0, 0, 0)
            const diffTime = advanceDate.getTime() - today.getTime()
            const diffDays = diffTime / (1000 * 60 * 60 * 24)
            return -diffDays // Negative for advance
        }
        return 0 // On time
    }

    const days = calculateDays()
    console.log('📍 Final days value for row:', days, 'installment:', installment.id)

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
                {/* Show the last covered date: advancePaymentDate is the coverage end date */}
                {installment.advancePaymentDate ? (
                    <div className={`flex items-center font-medium ${
                        days < 0 ? 'text-blue-400' : days > 0 ? 'text-red-400' : 'text-green-400'
                    }`}>
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatSpanishDate(installment.advancePaymentDate)}
                    </div>
                ) : installment.isLate && installment.latePaymentDate ? (
                    <div className="flex items-center text-red-400 font-medium">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatSpanishDate(installment.latePaymentDate)}
                    </div>
                ) : (
                    <div className="flex items-center text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatSpanishDate(installment.paymentDate)}
                    </div>
                )}
            </TableCell>
            <TableCell className="hidden xl:table-cell text-center">
                {days !== 0 ? (
                    <div className={`flex items-center justify-center font-bold ${
                        days > 0 ? 'text-red-400' : 'text-blue-400'
                    }`}>
                        <Clock className="mr-2 h-4 w-4" />
                        {days > 0 ? `+${days.toFixed(1)}` : days.toFixed(1)}
                    </div>
                ) : (
                    <div className="flex items-center justify-center text-muted-foreground">
                        <Clock className="mr-2 h-4 w-4" />
                        0
                    </div>
                )}
            </TableCell>
            <TableCell className="text-foreground">
                <div className="flex items-center whitespace-nowrap">
                    {getIcon(installment.paymentMethod)}
                    {getPaymentMethodLabel(installment.paymentMethod)}
                </div>
            </TableCell>
            <TableCell className="text-center">
                {(() => {
                    // Use the calculated days value for consistent status display
                    // days < 0 = ahead/advance, days > 0 = behind/late, days ≈ 0 = on time
                    
                    if (days < -0.01) {
                        // Paid ahead / advance (more than 0.01 days ahead)
                        return (
                            <Badge
                                variant="default"
                                className="bg-blue-500/80 hover:bg-blue-500/70 inline-flex items-center justify-center gap-1 px-2.5 py-0.5 text-xs font-medium"
                            >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                <span>Adelantada</span>
                            </Badge>
                        )
                    } else if (days >= -0.01 && days <= 1.01) {
                        // On time (days between -0.01 and 1.01, within 1 day tolerance)
                        return (
                            <Badge
                                variant="default"
                                className="bg-green-500/80 hover:bg-green-500/70 inline-flex items-center justify-center gap-1 px-2.5 py-0.5 text-xs font-medium"
                            >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                <span>Al día</span>
                            </Badge>
                        )
                    } else {
                        // Behind / late (owes more than 1 day)
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
