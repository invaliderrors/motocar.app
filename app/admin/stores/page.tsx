"use client"

import { useStore } from "@/contexts/StoreContext"
import { Building2, Store as StoreIcon } from "lucide-react"
import { StoreTable } from "@/components/admin/stores"
import { PageHeader } from "@/components/common/PageHeader"

export default function StoreManagementPage() {
  const { isAdmin } = useStore()

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">
          Acceso denegado. Solo administradores.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 w-full overflow-hidden flex flex-col">
      <PageHeader
        icon={Building2}
        title="Gestión de puntos"
        subtitle="Administración de puntos y sucursales"
        badgeIcon={StoreIcon}
        badgeLabel="Admin"
        badgeColor="purple"
      />
      <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background via-background to-muted/20">
        <StoreTable />
      </div>
    </div>
  )
}
