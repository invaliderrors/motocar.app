"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DownloadIcon,
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpDownIcon,
  Navigation,
  Wrench,
  Gavel,
  PhoneIcon,
  UserIcon,
} from "lucide-react"

interface VehicleStatusReportTableProps {
  data: any[]
  onExport?: (format: "excel" | "pdf" | "csv", statusFilter: string) => void
}

export function VehicleStatusReportTable({ data, onExport }: VehicleStatusReportTableProps) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("updatedAt")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const itemsPerPage = 10
  const totalPages = Math.ceil(data.length / itemsPerPage)

  // Handle export with current filter
  const handleExport = (format: "excel" | "pdf" | "csv") => {
    if (onExport) {
      onExport(format, statusFilter)
    }
  }

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

  // Get vehicle status badge
  const getVehicleStatusBadge = (status: string) => {
    switch (status) {
      case "IN_CIRCULATION":
        return (
          <Badge className="bg-green-500 hover:bg-green-600 text-white">
            <Navigation className="h-3 w-3 mr-1" />
            En Circulación
          </Badge>
        )
      case "IN_WORKSHOP":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
            <Wrench className="h-3 w-3 mr-1" />
            En Taller
          </Badge>
        )
      case "SEIZED_BY_PROSECUTOR":
        return (
          <Badge variant="destructive">
            <Gavel className="h-3 w-3 mr-1" />
            Incautado
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Get loan status badge
  const getLoanStatusBadge = (status: string | null) => {
    if (!status) {
      return <Badge variant="outline">Sin contrato</Badge>
    }

    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-blue-500 hover:bg-blue-600 text-white">Activo</Badge>
      case "COMPLETED":
        return <Badge className="bg-green-500 hover:bg-green-600 text-white">Completado</Badge>
      case "DEFAULTED":
        return <Badge variant="destructive">Incumplido</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Filtrar y ordenar datos
  const filteredData = data
    .filter(
      (vehicle) =>
        (statusFilter === "all" || vehicle.vehicleStatus === statusFilter) &&
        (vehicle.brand.toLowerCase().includes(search.toLowerCase()) ||
          vehicle.model.toLowerCase().includes(search.toLowerCase()) ||
          vehicle.plate.toLowerCase().includes(search.toLowerCase()) ||
          (vehicle.clientName && vehicle.clientName.toLowerCase().includes(search.toLowerCase())) ||
          (vehicle.providerName && vehicle.providerName.toLowerCase().includes(search.toLowerCase()))),
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
            <CardTitle>Reporte de Estado de Vehículos</CardTitle>
            <CardDescription>
              Estado operacional de los vehículos y asignación actual
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => handleExport("excel")}
              title="Exportar a Excel"
            >
              <DownloadIcon className="h-4 w-4" />
              Excel
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => handleExport("pdf")}
              title="Exportar a PDF"
            >
              <DownloadIcon className="h-4 w-4" />
              PDF
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => handleExport("csv")}
              title="Exportar a CSV"
            >
              <DownloadIcon className="h-4 w-4" />
              CSV
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por marca, modelo, placa, cliente o proveedor..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Estado del vehículo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="IN_CIRCULATION">En Circulación</SelectItem>
              <SelectItem value="IN_WORKSHOP">En Taller</SelectItem>
              <SelectItem value="SEIZED_BY_PROSECUTOR">Incautado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <div className="rounded-md border flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 p-0 font-medium"
                    onClick={() => handleSort("brand")}
                  >
                    Vehículo
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
                <TableHead>Especificaciones</TableHead>
                <TableHead className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1 p-0 font-medium mx-auto"
                    onClick={() => handleSort("vehicleStatus")}
                  >
                    Estado Vehículo
                    <ArrowUpDownIcon className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-center">Estado contrato</TableHead>
                <TableHead>Cliente Actual</TableHead>
                <TableHead>Proveedor</TableHead>
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
                    onClick={() => handleSort("updatedAt")}
                  >
                    Última Act.
                    <ArrowUpDownIcon className="h-3 w-3" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((vehicle) => (
                  <TableRow key={vehicle.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{vehicle.brand}</div>
                        <div className="text-sm text-muted-foreground">{vehicle.model}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono font-medium">{vehicle.plate}</span>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-0.5">
                        {vehicle.color && (
                          <div>
                            <span className="text-muted-foreground">Color:</span> {vehicle.color}
                          </div>
                        )}
                        {vehicle.cc && (
                          <div>
                            <span className="text-muted-foreground">CC:</span> {vehicle.cc}
                          </div>
                        )}
                        {vehicle.engine && (
                          <div className="text-xs">
                            <span className="text-muted-foreground">Motor:</span> {vehicle.engine}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {getVehicleStatusBadge(vehicle.vehicleStatus)}
                    </TableCell>
                    <TableCell className="text-center">
                      {getLoanStatusBadge(vehicle.loanStatus)}
                    </TableCell>
                    <TableCell>
                      {vehicle.clientName ? (
                        <div>
                          <div className="flex items-center gap-1 font-medium">
                            <UserIcon className="h-3 w-3 text-muted-foreground" />
                            {vehicle.clientName}
                          </div>
                          {vehicle.clientPhone && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <PhoneIcon className="h-3 w-3" />
                              {vehicle.clientPhone}
                            </div>
                          )}
                          {vehicle.contractNumber && (
                            <div className="text-xs text-muted-foreground">
                              Contrato: {vehicle.contractNumber}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Sin cliente</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{vehicle.providerName}</span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(vehicle.price)}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {formatDate(vehicle.updatedAt)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-4">
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
              <span className="text-sm">
                Página {page} de {totalPages}
              </span>
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
