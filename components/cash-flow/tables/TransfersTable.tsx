"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { CashFlowTransfer } from "@/lib/types/cash-flow"
import { formatCurrency, formatDate } from "../utils"
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

interface TransfersTableProps {
  transfers: CashFlowTransfer[]
  loading: boolean
  totalItems: number
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  onTransferDeleted: () => void
}

export function TransfersTable({
  transfers,
  loading,
  totalItems,
  totalPages,
  currentPage,
  onPageChange,
  onTransferDeleted,
}: TransfersTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [transferToDelete, setTransferToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = (id: string) => {
    setTransferToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!transferToDelete) return

    try {
      setDeleting(true)
      await CashFlowService.deleteTransfer(transferToDelete)
      toast({
        title: "Transferencia eliminada",
        description: "La transferencia y sus transacciones asociadas han sido eliminadas",
      })
      onTransferDeleted()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al eliminar transferencia",
        description: error.response?.data?.message || "No se pudo eliminar la transferencia",
      })
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setTransferToDelete(null)
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

  if (!transfers || transfers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No hay transferencias registradas</p>
        <p className="text-sm mt-2">Crea una nueva transferencia para comenzar</p>
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
                <TableHead>Fecha</TableHead>
                <TableHead>Desde</TableHead>
                <TableHead></TableHead>
                <TableHead>Hacia</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Tasa Cambio</TableHead>
                <TableHead>Notas</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell className="font-medium">{formatDate(transfer.transferDate)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{transfer.fromAccount?.name || "N/A"}</span>
                      <span className="text-xs text-muted-foreground">
                        {transfer.fromAccount?.currency || transfer.currency}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{transfer.toAccount?.name || "N/A"}</span>
                      <span className="text-xs text-muted-foreground">
                        {transfer.toAccount?.currency || transfer.currency}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span className="text-blue-600">{formatCurrency(transfer.amount, transfer.currency)}</span>
                  </TableCell>
                  <TableCell>
                    {transfer.exchangeRate && transfer.exchangeRate !== 1 ? (
                      <Badge variant="outline">{transfer.exchangeRate.toFixed(4)}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {transfer.memo ? (
                      <div className="truncate max-w-[200px]">{transfer.memo}</div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(transfer.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {transfers.length} de {totalItems} transferencias
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la transferencia y ambas transacciones asociadas (salida y entrada). Esta acción no se puede deshacer.
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
