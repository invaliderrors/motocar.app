"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CashRegisterForm } from "@/components/cierre-caja/CashRegisterForm"
import { DailySummary } from "@/components/cierre-caja/daily-summary"
import { TransactionTable } from "@/components/cierre-caja/transactions/TransactionTable"
import { CashRegisterHistory } from "@/components/cierre-caja/CashRegisterHistory"
import type { SelectedTransaction } from "@/components/cierre-caja/transactions/constants/types"
import { PageHeader } from "@/components/common/PageHeader"
import { Wallet, CircleDollarSign } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function CierreCajaPage() {
  // Single shared state for transaction selections across all tabs
  const [selectedTransactions, setSelectedTransactions] = useState<SelectedTransaction[]>([])
  const [token, setToken] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("summary")

  useEffect(() => {
    const localToken = localStorage.getItem("token")
    if (localToken) {
      setToken(localToken)
    }
  }, [])

  return (
    <div className="flex-1 w-full overflow-hidden flex flex-col">
      <PageHeader
        icon={Wallet}
        title="Cierre de Caja Diario"
        subtitle="Gestión de ingresos y cierre diario"
        badgeIcon={CircleDollarSign}
        badgeLabel="Control"
        badgeColor="emerald"
      />

      <ScrollArea className="flex-1">
        <div className="p-3 sm:p-4 md:p-6">
          <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 mb-3 sm:mb-4">
              <TabsTrigger value="summary">Resumen del Día</TabsTrigger>
              <TabsTrigger value="register">Cierre de Caja</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-3 sm:space-y-4">
              <DailySummary />
              <CashRegisterHistory />
            </TabsContent>

            <TabsContent value="register" className="space-y-3 sm:space-y-4">
              <div>
                <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Transacciones disponibles</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  Seleccione las transacciones que desea incluir en el cierre. La fecha del cierre se determinará
                  automáticamente según las transacciones seleccionadas.
                </p>
                <TransactionTable token={token} onSelect={(selected) => setSelectedTransactions(selected)} />
              </div>

              <CashRegisterForm token={token} selectedTransactions={selectedTransactions} />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  )
}
