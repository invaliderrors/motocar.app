"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { formatCurrency, formatDate, getInterest, calculatePartialInstallmentDebt } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { CreditCard, DollarSign, Percent } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { InstallmentForm } from "../installments/components/forms/installment-form"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bike, Users } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { fetchLoan } from "@/lib/api"
import { Loan } from "@/lib/types"


export function LoanDetails({
  children,
  loanId,
  loanData,
}: {
  children: React.ReactNode
  loanId: string
  loanData?: any
}) {
  const [open, setOpen] = useState(false)
  const [loan, setLoan] = useState<Loan | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("payments")
  const { toast } = useToast()
  const [interests, setInterests] = useState(0)
  const dataFetchedRef = useRef(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Función para obtener datos del contrato
  const fetchLoanData = () => {
    setLoading(true)
    // Simulación de carga de datos
    setTimeout(async () => {
      try {
        const response = await fetchLoan(loanId)
        const periods =
          response.paymentFrequency === "DAILY"
            ? 365
            : response.paymentFrequency === "WEEKLY"
              ? 52
              : response.paymentFrequency === "BIWEEKLY"
                ? 24
                : 12 // <- Monthly
        setInterests(getInterest(response.totalAmount, response.interestRate, periods))
        setLoan(response)
      } catch (error) {
        console.error("Error al cargar datos del contrato:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudieron cargar los datos del contrato",
        })
      } finally {
        setLoading(false)
      }
    }, 1000)
  }

  // Efecto para cargar datos cuando se abre el diálogo
  useEffect(() => {
    if (open && !dataFetchedRef.current) {
      dataFetchedRef.current = true
      fetchLoanData()
    }

    // Limpiar cuando se cierra el diálogo
    if (!open) {
      dataFetchedRef.current = false
    }
  }, [open])

  // Función para obtener el color del estado
  function getStatusColor(status: string) {
    switch (status) {
      case "ACTIVE":
        return "bg-blue-500"
      case "COMPLETED":
        return "bg-green-500"
      case "DEFAULTED":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Función para obtener el texto del estado
  function getStatusText(status: string) {
    switch (status) {
      case "ACTIVE":
        return "Activo"
      case "COMPLETED":
        return "Completado"
      case "DEFAULTED":
        return "Incumplido"
      default:
        return status
    }
  }

  // Función para obtener el texto de la frecuencia de pago
  function getPaymentFrequencyText(frequency: string) {
    switch (frequency) {
      case "MONTHLY":
        return "Mensual"
      case "BIWEEKLY":
        return "Quincenal"
      case "WEEKLY":
        return "Semanal"
      default:
        return frequency
    }
  }

  // Función para obtener el texto del tipo de interés
  function getInterestTypeText(type: string) {
    switch (type) {
      case "FIXED":
        return "Fijo (Simple)"
      case "COMPOUND":
        return "Compuesto"
      default:
        return type
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // Resetear estados cuando se cierra el diálogo
      setActiveTab("payments")
      setLoan(null)
      setLoading(true)
      setCurrentPage(1) // Add this line
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles del contrato</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-6 py-4">
            <div className="grid gap-6 md:grid-cols-2">
              <Skeleton className="h-[150px] w-full" />
              <Skeleton className="h-[150px] w-full" />
            </div>
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : loan ? (
          <div className="space-y-6 py-4">
            <div className="flex justify-end">
              <InstallmentForm loanId={loan.id}>
                <Button>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Registrar Pago
                </Button>
              </InstallmentForm>
            </div>

            {/* Información del cliente y vehículo */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="card-hover-effect">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-blue-400" />
                    Información del Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-12 w-12 border border-dark-blue-700 bg-dark-blue-800/50">
                      <AvatarImage
                        src={`/abstract-geometric-shapes.png?height=48&width=48&query=${loan.id}`}
                        alt={loan.user.name}
                      />
                      <AvatarFallback className="bg-dark-blue-800/80 text-blue-200">
                        {loan.user.name
                          .split(" ")
                          .slice(0, 2)
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium text-white">{loan.user.name}</h3>
                      <p className="text-sm text-blue-200/70">Cliente</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-dark-blue-800/50">
                      <span className="text-sm text-blue-200/80">Identificación</span>
                      <span className="text-sm font-medium text-white">{loan.user.identification || "N/A"}</span>
                    </div>
                    {loan.user.refName && (
                      <div className="flex justify-between py-2 border-b border-dark-blue-800/50">
                        <span className="text-sm text-blue-200/80">Referencia</span>
                        <span className="text-sm font-medium text-white">{loan.user.refName}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b border-dark-blue-800/50">
                      <span className="text-sm text-blue-200/80">Teléfono</span>
                      <span className="text-sm font-medium text-white">{loan.user.phone || "N/A"}</span>
                    </div>
                    {loan.user.address && (
                      <div className="flex justify-between py-2 border-b border-dark-blue-800/50">
                        <span className="text-sm text-blue-200/80">Dirección</span>
                        <span className="text-sm font-medium text-white">{loan.user.address}</span>
                      </div>
                    )}
                    {loan.user.city && (
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-blue-200/80">Ciudad</span>
                        <span className="text-sm font-medium text-white">{loan.user.city}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="card-hover-effect">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Bike className="mr-2 h-5 w-5 text-blue-400" />
                    Información del Vehículo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-12 w-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Bike className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">
                        {loan.vehicle?.brand || loan.motorcycle?.brand || "N/A"}{" "}
                        {loan.vehicle?.model || loan.motorcycle?.model || "N/A"}
                      </h3>
                      <p className="text-sm text-blue-200/70">Vehículo</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-dark-blue-800/50">
                      <span className="text-sm text-blue-200/80">Marca</span>
                      <span className="text-sm font-medium text-white">
                        {loan.vehicle?.brand || loan.motorcycle?.brand || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-dark-blue-800/50">
                      <span className="text-sm text-blue-200/80">Modelo</span>
                      <span className="text-sm font-medium text-white">
                        {loan.vehicle?.model || loan.motorcycle?.model || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-dark-blue-800/50">
                      <span className="text-sm text-blue-200/80">Placa</span>
                      <span className="text-sm font-medium text-white">
                        {loan.vehicle?.plate || loan.motorcycle?.plate || "N/A"}
                      </span>
                    </div>
                    {(loan.vehicle?.engine || loan.motorcycle?.engine) && (
                      <div className="flex justify-between py-2 border-b border-dark-blue-800/50">
                        <span className="text-sm text-blue-200/80">Motor</span>
                        <span className="text-sm font-medium text-white">
                          {loan.vehicle?.engine || loan.motorcycle?.engine}
                        </span>
                      </div>
                    )}
                    {(loan.vehicle?.chassis || loan.motorcycle?.chassis) && (
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-blue-200/80">Chasis</span>
                        <span className="text-sm font-medium text-white">
                          {loan.vehicle?.chassis || loan.motorcycle?.chassis}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detalles del contrato */}
            <Card>
              <CardHeader>
                <CardTitle>Detalles del contrato</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
                  <div className="col-span-2 md:col-span-4 mb-2">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-200/80">Estado del contrato</p>
                          <Badge className={`${getStatusColor(loan.status)} text-white px-3 py-1 text-sm mt-1`}>
                            {getStatusText(loan.status)}
                          </Badge>
                        </div>
                      </div>
                      {loan.contractNumber && (
                        <div className="text-right">
                          <p className="text-sm font-medium text-blue-200/80">Contrato No.</p>
                          <p className="text-lg font-bold text-white">{loan.contractNumber}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Información financiera */}
                  <div className="glass-card p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-200/80">Precio Total</p>
                    <p className="text-xl font-bold text-white">{formatCurrency(loan.totalAmount)}</p>
                    <div className="flex justify-between text-xs text-blue-200/60 mt-1">
                      <span>Pago inicial: {formatCurrency(loan.downPayment || 0)}</span>
                    </div>
                  </div>

                  <div className="glass-card p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-200/80">Total con Interés</p>
                    <p className="text-xl font-bold text-white">
                      {formatCurrency(loan.totalAmount + (interests * loan.installments || 0))}
                    </p>
                    <div className="flex justify-between text-xs text-blue-200/60 mt-1">
                      <span>Tasa: {loan.interestRate || 0}%</span>
                    </div>
                  </div>

                  <div className="glass-card p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-200/80">
                      Cuota {getPaymentFrequencyText(loan.paymentFrequency || "DAILY")}
                    </p>
                    <p className="text-xl font-bold text-white">{formatCurrency(loan.installmentPaymentAmmount || 0)}</p>
                    <div className="flex justify-between text-xs text-blue-200/60 mt-1">
                      <span>Tipo: {getInterestTypeText(loan.interestType || "FIXED")}</span>
                    </div>
                  </div>

                  <div className="glass-card p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-200/80">Total de Cuotas</p>
                    <p className="text-xl font-bold text-white">{loan.installments || 0}</p>
                    <div className="flex justify-between text-xs text-blue-200/60 mt-1">
                      <span>{getPaymentFrequencyText(loan.paymentFrequency || "DAILY")}</span>
                    </div>
                  </div>
                </div>

                {/* Resumen de pagos */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="glass-card p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <DollarSign className="h-4 w-4 text-blue-400 mr-1" />
                      <p className="text-sm font-medium text-blue-200/80">Progreso de Pagos</p>
                    </div>
                    <p className="text-xl font-bold text-white">
                      {loan.paidInstallments || 0} / {loan.installments || 0}
                    </p>
                    <div className="mt-2">
                      <Progress 
                        value={loan.installments ? ((loan.paidInstallments || 0) / loan.installments) * 100 : 0} 
                        className="h-2" 
                      />
                    </div>
                  </div>

                  <div className="glass-card p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <DollarSign className="h-4 w-4 text-green-400 mr-1" />
                      <p className="text-sm font-medium text-blue-200/80">Total Pagado</p>
                    </div>
                    <p className="text-xl font-bold text-green-400">{formatCurrency(loan.totalPaid || 0)}</p>
                    <div className="text-xs text-blue-200/60 mt-1">
                      <span>
                        {loan.installments ? ((((loan.paidInstallments || 0) / loan.installments) * 100).toFixed(1)) : 0}% completado
                      </span>
                    </div>
                  </div>

                  <div className="glass-card p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <DollarSign className="h-4 w-4 text-amber-400 mr-1" />
                      <p className="text-sm font-medium text-blue-200/80">Deuda Restante</p>
                    </div>
                    <p className="text-xl font-bold text-amber-400">{formatCurrency(loan.debtRemaining || 0)}</p>
                    <div className="text-xs text-blue-200/60 mt-1">
                      {(() => {
                        const partialDebt = calculatePartialInstallmentDebt(
                          loan.remainingInstallments || 0,
                          loan.installmentPaymentAmmount || 0
                        )
                        
                        if (partialDebt.fullInstallments > 0 && partialDebt.partialInstallmentAmount > 0) {
                          return (
                            <>
                              <span>{partialDebt.fullInstallments} cuotas completas</span>
                              <span className="block mt-0.5">
                                + {formatCurrency(partialDebt.partialInstallmentAmount)} ({partialDebt.partialInstallmentPercentage.toFixed(1)}% de cuota)
                              </span>
                            </>
                          )
                        } else if (partialDebt.partialInstallmentAmount > 0 && partialDebt.fullInstallments === 0) {
                          return (
                            <span>
                              {formatCurrency(partialDebt.partialInstallmentAmount)} ({partialDebt.partialInstallmentPercentage.toFixed(1)}% de cuota)
                            </span>
                          )
                        } else {
                          return <span>{partialDebt.fullInstallments} cuotas pendientes</span>
                        }
                      })()}
                    </div>
                  </div>

                  <div className="glass-card p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Percent className="h-4 w-4 text-blue-400 mr-1" />
                      <p className="text-sm font-medium text-blue-200/80">Interés Generado</p>
                    </div>
                    <p className="text-xl font-bold text-blue-400">
                      {formatCurrency((interests || 0) * (loan.paidInstallments || 0))}
                    </p>
                    <div className="text-xs text-blue-200/60 mt-1">
                      <span>{loan.interestRate || 0}% por cuota</span>
                    </div>
                  </div>
                </div>

                {/* Fechas y GPS */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass-card p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-200/80">Fecha de Inicio</p>
                    <p className="text-base font-medium text-white">
                      {loan.startDate ? formatDate(loan.startDate.split("T")[0]) : "No establecida"}
                    </p>
                  </div>

                  <div className="glass-card p-4 rounded-lg">
                    <p className="text-sm font-medium text-blue-200/80">Fecha Estimada de Finalización</p>
                    <p className="text-base font-medium text-white">
                      {loan.endDate ? formatDate(loan.endDate.split("T")[0]) : "No establecida"}
                    </p>
                  </div>

                  {loan.gpsInstallmentPayment > 0 && (
                    <div className="glass-card p-4 rounded-lg">
                      <p className="text-sm font-medium text-blue-200/80">Pago GPS por Cuota</p>
                      <p className="text-base font-medium text-white">
                        {formatCurrency(loan.gpsInstallmentPayment || 0)}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pestañas para historial de pagos y tabla de amortización */}
            <div>
              <div className="flex space-x-1 rounded-lg bg-dark-blue-800/30 p-1">
                <button
                  className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium ${activeTab === "payments"
                      ? "bg-blue-500 text-white"
                      : "text-blue-200 hover:bg-dark-blue-700/50 hover:text-white"
                    }`}
                  onClick={() => setActiveTab("payments")}
                >
                  Historial de Pagos
                </button>
                {/* <button
                  className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium ${
                    activeTab === "amortization"
                      ? "bg-blue-500 text-white"
                      : "text-blue-200 hover:bg-dark-blue-700/50 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("amortization")}
                >
                  Tabla de Amortización
                </button> */}
              </div>

              <div className="mt-4">
                {activeTab === "payments" && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Fecha</TableHead>
                              <TableHead>ID</TableHead>
                              <TableHead>Monto</TableHead>
                              {/* <TableHead>Capital</TableHead> */}
                              {/* <TableHead>Interés</TableHead> */}
                              <TableHead>Estado</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {(() => {
                              // Sort payments by date (most recent first)
                              const sortedPayments = [...loan.payments].sort(
                                (a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime(),
                              )

                              // Calculate pagination
                              const totalPages = Math.ceil(sortedPayments.length / itemsPerPage)
                              const startIndex = (currentPage - 1) * itemsPerPage
                              const endIndex = startIndex + itemsPerPage
                              const currentPayments = sortedPayments.slice(startIndex, endIndex)

                              if (sortedPayments.length === 0) {
                                return (
                                  <TableRow>
                                    <TableCell colSpan={5} className="text-center">
                                      No hay pagos registrados
                                    </TableCell>
                                  </TableRow>
                                )
                              }

                              return currentPayments.map((payment) => (
                                <TableRow key={payment.id}>
                                  <TableCell>{formatDate(payment.paymentDate.split("T")[0])}</TableCell>
                                  <TableCell>{payment.id}</TableCell>
                                  <TableCell>{formatCurrency(payment.amount)}</TableCell>
                                  <TableCell>
                                    {payment.isLate ? (
                                      <Badge variant="destructive">Atrasado</Badge>
                                    ) : (
                                      <Badge variant="default" className="bg-green-500">
                                        A tiempo
                                      </Badge>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))
                            })()}
                          </TableBody>
                        </Table>
                      </div>
                      {loan.payments.length > 0 && (
                        <div className="flex items-center justify-between space-x-2 py-4">
                          <div className="text-sm text-muted-foreground">
                            Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, loan.payments.length)} a{" "}
                            {Math.min(currentPage * itemsPerPage, loan.payments.length)} de {loan.payments.length} pagos
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                            >
                              Anterior
                            </Button>
                            <div className="flex items-center space-x-1">
                              {Array.from({ length: Math.ceil(loan.payments.length / itemsPerPage) }, (_, i) => i + 1)
                                .filter((page) => {
                                  const totalPages = Math.ceil(loan.payments.length / itemsPerPage)
                                  return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1
                                })
                                .map((page, index, array) => (
                                  <div key={page} className="flex items-center">
                                    {index > 0 && array[index - 1] !== page - 1 && (
                                      <span className="px-2 text-muted-foreground">...</span>
                                    )}
                                    <Button
                                      variant={currentPage === page ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => setCurrentPage(page)}
                                      className="w-8 h-8 p-0"
                                    >
                                      {page}
                                    </Button>
                                  </div>
                                ))}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentPage((prev) =>
                                  Math.min(prev + 1, Math.ceil(loan.payments.length / itemsPerPage)),
                                )
                              }
                              disabled={currentPage === Math.ceil(loan.payments.length / itemsPerPage)}
                            >
                              Siguiente
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center">
            <p>No se encontró información del contrato</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
