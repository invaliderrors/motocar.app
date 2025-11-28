"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { CashFlowService } from "@/lib/services/cash-flow.service"
import { useToast } from "@/hooks/useToast"
import type { CashFlowAccount, CreateAccountDto, UpdateAccountDto } from "@/lib/types/cash-flow"
import { CashFlowAccountType } from "@/lib/types/cash-flow"
import { getAccountTypeLabel } from "../utils"

interface AccountFormProps {
  children: React.ReactNode
  accountData?: CashFlowAccount
  onSuccess?: () => void
}

export function AccountForm({ children, accountData, onSuccess }: AccountFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<CreateAccountDto>({
    defaultValues: accountData
      ? {
          name: accountData.name,
          accountType: accountData.accountType,
          currency: accountData.currency,
          description: accountData.description || "",
        }
      : {
          name: "",
          accountType: CashFlowAccountType.BANK,
          currency: "COP",
          description: "",
        },
  })

  const onSubmit = async (data: CreateAccountDto | UpdateAccountDto) => {
    try {
      setLoading(true)
      if (accountData) {
        await CashFlowService.updateAccount(accountData.id, data)
        toast({ title: "Cuenta actualizada exitosamente" })
      } else {
        await CashFlowService.createAccount(data as CreateAccountDto)
        toast({ title: "Cuenta creada exitosamente" })
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

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{accountData ? "Editar Cuenta" : "Nueva Cuenta"}</DialogTitle>
            <DialogDescription>
              {accountData ? "Actualiza la información de la cuenta" : "Crea una nueva cuenta de flujo de efectivo"}
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
                      <Input {...field} placeholder="Ej: Cuenta Banco Popular" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Cuenta *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(CashFlowAccountType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {getAccountTypeLabel(type)}
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
                        <SelectItem value="COP">COP (Peso Colombiano)</SelectItem>
                        <SelectItem value="USD">USD (Dólar)</SelectItem>
                        <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      </SelectContent>
                    </Select>
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
                      <Textarea {...field} placeholder="Descripción opcional" rows={3} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Guardando..." : accountData ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
