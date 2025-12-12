"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard/overview"
import { RecentLoans } from "@/components/dashboard/recent-loans"
import { ArchivedLoans } from "@/components/dashboard/archived-loans"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { MobileSidebar } from "@/components/common/mobile-sidebar"
import { Button } from "@/components/ui/button"
import { CashFlowChart } from "@/components/dashboard/cash-flow-chart"
import { LoanStatusChart } from "@/components/dashboard/loan-status-chart"
import { PaymentCalendar } from "@/components/dashboard/payment-calendar"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { AlertCircle, ArrowUpRight, Bell, Download, Filter, ShieldAlert } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { RoleGuard } from "@/components/common/RoleGuard"
import { DashboardProvider, useDashboardContext } from "@/components/dashboard/dashboard-provider"
import { useStore } from "@/contexts/StoreContext"
import { Building2 } from "lucide-react"
import { useResourcePermissions } from "@/hooks/useResourcePermissions"
import { Resource } from "@/lib/types/permissions"

function DashboardContent() {
    const { data, loading } = useDashboardContext()
    const { currentStore, isAdmin } = useStore()
    const dashboardPermissions = useResourcePermissions(Resource.DASHBOARD)
    const pendingPaymentsThisWeek = data?.alerts?.pendingPaymentsThisWeek || 0

    // Wait for permissions to load before checking access
    if (dashboardPermissions.isLoading) {
        return null
    }

    // Check if user has permission to view dashboard
    if (!dashboardPermissions.canView) {
        return (
            <div className="flex-1 w-full overflow-hidden flex items-center justify-center p-8">
                <Alert className="max-w-md border-destructive/50 bg-destructive/10">
                    <ShieldAlert className="h-5 w-5 text-destructive" />
                    <AlertTitle className="text-destructive text-lg font-semibold">Acceso Denegado</AlertTitle>
                    <AlertDescription className="text-muted-foreground mt-2">
                        No tienes permisos para acceder al Dashboard. Contacta a tu administrador si necesitas acceso.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="flex-1 w-full overflow-hidden flex flex-col">
            <div className="bg-primary text-primary-foreground p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold">Dashboard</h1>
                            {currentStore && (
                                <div className="flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-lg px-3 py-1">
                                    <Building2 className="h-4 w-4" />
                                    <span className="text-sm font-medium">{currentStore.name}</span>
                                    {currentStore.code && (
                                        <Badge variant="outline" className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground text-xs">
                                            {currentStore.code}
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </div>
                        <p className="text-primary-foreground/80 text-sm mt-1">
                            {currentStore ? `Vista de punto ${isAdmin ? '(Admin)' : ''}` : 'Bienvenido de nuevo, Admin'}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 hidden lg:flex">
                            <Download className="mr-2 h-4 w-4" />
                            Exportar
                        </Button>
                        <Button size="sm" variant="outline" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 hidden lg:flex">
                            <Filter className="mr-2 h-4 w-4" />
                            Filtrar
                        </Button>
                        <Button size="sm" variant="outline" className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/20 relative">
                            <Bell className="h-4 w-4" />
                            {pendingPaymentsThisWeek > 0 && (
                                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                    {pendingPaymentsThisWeek}
                                </span>
                            )}
                        </Button>
                        <MobileSidebar />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {!loading && pendingPaymentsThisWeek > 0 && (
                    <Alert className="border-amber-500/50 bg-amber-500/10 py-2">
                        <AlertCircle className="h-4 w-4 text-amber-500" />
                        <AlertTitle className="text-amber-500 text-sm">Atención</AlertTitle>
                        <AlertDescription className="text-sm">
                            {pendingPaymentsThisWeek === 1 
                                ? "Hay 1 pago pendiente esta semana." 
                                : `Hay ${pendingPaymentsThisWeek} pagos pendientes esta semana.`}{" "}
                            <a href="/calendario-pagos" className="font-medium underline">
                                Ver detalles
                            </a>
                        </AlertDescription>
                    </Alert>
                )}

                <DashboardStats />

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                    <Card>
                        <CardHeader className="p-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-sm">Flujo de Caja</CardTitle>
                                    <CardDescription className="text-xs">Últimos 6 meses</CardDescription>
                                </div>
                                <Badge variant="outline" className="flex items-center text-xs">
                                    <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                                    <span className="text-green-500">+12.5%</span>
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                            <CashFlowChart />
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-2 gap-3">
                        <Card>
                            <CardHeader className="p-3">
                                <CardTitle className="text-sm">Estado</CardTitle>
                                <CardDescription className="text-xs">Distribución</CardDescription>
                            </CardHeader>
                            <CardContent className="p-3 pt-0">
                                <LoanStatusChart />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="p-3">
                                <CardTitle className="text-sm">Acciones</CardTitle>
                                <CardDescription className="text-xs">Rápidas</CardDescription>
                            </CardHeader>
                            <CardContent className="p-3 pt-0">
                                <QuickActions />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="mt-3">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview" className="text-xs">Resumen</TabsTrigger>
                        <TabsTrigger value="recent" className="text-xs">Recientes</TabsTrigger>
                        <TabsTrigger value="archived" className="text-xs">Archivados</TabsTrigger>
                        <TabsTrigger value="calendar" className="text-xs">Calendario</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-3">
                        <Card>
                            <CardHeader className="p-3">
                                <CardTitle className="text-sm">Resumen de contratos</CardTitle>
                                <CardDescription className="text-xs">Últimos 30 días</CardDescription>
                            </CardHeader>
                            <CardContent className="p-3 pt-0">
                                <Overview />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="recent" className="mt-3">
                        <Card>
                            <CardHeader className="p-3">
                                <CardTitle className="text-sm">contratos Recientes</CardTitle>
                                <CardDescription className="text-xs">Últimos realizados</CardDescription>
                            </CardHeader>
                            <CardContent className="p-3 pt-0">
                                <RecentLoans />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="archived" className="mt-3">
                        <Card>
                            <CardHeader className="p-3">
                                <CardTitle className="text-sm">contratos Archivados</CardTitle>
                                <CardDescription className="text-xs">Historial archivado</CardDescription>
                            </CardHeader>
                            <CardContent className="p-3 pt-0">
                                <ArchivedLoans />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="calendar" className="mt-3">
                        <Card>
                            <CardHeader className="p-3">
                                <CardTitle className="text-sm">Calendario de Pagos</CardTitle>
                                <CardDescription className="text-xs">Próximos 7 días</CardDescription>
                            </CardHeader>
                            <CardContent className="p-3 pt-0">
                                <PaymentCalendar />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
        )
}

export default function DashboardPage() {
    return (
        <RoleGuard>
            <DashboardProvider>
                <DashboardContent />
            </DashboardProvider>
        </RoleGuard>
    )
}
