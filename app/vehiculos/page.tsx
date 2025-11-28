import { VehicleTable } from "@/components/vehicles/VehicleTable"
import { PageHeader } from "@/components/common/PageHeader"
import { Car, Package } from "lucide-react"

export default function VehiclesPage() {
  return (
    <div className="flex-1 w-full overflow-hidden flex flex-col">
      <PageHeader
        icon={Car}
        title="Vehículos"
        subtitle="Gestión de vehículos e inventario"
        badgeIcon={Package}
        badgeLabel="Inventario"
        badgeColor="purple"
      />
      <div className="flex-1 overflow-auto p-4 md:p-6 bg-gradient-to-br from-background via-background to-muted/20">
        <VehicleTable />
      </div>
    </div>
  )
}
