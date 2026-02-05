"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, AlertTriangle, CheckCircle2, XCircle, Eye, Calendar, User } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import es from "date-fns/locale/es"
import type { ClosingValidationResult, ClosingValidationStatus } from "./hooks/useClosingValidation"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Props {
  validation: ClosingValidationResult
}

function getStatusConfig(status: ClosingValidationStatus) {
  switch (status) {
    case "CORRECT":
      return {
        icon: CheckCircle2,
        variant: "default" as const,
        className: "border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800",
        iconClassName: "text-green-600 dark:text-green-400",
        badgeClassName: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200",
      }
    case "MINOR_DIFFERENCE":
      return {
        icon: AlertTriangle,
        variant: "default" as const,
        className: "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800",
        iconClassName: "text-yellow-600 dark:text-yellow-400",
        badgeClassName: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200",
      }
    case "MAJOR_DIFFERENCE":
      return {
        icon: AlertCircle,
        variant: "destructive" as const,
        className: "border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800",
        iconClassName: "text-orange-600 dark:text-orange-400",
        badgeClassName: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200",
      }
    case "INSTALLMENT_DELETED":
      return {
        icon: XCircle,
        variant: "destructive" as const,
        className: "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800",
        iconClassName: "text-red-600 dark:text-red-400",
        badgeClassName: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200",
      }
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function ClosingValidationAlert({ validation }: Props) {
  const config = getStatusConfig(validation.status)
  const Icon = config.icon

  const allMissingItems = [
    ...validation.details.missingInstallments,
    ...validation.details.deletedInstallments,
  ]

  return (
    <div className="space-y-4">
      <Alert className={config.className}>
        <Icon className={`h-5 w-5 ${config.iconClassName}`} />
        <AlertTitle className="flex items-center gap-2 text-base font-semibold">
          Estado del Cierre
          <Badge variant="outline" className={config.badgeClassName}>
            {validation.status === "CORRECT" && "Correcto"}
            {validation.status === "MINOR_DIFFERENCE" && "Diferencia Menor"}
            {validation.status === "MAJOR_DIFFERENCE" && "Diferencia Mayor"}
            {validation.status === "INSTALLMENT_DELETED" && "Cuotas Eliminadas"}
          </Badge>
        </AlertTitle>
        <AlertDescription className="mt-2 space-y-3">
          <p className="text-sm">{validation.message}</p>
          
          {validation.details.difference !== 0 && (
            <div className="grid grid-cols-3 gap-4 p-3 rounded-md bg-white/50 dark:bg-slate-900/50 border">
              <div>
                <p className="text-xs text-muted-foreground">Total Esperado</p>
                <p className="text-sm font-semibold">{formatCurrency(validation.details.expectedTotal)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Actual</p>
                <p className="text-sm font-semibold">{formatCurrency(validation.details.actualTotal)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Diferencia</p>
                <p className={`text-sm font-semibold ${validation.details.difference < 0 ? "text-red-600" : "text-orange-600"}`}>
                  {formatCurrency(Math.abs(validation.details.difference))}
                </p>
              </div>
            </div>
          )}
        </AlertDescription>
      </Alert>

      {allMissingItems.length > 0 && (
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="missing-installments" className="border rounded-lg">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span className="font-semibold">
                  Ver Cuotas Faltantes ({allMissingItems.length})
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Placa</TableHead>
                      <TableHead>Contrato</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                      <TableHead className="text-right">GPS</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead>Fecha</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allMissingItems.map((item) => (
                      <TableRow key={item.installmentId}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {getInitials(item.clientName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{item.clientName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-xs">
                            {item.vehiclePlate}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-xs">{item.contractNumber}</span>
                        </TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          {formatCurrency(item.amount)}
                        </TableCell>
                        <TableCell className="text-right font-medium text-blue-600">
                          {formatCurrency(item.gpsAmount)}
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          {formatCurrency(item.totalAmount)}
                        </TableCell>
                        <TableCell>
                          {item.reason === "DELETED" ? (
                            <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 border-red-200">
                              <XCircle className="h-3 w-3 mr-1" />
                              Eliminada
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 border-orange-200">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Removida
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col text-xs">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(item.deletedAt || item.paymentDate), "dd/MM/yyyy", { locale: es })}
                            </span>
                            {item.deletedBy && (
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <User className="h-3 w-3" />
                                {item.deletedBy}
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  )
}
