"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Edit, Trash2, ArrowUpToLine, ArrowDownToLine } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { formatCurrency } from "@/lib/utils"

type CashFlowItem = {
  id: string
  date: string
  description: string
  category: string
  amount: number
  paymentMethod: string
}

export function CashFlowTable({ type }: { type: "income" | "expense" }) {
  const [items, setItems] = useState<CashFlowItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    // Simulación de carga de datos
    const timer = setTimeout(() => {
      if (type === "income") {
        setItems([
          {
            id: "1",
            date: "2023-06-15",
            description: "Pago de cuota - Carlos Rodríguez",
            category: "Cuota de préstamo",
            amount: 354167,
            paymentMethod: "Transferencia",
          },
          {
            id: "2",
            date: "2023-06-14",
            description: "Pago de cuota - María López",
            category: "Cuota de préstamo",
            amount: 333333,
            paymentMethod: "Efectivo",
          },
          {
            id: "3",
            date: "2023-06-12",
            description: "Pago de cuota - Juan Pérez",
            category: "Cuota de préstamo",
            amount: 312500,
            paymentMethod: "Transferencia",
          },
          {
            id: "4",
            date: "2023-06-10",
            description: "Pago de cuota - Ana Gómez",
            category: "Cuota de préstamo",
            amount: 291667,
            paymentMethod: "Efectivo",
          },
          {
            id: "5",
            date: "2023-06-05",
            description: "Intereses bancarios",
            category: "Otros ingresos",
            amount: 125000,
            paymentMethod: "Transferencia",
          },
        ])
      } else {
        setItems([
          {
            id: "1",
            date: "2023-06-16",
            description: "Pago de salarios",
            category: "Nómina",
            amount: 5000000,
            paymentMethod: "Transferencia",
          },
          {
            id: "2",
            date: "2023-06-15",
            description: "Pago de alquiler",
            category: "Alquiler",
            amount: 2500000,
            paymentMethod: "Transferencia",
          },
          {
            id: "3",
            date: "2023-06-10",
            description: "Servicios públicos",
            category: "Servicios",
            amount: 850000,
            paymentMethod: "Transferencia",
          },
          {
            id: "4",
            date: "2023-06-08",
            description: "Compra de suministros",
            category: "Suministros",
            amount: 450000,
            paymentMethod: "Efectivo",
          },
          {
            id: "5",
            date: "2023-06-05",
            description: "Pago de impuestos",
            category: "Impuestos",
            amount: 1200000,
            paymentMethod: "Transferencia",
          },
        ])
      }
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [type])

  const filteredItems = items.filter(
    (item) =>
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por descripción o categoría..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Search className="mr-2 h-4 w-4" />
            Filtros Avanzados
          </Button>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Método de Pago</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-5 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-[200px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-[120px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-[100px]" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-8 rounded-md" />
                        <Skeleton className="h-8 w-8 rounded-md" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No se encontraron registros
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{formatDate(item.date)}</TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {type === "income" ? (
                          <ArrowUpToLine className="h-4 w-4 text-green-500 mr-2" />
                        ) : (
                          <ArrowDownToLine className="h-4 w-4 text-red-500 mr-2" />
                        )}
                        {item.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell
                      className={type === "income" ? "text-green-500 font-medium" : "text-red-500 font-medium"}
                    >
                      {formatCurrency(item.amount)}
                    </TableCell>
                    <TableCell>{item.paymentMethod}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon">
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button variant="outline" size="icon">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
