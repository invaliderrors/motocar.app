"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calculator } from "lucide-react"

const calculatorSchema = z.object({
    amount: z.coerce.number().min(1, {
        message: "El monto debe ser mayor a 0",
    }),
    downPayment: z.coerce.number().min(0, {
        message: "El pago inicial no puede ser negativo",
    }),
    installments: z.coerce.number().min(1, {
        message: "El número de cuotas debe ser mayor a 0",
    }),
    interestRate: z.coerce.number().min(0, {
        message: "La tasa de interés no puede ser negativa",
    }),
    interestType: z.enum(["FIXED", "COMPOUND"], {
        required_error: "Debe seleccionar un tipo de interés",
    }),
})

type CalculatorFormValues = z.infer<typeof calculatorSchema>

type AmortizationRow = {
    installmentNumber: number
    payment: number
    principalPayment: number
    interestPayment: number
    remainingBalance: number
}

export function LoanCalculator() {
    const [amortizationTable, setAmortizationTable] = useState<AmortizationRow[]>([])
    const [loanSummary, setLoanSummary] = useState<{
        financedAmount: number
        totalWithInterest: number
        monthlyPayment: number
        totalInterest: number
    } | null>(null)

    const form = useForm<CalculatorFormValues>({
        resolver: zodResolver(calculatorSchema),
        defaultValues: {
            amount: 10000000,
            downPayment: 1000000,
            installments: 24,
            interestRate: 12,
            interestType: "FIXED",
        },
    })

    function onSubmit(values: CalculatorFormValues) {
        const { amount, downPayment, installments, interestRate, interestType } = values
        const financedAmount = amount - downPayment

        let totalWithInterest: number
        let monthlyPayment: number

        if (interestType === "FIXED") {
            // Interés simple
            const interestAmount = financedAmount * (interestRate / 100) * (installments / 12)
            totalWithInterest = financedAmount + interestAmount
        } else {
            // Interés compuesto
            const monthlyRate = interestRate / 100 / 12
            totalWithInterest = financedAmount * Math.pow(1 + monthlyRate, installments)
        }

        monthlyPayment = totalWithInterest / installments

        // Calcular tabla de amortización
        const table: AmortizationRow[] = []
        let balance = financedAmount
        const monthlyRate = interestRate / 100 / 12

        for (let i = 1; i <= installments; i++) {
            let interestPayment: number
            let principalPayment: number

            if (interestType === "FIXED") {
                // Para interés fijo, el interés se distribuye uniformemente
                interestPayment = (financedAmount * (interestRate / 100) * (installments / 12)) / installments
                principalPayment = monthlyPayment - interestPayment
            } else {
                // Para interés compuesto, el interés se calcula sobre el saldo restante
                interestPayment = balance * monthlyRate
                principalPayment = monthlyPayment - interestPayment
            }

            balance -= principalPayment

            // Asegurarse de que el saldo final sea exactamente 0
            if (i === installments) {
                principalPayment += balance
                balance = 0
            }

            table.push({
                installmentNumber: i,
                payment: monthlyPayment,
                principalPayment,
                interestPayment,
                remainingBalance: Math.max(0, balance),
            })
        }

        setAmortizationTable(table)
        setLoanSummary({
            financedAmount,
            totalWithInterest,
            monthlyPayment,
            totalInterest: totalWithInterest - financedAmount,
        })
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Calculator className="mr-2 h-5 w-5 text-blue-400" />
                        Calculadora de arrendamientos
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Precio Total</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="downPayment"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pago Inicial</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="installments"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Número de Cuotas</FormLabel>
                                            <FormControl>
                                                <Input type="number" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="interestRate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tasa de Interés (%)</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="interestType"
                                    render={({ field }) => (
                                        <FormItem className="space-y-3">
                                            <FormLabel>Tipo de Interés</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                    className="flex flex-col space-y-1"
                                                >
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="FIXED" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">Fijo (Simple)</FormLabel>
                                                    </FormItem>
                                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                                        <FormControl>
                                                            <RadioGroupItem value="COMPOUND" />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">Compuesto</FormLabel>
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit">Calcular</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {loanSummary && (
                <Card className="bg-blue-900/20 border-blue-800/30">
                    <CardContent className="pt-6">
                        <h3 className="text-lg font-semibold mb-4 text-blue-200">Resumen del Préstamo</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-blue-300">Monto Financiado:</p>
                                <p className="text-lg font-medium text-white">{formatCurrency(loanSummary.financedAmount)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-blue-300">Total a Pagar (con interés):</p>
                                <p className="text-lg font-medium text-white">{formatCurrency(loanSummary.totalWithInterest)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-blue-300">Interés Total:</p>
                                <p className="text-lg font-medium text-green-400">{formatCurrency(loanSummary.totalInterest)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-blue-300">Cuota Mensual:</p>
                                <p className="text-lg font-medium text-amber-400">{formatCurrency(loanSummary.monthlyPayment)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {amortizationTable.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Tabla de Amortización</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Cuota</TableHead>
                                        <TableHead>Pago</TableHead>
                                        <TableHead>Capital</TableHead>
                                        <TableHead>Interés</TableHead>
                                        <TableHead>Saldo</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {amortizationTable.map((row) => (
                                        <TableRow key={row.installmentNumber}>
                                            <TableCell>{row.installmentNumber}</TableCell>
                                            <TableCell>{formatCurrency(row.payment)}</TableCell>
                                            <TableCell>{formatCurrency(row.principalPayment)}</TableCell>
                                            <TableCell>{formatCurrency(row.interestPayment)}</TableCell>
                                            <TableCell>{formatCurrency(row.remainingBalance)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
