import { InstallmentTable } from "@/components/installments/installment-table"
import { PageHeader } from "@/components/common/PageHeader"
import { Receipt, CheckCircle2 } from "lucide-react"

export default function InstallmentsPage() {
  return (
    <div className="flex-1 w-full overflow-hidden flex flex-col">
      <PageHeader
        icon={Receipt}
        title="Cuotas"
        subtitle="Gestión de cuotas de contratos"
        badgeIcon={CheckCircle2}
        badgeLabel="Gestión"
        badgeColor="blue"
      />
      <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background via-background to-muted/20">
        <InstallmentTable />
      </div>
    </div>
  )
}
