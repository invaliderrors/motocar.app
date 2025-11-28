"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Loader2, Download } from "lucide-react"
import { useState, useEffect } from "react"
import { CashFlowService } from "@/lib/services/cash-flow.service"
import type { CashFlowAccount, CashFlowForecast } from "@/lib/types/cash-flow"
import { ReportFormat, CashFlowScenario } from "@/lib/types/cash-flow"
import { useToast } from "@/hooks/useToast"
import { downloadFile, formatCurrency, formatDate } from "../utils"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function ForecastReport() {
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState<CashFlowAccount[]>([])
  const [forecast, setForecast] = useState<CashFlowForecast | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split("T")[0],
    weeks: 13,
    scenario: "BASE" as CashFlowScenario,
    format: "JSON" as ReportFormat,
  })

  useEffect(() => {
    fetchAccounts()
  }, [])

  const fetchAccounts = async () => {
    try {
      const response = await CashFlowService.getAccounts({ isActive: true, limit: 100 })
      setAccounts(response.data)
    } catch (error) {
      console.error("Error fetching accounts:", error)
    }
  }

  const handleGenerate = async () => {
    try {
      setLoading(true)
      setForecast(null)

      const result = await CashFlowService.getForecast(formData)

      if (formData.format === "CSV" || formData.format === "PDF") {
        const blob = result as Blob
        const filename = `proyeccion-${formData.startDate}-${formData.weeks}w.${formData.format.toLowerCase()}`
        downloadFile(blob, filename)
        toast({
          title: "Proyección generada",
          description: `El archivo ${filename} se ha descargado exitosamente`,
        })
      } else {
        setForecast(result as CashFlowForecast)
        toast({
          title: "Proyección generada",
          description: "La proyección de liquidez se ha generado correctamente",
        })
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al generar proyección",
        description: error.response?.data?.message || "No se pudo generar la proyección",
      })
    } finally {
      setLoading(false)
    }
  }

  const getScenarioLabel = (scenario: CashFlowScenario) => {
    const labels: Record<CashFlowScenario, string> = {
      BASE: "Base",
      BEST: "Optimista",
      WORST: "Pesimista",
    }
    return labels[scenario]
  }

  const getScenarioVariant = (scenario: CashFlowScenario) => {
    const variants: Record<CashFlowScenario, "default" | "secondary" | "destructive"> = {
      BASE: "default",
      BEST: "secondary",
      WORST: "destructive",
    }
    return variants[scenario]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proyección de Liquidez</CardTitle>
        <CardDescription>Genera una proyección de flujo de efectivo a futuro</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha Inicio *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weeks">Número de Semanas *</Label>
              <Input
                id="weeks"
                type="number"
                min="1"
                max="52"
                value={formData.weeks}
                onChange={(e) => setFormData({ ...formData, weeks: parseInt(e.target.value) || 13 })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scenario">Escenario</Label>
              <Select
                value={formData.scenario}
                onValueChange={(value) => setFormData({ ...formData, scenario: value as CashFlowScenario })}
              >
                <SelectTrigger id="scenario">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BASE">Base (Realista)</SelectItem>
                  <SelectItem value="BEST">Optimista (Mejor Caso)</SelectItem>
                  <SelectItem value="WORST">Pesimista (Peor Caso)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Formato</Label>
              <Select
                value={formData.format}
                onValueChange={(value) => setFormData({ ...formData, format: value as ReportFormat })}
              >
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="JSON">Vista Previa (JSON)</SelectItem>
                  <SelectItem value="CSV">Exportar CSV</SelectItem>
                  <SelectItem value="PDF">Exportar PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4 mr-2" />
                Generar Proyección
              </>
            )}
          </Button>

          {forecast && (
            <div className="space-y-4 mt-6 border-t pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Resultados</h3>
                <Badge variant={getScenarioVariant(forecast.scenario)}>Escenario {getScenarioLabel(forecast.scenario)}</Badge>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Período:</span>
                  <span>
                    {formatDate(forecast.startDate)} - {forecast.weeks} semanas
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Duración:</span>
                  <span>{forecast.weeks} semanas</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Balance Inicial:</span>
                  <span className="font-mono">{formatCurrency(forecast.summary.openingBalance, "COP")}</span>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Semana</TableHead>
                      <TableHead>Fecha Inicio</TableHead>
                      <TableHead className="text-right">Entradas</TableHead>
                      <TableHead className="text-right">Salidas</TableHead>
                      <TableHead className="text-right">Flujo Neto</TableHead>
                      <TableHead className="text-right">Balance Final</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {forecast.forecast.map((week) => (
                      <TableRow key={week.weekNumber}>
                        <TableCell className="font-medium">Semana {week.weekNumber}</TableCell>
                        <TableCell className="text-sm">{formatDate(week.startDate)}</TableCell>
                        <TableCell className="text-right text-green-600 font-mono text-sm">
                          {formatCurrency(week.projectedInflows, "COP")}
                        </TableCell>
                        <TableCell className="text-right text-red-600 font-mono text-sm">
                          {formatCurrency(week.projectedOutflows, "COP")}
                        </TableCell>
                        <TableCell
                          className={`text-right font-mono text-sm ${
                            week.netCashFlow >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {formatCurrency(week.netCashFlow, "COP")}
                        </TableCell>
                        <TableCell
                          className={`text-right font-semibold font-mono ${
                            week.cumulativeCash >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {formatCurrency(week.cumulativeCash, "COP")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="bg-primary/10 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Resumen</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Entradas Proyectadas:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(forecast.summary.totalProjectedInflows, "COP")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Salidas Proyectadas:</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(forecast.summary.totalProjectedOutflows, "COP")}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Balance Final Proyectado:</span>
                    <span
                      className={`font-bold ${
                        forecast.summary.projectedClosingBalance >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(forecast.summary.projectedClosingBalance, "COP")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
