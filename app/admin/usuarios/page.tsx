import { EmployeeTable } from "@/components/admin/employees"
import { PageHeader } from "@/components/common/PageHeader"
import { Users, Shield } from "lucide-react"

export default function AdminEmployeesPage() {
  return (
    <div className="flex-1 w-full overflow-hidden flex flex-col">
      <PageHeader
        icon={Users}
        title="Gestión de Empleados"
        subtitle="Administra los empleados y asignaciones de punto"
        badgeIcon={Shield}
        badgeLabel="Admin"
        badgeColor="purple"
      />
      <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background via-background to-muted/20">
        <EmployeeTable />
      </div>
    </div>
  )
}
