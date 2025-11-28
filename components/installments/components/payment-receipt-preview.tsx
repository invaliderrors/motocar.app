"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"
import { Printer, Download, Share2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface PaymentReceiptProps {
    clientName: string
    vehicleModel: string
    installmentNumber: number
    paymentMethod: string
    paymentDate: Date
    amount: number
    gps: number
    totalAmount: number
}

export function PaymentReceiptPreview({
    clientName = "Cliente de ejemplo",
    vehicleModel = "Modelo de ejemplo",
    installmentNumber = 1,
    paymentMethod = "CASH",
    paymentDate = new Date(),
    amount = 0,
    gps = 0,
    totalAmount = 0,
}: Partial<PaymentReceiptProps>) {
    const [isExpanded, setIsExpanded] = useState(false)

    const getPaymentMethodText = (method: string) => {
        switch (method) {
            case "CASH":
                return "Efectivo"
            case "CARD":
                return "Tarjeta"
            case "TRANSACTION":
                return "Transferencia"
            default:
                return "No especificado"
        }
    }

    return (
        <Card
            className={`bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md transition-all duration-300 ${isExpanded ? "scale-105" : ""}`}
        >
            <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-t-lg pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                    <span>Recibo de Pago</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">#{installmentNumber}</span>
                </CardTitle>
                <p className="text-xs text-white/80">{format(paymentDate, "PPP", { locale: es })}</p>
            </CardHeader>
            <CardContent className="p-4">
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-slate-500 dark:text-slate-400">Cliente:</div>
                        <div className="font-medium text-right">{clientName}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-slate-500 dark:text-slate-400">Vehículo:</div>
                        <div className="font-medium text-right">{vehicleModel}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-slate-500 dark:text-slate-400">Método de pago:</div>
                        <div className="font-medium text-right">{getPaymentMethodText(paymentMethod)}</div>
                    </div>

                    <div className="my-3 border-t border-dashed border-slate-200 dark:border-slate-700 pt-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-slate-500 dark:text-slate-400">Monto:</div>
                            <div className="font-medium text-right">{formatCurrency(amount)}</div>
                        </div>

                        {gps > 0 && (
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-slate-500 dark:text-slate-400">GPS:</div>
                                <div className="font-medium text-right">{formatCurrency(gps)}</div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 text-sm mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                            <div className="text-slate-500 dark:text-slate-400 font-medium">Total:</div>
                            <div className="font-bold text-right text-purple-600 dark:text-purple-400">
                                {formatCurrency(amount + (gps || 0))}
                            </div>
                        </div>
                    </div>

                    {isExpanded && (
                        <div className="flex justify-center gap-2 mt-4">
                            <Button size="sm" variant="outline" className="text-xs h-8">
                                <Printer className="h-3 w-3 mr-1" />
                                Imprimir
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs h-8">
                                <Download className="h-3 w-3 mr-1" />
                                Descargar
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs h-8">
                                <Share2 className="h-3 w-3 mr-1" />
                                Compartir
                            </Button>
                        </div>
                    )}

                    <Button variant="ghost" size="sm" className="w-full text-xs mt-2" onClick={() => setIsExpanded(!isExpanded)}>
                        {isExpanded ? "Ver menos" : "Ver más"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
