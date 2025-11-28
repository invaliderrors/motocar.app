"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MobileSidebar } from "@/components/common/mobile-sidebar"
import { Button } from "@/components/ui/button"
import { Download, TrendingUp, ArrowLeftRight, Settings, BarChart3 } from "lucide-react"
import { RoleGuard } from "@/components/common/RoleGuard"
import { AccountsTab } from "@/components/cash-flow/tabs/AccountsTab"
import { TransactionsTab } from "@/components/cash-flow/tabs/TransactionsTab"
import { TransfersTab } from "@/components/cash-flow/tabs/TransfersTab"
import { RulesTab } from "@/components/cash-flow/tabs/RulesTab"
import { ReportsTab } from "@/components/cash-flow/tabs/ReportsTab"

export default function CashFlowPage() {
  return (
    <RoleGuard>
      <div className="flex-1 w-full h-screen overflow-hidden flex flex-col">
        <div className="bg-primary text-primary-foreground p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Flujo de Efectivo
              </h1>
              <p className="text-primary-foreground/80 text-sm">
                Gestión completa de cuentas, transacciones y reportes financieros
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <MobileSidebar />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-background">
          <Tabs defaultValue="accounts" className="w-full">
            <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-flex">
              <TabsTrigger value="accounts" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Cuentas</span>
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Transacciones</span>
              </TabsTrigger>
              <TabsTrigger value="transfers" className="flex items-center gap-2">
                <ArrowLeftRight className="h-4 w-4" />
                <span className="hidden sm:inline">Transferencias</span>
              </TabsTrigger>
              <TabsTrigger value="rules" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Reglas</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Reportes</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="accounts" className="space-y-4">
                <AccountsTab />
              </TabsContent>

              <TabsContent value="transactions" className="space-y-4">
                <TransactionsTab />
              </TabsContent>

              <TabsContent value="transfers" className="space-y-4">
                <TransfersTab />
              </TabsContent>

              <TabsContent value="rules" className="space-y-4">
                <RulesTab />
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <ReportsTab />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </RoleGuard>
  )
}
