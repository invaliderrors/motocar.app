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
    // Each installment should display its OWN status (isLate, isAdvance) as it was when created
    // NOT the currentDaysBehind which represents the CURRENT loan status (only valid for most recent installment)
    const calculateDays = () => {
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
                {/* Show current status for most recent installment if they owe money */}
                {installment.isLatestInstallment && installment.exactInstallmentsOwed !== undefined && installment.exactInstallmentsOwed > 0 ? (
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex items-center justify-center font-bold text-red-400">
                            <Clock className="mr-1 h-4 w-4" />
                            +{Number(installment.exactInstallmentsOwed.toFixed(2))}
                        </div>
                        <div className="text-xs text-red-400/70 mt-1">
                            {formatCurrency(installment.remainingAmountOwed || 0)}
                        </div>
                    </div>
                ) : days !== 0 ? (
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
                    // Display the status based on the installment's own flags (as it was when created)
                    // isAdvance = payment covered days ahead (blue badge)
                    // isLate = payment was made late (red badge)  
                    // neither = payment was on time (green badge)
                    
                    if (installment.isAdvance && installment.advancePaymentDate) {
                        // Paid ahead / advance
                        return (
                            <Badge
                                variant="default"
                                className="bg-blue-500/80 hover:bg-blue-500/70 inline-flex items-center justify-center gap-1 px-2.5 py-0.5 text-xs font-medium"
                            >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                <span>Adelantada</span>
                            </Badge>
                        )
                    } else if (installment.isLate && installment.latePaymentDate) {
                        // Behind / late
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
                        // On time
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
