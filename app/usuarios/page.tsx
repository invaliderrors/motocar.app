import { UserTable } from "@/components/users/UserTable"
import { PageHeader } from "@/components/common/PageHeader"
import { Users, UserCog } from "lucide-react"

export default function UsersPage() {
  return (
    <div className="flex-1 w-full overflow-hidden flex flex-col">
      <PageHeader
        icon={Users}
        title="Usuarios"
        subtitle="Gestión de usuarios del sistema"
        badgeIcon={UserCog}
        badgeLabel="Administración"
        badgeColor="blue"
      />
      <div className="flex-1 overflow-auto p-4 md:p-6 bg-gradient-to-br from-background via-background to-muted/20">
        <UserTable />
      </div>
    </div>
  )
}
