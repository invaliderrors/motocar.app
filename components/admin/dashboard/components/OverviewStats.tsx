import { Building2, Car, FileText, DollarSign, Users, Activity } from "lucide-react"
import { StatCard } from "./StatCard"
import { formatCurrency } from "@/lib/utils/formatters"

interface OverviewData {
  totalStores: number
  activeStores: number
  totalVehicles: number
  totalLoans: number
  totalEmployees: number
  totalProviders: number
  activeLoans: number
  totalRevenue: number
}

interface OverviewStatsProps {
  data: OverviewData
}

export function OverviewStats({ data }: OverviewStatsProps) {
  const averageVehiclesPerStore =
    data.totalStores > 0 ? Math.round(data.totalVehicles / data.totalStores) : 0

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Puntos"
          value={data.totalStores}
          subtitle={`${data.activeStores} activas`}
          icon={Building2}
          iconColor="text-blue-600"
          gradientFrom="from-blue-500/20"
          gradientTo="to-blue-500/5"
        />
        <StatCard
          title="Vehículos Total"
          value={data.totalVehicles}
          subtitle="En todos los puntos"
          icon={Car}
          iconColor="text-purple-600"
          gradientFrom="from-purple-500/20"
          gradientTo="to-purple-500/5"
        />
        <StatCard
          title="contratos Activos"
          value={data.activeLoans}
          subtitle={`De ${data.totalLoans} totales`}
          icon={FileText}
          iconColor="text-green-600"
          gradientFrom="from-green-500/20"
          gradientTo="to-green-500/5"
        />
        <StatCard
          title="Ingresos Totales"
          value={formatCurrency(data.totalRevenue)}
          subtitle="Acumulado histórico"
          icon={DollarSign}
          iconColor="text-orange-600"
          gradientFrom="from-orange-500/20"
          gradientTo="to-orange-500/5"
        />
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Empleados"
          value={data.totalEmployees}
          subtitle="Personal activo"
          icon={Users}
          iconColor="text-cyan-600"
          gradientFrom="from-cyan-500/20"
          gradientTo="to-cyan-500/5"
        />
        <StatCard
          title="Proveedores"
          value={data.totalProviders}
          subtitle="Registrados"
          icon={Users}
          iconColor="text-indigo-600"
          gradientFrom="from-indigo-500/20"
          gradientTo="to-indigo-500/5"
        />
        <StatCard
          title="Promedio por punto"
          value={averageVehiclesPerStore}
          subtitle="Vehículos por punto"
          icon={Activity}
          iconColor="text-pink-600"
          gradientFrom="from-pink-500/20"
          gradientTo="to-pink-500/5"
        />
      </div>
    </div>
  )
}
