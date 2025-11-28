"use client"

import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/lib/utils"

import { User, Car, DollarSign, BadgeCent, Calendar, AlertTriangle, CheckCircle2, StickyNote, Clock } from 'lucide-react'
import { CreditCard, FileText } from 'lucide-react'
import { getPaymentMethodIcon, formatSpanishDate, getPaymentMethodLabel } from "../utils/format"
import { ActionsMenu } from "./actions"
import { NoteDisplay } from "./dialogs/note-display"
import { Installment } from "@/lib/types"

interface InstallmentRowProps {
    installment: Installment
    onViewAttachment: (installment: Installment) => void
    onSendWhatsapp: (installment: Installment) => void
    onPrint: (installment: Installment) => void
    onEdit: (installment: Installment) => void
    onDelete: (installment: Installment) => void
    onViewNotes?: (notes: string) => void
}

export function InstallmentRow({
    installment,
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
    const calculateDays = () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        if (installment.isLate && installment.latePaymentDate) {
            const dueDate = new Date(installment.latePaymentDate)
            dueDate.setHours(0, 0, 0, 0)
            const diffTime = today.getTime() - dueDate.getTime()
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
            return diffDays // Positive for late
        } else if (installment.advancePaymentDate) {
            const advanceDate = new Date(installment.advancePaymentDate)
            advanceDate.setHours(0, 0, 0, 0)
            const diffTime = advanceDate.getTime() - today.getTime()
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
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
                    <DollarSign className="mr-1 h-4 w-4 text-green-400" />
                    {formatCurrency(installment.amount)}
                </div>
            </TableCell>
            <TableCell className="text-foreground font-medium">
                <div className="flex items-center">
                    <BadgeCent className="mr-1 h-4 w-4 text-yellow-400" />
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
                {installment.isLate && installment.latePaymentDate ? (
                    <div className="flex items-center text-red-400 font-medium">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatSpanishDate(installment.latePaymentDate)}
                    </div>
                ) : installment.advancePaymentDate ? (
                    <div className="flex items-center text-blue-400 font-medium">
                        <Calendar className="mr-2 h-4 w-4" />
                        {formatSpanishDate(installment.advancePaymentDate)}
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
                        {days > 0 ? `+${days}` : days}
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
                    // Determine the effective status based on payment date and coverage
                    // If late payment has advancePaymentDate, it means the payment covered late days AND put client ahead
                    const hasAdvance = !!installment.advancePaymentDate
                    
                    // Calculate if the payment brought the client up to date or ahead
                    // by comparing the coverage end date with today
                    const today = new Date()
                    today.setHours(0, 0, 0, 0)
                    
                    let effectiveStatus: 'late' | 'advance' | 'ontime' = 'ontime'
                    
                    if (installment.isLate) {
                        // Payment was for a late date
                        if (hasAdvance) {
                            // But it also put the client ahead - show as advance
                            const advanceDate = new Date(installment.advancePaymentDate!)
                            advanceDate.setHours(0, 0, 0, 0)
                            if (advanceDate >= today) {
                                effectiveStatus = 'advance'
                            } else {
                                // Advance date has passed, now effectively on time or late again
                                effectiveStatus = 'ontime'
                            }
                        } else if (installment.latePaymentDate) {
                            // Check if the late payment date is still in the past
                            const lateDate = new Date(installment.latePaymentDate)
                            lateDate.setHours(0, 0, 0, 0)
                            if (lateDate < today) {
                                effectiveStatus = 'late'
                            } else {
                                effectiveStatus = 'ontime'
                            }
                        } else {
                            effectiveStatus = 'late'
                        }
                    } else if (hasAdvance) {
                        const advanceDate = new Date(installment.advancePaymentDate!)
                        advanceDate.setHours(0, 0, 0, 0)
                        if (advanceDate >= today) {
                            effectiveStatus = 'advance'
                        } else {
                            effectiveStatus = 'ontime'
                        }
                    }
                    
                    if (effectiveStatus === 'late') {
                        return (
                            <Badge
                                variant="destructive"
                                className="bg-red-500/80 hover:bg-red-500/70 inline-flex items-center justify-center gap-1 px-2.5 py-0.5 text-xs font-medium"
                            >
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                <span>Atrasada</span>
                            </Badge>
                        )
                    } else if (effectiveStatus === 'advance') {
                        return (
                            <Badge
                                variant="default"
                                className="bg-blue-500/80 hover:bg-blue-500/70 inline-flex items-center justify-center gap-1 px-2.5 py-0.5 text-xs font-medium"
                            >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                <span>Adelantada</span>
                            </Badge>
                        )
                    } else {
                        return (
                            <Badge
                                variant="default"
                                className="bg-green-500/80 hover:bg-green-500/70 inline-flex items-center justify-center gap-1 px-2.5 py-0.5 text-xs font-medium"
                            >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                <span>A tiempo</span>
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
