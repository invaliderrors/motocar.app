import { UserManagement } from "@/components/admin/UserManagement"
import { PageHeader } from "@/components/common/PageHeader"
import { Users, Shield } from "lucide-react"

export default function AdminUsersPage() {
  return (
    <div className="flex-1 w-full overflow-hidden flex flex-col">
      <PageHeader
        icon={Users}
        title="Gestión de Usuarios"
        subtitle="Administra los usuarios y permisos del sistema"
        badgeIcon={Shield}
        badgeLabel="Admin"
        badgeColor="purple"
      />
      <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background via-background to-muted/20">
        <UserManagement filter="all" />
      </div>
    </div>
  )
}
