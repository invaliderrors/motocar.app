"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { formatCurrency, formatDate } from "@/lib/utils"
import {
  Archive,
  User,
  Calendar,
  DollarSign,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { HttpService } from "@/lib/http"
import { useToast } from "@/components/ui/use-toast"
import type { Loan, Installment } from "@/lib/types"

interface ArchivedLoansDialogProps {
  vehicleId: string
  vehicleInfo: string
  children: React.ReactNode
}

interface ArchivedLoanData extends Loan {
  archivedAt?: string
}

export function ArchivedLoansDialog({ vehicleId, vehicleInfo, children }: ArchivedLoansDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [archivedLoans, setArchivedLoans] = useState<ArchivedLoanData[]>([])
  const [expandedLoans, setExpandedLoans] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [loansPerPage] = useState(3) // Show 3 loans per page
  const [paymentPages, setPaymentPages] = useState<Map<string, number>>(new Map())
  const [paymentsPerPage] = useState(5) // Show 5 payments per page
  const { toast } = useToast()

  const toggleLoanExpansion = (loanId: string) => {
    setExpandedLoans((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(loanId)) {
        newSet.delete(loanId)
      } else {
        newSet.add(loanId)
        // Initialize payment page to 1 when expanding
        setPaymentPages((prevPages) => {
          const newPages = new Map(prevPages)
          newPages.set(loanId, 1)
          return newPages
        })
      }
      return newSet
    })
  }

  // Calculate pagination
  const totalPages = Math.ceil(archivedLoans.length / loansPerPage)
  const startIndex = (currentPage - 1) * loansPerPage
  const endIndex = startIndex + loansPerPage
  const currentLoans = archivedLoans.slice(startIndex, endIndex)

  // Reset to page 1 when dialog opens
  useEffect(() => {
    if (open) {
      setCurrentPage(1)
      setExpandedLoans(new Set())
      setPaymentPages(new Map())
    }
  }, [open])

  useEffect(() => {
    if (open) {
      fetchArchivedLoans()
    }
  }, [open])

  const fetchArchivedLoans = async () => {
    try {
      setLoading(true)
      // Fetch archived loans specifically for this vehicle
      const response = await HttpService.get(`/api/v1/loans`)
      const allLoans = response.data || []
      
      // Filter to only show archived loans for this specific vehicle
      const filtered = allLoans.filter((loan: ArchivedLoanData) => {
        const loanVehicleId = loan.vehicle?.id || loan.vehicleId
        return loan.archived === true && loanVehicleId === vehicleId
      })
      
      setArchivedLoans(filtered)
    } catch (error: any) {
      console.error("Error fetching archived loans:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los contratos archivados.",
      })
    } finally {
      setLoading(false)
    }
  }

  const getLoanStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Completado
          </Badge>
        )
      case "DEFAULTED":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Incumplido
          </Badge>
        )
      case "ACTIVE":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
            <Clock className="h-3 w-3 mr-1" />
            Activo
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "CASH":
        return "Efectivo"
      case "CARD":
        return "Tarjeta"
      case "TRANSACTION":
        return "Transferencia"
      default:
        return method
    }
  }

  const getPaymentMethodBadgeColor = (method: string) => {
    switch (method) {
      case "CASH":
        return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20"
      case "CARD":
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
      case "TRANSACTION":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20"
      default:
        return ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[90vw] lg:max-w-[1200px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Historial de contratos Archivados
          </DialogTitle>
          <DialogDescription>
            Vehículo: <strong>{vehicleInfo}</strong>
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : archivedLoans.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Archive className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No se encontraron contratos archivados</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {currentLoans.map((loan, index) => (
                <div
                  key={loan.id}
                  className="border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        {loan.contractNumber || "N/A"}
                      </Badge>
                      {getLoanStatusBadge(loan.status)}
                    </div>
                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                      <Archive className="h-3 w-3 mr-1" />
                      Archivado
                    </Badge>
                  </div>

                  <Separator className="my-3" />

                  {/* Client Info */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <User className="h-4 w-4" />
                        Cliente
                      </div>
                      <p className="font-medium">{loan.user.name}</p>
                      <p className="text-sm text-muted-foreground">{loan.user.identification}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <DollarSign className="h-4 w-4" />
                        Monto Total
                      </div>
                      <p className="font-bold text-lg text-green-600">
                        {formatCurrency(loan.totalAmount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Inicial: {formatCurrency(loan.downPayment)}
                      </p>
                    </div>
                  </div>

                  {/* Loan Details */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <CalendarDays className="h-4 w-4" />
                        Fechas
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">Inicio:</span>{" "}
                        {loan.startDate ? formatDate(loan.startDate.split("T")[0], "d MMM yyyy") : "N/A"}
                      </p>
                      {loan.endDate && (
                        <p className="text-sm">
                          <span className="font-medium">Fin:</span>{" "}
                          {formatDate(loan.endDate.split("T")[0], "d MMM yyyy")}
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <CreditCard className="h-4 w-4" />
                        Cuotas
                      </div>
                      {(() => {
                        const dailyRate = (loan.installmentPaymentAmmount || 0) + (loan.gpsInstallmentPayment || 0)
                        const downPaymentInstallments = loan.downPayment > 0 && dailyRate > 0 
                          ? Math.floor(loan.downPayment / dailyRate) 
                          : 0
                        const effectivePaidInstallments = Number(loan.paidInstallments) + downPaymentInstallments
                        return (
                          <>
                            <p className="text-sm">
                              <span className="font-medium">Pagadas:</span> {effectivePaidInstallments.toFixed(2)} / {Number(loan.installments).toFixed(0)}
                            </p>
                            {downPaymentInstallments > 0 && (
                              <p className="text-xs text-green-600 dark:text-green-400">
                                Inicial: {downPaymentInstallments} cuotas cubiertas
                              </p>
                            )}
                          </>
                        )
                      })()}
                      <p className="text-sm">
                        <span className="font-medium">Restantes:</span> {Number(loan.remainingInstallments).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Total Pagado</div>
                      <p className="font-semibold text-blue-600">
                        {formatCurrency(loan.totalPaid)}
                      </p>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Deuda Restante</div>
                      <p className="font-semibold text-red-600">
                        {formatCurrency(loan.debtRemaining)}
                      </p>
                    </div>
                  </div>

                  {/* Payment frequency and interest */}
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Frecuencia: <span className="font-medium text-foreground">{loan.paymentFrequency}</span>
                      </span>
                      <span className="text-muted-foreground">
                        Interés: <span className="font-medium text-foreground">{loan.interestRate}%</span>
                      </span>
                      <span className="text-muted-foreground">
                        Cuota: <span className="font-medium text-foreground">{formatCurrency(loan.installmentPaymentAmmount)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Installments summary */}
                  {loan.payments && loan.payments.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <Collapsible
                        open={expandedLoans.has(loan.id)}
                        onOpenChange={() => toggleLoanExpansion(loan.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                              Registros de pago:{" "}
                              <span className="font-medium text-foreground">{loan.payments.length}</span>
                            </span>
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              <span>{loan.payments.filter((p) => !p.isLate).length} a tiempo</span>
                              <XCircle className="h-4 w-4 text-red-500 ml-2" />
                              <span>{loan.payments.filter((p) => p.isLate).length} tardíos</span>
                            </div>
                          </div>
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="gap-1">
                              {expandedLoans.has(loan.id) ? (
                                <>
                                  <ChevronUp className="h-4 w-4" />
                                  Ocultar
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-4 w-4" />
                                  Ver detalles
                                </>
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        </div>

                        <CollapsibleContent className="mt-4">
                          <div className="space-y-2 border rounded-lg">
                            {(() => {
                              const currentPaymentPage = paymentPages.get(loan.id) || 1
                              const sortedPayments = loan.payments
                                .sort(
                                  (a, b) =>
                                    new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
                                )
                              const totalPaymentPages = Math.ceil(sortedPayments.length / paymentsPerPage)
                              const paymentStartIndex = (currentPaymentPage - 1) * paymentsPerPage
                              const paymentEndIndex = paymentStartIndex + paymentsPerPage
                              const currentPayments = sortedPayments.slice(paymentStartIndex, paymentEndIndex)

                              return (
                                <>
                                  <div className="max-h-[400px] overflow-y-auto">
                                    {currentPayments.map((payment: Installment, idx: number) => (
                                      <div
                                        key={payment.id}
                                        className={`p-3 ${idx % 2 === 0 ? "bg-muted/30" : "bg-background"}`}
                                      >
                                        <div className="grid grid-cols-4 gap-4 items-center">
                                          {/* Payment info */}
                                          <div>
                                            <div className="flex items-center gap-2 mb-1">
                                              <Calendar className="h-3 w-3 text-muted-foreground" />
                                              <span className="text-sm font-medium">
                                                {formatDate(payment.paymentDate.split("T")[0], "d MMM yyyy")}
                                              </span>
                                            </div>
                                            {payment.isLate && payment.latePaymentDate && (
                                              <div className="flex items-center gap-1 text-xs text-red-500">
                                                <AlertTriangle className="h-3 w-3" />
                                                Tarde: {formatDate(payment.latePaymentDate.split("T")[0], "d MMM yyyy")}
                                              </div>
                                            )}
                                          </div>

                                          {/* Amount */}
                                          <div>
                                            <div className="text-sm text-muted-foreground mb-1">Monto</div>
                                            <div className="font-semibold text-green-600">
                                              {formatCurrency(payment.amount)}
                                            </div>
                                            {payment.gps > 0 && (
                                              <div className="text-xs text-muted-foreground">
                                                GPS: {formatCurrency(payment.gps)}
                                              </div>
                                            )}
                                          </div>

                                          {/* Payment method */}
                                          <div>
                                            <div className="text-sm text-muted-foreground mb-1">Método</div>
                                            <Badge
                                              variant="outline"
                                              className={`text-xs ${getPaymentMethodBadgeColor(payment.paymentMethod)}`}
                                            >
                                              <CreditCard className="h-3 w-3 mr-1" />
                                              {getPaymentMethodLabel(payment.paymentMethod)}
                                            </Badge>
                                          </div>

                                          {/* Status */}
                                          <div className="flex justify-end">
                                            {payment.isLate ? (
                                              <Badge variant="destructive" className="text-xs">
                                                <AlertTriangle className="h-3 w-3 mr-1" />
                                                Atrasado
                                              </Badge>
                                            ) : (
                                              <Badge className="bg-green-500 text-white text-xs">
                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                A tiempo
                                              </Badge>
                                            )}
                                          </div>
                                        </div>

                                        {/* Notes */}
                                        {payment.notes && (
                                          <div className="mt-2 pt-2 border-t">
                                            <div className="flex items-start gap-2 text-xs">
                                              <FileText className="h-3 w-3 text-muted-foreground mt-0.5" />
                                              <span className="text-muted-foreground">{payment.notes}</span>
                                            </div>
                                          </div>
                                        )}

                                        {/* Created by */}
                                        {payment.createdBy && (
                                          <div className="mt-1 text-xs text-muted-foreground">
                                            <User className="h-3 w-3 inline mr-1" />
                                            Registrado por: {payment.createdBy.name}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>

                                  {/* Payment Pagination Controls */}
                                  {totalPaymentPages > 1 && (
                                    <div className="p-3 border-t bg-muted/20 flex items-center justify-between">
                                      <div className="text-xs text-muted-foreground">
                                        Mostrando {paymentStartIndex + 1} a{" "}
                                        {Math.min(paymentEndIndex, sortedPayments.length)} de{" "}
                                        {sortedPayments.length} {sortedPayments.length === 1 ? "pago" : "pagos"}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            setPaymentPages((prev) => {
                                              const newPages = new Map(prev)
                                              newPages.set(loan.id, Math.max(1, currentPaymentPage - 1))
                                              return newPages
                                            })
                                          }}
                                          disabled={currentPaymentPage === 1}
                                        >
                                          <ChevronLeft className="h-3 w-3" />
                                        </Button>
                                        <div className="text-xs font-medium">
                                          {currentPaymentPage} / {totalPaymentPages}
                                        </div>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => {
                                            setPaymentPages((prev) => {
                                              const newPages = new Map(prev)
                                              newPages.set(
                                                loan.id,
                                                Math.min(totalPaymentPages, currentPaymentPage + 1)
                                              )
                                              return newPages
                                            })
                                          }}
                                          disabled={currentPaymentPage === totalPaymentPages}
                                        >
                                          <ChevronRight className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )
                            })()}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      <Calendar className="h-3 w-3 inline mr-1" />
                      Creado: {formatDate(loan.createdAt.split("T")[0], "d MMM yyyy")}
                    </span>
                    <span>
                      <Calendar className="h-3 w-3 inline mr-1" />
                      Actualizado: {formatDate(loan.updatedAt.split("T")[0], "d MMM yyyy")}
                    </span>
                  </div>
                </div>
              ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-6 pt-4 border-t flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, archivedLoans.length)} de{" "}
                    {archivedLoans.length} {archivedLoans.length === 1 ? "contrato" : "contratos"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <div className="text-sm font-medium">
                      Página {currentPage} de {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
