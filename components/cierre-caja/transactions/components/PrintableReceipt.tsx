"use client"

import { formatCurrency } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Transaction } from "../constants/types"

interface PrintableReceiptProps {
    transaction: Transaction
}

export function PrintableReceipt({ transaction }: PrintableReceiptProps) {
    const formatSpanishDate = (date: Date) => {
        return format(new Date(date), "d 'de' MMMM 'de' yyyy", { locale: es })
    }

    const formatSpanishTime = (date: Date) => {
        return format(new Date(date), "HH:mm:ss", { locale: es })
    }

    const getPaymentMethodLabel = (method: string) => {
        const labels: Record<string, string> = {
            CASH: "Efectivo",
            CARD: "Tarjeta",
            TRANSACTION: "Transferencia",
        }
        return labels[method] || method
    }

    const isIncome = transaction.type === "income"

    return (
        <div className="print:block hidden">
            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        .printable-receipt, .printable-receipt * {
                            visibility: visible;
                        }
                        .printable-receipt {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                        }
                    }
                `}
            </style>
            <div className="printable-receipt max-w-2xl mx-auto p-8 bg-white text-black">
                {/* Header */}
                <div className="text-center mb-8 border-b-2 border-black pb-4">
                    <h1 className="text-3xl font-bold mb-2">RECIBO DE {isIncome ? "PAGO" : "EGRESO"}</h1>
                    <p className="text-sm">MotoFácil - Sistema de Gestión</p>
                    <p className="text-xs mt-1">{formatSpanishDate(new Date())} - {formatSpanishTime(new Date())}</p>
                </div>

                {/* Transaction Type */}
                <div className="mb-6 text-center">
                    <div
                        className={`inline-block px-6 py-2 text-xl font-bold ${
                            isIncome ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        } rounded`}
                    >
                        {isIncome ? "INGRESO" : "EGRESO"}
                    </div>
                </div>

                {/* Amount */}
                <div className="mb-8 text-center border-2 border-black rounded p-6">
                    <p className="text-sm mb-2">MONTO TOTAL</p>
                    <p className="text-4xl font-bold">
                        {isIncome ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                    </p>
                    
                    {/* Amount Breakdown for Income */}
                    {isIncome && transaction.baseAmount !== undefined && transaction.gpsAmount !== undefined && (
                        <div className="mt-4 pt-4 border-t border-gray-300">
                            <div className="flex justify-between mb-2">
                                <span>Cuota base:</span>
                                <span className="font-semibold">{formatCurrency(transaction.baseAmount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>GPS:</span>
                                <span className="font-semibold">{formatCurrency(transaction.gpsAmount)}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="space-y-4 mb-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-gray-600 mb-1">FECHA DE PAGO</p>
                            <p className="font-semibold">{formatSpanishDate(transaction.date)}</p>
                            <p className="text-sm">{formatSpanishTime(transaction.date)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-600 mb-1">MÉTODO DE PAGO</p>
                            <p className="font-semibold">{getPaymentMethodLabel(transaction.paymentMethod)}</p>
                        </div>
                    </div>

                    {transaction.isLate && transaction.latePaymentDate && (
                        <div className="bg-yellow-100 p-3 rounded border border-yellow-300">
                            <p className="text-xs font-semibold mb-1">PAGO CON MORA</p>
                            <p className="text-sm">
                                Fecha de vencimiento: {formatSpanishDate(transaction.latePaymentDate)}
                            </p>
                        </div>
                    )}

                    <div>
                        <p className="text-xs text-gray-600 mb-1">DESCRIPCIÓN</p>
                        <p className="font-semibold">{transaction.description}</p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-600 mb-1">CATEGORÍA</p>
                        <p className="font-semibold">{transaction.category}</p>
                    </div>

                    {transaction.reference && (
                        <div>
                            <p className="text-xs text-gray-600 mb-1">REFERENCIA</p>
                            <p className="font-mono text-sm">{transaction.reference}</p>
                        </div>
                    )}

                    {isIncome && transaction.client && (
                        <div>
                            <p className="text-xs text-gray-600 mb-1">CLIENTE</p>
                            <p className="font-semibold">{transaction.client}</p>
                        </div>
                    )}

                    {!isIncome && transaction.createdBy && (
                        <div>
                            <p className="text-xs text-gray-600 mb-1">REGISTRADO POR</p>
                            <p className="font-semibold">{transaction.createdBy.username}</p>
                        </div>
                    )}

                    {transaction.provider && (
                        <div>
                            <p className="text-xs text-gray-600 mb-1">PROVEEDOR</p>
                            <p className="font-semibold">{transaction.provider.name}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t-2 border-black pt-4 mt-8">
                    <div className="text-xs space-y-1">
                        <p>
                            <span className="font-semibold">ID de Transacción:</span> {transaction.id}
                        </p>
                        <p>
                            <span className="font-semibold">Hora de Registro:</span> {transaction.time}
                        </p>
                    </div>
                </div>

                {/* Signature */}
                <div className="mt-12 pt-8 border-t border-gray-300">
                    <div className="flex justify-between">
                        <div className="text-center">
                            <div className="border-t border-black w-48 mb-2"></div>
                            <p className="text-sm">Firma del Cliente</p>
                        </div>
                        <div className="text-center">
                            <div className="border-t border-black w-48 mb-2"></div>
                            <p className="text-sm">Firma Autorizada</p>
                        </div>
                    </div>
                </div>

                {/* Legal Text */}
                <div className="mt-8 text-center text-xs text-gray-600">
                    <p>Este documento es un comprobante oficial de la transacción realizada.</p>
                    <p>Conserve este recibo para futuros reclamos.</p>
                </div>
            </div>
        </div>
    )
}
