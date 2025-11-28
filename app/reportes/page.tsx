import ReportsDashboard from "@/components/reports/reports-dashboard"
import { PageHeader } from "@/components/common/PageHeader"
import { BarChart3, FileBarChart } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reportes | Sistema de Gestión de contratos",
  description: "Visualiza y exporta reportes detallados sobre contratos, pagos, clientes y motocicletas.",
}

export default function ReportsPage() {
  return (
    <div className="flex-1 w-full overflow-hidden flex flex-col">
      <PageHeader
        icon={BarChart3}
        title="Reportes"
        subtitle="Visualiza y exporta reportes detallados"
        badgeIcon={FileBarChart}
        badgeLabel="Análisis"
        badgeColor="amber"
      />
      <div className="flex-1 overflow-auto p-4 md:p-6 bg-gradient-to-br from-background via-background to-muted/20">
        <ReportsDashboard />
      </div>
    </div>
  )
}
