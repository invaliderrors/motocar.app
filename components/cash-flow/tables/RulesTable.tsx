"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Play } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { CashFlowRule } from "@/lib/types/cash-flow"
import { getCategoryLabel } from "../utils"
import { RuleForm } from "../forms/RuleForm"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CashFlowService } from "@/lib/services/cash-flow.service"
import { useToast } from "@/hooks/useToast"

interface RulesTableProps {
  rules: CashFlowRule[]
  loading: boolean
  onRuleUpdated: () => void
}

export function RulesTable({ rules, loading, onRuleUpdated }: RulesTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [applying, setApplying] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDelete = (id: string) => {
    setRuleToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!ruleToDelete) return

    try {
      setDeleting(true)
      await CashFlowService.deleteRule(ruleToDelete)
      toast({
        title: "Regla eliminada",
        description: "La regla ha sido eliminada exitosamente",
      })
      onRuleUpdated()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al eliminar regla",
        description: error.response?.data?.message || "No se pudo eliminar la regla",
      })
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setRuleToDelete(null)
    }
  }

  const handleApplyRule = async (ruleId: string) => {
    try {
      setApplying(ruleId)
      const result = await CashFlowService.applyRule(ruleId)
      toast({
        title: "Regla aplicada",
        description: `Se clasificaron ${result.applied} transacciones`,
      })
      onRuleUpdated()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al aplicar regla",
        description: error.response?.data?.message || "No se pudo aplicar la regla",
      })
    } finally {
      setApplying(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (!rules || rules.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No hay reglas configuradas</p>
        <p className="text-sm mt-2">Crea una nueva regla para automatizar la clasificación</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Patrón Regex</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{rule.name}</span>
                      {rule.description && <span className="text-xs text-muted-foreground">{rule.description}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{rule.regexPattern}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getCategoryLabel(rule.category)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{rule.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={rule.isActive ? "default" : "secondary"}>
                      {rule.isActive ? "Activa" : "Inactiva"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApplyRule(rule.id)}
                        disabled={applying === rule.id || !rule.isActive}
                        title="Aplicar regla a transacciones existentes"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <RuleForm ruleData={rule} onSuccess={onRuleUpdated}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </RuleForm>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(rule.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará la regla permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleting}>
              {deleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
