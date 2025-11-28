"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/utils"

export function CashFlowSummary() {
  const summaryData = [
    {
      category: "Ingresos",
      items: [
        { name: "Cuotas de arrendamientos", amount: 112500000 },
        { name: "Intereses", amount: 8500000 },
        { name: "Otros ingresos", amount: 4500000 },
      ],
    },
    {
      category: "Egresos",
      items: [
        { name: "Nómina", amount: 35000000 },
        { name: "Alquiler", amount: 15000000 },
        { name: "Servicios", amount: 5100000 },
        { name: "Suministros", amount: 2700000 },
        { name: "Impuestos", amount: 18500000 },
        { name: "Otros gastos", amount: 1900000 },
      ],
    },
  ]

  const getTotalIncome = () => {
    return summaryData[0].items.reduce((total, item) => total + item.amount, 0)
  }

  const getTotalExpenses = () => {
    return summaryData[1].items.reduce((total, item) => total + item.amount, 0)
  }

  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 card-hover-effect">
        <CardHeader>
          <CardTitle>Resumen por Categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {summaryData.map((section) => (
              <div key={section.category}>
                <h3 className="font-medium mb-2">{section.category}</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Categoría</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                      <TableHead className="text-right">Porcentaje</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {section.items.map((item) => (
                      <TableRow key={item.name}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                        <TableCell className="text-right">
                          {(
                            (item.amount / (section.category === "Ingresos" ? getTotalIncome() : getTotalExpenses())) *
                            100
                          ).toFixed(1)}
                          %
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell className="font-bold">Total</TableCell>
                      <TableCell className="text-right font-bold">
                        {formatCurrency(section.category === "Ingresos" ? getTotalIncome() : getTotalExpenses())}
                      </TableCell>
                      <TableCell className="text-right font-bold">100%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="card-hover-effect">
        <CardHeader>
          <CardTitle>Balance General</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="font-medium">Total Ingresos</span>
              <span className="text-xl font-bold text-green-500">{formatCurrency(getTotalIncome())}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="font-medium">Total Egresos</span>
              <span className="text-xl font-bold text-red-500">{formatCurrency(getTotalExpenses())}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-medium">Balance</span>
              <span className={`text-2xl font-bold ${getBalance() >= 0 ? "text-green-500" : "text-red-500"}`}>
                {formatCurrency(getBalance())}
              </span>
            </div>

            <div className="mt-8">
              <h3 className="font-medium mb-4">Indicadores</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Margen de Beneficio</span>
                    <span className="text-sm font-medium">{((getBalance() / getTotalIncome()) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ width: `${(getBalance() / getTotalIncome()) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Ratio Ingresos/Egresos</span>
                    <span className="text-sm font-medium">{(getTotalIncome() / getTotalExpenses()).toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary rounded-full h-2"
                      style={{ width: `${Math.min((getTotalIncome() / getTotalExpenses()) * 50, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
