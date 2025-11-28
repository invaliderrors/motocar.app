"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle2,
  AlertCircle,
  Calendar,
  DollarSign,
  User,
  Car,
  CreditCard,
  FileText,
  Phone,
  MapPin,
} from "lucide-react"
import { PaymentMethodIcon } from "@/components/common/PaymentMethodIcon"

type Payment = {
  id: string
  loanId: string
  amount: number
  gps: number
  paymentDate: string
  isLate: boolean
  latePaymentDate: string | null
  notes: string | null
  paymentMethod: string
  loan: {
    id: string
    user: {
      name: string
      identification: string
      phone: string
    }
    vehicle: {
      model: string
      plate: string
      brand: string
    }
    contractNumber: string | null
  }
}

interface PaymentDetailsDialogProps {
  open: boolean
  payment: Payment | null
  onOpenChange: (open: boolean) => void
}

export function PaymentDetailsDialog({ open, payment, onOpenChange }: PaymentDetailsDialogProps) {
  if (!payment) return null

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getPaymentMethodText = (method: string) => {
    const methods: Record<string, string> = {
      CASH: "Efectivo",
      NEQUI: "Nequi",
      DAVIPLATA: "Daviplata",
      BANCOLOMBIA: "Bancolombia",
      TRANSFER: "Transferencia",
      OTHER: "Otro",
    }
    return methods[method] || method
  }

  const totalAmount = payment.amount + payment.gps

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {payment.isLate ? (
              <AlertCircle className="h-5 w-5 text-red-600" />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            )}
            <DialogTitle className="text-xl">
              Detalles del Pago
            </DialogTitle>
          </div>
          <DialogDescription>
            Información completa sobre este pago
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <Badge
              variant={payment.isLate ? "destructive" : "default"}
              className={payment.isLate ? "" : "bg-green-600 hover:bg-green-700"}
            >
              {payment.isLate ? "Pago Tardío" : "Pago a Tiempo"}
            </Badge>
            {payment.loan.contractNumber && (
              <Badge variant="outline">
                Contrato: {payment.loan.contractNumber}
              </Badge>
            )}
          </div>

          {/* Payment Amount */}
          <div className="bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/30 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Monto Total</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(totalAmount)}
                </p>
                <div className="flex gap-4 mt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Cuota</p>
                    <p className="text-sm font-medium">{formatCurrency(payment.amount)}</p>
                  </div>
                  {payment.gps > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground">GPS</p>
                      <p className="text-sm font-medium">{formatCurrency(payment.gps)}</p>
                    </div>
                  )}
                </div>
              </div>
              <DollarSign className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <Separator />

          {/* Payment Date */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fecha de Pago
            </h3>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="font-medium">{formatDate(payment.paymentDate)}</p>
              {payment.isLate && payment.latePaymentDate && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                  <p className="font-medium">Pagado con retraso</p>
                  <p className="text-xs">Fecha: {formatDate(payment.latePaymentDate)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Método de Pago
            </h3>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5">
                <PaymentMethodIcon method={payment.paymentMethod} />
              </div>
              <span className="font-medium">{getPaymentMethodText(payment.paymentMethod)}</span>
            </div>
          </div>

          <Separator />

          {/* Client Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Cliente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Nombre</p>
                <p className="font-medium">{payment.loan.user.name}</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Identificación</p>
                <p className="font-medium">{payment.loan.user.identification}</p>
              </div>
              {payment.loan.user.phone && (
                <div className="bg-muted/50 p-3 rounded-lg md:col-span-2">
                  <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    Teléfono
                  </p>
                  <p className="font-medium">{payment.loan.user.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Car className="h-4 w-4" />
              Vehículo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Marca</p>
                <p className="font-medium">{payment.loan.vehicle.brand}</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Modelo</p>
                <p className="font-medium">{payment.loan.vehicle.model}</p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Placa</p>
                <p className="font-medium">{payment.loan.vehicle.plate}</p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {payment.notes && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notas
              </h3>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{payment.notes}</p>
              </div>
            </div>
          )}

          {/* Payment ID */}
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              ID de Pago: <span className="font-mono">{payment.id}</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
