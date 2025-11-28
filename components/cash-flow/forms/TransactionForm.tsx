"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import { CashFlowService } from "@/lib/services/cash-flow.service"
import { useToast } from "@/hooks/useToast"
import type {
  CashFlowTransaction,
  CreateTransactionDto,
  UpdateTransactionDto,
  CashFlowAccount,
} from "@/lib/types/cash-flow"
import { CashFlowTransactionType, CashFlowCategory } from "@/lib/types/cash-flow"
import { getCategoryLabel, getTransactionTypeLabel, generateIdempotencyKey, getCategoriesGrouped } from "../utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface TransactionFormProps {
  children: React.ReactNode
  transactionData?: CashFlowTransaction
  onSuccess?: () => void
}

export function TransactionForm({ children, transactionData, onSuccess }: TransactionFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState<CashFlowAccount[]>([])
  const [loadingAccounts, setLoadingAccounts] = useState(false)
  const { toast } = useToast()

  const form = useForm<CreateTransactionDto>({
    defaultValues: transactionData
      ? {
          accountId: transactionData.accountId,
          type: transactionData.type,
          amount: transactionData.amount,
          currency: transactionData.currency,
          category: transactionData.category,
          date: transactionData.date,
          counterparty: transactionData.counterparty || "",
          memo: transactionData.memo || "",
          reference: transactionData.reference || "",
          idempotencyKey: transactionData.idempotencyKey,
        }
      : {
          accountId: "",
          type: CashFlowTransactionType.INFLOW,
          amount: 0,
          currency: "COP",
          category: CashFlowCategory.OTHER_INCOME,
          date: new Date().toISOString().split("T")[0],
          counterparty: "",
          memo: "",
          reference: "",
          idempotencyKey: generateIdempotencyKey(),
        },
  })

  const transactionType = form.watch("type")
  const categories = getCategoriesGrouped()
  const categoryList = transactionType === CashFlowTransactionType.INFLOW ? categories.income : categories.expense

  useEffect(() => {
    if (isOpen && !transactionData) {
      fetchAccounts()
    }
  }, [isOpen])

  const fetchAccounts = async () => {
    try {
      setLoadingAccounts(true)
      const response = await CashFlowService.getAccounts({ isActive: true, limit: 100 })
      setAccounts(response.data)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al cargar cuentas",
        description: error.response?.data?.message || "No se pudieron cargar las cuentas",
      })
    } finally {
      setLoadingAccounts(false)
    }
  }

  const onSubmit = async (data: CreateTransactionDto | UpdateTransactionDto) => {
    try {
      setLoading(true)
      if (transactionData) {
        await CashFlowService.updateTransaction(transactionData.id, data as UpdateTransactionDto)
        toast({ title: "Transacción actualizada exitosamente" })
      } else {
        await CashFlowService.createTransaction(data as CreateTransactionDto)
        toast({ title: "Transacción creada exitosamente" })
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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      form.reset()
    }
  }

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{transactionData ? "Editar Transacción" : "Nueva Transacción"}</DialogTitle>
            <DialogDescription>
              {transactionData
                ? "Actualiza la información de la transacción"
                : "Registra una nueva entrada o salida de efectivo"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="accountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cuenta *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingAccounts}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar cuenta" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.name} ({account.currency})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(CashFlowTransactionType).map((type) => (
                            <SelectItem key={type} value={type}>
                              {getTransactionTypeLabel(type)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monto *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          placeholder="0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Moneda</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="COP">COP</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                        {categoryList.map((category) => (
                          <SelectItem key={category} value={category}>
                            {getCategoryLabel(category)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Las categorías cambian según el tipo de transacción (entrada/salida)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="counterparty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraparte</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: Cliente Juan Pérez" />
                    </FormControl>
                    <FormDescription>Persona o empresa involucrada en la transacción</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referencia</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ej: Factura #12345, Contrato #678" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="memo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Notas adicionales sobre la transacción" rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : transactionData ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
