"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { X, Search } from "lucide-react"
import type { TransactionQueryDto } from "@/lib/types/cash-flow"
import { CashFlowTransactionType, CashFlowCategory } from "@/lib/types/cash-flow"
import { getCategoryLabel, getTransactionTypeLabel, getCategoriesGrouped } from "../utils"
import { useState, useEffect } from "react"
import { CashFlowService } from "@/lib/services/cash-flow.service"
import type { CashFlowAccount } from "@/lib/types/cash-flow"

interface TransactionFiltersProps {
  query: TransactionQueryDto
  updateQuery: (query: Partial<TransactionQueryDto>) => void
}

export function TransactionFilters({ query, updateQuery }: TransactionFiltersProps) {
  const [accounts, setAccounts] = useState<CashFlowAccount[]>([])
  const [searchInput, setSearchInput] = useState(query.search || "")

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

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    if (value.length === 0 || value.length >= 2) {
      updateQuery({ search: value, page: 1 })
    }
  }

  const handleClearFilters = () => {
    setSearchInput("")
    updateQuery({
      accountId: undefined,
      category: undefined,
      type: undefined,
      currency: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      amountMin: undefined,
      amountMax: undefined,
      search: undefined,
      isReconciled: undefined,
      page: 1,
    })
  }

  const hasActiveFilters = Boolean(
    query.accountId ||
      query.category ||
      query.type ||
      query.currency ||
      query.dateFrom ||
      query.dateTo ||
      query.amountMin ||
      query.amountMax ||
      query.search ||
      query.isReconciled !== undefined
  )

  const allCategories = [...getCategoriesGrouped().income, ...getCategoriesGrouped().expense]

  return (
    <div className="bg-muted/30 p-4 rounded-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Filtros</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X className="h-4 w-4 mr-2" />
            Limpiar Filtros
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Buscar</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Buscar en memo, referencia..."
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountId">Cuenta</Label>
          <Select
            value={query.accountId || "all"}
            onValueChange={(value) => updateQuery({ accountId: value === "all" ? undefined : value, page: 1 })}
          >
            <SelectTrigger id="accountId">
              <SelectValue placeholder="Todas las cuentas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las cuentas</SelectItem>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo</Label>
          <Select
            value={query.type || "all"}
            onValueChange={(value) =>
              updateQuery({ type: value === "all" ? undefined : (value as CashFlowTransactionType), page: 1 })
            }
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Todos los tipos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {Object.values(CashFlowTransactionType).map((type) => (
                <SelectItem key={type} value={type}>
                  {getTransactionTypeLabel(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select
            value={query.category || "all"}
            onValueChange={(value) =>
              updateQuery({ category: value === "all" ? undefined : (value as CashFlowCategory), page: 1 })
            }
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateFrom">Desde</Label>
          <Input
            id="dateFrom"
            type="date"
            value={query.dateFrom || ""}
            onChange={(e) => updateQuery({ dateFrom: e.target.value, page: 1 })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateTo">Hasta</Label>
          <Input
            id="dateTo"
            type="date"
            value={query.dateTo || ""}
            onChange={(e) => updateQuery({ dateTo: e.target.value, page: 1 })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amountMin">Monto Mínimo</Label>
          <Input
            id="amountMin"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={query.amountMin || ""}
            onChange={(e) =>
              updateQuery({ amountMin: e.target.value ? parseFloat(e.target.value) : undefined, page: 1 })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="amountMax">Monto Máximo</Label>
          <Input
            id="amountMax"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={query.amountMax || ""}
            onChange={(e) =>
              updateQuery({ amountMax: e.target.value ? parseFloat(e.target.value) : undefined, page: 1 })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="isReconciled">Estado</Label>
          <Select
            value={
              query.isReconciled === undefined ? "all" : query.isReconciled ? "reconciled" : "pending"
            }
            onValueChange={(value) =>
              updateQuery({
                isReconciled: value === "all" ? undefined : value === "reconciled",
                page: 1,
              })
            }
          >
            <SelectTrigger id="isReconciled">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="reconciled">Reconciliadas</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Moneda</Label>
          <Select
            value={query.currency || "all"}
            onValueChange={(value) => updateQuery({ currency: value === "all" ? undefined : value, page: 1 })}
          >
            <SelectTrigger id="currency">
              <SelectValue placeholder="Todas las monedas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las monedas</SelectItem>
              <SelectItem value="COP">COP</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
