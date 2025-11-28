"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CashFlowStatementReport } from "../reports/CashFlowStatementReport"
import { ForecastReport } from "../reports/ForecastReport"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, TrendingUp } from "lucide-react"

export function ReportsTab() {
  return (
    <div className="space-y-6">
      <Card className="shadow-md bg-card border-border">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Reportes y Proyecciones</CardTitle>
          <CardDescription>Genera estados de flujo de efectivo y proyecciones de liquidez</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="statement" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="statement" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Estado de Flujo
              </TabsTrigger>
              <TabsTrigger value="forecast" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Proyección
              </TabsTrigger>
            </TabsList>
            <TabsContent value="statement" className="mt-6">
              <CashFlowStatementReport />
            </TabsContent>
            <TabsContent value="forecast" className="mt-6">
              <ForecastReport />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
