import { AdminDashboard } from "@/components/admin/dashboard/AdminDashboard"
import { PageHeader } from "@/components/common/PageHeader"
import { LayoutDashboard, Shield } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    <div className="flex-1 w-full overflow-hidden flex flex-col">
      <PageHeader
        icon={LayoutDashboard}
        title="Panel Administrativo"
        subtitle="Vista general de todas las puntos y métricas del sistema"
        badgeIcon={Shield}
        badgeLabel="Admin"
        badgeColor="purple"
      />
      <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background via-background to-muted/20">
        <AdminDashboard />
      </div>
    </div>
  )
}
