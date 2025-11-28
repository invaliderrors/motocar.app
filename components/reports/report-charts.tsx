"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts"

interface ReportChartsProps {
  data: any
  activeTab: string
}

export function ReportCharts({ data, activeTab }: ReportChartsProps) {
  // Colores para los gráficos
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  // Formatear moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Formatear moneda compacta
  const formatCompactCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    }
    return `$${value}`
  }

  // Datos para los gráficos según la pestaña activa usando datos reales
  const getChartData = () => {
    switch (activeTab) {
      case "prestamos":
        // Agrupar contratos por estado
        const loansByStatus = [
          { name: "Activos", value: data.loans.active },
          { name: "Completados", value: data.loans.completed },
          { name: "En Mora", value: data.loans.defaulted },
        ].filter(item => item.value > 0)

        // Agrupar contratos por frecuencia de pago
        const loansByFrequency: { [key: string]: number } = {}
        data.loans.items.forEach((loan: any) => {
          const freq = loan.paymentFrequency || 'Semanal'
          loansByFrequency[freq] = (loansByFrequency[freq] || 0) + 1
        })
        const frequencyData = Object.entries(loansByFrequency).map(([name, value]) => ({
          name,
          value
        }))

        // Agrupar contratos por tipo de interés
        const loansByInterestType: { [key: string]: number } = {}
        data.loans.items.forEach((loan: any) => {
          const type = loan.interestType || 'Fijo'
          loansByInterestType[type] = (loansByInterestType[type] || 0) + Number(loan.amount || 0)
        })
        const interestTypeData = Object.entries(loansByInterestType).map(([name, value]) => ({
          name,
          value
        }))

        return {
          title: "Análisis de contratos",
          description: "Distribución y estadísticas",
          pieData: loansByStatus,
          barData: interestTypeData.length > 0 ? interestTypeData : [{ name: 'Sin datos', value: 0 }],
          lineData: frequencyData.length > 0 ? frequencyData : [{ name: 'Sin datos', value: 0 }],
          pieLabel: "Estado",
          barLabel: "Monto por Tipo",
          lineLabel: "Por Frecuencia",
          isCurrency: true,
        }

      case "pagos":
        // Distribución de pagos
        const paymentsByStatus = [
          { name: "A Tiempo", value: data.payments.onTime },
          { name: "Tardíos", value: data.payments.late },
        ].filter(item => item.value > 0)

        // Agrupar pagos por método
        const paymentsByMethod: { [key: string]: number } = {}
        data.payments.items.forEach((payment: any) => {
          const method = payment.paymentMethod || 'Efectivo'
          paymentsByMethod[method] = (paymentsByMethod[method] || 0) + Number(payment.amount || 0)
        })
        const methodData = Object.entries(paymentsByMethod).map(([name, value]) => ({
          name,
          value
        }))

        // Top clientes por monto pagado
        const clientPayments: { [key: string]: number } = {}
        data.payments.items.forEach((payment: any) => {
          const client = payment.clientName || 'Sin nombre'
          clientPayments[client] = (clientPayments[client] || 0) + Number(payment.amount || 0)
        })
        const topClients = Object.entries(clientPayments)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([name, value]) => ({ name: name.split(' ')[0], value }))

        return {
          title: "Análisis de Pagos",
          description: "Distribución y estadísticas",
          pieData: paymentsByStatus,
          barData: methodData.length > 0 ? methodData : [{ name: 'Sin datos', value: 0 }],
          lineData: topClients.length > 0 ? topClients : [{ name: 'Sin datos', value: 0 }],
          pieLabel: "Puntualidad",
          barLabel: "Por Método",
          lineLabel: "Top Clientes",
          isCurrency: true,
        }

      case "clientes":
        // Distribución de clientes
        const clientsByStatus = [
          { name: "Activos", value: data.clients.active },
          { name: "Inactivos", value: data.clients.inactive },
        ].filter(item => item.value > 0)

        // Top clientes por monto total
        const topClientsByAmount = [...data.clients.items]
          .sort((a: any, b: any) => b.totalAmount - a.totalAmount)
          .slice(0, 6)
          .map((client: any) => ({
            name: client.name.split(' ')[0],
            value: client.totalAmount
          }))

        // Clientes por cantidad de contratos
        const clientsByLoans = [...data.clients.items]
          .sort((a: any, b: any) => b.totalLoans - a.totalLoans)
          .slice(0, 5)
          .map((client: any) => ({
            name: client.name.split(' ')[0],
            value: client.totalLoans
          }))

        return {
          title: "Análisis de Clientes",
          description: "Distribución y estadísticas",
          pieData: clientsByStatus,
          barData: topClientsByAmount.length > 0 ? topClientsByAmount : [{ name: 'Sin datos', value: 0 }],
          lineData: clientsByLoans.length > 0 ? clientsByLoans : [{ name: 'Sin datos', value: 0 }],
          pieLabel: "Estado",
          barLabel: "Top por Monto",
          lineLabel: "Top por contratos",
          isCurrency: false,
        }

      case "motocicletas":
        // Distribución de vehículos
        const vehiclesByStatus = [
          { name: "Financiadas", value: data.motorcycles.financed },
          { name: "Disponibles", value: data.motorcycles.available },
        ].filter(item => item.value > 0)

        // Vehículos por marca
        const vehiclesByBrand: { [key: string]: number } = {}
        data.motorcycles.items.forEach((vehicle: any) => {
          const brand = vehicle.brand || 'Sin marca'
          vehiclesByBrand[brand] = (vehiclesByBrand[brand] || 0) + 1
        })
        const brandData = Object.entries(vehiclesByBrand)
          .sort(([, a], [, b]) => b - a)
          .map(([name, value]) => ({ name, value }))

        // Vehículos por precio
        const vehiclesByPrice = [...data.motorcycles.items]
          .filter((v: any) => v.price > 0)
          .sort((a: any, b: any) => b.price - a.price)
          .slice(0, 6)
          .map((vehicle: any) => ({
            name: `${vehicle.brand} ${vehicle.model}`.substring(0, 15),
            value: vehicle.price
          }))

        return {
          title: "Análisis de Vehículos",
          description: "Distribución y estadísticas",
          pieData: vehiclesByStatus,
          barData: brandData.length > 0 ? brandData : [{ name: 'Sin datos', value: 0 }],
          lineData: vehiclesByPrice.length > 0 ? vehiclesByPrice : [{ name: 'Sin datos', value: 0 }],
          pieLabel: "Disponibilidad",
          barLabel: "Por Marca",
          lineLabel: "Top por Precio",
          isCurrency: false,
        }

      default:
        return {
          title: "Análisis General",
          description: "Selecciona una pestaña",
          pieData: [],
          barData: [],
          lineData: [],
          pieLabel: "",
          barLabel: "",
          lineLabel: "",
          isCurrency: false,
        }
    }
  }

  const chartData = getChartData()

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-2 px-3 pt-3 space-y-0 shrink-0">
        <CardTitle className="text-sm font-semibold">{chartData.title}</CardTitle>
        <CardDescription className="text-[11px]">{chartData.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0 flex flex-col min-h-0">
        <Tabs defaultValue="distribucion" className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full grid grid-cols-3 h-8 mx-3 mb-2 shrink-0">
            <TabsTrigger value="distribucion" className="text-[10px] py-1">Estado</TabsTrigger>
            <TabsTrigger value="tendencia" className="text-[10px] py-1">Top</TabsTrigger>
            <TabsTrigger value="comparativa" className="text-[10px] py-1">Análisis</TabsTrigger>
          </TabsList>

          <div className="flex-1 min-h-0 pb-3">
            <TabsContent value="distribucion" className="px-3 mt-0 h-full">
              <div className="h-full flex items-center justify-center">
                {chartData.pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData.pieData}
                        cx="50%"
                        cy="45%"
                        labelLine={false}
                        outerRadius="50%"
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}`, chartData.pieLabel]}
                        contentStyle={{ fontSize: '11px' }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        wrapperStyle={{ fontSize: '11px' }}
                        formatter={(value, entry: any) => `${value}: ${entry.payload.value}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-muted-foreground text-xs">
                    No hay datos disponibles
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="tendencia" className="px-3 mt-0 h-full">
              <div className="h-full">
                {chartData.lineData.length > 0 && chartData.lineData[0].name !== 'Sin datos' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.lineData} layout="horizontal" margin={{ top: 5, right: 5, left: -5, bottom: 5 }}>
                      <XAxis type="category" dataKey="name" fontSize={9} />
                      <YAxis 
                        type="number" 
                        fontSize={9}
                        width={45}
                        tickFormatter={(value) => 
                          activeTab === "clientes" || activeTab === "motocicletas"
                            ? `${value}`
                            : formatCompactCurrency(value)
                        }
                      />
                      <Tooltip
                        formatter={(value) => [
                          activeTab === "clientes" || activeTab === "motocicletas" 
                            ? value 
                            : formatCurrency(Number(value)),
                          chartData.lineLabel
                        ]}
                        contentStyle={{ fontSize: '10px' }}
                      />
                      <Bar dataKey="value" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-center text-muted-foreground text-xs">
                    No hay datos suficientes
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="comparativa" className="px-3 mt-0 h-full">
              <div className="h-full">
                {chartData.barData.length > 0 && chartData.barData[0].name !== 'Sin datos' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData.barData} margin={{ top: 5, right: 5, left: -5, bottom: 5 }}>
                      <XAxis dataKey="name" fontSize={9} />
                      <YAxis
                        fontSize={9}
                        width={45}
                        tickFormatter={(value) =>
                          chartData.isCurrency || activeTab === "motocicletas"
                            ? formatCompactCurrency(value)
                            : `${value}`
                        }
                      />
                      <Tooltip
                        formatter={(value) => [
                          chartData.isCurrency || activeTab === "motocicletas"
                            ? formatCurrency(Number(value))
                            : value,
                          chartData.barLabel
                        ]}
                        contentStyle={{ fontSize: '10px' }}
                      />
                      <Bar dataKey="value" fill="#10b981" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-center text-muted-foreground text-xs">
                    No hay datos suficientes
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}
