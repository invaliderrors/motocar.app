import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3 } from "lucide-react"
import {
    BarChart,
    Bar,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    Legend,
    XAxis,
} from "recharts"
import { formatCurrency } from "@/lib/utils"
import { createChartData, CHART_COLORS } from "../utils"
import type { FormCalculations } from "../types"

interface ChartsTabProps {
    calculations: FormCalculations
}

export const ChartsTab: React.FC<ChartsTabProps> = ({ calculations }) => {
    const { paymentMethodData, transactionTypeData } = createChartData(calculations)

    return (
        <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-xl flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    Visualización de Datos
                </CardTitle>
                <CardDescription>Gráficos para analizar la distribución de ingresos y egresos</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-center">Distribución por Método de Pago</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsPieChart>
                                    <Pie
                                        data={paymentMethodData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                        nameKey="name"
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {paymentMethodData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={CHART_COLORS.PAYMENT_METHODS[index % CHART_COLORS.PAYMENT_METHODS.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Legend />
                                    <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                                </RechartsPieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-center">Ingresos vs Egresos</h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={transactionTypeData}>
                                    <XAxis dataKey="name" />
                                    <Bar dataKey="value">
                                        {transactionTypeData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={CHART_COLORS.TRANSACTION_TYPES[index % CHART_COLORS.TRANSACTION_TYPES.length]}
                                            />
                                        ))}
                                    </Bar>
                                    <RechartsTooltip formatter={(value: number, name: string) => [formatCurrency(value), name]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
