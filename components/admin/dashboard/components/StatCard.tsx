import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  iconColor?: string
  gradientFrom?: string
  gradientTo?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-primary",
  gradientFrom = "from-primary/10",
  gradientTo = "to-primary/5",
  trend,
  className,
}: StatCardProps) {
  return (
    <Card 
      className={cn(
        "group relative overflow-hidden border-0 shadow-md backdrop-blur-sm",
        "hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 ease-out",
        "bg-gradient-to-br from-card/80 to-card/40",
        className
      )}
    >
      {/* Gradient overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-50 group-hover:opacity-70 transition-opacity duration-300",
        gradientFrom,
        gradientTo
      )} />
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-0 -left-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-pulse delay-75" />
      </div>

      <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground/80 group-hover:text-foreground transition-colors">
          {title}
        </CardTitle>
        <div className={cn(
          "h-10 w-10 rounded-xl bg-gradient-to-br flex items-center justify-center",
          "group-hover:scale-110 transition-transform duration-300",
          "shadow-lg"
        )}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-2 font-medium">{subtitle}</p>
        )}
        {trend && (
          <div
            className={cn(
              "text-xs font-bold mt-2 flex items-center gap-1 px-2 py-1 rounded-full w-fit",
              trend.isPositive 
                ? "bg-green-500/10 text-green-600 dark:text-green-400" 
                : "bg-red-500/10 text-red-600 dark:text-red-400"
            )}
          >
            <span>{trend.isPositive ? "↑" : "↓"}</span>
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
