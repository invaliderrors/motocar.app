"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, ArrowUpCircle, ArrowDownCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { CashFlowTransaction } from "@/lib/types/cash-flow"
import {
  formatCurrency,
  formatDate,
  getCategoryLabel,
  getTransactionTypeLabel,
  getTransactionTypeBadgeVariant,
} from "../utils"
import { TransactionForm } from "../forms/TransactionForm"
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

interface TransactionsTableProps {
  transactions: CashFlowTransaction[]
  loading: boolean
  totalItems: number
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
  onTransactionUpdated: () => void
}

export function TransactionsTable({
  transactions,
  loading,
  totalItems,
  totalPages,
  currentPage,
  onPageChange,
  onTransactionUpdated,
}: TransactionsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = (id: string) => {
    setTransactionToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!transactionToDelete) return

    try {
      setDeleting(true)
      await CashFlowService.deleteTransaction(transactionToDelete)
      toast({
        title: "Transacción eliminada",
        description: "La transacción ha sido eliminada exitosamente",
      })
      onTransactionUpdated()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al eliminar transacción",
        description: error.response?.data?.message || "No se pudo eliminar la transacción",
      })
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setTransactionToDelete(null)
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

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No hay transacciones registradas</p>
        <p className="text-sm mt-2">Crea una nueva transacción para comenzar</p>
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
                <TableHead>Cuenta</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Contraparte</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{formatDate(transaction.date)}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{transaction.account?.name || "N/A"}</div>
                      {transaction.memo && <div className="text-sm text-muted-foreground truncate max-w-[200px]">{transaction.memo}</div>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTransactionTypeBadgeVariant(transaction.type)} className="gap-1">
                      {transaction.type === "INFLOW" ? (
                        <ArrowUpCircle className="h-3 w-3" />
                      ) : (
                        <ArrowDownCircle className="h-3 w-3" />
                      )}
                      {getTransactionTypeLabel(transaction.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {getCategoryLabel(transaction.category)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {transaction.counterparty ? (
                      <div className="truncate max-w-[150px]">{transaction.counterparty}</div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span className={transaction.type === "INFLOW" ? "text-green-600" : "text-red-600"}>
                      {transaction.type === "INFLOW" ? "+" : "-"}
                      {formatCurrency(transaction.amount, transaction.currency)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={transaction.isReconciled ? "default" : "secondary"}>
                      {transaction.isReconciled ? "Reconciliada" : "Pendiente"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <TransactionForm transactionData={transaction} onSuccess={onTransactionUpdated}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TransactionForm>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(transaction.id)}>
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

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {transactions.length} de {totalItems} transacciones
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
              Esta acción no se puede deshacer. Se eliminará la transacción permanentemente y se actualizará el balance de la cuenta.
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
