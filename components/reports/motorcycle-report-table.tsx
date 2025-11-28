"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DownloadIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpDownIcon,
  BikeIcon as MotorcycleIcon,
} from "lucide-react"

interface MotorcycleReportTableProps {
  data: any[]
}

export function MotorcycleReportTable({ data }: MotorcycleReportTableProps) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState("id")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const itemsPerPage = 5
  const totalPages = Math.ceil(data.length / itemsPerPage)

  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Formatear fecha
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    if (isNaN(dateObj.getTime())) {
      return 'N/A'
    }
    return new Intl.DateTimeFormat("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(dateObj)
  }

  // Filtrar y ordenar datos
  const filteredData = data
    .filter(
      (motorcycle) =>
        motorcycle.id.toLowerCase().includes(search.toLowerCase()) ||
        motorcycle.brand.toLowerCase().includes(search.toLowerCase()) ||
        motorcycle.model.toLowerCase().includes(search.toLowerCase()) ||
        motorcycle.plate.toLowerCase().includes(search.toLowerCase()) ||
        (motorcycle.clientName && motorcycle.clientName.toLowerCase().includes(search.toLowerCase())),
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortBy] > b[sortBy] ? 1 : -1
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1
      }
    })

  // Paginar datos
  const paginatedData = filteredData.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  // Manejar cambio de ordenamiento
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("asc")
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3 shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Reporte de Vehículos</CardTitle>
            <CardDescription>Listado detallado de vehículos y su estado</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <DownloadIcon className="h-4 w-4" />
            Exportar
          </Button>
        </div>
        <div className="flex items-center mt-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar vehículos..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <div className="rounded-md border flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 p-0 font-medium"
                    onClick={() => handleSort("id")}
                  >
                    ID
                    <ArrowUpDownIcon className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 p-0 font-medium"
                    onClick={() => handleSort("brand")}
                  >
                    Marca/Modelo
                    <ArrowUpDownIcon className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 p-0 font-medium"
                    onClick={() => handleSort("plate")}
                  >
                    Placa
                    <ArrowUpDownIcon className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Detalles</TableHead>
                <TableHead className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 p-0 font-medium ml-auto"
                    onClick={() => handleSort("price")}
                  >
                    Precio
                    <ArrowUpDownIcon className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 p-0 font-medium mx-auto"
                    onClick={() => handleSort("purchaseDate")}
                  >
                    Fecha Compra
                    <ArrowUpDownIcon className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 p-0 font-medium mx-auto"
                    onClick={() => handleSort("status")}
                  >
                    Estado
                    <ArrowUpDownIcon className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Cliente</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((motorcycle) => (
                  <TableRow key={motorcycle.id}>
                    <TableCell className="font-medium">{motorcycle.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MotorcycleIcon className="h-4 w-4 text-blue-500" />
                        <div>
                          <div className="font-medium">{motorcycle.brand}</div>
                          <div className="text-sm text-muted-foreground">{motorcycle.model}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{motorcycle.plate}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Color:</span> {motorcycle.color}
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Año:</span> {motorcycle.year}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(motorcycle.price)}</TableCell>
                    <TableCell className="text-center">{formatDate(motorcycle.purchaseDate)}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          motorcycle.status === "AVAILABLE"
                            ? "outline"
                            : motorcycle.status === "FINANCED"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {motorcycle.status === "AVAILABLE"
                          ? "Disponible"
                          : motorcycle.status === "FINANCED"
                            ? "Financiada"
                            : "Vendida"}
                      </Badge>
                    </TableCell>
                    <TableCell>{motorcycle.clientName || <span className="text-muted-foreground">N/A</span>}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No se encontraron vehículos
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginación */}
        {filteredData.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t shrink-0">
            <p className="text-sm text-muted-foreground">
              Mostrando {(page - 1) * itemsPerPage + 1} a {Math.min(page * itemsPerPage, filteredData.length)} de{" "}
              {filteredData.length} vehículos
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                <ChevronLeftIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                <ChevronRightIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
