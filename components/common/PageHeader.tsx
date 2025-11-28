import { MobileSidebar } from "@/components/common/mobile-sidebar"
import { LucideIcon } from "lucide-react"
import { ReactNode } from "react"

interface PageHeaderProps {
  icon: LucideIcon
  title: string
  subtitle: string
  badgeIcon: LucideIcon
  badgeLabel: string
  badgeColor: "green" | "blue" | "purple" | "amber" | "emerald"
}

const badgeColorClasses = {
  green: "bg-green-500/20 border-green-400/30 text-green-400",
  blue: "bg-blue-500/20 border-blue-400/30 text-blue-400",
  purple: "bg-purple-500/20 border-purple-400/30 text-purple-400",
  amber: "bg-amber-500/20 border-amber-400/30 text-amber-400",
  emerald: "bg-emerald-500/20 border-emerald-400/30 text-emerald-400",
}

export function PageHeader({ icon: Icon, title, subtitle, badgeIcon: BadgeIcon, badgeLabel, badgeColor }: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground py-6 px-6 shrink-0 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-primary-foreground/20 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-primary-foreground/10">
            <Icon className="h-7 w-7 text-primary-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{title}</h1>
              <div className={`${badgeColorClasses[badgeColor]} border px-2 py-0.5 rounded-full flex items-center gap-1`}>
                <BadgeIcon className="h-3 w-3" />
                <span className="text-xs font-semibold">{badgeLabel}</span>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <MobileSidebar />
        </div>
      </div>
    </div>
  )
}
