"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

// Datos de ejemplo para las estadísticas
const monthlyExpenses = [
    { month: "Enero", total: 3500 },
    { month: "Febrero", total: 3200 },
    { month: "Marzo", total: 3800 },
    { month: "Abril", total: 3600 },
    { month: "Mayo", total: 4200 },
]

const categoryExpenses = [
    { category: "Alquiler", amount: 1200, percentage: 28.6 },
    { category: "Servicios", amount: 650, percentage: 15.5 },
    { category: "Salarios", amount: 1500, percentage: 35.7 },
    { category: "Impuestos", amount: 520, percentage: 12.4 },
    { category: "Mantenimiento", amount: 120, percentage: 2.9 },
    { category: "Compras", amount: 180, percentage: 4.3 },
    { category: "Otros", amount: 30, percentage: 0.7 },
]

const paymentMethodExpenses = [
    { method: "Efectivo", amount: 1250, percentage: 29.8 },
    { method: "Transferencia", amount: 2570, percentage: 61.2 },
    { method: "Tarjeta", amount: 380, percentage: 9.0 },
]

export function ExpenseSummary() {
    const [period, setPeriod] = useState("mayo")

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Resumen de Egresos</h2>
                <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Seleccionar período" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="enero">Enero 2025</SelectItem>
                        <SelectItem value="febrero">Febrero 2025</SelectItem>
                        <SelectItem value="marzo">Marzo 2025</SelectItem>
                        <SelectItem value="abril">Abril 2025</SelectItem>
                        <SelectItem value="mayo">Mayo 2025</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Total de Egresos</CardTitle>
                        <CardDescription>Mayo 2025</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">$4,200.00</div>
                        <p className="text-sm text-muted-foreground mt-1">
                            <span className="text-red-500">↑ 16.7%</span> vs mes anterior
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Promedio Diario</CardTitle>
                        <CardDescription>Mayo 2025</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">$135.48</div>
                        <p className="text-sm text-muted-foreground mt-1">31 días en el mes</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Mayor Categoría</CardTitle>
                        <CardDescription>Mayo 2025</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">Salarios</div>
                        <p className="text-sm text-muted-foreground mt-1">$1,500.00 (35.7% del total)</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="categories">
                <TabsList className="grid w-full md:w-auto grid-cols-3 md:grid-cols-3">
                    <TabsTrigger value="categories">Por Categoría</TabsTrigger>
                    <TabsTrigger value="payment">Por Método de Pago</TabsTrigger>
                    <TabsTrigger value="trend">Tendencia Mensual</TabsTrigger>
                </TabsList>

                <TabsContent value="categories" className="mt-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {categoryExpenses.map((item) => (
                                    <div key={item.category} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                                            <span>{item.category}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right text-sm text-muted-foreground w-16">{item.percentage}%</div>
                                            <div className="text-right font-medium w-24">${item.amount.toFixed(2)}</div>
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-2 mt-2 border-t flex items-center justify-between font-bold">
                                    <span>Total</span>
                                    <span>${categoryExpenses.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payment" className="mt-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {paymentMethodExpenses.map((item) => (
                                    <div key={item.method} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-primary"></div>
                                            <span>{item.method}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right text-sm text-muted-foreground w-16">{item.percentage}%</div>
                                            <div className="text-right font-medium w-24">${item.amount.toFixed(2)}</div>
                                        </div>
                                    </div>
                                ))}
                                <div className="pt-2 mt-2 border-t flex items-center justify-between font-bold">
                                    <span>Total</span>
                                    <span>${paymentMethodExpenses.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="trend" className="mt-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="h-[300px] flex items-end justify-between gap-2">
                                {monthlyExpenses.map((item) => {
                                    const maxHeight = 250
                                    const maxValue = Math.max(...monthlyExpenses.map((e) => e.total))
                                    const height = (item.total / maxValue) * maxHeight

                                    return (
                                        <div key={item.month} className="flex flex-col items-center gap-2">
                                            <div className="w-16 bg-primary rounded-t-md relative group" style={{ height: `${height}px` }}>
                                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-primary/90 text-primary-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    ${item.total.toFixed(2)}
                                                </div>
                                            </div>
                                            <div className="text-xs font-medium">{item.month}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Card>
                <CardHeader>
                    <CardTitle>Egresos Recientes</CardTitle>
                    <CardDescription>Últimos 5 egresos registrados</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { id: "EXP-001", date: "10/05/2025", category: "Alquiler", amount: 1200, recipient: "Inmobiliaria XYZ" },
                            {
                                id: "EXP-002",
                                date: "10/05/2025",
                                category: "Servicios",
                                amount: 150,
                                recipient: "Compañía Eléctrica",
                            },
                            { id: "EXP-003", date: "09/05/2025", category: "Salarios", amount: 850, recipient: "Juan Pérez" },
                            {
                                id: "EXP-004",
                                date: "08/05/2025",
                                category: "Compras",
                                amount: 350,
                                recipient: "Distribuidora de Repuestos",
                            },
                            {
                                id: "EXP-005",
                                date: "07/05/2025",
                                category: "Impuestos",
                                amount: 520,
                                recipient: "Dirección de Impuestos",
                            },
                        ].map((expense) => (
                            <div key={expense.id} className="flex items-center justify-between py-2 border-b last:border-0">
                                <div className="flex flex-col">
                                    <div className="font-medium">{expense.recipient}</div>
                                    <div className="text-sm text-muted-foreground flex gap-2">
                                        <span>{expense.date}</span>
                                        <span>•</span>
                                        <span>{expense.category}</span>
                                    </div>
                                </div>
                                <div className="font-medium text-red-600">-${expense.amount.toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
