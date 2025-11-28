"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import { RulesTable } from "../tables/RulesTable"
import { RuleForm } from "../forms/RuleForm"
import { useRules } from "../hooks/useRules"

export function RulesTab() {
  const { rules, loading, refreshing, refetch, handleRuleCreated } = useRules()

  return (
    <div className="space-y-6">
      <Card className="shadow-md bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-bold">Reglas de Clasificación Automática</CardTitle>
              <CardDescription>
                Configura reglas para clasificar automáticamente las transacciones según patrones
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={refetch} disabled={refreshing} className="h-9 gap-1.5">
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                Actualizar
              </Button>
              <RuleForm onSuccess={handleRuleCreated}>
                <Button size="sm" className="h-9 gap-1.5">
                  <Plus className="h-4 w-4" />
                  Nueva Regla
                </Button>
              </RuleForm>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <RulesTable rules={rules} loading={loading} onRuleUpdated={handleRuleCreated} />
        </CardContent>
      </Card>
    </div>
  )
}
