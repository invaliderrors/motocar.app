import { LoanTable } from "@/components/loans/LoanTable"
import { PageHeader } from "@/components/common/PageHeader"
import { DollarSign, TrendingUp } from "lucide-react"

export default function LoansPage() {
  return (
    <div className="flex-1 w-full overflow-hidden flex flex-col">
      <PageHeader
        icon={DollarSign}
        title="Arrendamientos"
        subtitle="Administra los arrendamientos y financiamientos"
        badgeIcon={TrendingUp}
        badgeLabel="Activo"
        badgeColor="green"
      />
      <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background via-background to-muted/20">
        <LoanTable />
      </div>
    </div>
  )
}
