import { MobileSidebar } from "@/components/common/mobile-sidebar"
import { LucideIcon, Sparkles } from "lucide-react"
import { ReactNode } from "react"

interface PageHeaderProps {
  icon: LucideIcon
  title: string
  subtitle: string
  badgeIcon: LucideIcon
  badgeLabel: string
  badgeColor: "green" | "blue" | "purple" | "amber" | "emerald" | "rose" | "cyan"
  children?: ReactNode
}

const badgeColorClasses = {
  green: "bg-green-500/20 border-green-400/30 text-green-300 shadow-green-500/20",
  blue: "bg-blue-500/20 border-blue-400/30 text-blue-300 shadow-blue-500/20",
  purple: "bg-purple-500/20 border-purple-400/30 text-purple-300 shadow-purple-500/20",
  amber: "bg-amber-500/20 border-amber-400/30 text-amber-300 shadow-amber-500/20",
  emerald: "bg-emerald-500/20 border-emerald-400/30 text-emerald-300 shadow-emerald-500/20",
  rose: "bg-rose-500/20 border-rose-400/30 text-rose-300 shadow-rose-500/20",
  cyan: "bg-cyan-500/20 border-cyan-400/30 text-cyan-300 shadow-cyan-500/20",
}

const iconBgClasses = {
  green: "from-green-400/20 to-emerald-500/20 border-green-400/20 shadow-green-500/10",
  blue: "from-blue-400/20 to-indigo-500/20 border-blue-400/20 shadow-blue-500/10",
  purple: "from-purple-400/20 to-violet-500/20 border-purple-400/20 shadow-purple-500/10",
  amber: "from-amber-400/20 to-orange-500/20 border-amber-400/20 shadow-amber-500/10",
  emerald: "from-emerald-400/20 to-teal-500/20 border-emerald-400/20 shadow-emerald-500/10",
  rose: "from-rose-400/20 to-pink-500/20 border-rose-400/20 shadow-rose-500/10",
  cyan: "from-cyan-400/20 to-sky-500/20 border-cyan-400/20 shadow-cyan-500/10",
}

export function PageHeader({ icon: Icon, title, subtitle, badgeIcon: BadgeIcon, badgeLabel, badgeColor, children }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/80 text-primary-foreground shrink-0">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Animated shimmer line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>

      {/* Main content */}
      <div className="relative py-6 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            {/* Icon container with glow effect */}
            <div className="relative group">
              <div className={`absolute inset-0 bg-gradient-to-br ${iconBgClasses[badgeColor]} rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity`} />
              <div className={`relative bg-gradient-to-br ${iconBgClasses[badgeColor]} backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/10 transition-transform duration-300 group-hover:scale-105`}>
                <Icon className="h-7 w-7 text-primary-foreground drop-shadow-lg" />
              </div>
            </div>
            
            {/* Title section */}
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text">
                  {title}
                </h1>
                
                {/* Enhanced badge */}
                <div className={`${badgeColorClasses[badgeColor]} border backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-lg transition-all duration-300 hover:scale-105`}>
                  <BadgeIcon className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold tracking-wide">{badgeLabel}</span>
                </div>
              </div>
              
              {/* Subtitle with icon */}
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary-foreground/50" />
                <p className="text-primary-foreground/70 text-sm font-medium">{subtitle}</p>
              </div>
            </div>
          </div>
          
          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {children}
            <MobileSidebar />
          </div>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  )
}
