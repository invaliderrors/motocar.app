"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
    Building, 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    Bike, 
    FileText, 
    Calendar,
    Activity,
    ShoppingCart,
    CreditCard,
    AlertCircle
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { providerStatsService } from "@/lib/services/provider-stats.service"
import type { ProviderDetails } from "@/lib/types"

interface ProviderDetailsModalProps {
    providerId: string | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ProviderDetailsModal({ providerId, open, onOpenChange }: ProviderDetailsModalProps) {
    const [details, setDetails] = useState<ProviderDetails | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (providerId && open) {
            loadProviderDetails()
        }
    }, [providerId, open])

    const loadProviderDetails = async () => {
        if (!providerId) return

        setLoading(true)
        setError(null)
        try {
            const data = await providerStatsService.getProviderDetails(providerId)
            setDetails(data)
        } catch (err) {
            setError("Error al cargar los detalles del proveedor")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(amount)
    }

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { label: string; className: string }> = {
            ACTIVE: { label: "Activo", className: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" },
            COMPLETED: { label: "Completado", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" },
            PENDING: { label: "Pendiente", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" },
            DEFAULTED: { label: "Incumplido", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300" },
        }
        const config = statusConfig[status] || statusConfig.PENDING
        return <Badge className={config.className}>{config.label}</Badge>
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <Building className="h-6 w-6 text-blue-500" />
                        {loading ? "Cargando..." : details?.provider.name || "Detalles del Proveedor"}
                    </DialogTitle>
                </DialogHeader>

                <ScrollArea className="h-[calc(90vh-120px)]">
                    {loading ? (
                        <div className="space-y-4 p-4">
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-64 w-full" />
                            <Skeleton className="h-64 w-full" />
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                            <p className="text-red-600 dark:text-red-400">{error}</p>
                        </div>
                    ) : details ? (
                        <div className="space-y-6 p-4">
                            {/* Summary Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Card className="border-blue-100 dark:border-blue-900/30">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <Bike className="h-4 w-4 text-blue-500" />
                                            Vehículos
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{details.stats.totalVehicles}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {details.stats.vehiclesByStatus.RENTED} arrendados
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-green-100 dark:border-green-900/30">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-green-500" />
                                            Arrendamientos
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{details.stats.activeLoans}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {details.stats.completedLoans} completados
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-amber-100 dark:border-amber-900/30">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <DollarSign className="h-4 w-4 text-amber-500" />
                                            Ingresos Totales
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{formatCurrency(details.stats.totalRevenue)}</div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatCurrency(details.stats.pendingPayments)} pendiente
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className={`border-${details.stats.financialSummary.netProfit >= 0 ? 'green' : 'red'}-100`}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            {details.stats.financialSummary.netProfit >= 0 ? (
                                                <TrendingUp className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <TrendingDown className="h-4 w-4 text-red-500" />
                                            )}
                                            Ganancia Neta
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className={`text-2xl font-bold ${details.stats.financialSummary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatCurrency(details.stats.financialSummary.netProfit)}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {formatCurrency(details.stats.totalExpenses)} en gastos
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Tabs with Details */}
                            <Tabs defaultValue="vehicles" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="vehicles">
                                        <Bike className="h-4 w-4 mr-2" />
                                        Vehículos
                                    </TabsTrigger>
                                    <TabsTrigger value="loans">
                                        <FileText className="h-4 w-4 mr-2" />
                                        Arrendamientos
                                    </TabsTrigger>
                                    <TabsTrigger value="expenses">
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Gastos
                                    </TabsTrigger>
                                    <TabsTrigger value="activity">
                                        <Activity className="h-4 w-4 mr-2" />
                                        Actividad
                                    </TabsTrigger>
                                </TabsList>

                                {/* Vehicles Tab */}
                                <TabsContent value="vehicles">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Vehículos Recientes</CardTitle>
                                            <CardDescription>Últimos 5 vehículos registrados</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {details.recentVehicles.length === 0 ? (
                                                <p className="text-center text-muted-foreground py-8">No hay vehículos registrados</p>
                                            ) : (
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Placa</TableHead>
                                                            <TableHead>Marca/Modelo</TableHead>
                                                            <TableHead>Precio</TableHead>
                                                            <TableHead>Fecha</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {details.recentVehicles.map((vehicle) => (
                                                            <TableRow key={vehicle.id}>
                                                                <TableCell className="font-medium">{vehicle.plate}</TableCell>
                                                                <TableCell>
                                                                    {vehicle.brand} {vehicle.model}
                                                                </TableCell>
                                                                <TableCell>{formatCurrency(vehicle.purchasePrice)}</TableCell>
                                                                <TableCell>
                                                                    {format(new Date(vehicle.createdAt), "dd MMM yyyy", { locale: es })}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Loans Tab */}
                                <TabsContent value="loans">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Arrendamientos Recientes</CardTitle>
                                            <CardDescription>Últimos 5 arrendamientos realizados</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {details.recentLoans.length === 0 ? (
                                                <p className="text-center text-muted-foreground py-8">No hay arrendamientos registrados</p>
                                            ) : (
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Cliente</TableHead>
                                                            <TableHead>Vehículo</TableHead>
                                                            <TableHead>Monto</TableHead>
                                                            <TableHead>Estado</TableHead>
                                                            <TableHead>Fecha</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {details.recentLoans.map((loan) => (
                                                            <TableRow key={loan.id}>
                                                                <TableCell className="font-medium">{loan.user.name}</TableCell>
                                                                <TableCell>
                                                                    {loan.vehicle.brand} {loan.vehicle.model}
                                                                    <br />
                                                                    <span className="text-xs text-muted-foreground">{loan.vehicle.plate}</span>
                                                                </TableCell>
                                                                <TableCell>{formatCurrency(loan.loanAmount)}</TableCell>
                                                                <TableCell>{getStatusBadge(loan.status)}</TableCell>
                                                                <TableCell>
                                                                    {format(new Date(loan.startDate), "dd MMM yyyy", { locale: es })}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Expenses Tab */}
                                <TabsContent value="expenses">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Gastos Recientes</CardTitle>
                                            <CardDescription>Últimos 10 gastos registrados</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {details.recentExpenses.length === 0 ? (
                                                <p className="text-center text-muted-foreground py-8">No hay gastos registrados</p>
                                            ) : (
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Descripción</TableHead>
                                                            <TableHead>Categoría</TableHead>
                                                            <TableHead>Monto</TableHead>
                                                            <TableHead>Fecha</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {details.recentExpenses.map((expense) => (
                                                            <TableRow key={expense.id}>
                                                                <TableCell className="font-medium">{expense.description}</TableCell>
                                                                <TableCell>
                                                                    <Badge variant="outline">{expense.category}</Badge>
                                                                </TableCell>
                                                                <TableCell className="text-red-600 dark:text-red-400">
                                                                    {formatCurrency(expense.amount)}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {format(new Date(expense.date), "dd MMM yyyy", { locale: es })}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Activity Tab */}
                                <TabsContent value="activity">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">Actividad Reciente</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-4 w-4 text-blue-500" />
                                                        <span className="text-sm">Último Arrendamiento</span>
                                                    </div>
                                                    <span className="text-sm font-medium">
                                                        {details.stats.recentActivity.lastLoan
                                                            ? format(new Date(details.stats.recentActivity.lastLoan), "dd MMM yyyy", { locale: es })
                                                            : "N/A"}
                                                    </span>
                                                </div>
                                                <Separator />
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <CreditCard className="h-4 w-4 text-green-500" />
                                                        <span className="text-sm">Último Pago</span>
                                                    </div>
                                                    <span className="text-sm font-medium">
                                                        {details.stats.recentActivity.lastPayment
                                                            ? format(new Date(details.stats.recentActivity.lastPayment), "dd MMM yyyy", { locale: es })
                                                            : "N/A"}
                                                    </span>
                                                </div>
                                                <Separator />
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <ShoppingCart className="h-4 w-4 text-red-500" />
                                                        <span className="text-sm">Último Gasto</span>
                                                    </div>
                                                    <span className="text-sm font-medium">
                                                        {details.stats.recentActivity.lastExpense
                                                            ? format(new Date(details.stats.recentActivity.lastExpense), "dd MMM yyyy", { locale: es })
                                                            : "N/A"}
                                                    </span>
                                                </div>
                                                <Separator />
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="h-4 w-4 text-amber-500" />
                                                        <span className="text-sm">Último Cierre de Caja</span>
                                                    </div>
                                                    <span className="text-sm font-medium">
                                                        {details.stats.lastCashRegisterDate
                                                            ? format(new Date(details.stats.lastCashRegisterDate), "dd MMM yyyy", { locale: es })
                                                            : "N/A"}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">Estado de Vehículos</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm">Disponibles</span>
                                                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                                                            {details.stats.vehiclesByStatus.AVAILABLE}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm">Arrendados</span>
                                                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                                            {details.stats.vehiclesByStatus.RENTED}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm">Mantenimiento</span>
                                                        <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                                                            {details.stats.vehiclesByStatus.MAINTENANCE}
                                                        </Badge>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm">Vendidos</span>
                                                        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                                            {details.stats.vehiclesByStatus.SOLD}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <Separator />
                                                <div className="pt-2">
                                                    <div className="text-sm text-muted-foreground mb-2">Información Adicional</div>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span>Total Cierres de Caja:</span>
                                                            <span className="font-medium">{details.stats.totalCashRegisters}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Fecha de Creación:</span>
                                                            <span className="font-medium">
                                                                {format(new Date(details.provider.createdAt), "dd MMM yyyy", { locale: es })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    ) : null}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
