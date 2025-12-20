import { ExpenseTable } from "@/components/expenses/ExpenseTable"
import { PageHeader } from "@/components/common/PageHeader"
import { Wallet, TrendingDown } from "lucide-react"

export default function ExpensesPage() {
  return (
    <div className="flex-1 w-full overflow-hidden flex flex-col">
      <PageHeader
        icon={Wallet}
        title="Egresos"
        subtitle="Gestiona todos los egresos del negocio"
        badgeIcon={TrendingDown}
        badgeLabel="Gastos"
        badgeColor="red"
      />
      <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background via-background to-muted/20">
        <ExpenseTable />
      </div>
    </div>
  )
}
