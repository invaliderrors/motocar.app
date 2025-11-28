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
import type { CreateTransferDto, CashFlowAccount } from "@/lib/types/cash-flow"
import { generateIdempotencyKey } from "../utils"
import { ArrowRight } from "lucide-react"

interface TransferFormProps {
  children: React.ReactNode
  onSuccess?: () => void
}

export function TransferForm({ children, onSuccess }: TransferFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [accounts, setAccounts] = useState<CashFlowAccount[]>([])
  const [loadingAccounts, setLoadingAccounts] = useState(false)
  const { toast } = useToast()

  const form = useForm<CreateTransferDto>({
    defaultValues: {
      fromAccountId: "",
      toAccountId: "",
      amount: 0,
      currency: "COP",
      exchangeRate: 1,
      memo: "",
      transferDate: new Date().toISOString().split("T")[0],
      idempotencyKey: generateIdempotencyKey(),
    },
  })

  const fromAccountId = form.watch("fromAccountId")
  const toAccountId = form.watch("toAccountId")

  useEffect(() => {
    if (isOpen) {
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

  const onSubmit = async (data: CreateTransferDto) => {
    if (data.fromAccountId === data.toAccountId) {
      toast({
        variant: "destructive",
        title: "Error de validación",
        description: "La cuenta de origen y destino deben ser diferentes",
      })
      return
    }

    try {
      setLoading(true)
      await CashFlowService.createTransfer(data)
      toast({ title: "Transferencia creada exitosamente" })
      setIsOpen(false)
      form.reset({
        fromAccountId: "",
        toAccountId: "",
        amount: 0,
        currency: "COP",
        exchangeRate: 1,
        memo: "",
        transferDate: new Date().toISOString().split("T")[0],
        idempotencyKey: generateIdempotencyKey(),
      })
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
      form.reset({
        fromAccountId: "",
        toAccountId: "",
        amount: 0,
        currency: "COP",
        exchangeRate: 1,
        memo: "",
        transferDate: new Date().toISOString().split("T")[0],
        idempotencyKey: generateIdempotencyKey(),
      })
    }
  }

  const fromAccount = accounts.find((acc) => acc.id === fromAccountId)
  const toAccount = accounts.find((acc) => acc.id === toAccountId)

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nueva Transferencia entre Cuentas</DialogTitle>
            <DialogDescription>Transfiere dinero de una cuenta a otra en tu organización</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 items-end">
                <FormField
                  control={form.control}
                  name="fromAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desde Cuenta *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingAccounts}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar cuenta origen" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accounts
                            .filter((acc) => acc.id !== toAccountId)
                            .map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.name} ({account.currency})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {fromAccount && (
                        <FormDescription>
                          Balance actual: {fromAccount.balance.toFixed(2)} {fromAccount.currency}
                        </FormDescription>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center pb-2">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>

                <FormField
                  control={form.control}
                  name="toAccountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hacia Cuenta *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingAccounts}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar cuenta destino" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accounts
                            .filter((acc) => acc.id !== fromAccountId)
                            .map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.name} ({account.currency})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {toAccount && (
                        <FormDescription>
                          Balance actual: {toAccount.balance.toFixed(2)} {toAccount.currency}
                        </FormDescription>
                      )}
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
                name="transferDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de Transferencia *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exchangeRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tasa de Cambio</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.0001"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        placeholder="1.0000"
                      />
                    </FormControl>
                    <FormDescription>Solo necesario si las cuentas tienen monedas diferentes</FormDescription>
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
                      <Textarea {...field} placeholder="Notas adicionales sobre la transferencia" rows={3} />
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
                  {loading ? "Creando..." : "Crear Transferencia"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
