"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Check,
  ChevronsUpDown,
  Download,
  Filter,
  RefreshCw,
  BarChart3,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

type Loan = {
  id: string
  contractNumber: string | null
  user: {
    name: string
    identification: string
  }
  vehicle: {
    model: string
    plate: string
    brand: string
  }
}

interface CalendarHeaderProps {
  currentDate: Date
  selectedLoan: string | null
  loans: Loan[]
  loading: boolean
  onLoanSelect: (loanId: string | null) => void
  onPreviousMonth: () => void
  onNextMonth: () => void
  onToday: () => void
  onExport?: () => void
  onRefresh?: () => void
  totalPayments?: number
  totalAmount?: number
}

export function CalendarHeader({
  currentDate,
  selectedLoan,
  loans,
  loading,
  onLoanSelect,
  onPreviousMonth,
  onNextMonth,
  onToday,
  onExport,
  onRefresh,
  totalPayments = 0,
  totalAmount = 0,
}: CalendarHeaderProps) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const selectedLoanData = loans.find((l) => l.id === selectedLoan)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const filteredLoans = loans.filter((loan) => {
    if (!searchValue) return true
    const search = searchValue.toLowerCase()
    return (
      loan.vehicle.plate.toLowerCase().includes(search) ||
      loan.vehicle.model.toLowerCase().includes(search) ||
      loan.vehicle.brand.toLowerCase().includes(search) ||
      loan.user.name.toLowerCase().includes(search)
    )
  })

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Filtrar por contrato</h3>
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            )}
            {onExport && selectedLoan && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            )}
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {selectedLoanData ? (
                    <div className="flex items-center gap-2 truncate">
                      <Badge variant="secondary" className="font-mono">
                        {selectedLoanData.vehicle.plate}
                      </Badge>
                      <span className="truncate">
                        {selectedLoanData.vehicle.brand} {selectedLoanData.vehicle.model}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Buscar contrato por placa...</span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[600px] p-0" align="start">
                <Command shouldFilter={false}>
                  <CommandInput 
                    placeholder="Buscar por placa, modelo, marca o cliente..." 
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandList>
                    <CommandEmpty>No se encontraron contratos</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="all"
                        onSelect={() => {
                          onLoanSelect(null)
                          setOpen(false)
                          setSearchValue("")
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            !selectedLoan ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="font-medium">Limpiar selección</span>
                      </CommandItem>
                      {filteredLoans.map((loan) => (
                        <CommandItem
                          key={loan.id}
                          value={`${loan.vehicle.plate} ${loan.vehicle.brand} ${loan.vehicle.model} ${loan.user.name}`}
                          onSelect={() => {
                            onLoanSelect(loan.id)
                            setOpen(false)
                            setSearchValue("")
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedLoan === loan.id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex items-center gap-2 flex-1">
                            <Badge variant="outline" className="font-mono font-semibold">
                              {loan.vehicle.plate}
                            </Badge>
                            <div className="flex flex-col">
                              <span className="font-medium">
                                {loan.vehicle.brand} {loan.vehicle.model}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {loan.user.name} - {loan.user.identification}
                              </span>
                            </div>
                            {loan.contractNumber && (
                              <Badge variant="secondary" className="ml-auto text-xs">
                                {loan.contractNumber}
                              </Badge>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Statistics */}
          {selectedLoan && totalPayments > 0 && (
            <div className="flex items-center gap-4 px-4 py-2 bg-muted/50 rounded-lg">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Pagos</p>
                <p className="text-lg font-bold">{totalPayments}</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-lg font-bold">{formatCurrency(totalAmount)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={onPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={onNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={onToday} className="ml-2">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Hoy
            </Button>
          </div>
          <h3 className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
        </div>

        {/* Selected Loan Info */}
        {selectedLoan && !loading && (
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            {loans.find((l) => l.id === selectedLoan) && (
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-blue-900 dark:text-blue-100">
                    {loans.find((l) => l.id === selectedLoan)?.vehicle.brand}{" "}
                    {loans.find((l) => l.id === selectedLoan)?.vehicle.model}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Placa: {loans.find((l) => l.id === selectedLoan)?.vehicle.plate} | Cliente:{" "}
                    {loans.find((l) => l.id === selectedLoan)?.user.name}
                  </p>
                  {loans.find((l) => l.id === selectedLoan)?.contractNumber && (
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Contrato: {loans.find((l) => l.id === selectedLoan)?.contractNumber}
                    </p>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => onLoanSelect(null)}>
                  Limpiar
                </Button>
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}
      </div>
    </Card>
  )
}
