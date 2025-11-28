"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"

const projectionData = [
  {
    month: "Jul",
    ingresos: 38500000,
    egresos: 26000000,
    balance: 12500000,
    ingresosProyectados: 39000000,
    egresosProyectados: 26500000,
    balanceProyectado: 12500000,
  },
  {
    month: "Ago",
    ingresos: 0,
    egresos: 0,
    balance: 0,
    ingresosProyectados: 40000000,
    egresosProyectados: 27000000,
    balanceProyectado: 13000000,
  },
  {
    month: "Sep",
    ingresos: 0,
    egresos: 0,
    balance: 0,
    ingresosProyectados: 41000000,
    egresosProyectados: 27500000,
    balanceProyectado: 13500000,
  },
  {
    month: "Oct",
    ingresos: 0,
    egresos: 0,
    balance: 0,
    ingresosProyectados: 42000000,
    egresosProyectados: 28000000,
    balanceProyectado: 14000000,
  },
  {
    month: "Nov",
    ingresos: 0,
    egresos: 0,
    balance: 0,
    ingresosProyectados: 43000000,
    egresosProyectados: 28500000,
    balanceProyectado: 14500000,
  },
  {
    month: "Dic",
    ingresos: 0,
    egresos: 0,
    balance: 0,
    ingresosProyectados: 44000000,
    egresosProyectados: 29000000,
    balanceProyectado: 15000000,
  },
]

export function CashFlowProjection() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="h-[400px] flex items-center justify-center">Cargando proyección...</div>
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="chart">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chart">Gráfico</TabsTrigger>
          <TabsTrigger value="table">Tabla</TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="pt-4">
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value / 1000000}M`}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), ""]}
                  contentStyle={{ borderRadius: "8px" }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="ingresosProyectados"
                  name="Ingresos Proyectados"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="egresosProyectados"
                  name="Egresos Proyectados"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="balanceProyectado"
                  name="Balance Proyectado"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="table" className="pt-4">
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full data-table">
                <thead>
                  <tr>
                    <th>Mes</th>
                    <th>Ingresos Proyectados</th>
                    <th>Egresos Proyectados</th>
                    <th>Balance Proyectado</th>
                  </tr>
                </thead>
                <tbody>
                  {projectionData.map((item) => (
                    <tr key={item.month}>
                      <td>{item.month}</td>
                      <td>{formatCurrency(item.ingresosProyectados)}</td>
                      <td>{formatCurrency(item.egresosProyectados)}</td>
                      <td className="font-medium text-green-500">{formatCurrency(item.balanceProyectado)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-hover-effect">
          <CardContent className="p-6">
            <h3 className="font-medium mb-2">Ingresos Proyectados</h3>
            <p className="text-2xl font-bold text-primary">$249M</p>
            <p className="text-sm text-muted-foreground mt-1">Próximos 6 meses</p>
            <div className="flex items-center mt-2">
              <span className="text-xs text-green-500">+5.2% vs semestre anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover-effect">
          <CardContent className="p-6">
            <h3 className="font-medium mb-2">Egresos Proyectados</h3>
            <p className="text-2xl font-bold text-destructive">$166.5M</p>
            <p className="text-sm text-muted-foreground mt-1">Próximos 6 meses</p>
            <div className="flex items-center mt-2">
              <span className="text-xs text-amber-500">+3.8% vs semestre anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover-effect">
          <CardContent className="p-6">
            <h3 className="font-medium mb-2">Balance Proyectado</h3>
            <p className="text-2xl font-bold text-green-500">$82.5M</p>
            <p className="text-sm text-muted-foreground mt-1">Próximos 6 meses</p>
            <div className="flex items-center mt-2">
              <span className="text-xs text-green-500">+8.4% vs semestre anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
