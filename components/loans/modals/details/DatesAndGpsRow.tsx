"use client"

import { formatDate, formatCurrency } from "@/lib/utils"
import { Calendar, MapPin, Navigation } from "lucide-react"
import { cn } from "@/lib/utils"

interface DatesAndGpsRowProps {
    startDate?: string | null
    endDate?: string | null
    gpsInstallmentPayment?: number
}

export function DatesAndGpsRow({ startDate, endDate, gpsInstallmentPayment }: DatesAndGpsRowProps) {
    const showGps = gpsInstallmentPayment && gpsInstallmentPayment > 0

    return (
        <div className={cn(
            "grid gap-3",
            showGps ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-2"
        )}>
            <DateCard
                icon={<Calendar className="h-5 w-5" />}
                iconColor="text-emerald-500"
                iconBg="from-emerald-500/20 to-emerald-600/20"
                label="Fecha de Inicio"
                date={startDate}
            />
            
            <DateCard
                icon={<MapPin className="h-5 w-5" />}
                iconColor="text-blue-500"
                iconBg="from-blue-500/20 to-blue-600/20"
                label="Fecha Estimada de Fin"
                date={endDate}
            />
            
            {showGps && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20">
                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center flex-shrink-0">
                            <Navigation className="h-5 w-5 text-cyan-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-muted-foreground">Pago GPS por Cuota</p>
                            <p className="text-lg font-bold text-cyan-600 dark:text-cyan-400">
                                {formatCurrency(gpsInstallmentPayment)}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

interface DateCardProps {
    icon: React.ReactNode
    iconColor: string
    iconBg: string
    label: string
    date?: string | null
}

function DateCard({ icon, iconColor, iconBg, label, date }: DateCardProps) {
    const formattedDate = date 
        ? formatDate(date.split("T")[0]) 
        : "No establecida"

    return (
        <div className="p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
            <div className="flex items-start gap-3">
                <div className={cn(
                    "h-10 w-10 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                    iconBg
                )}>
                    <span className={iconColor}>{icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">{label}</p>
                    <p className="text-base font-semibold text-foreground">{formattedDate}</p>
                </div>
            </div>
        </div>
    )
}
