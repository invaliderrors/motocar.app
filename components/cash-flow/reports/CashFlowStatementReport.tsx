"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { CashFlowService } from "@/lib/services/cash-flow.service"
import type { CashFlowAccount, CashFlowStatement } from "@/lib/types/cash-flow"
import { ReportFormat } from "@/lib/types/cash-flow"
import { useToast } from "@/hooks/useToast"
import { downloadFile, formatCurrency, formatDate } from "../utils"
import { Badge } from "@/components/ui/badge"

export function CashFlowStatementReport() {
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState<CashFlowAccount[]>([])
  const [statement, setStatement] = useState<CashFlowStatement | null>(null)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
    currency: "COP",
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
      setStatement(null)

      const result = await CashFlowService.getCashFlowStatement(formData)

      if (formData.format === "CSV" || formData.format === "PDF") {
        const blob = result as Blob
        const filename = `estado-flujo-${formData.startDate}-${formData.endDate}.${formData.format.toLowerCase()}`
        downloadFile(blob, filename)
        toast({
          title: "Reporte generado",
          description: `El archivo ${filename} se ha descargado exitosamente`,
        })
      } else {
        setStatement(result as CashFlowStatement)
        toast({
          title: "Reporte generado",
          description: "El estado de flujo de efectivo se ha generado correctamente",
        })
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al generar reporte",
        description: error.response?.data?.message || "No se pudo generar el reporte",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de Flujo de Efectivo</CardTitle>
        <CardDescription>Genera un estado de flujo de efectivo para un período específico</CardDescription>
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
              <Label htmlFor="endDate">Fecha Fin *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moneda</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COP">COP (Peso Colombiano)</SelectItem>
                  <SelectItem value="USD">USD (Dólar)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
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
                <FileText className="h-4 w-4 mr-2" />
                Generar Estado de Flujo
              </>
            )}
          </Button>

          {statement && (
            <div className="space-y-4 mt-6 border-t pt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Resultados</h3>
                <Badge variant="outline">
                  {formatDate(statement.period.startDate)} - {formatDate(statement.period.endDate)}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Actividades Operativas</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Entradas:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(
                          statement.operatingActivities.inflows.reduce((sum, item) => sum + item.amount, 0),
                          statement.currency
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Salidas:</span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(
                          statement.operatingActivities.outflows.reduce((sum, item) => sum + item.amount, 0),
                          statement.currency
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>Neto Operaciones:</span>
                      <span className={statement.operatingActivities.netCashFromOperations >= 0 ? "text-green-600" : "text-red-600"}>
                        {formatCurrency(statement.operatingActivities.netCashFromOperations, statement.currency)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Actividades de Inversión</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Entradas:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(
                          statement.investingActivities.inflows.reduce((sum, item) => sum + item.amount, 0),
                          statement.currency
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Salidas:</span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(
                          statement.investingActivities.outflows.reduce((sum, item) => sum + item.amount, 0),
                          statement.currency
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>Neto Inversión:</span>
                      <span className={statement.investingActivities.netCashFromInvesting >= 0 ? "text-green-600" : "text-red-600"}>
                        {formatCurrency(statement.investingActivities.netCashFromInvesting, statement.currency)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Actividades de Financiamiento</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Entradas:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(
                          statement.financingActivities.inflows.reduce((sum, item) => sum + item.amount, 0),
                          statement.currency
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Salidas:</span>
                      <span className="font-medium text-red-600">
                        {formatCurrency(
                          statement.financingActivities.outflows.reduce((sum, item) => sum + item.amount, 0),
                          statement.currency
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-semibold">
                      <span>Neto Financiamiento:</span>
                      <span className={statement.financingActivities.netCashFromFinancing >= 0 ? "text-green-600" : "text-red-600"}>
                        {formatCurrency(statement.financingActivities.netCashFromFinancing, statement.currency)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/10 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Resumen</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Balance Inicial:</span>
                      <span className="font-medium">{formatCurrency(statement.summary.openingBalance, statement.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cambio Neto:</span>
                      <span className={statement.summary.netCashChange >= 0 ? "font-medium text-green-600" : "font-medium text-red-600"}>
                        {formatCurrency(statement.summary.netCashChange, statement.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-bold text-base">
                      <span>Balance Final:</span>
                      <span className={statement.summary.closingBalance >= 0 ? "text-green-600" : "text-red-600"}>
                        {formatCurrency(statement.summary.closingBalance, statement.currency)}
                      </span>
                    </div>
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
