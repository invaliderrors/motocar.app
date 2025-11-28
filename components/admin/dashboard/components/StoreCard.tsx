import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Store,
  MapPin,
  Car,
  Activity,
  FileText,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageSquare,
  ArrowRight,
} from "lucide-react"
import { StoreData } from "@/lib/services/admin-dashboard.service"
import { formatCurrency } from "@/lib/utils/formatters"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface StoreCardProps {
  store: StoreData
}

export function StoreCard({ store }: StoreCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/admin/stores/${store.id}`)
  }

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-0 shadow-lg backdrop-blur-sm",
        "hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 ease-out cursor-pointer",
        "bg-gradient-to-br from-card/90 to-card/60",
        store.status !== "ACTIVE" && "opacity-50 grayscale hover:grayscale-0"
      )}
      onClick={handleClick}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <CardHeader className="relative pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
              <Store className="h-7 w-7 text-primary-foreground" />
              <div className="absolute -inset-1 bg-primary/20 rounded-2xl blur-md group-hover:blur-lg transition-all" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                {store.name}
              </h3>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{store.city}</span>
              </div>
            </div>
          </div>
          
          <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={store.status === "ACTIVE" ? "default" : "secondary"}
            className={cn(
              "px-2.5 py-0.5 font-semibold shadow-sm",
              store.status === "ACTIVE"
                ? "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30 hover:bg-green-500/25"
                : "bg-gray-500/15 text-gray-600 dark:text-gray-400 border-gray-500/30"
            )}
          >
            {store.status === "ACTIVE" ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <XCircle className="w-3 h-3 mr-1" />
            )}
            {store.status === "ACTIVE" ? "Activa" : "Inactiva"}
          </Badge>
          
          {store.whatsappEnabled && (
            <Badge
              variant="outline"
              className={cn(
                "px-2.5 py-0.5 font-semibold shadow-sm",
                store.whatsappConfigured
                  ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/25"
                  : "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30 hover:bg-orange-500/25"
              )}
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              WhatsApp
            </Badge>
          )}
          
          <Badge 
            variant="outline" 
            className="px-2.5 py-0.5 font-mono text-[10px] bg-muted/50"
          >
            {store.code}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Car, label: "Vehículos", value: store.stats.totalVehicles, color: "purple" },
            { icon: Activity, label: "En uso", value: store.stats.vehiclesInUse, color: "blue" },
            { icon: FileText, label: "Arriendos", value: store.stats.activeLoans, color: "green" },
            { icon: Users, label: "Empleados", value: store.stats.totalEmployees, color: "cyan" },
          ].map((stat) => (
            <div
              key={stat.label}
              className={cn(
                "group/stat relative overflow-hidden rounded-xl p-3 transition-all duration-300",
                "hover:scale-105 hover:shadow-md",
                `bg-${stat.color}-500/5 border border-${stat.color}-500/20`
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <stat.icon className={cn("h-4 w-4", `text-${stat.color}-600`)} />
              </div>
              <div className="space-y-0.5">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground font-medium">{stat.label}</p>
              </div>
              
              {/* Subtle gradient overlay */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-0 group-hover/stat:opacity-100 transition-opacity",
                `from-${stat.color}-500/10 to-transparent`
              )} />
            </div>
          ))}
        </div>

        {/* Financial Stats */}
        <div className="space-y-2 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-green-500/10 to-green-500/5 border border-green-500/20 hover:border-green-500/40 transition-colors">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Ingresos mes</span>
            </div>
            <span className="font-bold text-green-600 text-sm">
              {formatCurrency(store.stats.monthlyRevenue)}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-500/5 border border-orange-500/20 hover:border-orange-500/40 transition-colors">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <AlertCircle className="h-4 w-4 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Pendiente</span>
            </div>
            <span className="font-bold text-orange-600 text-sm">
              {formatCurrency(store.stats.pendingPayments)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
