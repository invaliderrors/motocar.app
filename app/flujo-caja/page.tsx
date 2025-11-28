import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MobileSidebar } from "@/components/common/mobile-sidebar"
import { Button } from "@/components/ui/button"
import { CashFlowChart } from "@/components/dashboard/cash-flow-chart"
import { CashFlowTable } from "@/components/flujo-caja/cash-flow-table"
import { CashFlowSummary } from "@/components/flujo-caja/cash-flow-summary"
import { CashFlowProjection } from "@/components/flujo-caja/cash-flow-projection"
import { ArrowDownToLine, ArrowUpToLine, Calendar, Download, Plus, Printer } from "lucide-react"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { RoleGuard } from "@/components/common/RoleGuard"

export default function CashFlowPage() {

  return (
    <RoleGuard>
      <div className="flex-1 w-full">
        <div className="gradient-bg text-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Flujo de Caja</h1>
              <p className="text-white/80 mt-1">Gestión de ingresos y egresos</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Movimiento
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </Button>
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
              <MobileSidebar />
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Card className="stats-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <ArrowUpToLine className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
                      <h3 className="text-xl font-bold">$125.5M</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="stats-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                      <ArrowDownToLine className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Egresos Totales</p>
                      <h3 className="text-xl font-bold">$78.2M</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="stats-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Balance</p>
                      <h3 className="text-xl font-bold text-green-500">$47.3M</h3>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DatePickerWithRange className="w-full md:w-auto" />
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="income">Ingresos</TabsTrigger>
              <TabsTrigger value="expenses">Egresos</TabsTrigger>
              <TabsTrigger value="projection">Proyección</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="card-hover-effect">
                <CardHeader>
                  <CardTitle>Resumen de Flujo de Caja</CardTitle>
                  <CardDescription>Ingresos y egresos de los últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <CashFlowChart />
                </CardContent>
              </Card>

              <CashFlowSummary />
            </TabsContent>

            <TabsContent value="income" className="space-y-6">
              <Card className="card-hover-effect">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Ingresos</CardTitle>
                    <CardDescription>Detalle de todos los ingresos</CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Ingreso
                  </Button>
                </CardHeader>
                <CardContent>
                  <CashFlowTable type="income" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expenses" className="space-y-6">
              <Card className="card-hover-effect">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Egresos</CardTitle>
                    <CardDescription>Detalle de todos los egresos</CardDescription>
                  </div>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Egreso
                  </Button>
                </CardHeader>
                <CardContent>
                  <CashFlowTable type="expense" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projection" className="space-y-6">
              <Card className="card-hover-effect">
                <CardHeader>
                  <CardTitle>Proyección de Flujo de Caja</CardTitle>
                  <CardDescription>Proyección para los próximos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <CashFlowProjection />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </RoleGuard>

  )
}
