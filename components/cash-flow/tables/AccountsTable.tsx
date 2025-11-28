"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import type { CashFlowAccount } from "@/lib/types/cash-flow"
import { formatCurrency, getAccountTypeLabel, getAccountTypeBadgeVariant } from "../utils"
import { AccountForm } from "../forms/AccountForm"
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

interface AccountsTableProps {
  accounts: CashFlowAccount[]
  loading: boolean
  onAccountUpdated: () => void
}

export function AccountsTable({ accounts, loading, onAccountUpdated }: AccountsTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const { toast } = useToast()

  const handleDelete = (id: string) => {
    setAccountToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!accountToDelete) return

    try {
      setDeleting(true)
      await CashFlowService.deleteAccount(accountToDelete)
      toast({
        title: "Cuenta eliminada",
        description: "La cuenta ha sido eliminada exitosamente",
      })
      onAccountUpdated()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al eliminar cuenta",
        description: error.response?.data?.message || "No se pudo eliminar la cuenta",
      })
    } finally {
      setDeleting(false)
      setDeleteDialogOpen(false)
      setAccountToDelete(null)
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

  if (!accounts || accounts.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No hay cuentas registradas</p>
        <p className="text-sm mt-2">Crea una nueva cuenta para comenzar</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Moneda</TableHead>
              <TableHead className="text-right">Saldo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell className="font-medium">
                  <div>
                    <div>{account.name}</div>
                    {account.description && <div className="text-sm text-muted-foreground">{account.description}</div>}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getAccountTypeBadgeVariant(account.accountType)}>
                    {getAccountTypeLabel(account.accountType)}
                  </Badge>
                </TableCell>
                <TableCell>{account.currency}</TableCell>
                <TableCell className="text-right font-medium">
                  <span className={account.balance >= 0 ? "text-green-600" : "text-red-600"}>
                    {formatCurrency(account.balance, account.currency)}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={account.isActive ? "success" : "secondary"}>
                    {account.isActive ? "Activa" : "Inactiva"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <AccountForm accountData={account} onSuccess={onAccountUpdated}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </AccountForm>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(account.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará la cuenta permanentemente.
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
