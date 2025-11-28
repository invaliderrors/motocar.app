"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { CashFlowService } from "@/lib/services/cash-flow.service"
import { useToast } from "@/hooks/useToast"
import type { CashFlowRule, CreateRuleDto, UpdateRuleDto } from "@/lib/types/cash-flow"
import { CashFlowCategory } from "@/lib/types/cash-flow"
import { getCategoryLabel, getCategoriesGrouped } from "../utils"
import { TestTube, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface RuleFormProps {
  children: React.ReactNode
  ruleData?: CashFlowRule
  onSuccess?: () => void
}

export function RuleForm({ children, ruleData, onSuccess }: RuleFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [testMode, setTestMode] = useState(false)
  const [testInput, setTestInput] = useState("")
  const [testResult, setTestResult] = useState<{ matched: boolean; matchedText?: string } | null>(null)
  const { toast } = useToast()

  const form = useForm<CreateRuleDto>({
    defaultValues: ruleData
      ? {
          name: ruleData.name,
          description: ruleData.description || "",
          isActive: ruleData.isActive,
          priority: ruleData.priority,
          regexPattern: ruleData.regexPattern,
          category: ruleData.category,
          counterpartyOverride: ruleData.counterpartyOverride || "",
        }
      : {
          name: "",
          description: "",
          isActive: true,
          priority: 100,
          regexPattern: "",
          category: CashFlowCategory.OTHER_INCOME,
          counterpartyOverride: "",
        },
  })

  const allCategories = [...getCategoriesGrouped().income, ...getCategoriesGrouped().expense]

  const onSubmit = async (data: CreateRuleDto | UpdateRuleDto) => {
    try {
      setLoading(true)
      if (ruleData) {
        await CashFlowService.updateRule(ruleData.id, data as UpdateRuleDto)
        toast({ title: "Regla actualizada exitosamente" })
      } else {
        await CashFlowService.createRule(data as CreateRuleDto)
        toast({ title: "Regla creada exitosamente" })
      }
      setIsOpen(false)
      form.reset()
      onSuccess?.()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Ocurrió un error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTestPattern = async () => {
    const pattern = form.getValues("regexPattern")
    if (!pattern || !testInput) {
      toast({
        variant: "destructive",
        title: "Faltan datos",
        description: "Debes ingresar un patrón y un texto de prueba",
      })
      return
    }

    try {
      const result = await CashFlowService.dryRunRule({
        regexPattern: pattern,
        testStrings: [testInput],
      })
      if (result.matches && result.matches.length > 0) {
        setTestResult(result.matches[0])
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al probar patrón",
        description: error.response?.data?.message || "Patrón regex inválido",
      })
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      form.reset()
      setTestMode(false)
      setTestInput("")
      setTestResult(null)
    }
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{ruleData ? "Editar Regla" : "Nueva Regla de Clasificación"}</DialogTitle>
            <DialogDescription>
              Las reglas automatizan la clasificación de transacciones usando patrones de texto
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: Pagos de Nómina" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Descripción de la regla" rows={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="regexPattern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patrón Regex *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: ^(PAGO|PAY|SALARY).*" className="font-mono" />
                    </FormControl>
                    <FormDescription>
                      Patrón de expresión regular para coincidir con el texto de transacciones
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Probar Patrón</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setTestMode(!testMode)}
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    {testMode ? "Ocultar" : "Probar"}
                  </Button>
                </div>
                
                {testMode && (
                  <div className="space-y-3">
                    <Input
                      placeholder="Texto de prueba..."
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                    />
                    <Button type="button" variant="secondary" size="sm" onClick={handleTestPattern}>
                      <Play className="h-4 w-4 mr-2" />
                      Ejecutar Prueba
                    </Button>
                    {testResult && (
                      <div className="mt-2">
                        <Badge variant={testResult.matched ? "default" : "secondary"}>
                          {testResult.matched ? "✓ Coincide" : "✗ No coincide"}
                        </Badge>
                        {testResult.matchedText && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Texto encontrado: <span className="font-mono">{testResult.matchedText}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Ingresos</div>
                        {getCategoriesGrouped().income.map((category) => (
                          <SelectItem key={category} value={category}>
                            {getCategoryLabel(category)}
                          </SelectItem>
                        ))}
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t">Gastos</div>
                        {getCategoriesGrouped().expense.map((category) => (
                          <SelectItem key={category} value={category}>
                            {getCategoryLabel(category)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioridad</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          placeholder="100"
                        />
                      </FormControl>
                      <FormDescription>Menor número = mayor prioridad</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Estado</FormLabel>
                        <FormDescription>Activar/desactivar regla</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="counterpartyOverride"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraparte (Override)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Nombre de contraparte a asignar" />
                    </FormControl>
                    <FormDescription>Sobrescribir el nombre de la contraparte cuando aplique</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : ruleData ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
