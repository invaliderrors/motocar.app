"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency, formatDate } from "@/lib/utils"
import { Loan, Installment } from "@/lib/types"
import { Receipt, ChevronLeft, ChevronRight, MoreHorizontal, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaymentHistoryTableProps {
    payments: Loan["payments"]
    currentPage: number
    itemsPerPage: number
    onPageChange: (page: number) => void
    onViewPayment?: (payment: Installment) => void
}

export function PaymentHistoryTable({ 
    payments, 
    currentPage, 
    itemsPerPage, 
    onPageChange,
    onViewPayment
}: PaymentHistoryTableProps) {
    // Sort payments by date (most recent first)
    const sortedPayments = [...payments].sort(
        (a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
    )

    const totalPages = Math.ceil(sortedPayments.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentPayments = sortedPayments.slice(startIndex, endIndex)

    return (
        <Card className="overflow-hidden border-border/50 shadow-sm">
            <div className="px-4 py-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-amber-500" />
                    <h3 className="font-semibold text-sm">Historial de Pagos</h3>
                    <Badge variant="secondary" className="ml-auto text-xs">
                        {payments.length} pagos
                    </Badge>
                </div>
            </div>
            <CardContent className="p-0">
                {sortedPayments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Receipt className="h-12 w-12 text-muted-foreground/30 mb-3" />
                        <p className="text-muted-foreground font-medium">No hay pagos registrados</p>
                        <p className="text-sm text-muted-foreground/70">Los pagos aparecerán aquí una vez registrados</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                                        <TableHead className="font-semibold">Fecha</TableHead>
                                        <TableHead className="font-semibold">ID</TableHead>
                                        <TableHead className="font-semibold">Monto</TableHead>
                                        <TableHead className="font-semibold">Estado</TableHead>
                                        <TableHead className="font-semibold text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentPayments.map((payment, index) => (
                                        <TableRow 
                                            key={payment.id}
                                            className={cn(
                                                "transition-colors",
                                                index % 2 === 0 ? "bg-background" : "bg-muted/20"
                                            )}
                                        >
                                            <TableCell className="font-medium">
                                                {formatDate(payment.paymentDate.split("T")[0])}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs text-muted-foreground">
                                                {payment.id.slice(0, 8)}...
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {formatCurrency(payment.amount)}
                                            </TableCell>
                                            <TableCell>
                                                <PaymentStatusBadge isLate={payment.isLate} />
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 hover:bg-primary/10"
                                                    onClick={() => onViewPayment?.(payment)}
                                                    title="Ver detalles"
                                                >
                                                    <Eye className="h-4 w-4 text-primary" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        
                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 bg-muted/20">
                                <p className="text-sm text-muted-foreground">
                                    Mostrando {startIndex + 1} - {Math.min(endIndex, sortedPayments.length)} de {sortedPayments.length}
                                </p>
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onPageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    
                                    <PaginationNumbers
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={onPageChange}
                                    />
                                    
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onPageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    )
}

function PaymentStatusBadge({ isLate }: { isLate: boolean }) {
    if (isLate) {
        return (
            <Badge 
                variant="outline" 
                className="bg-red-500/15 text-red-600 border-red-500/30 dark:bg-red-500/20 dark:text-red-400"
            >
                Atrasado
            </Badge>
        )
    }
    
    return (
        <Badge 
            variant="outline" 
            className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400"
        >
            A tiempo
        </Badge>
    )
}

interface PaginationNumbersProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

function PaginationNumbers({ currentPage, totalPages, onPageChange }: PaginationNumbersProps) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)

    return (
        <>
            {pages.map((page, index, array) => (
                <div key={page} className="flex items-center">
                    {index > 0 && array[index - 1] !== page - 1 && (
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground mx-1" />
                    )}
                    <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(page)}
                        className="h-8 w-8 p-0"
                    >
                        {page}
                    </Button>
                </div>
            ))}
        </>
    )
}
