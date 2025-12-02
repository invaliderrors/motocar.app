"use client"

import { formatDate, formatCurrency, cn } from "@/lib/utils"
import { Calendar, MapPin, Navigation } from "lucide-react"

interface DatesAndGpsRowProps {
    startDate?: string | null
    endDate?: string | null
    gpsInstallmentPayment?: number
}

export function DatesAndGpsRow({ startDate, endDate, gpsInstallmentPayment }: DatesAndGpsRowProps) {
    const showGps = gpsInstallmentPayment && gpsInstallmentPayment > 0

    return (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <DateCard
                icon={<Calendar className="h-4 w-4" />}
                iconColor="text-emerald-500"
                iconBg="from-emerald-500/20 to-emerald-600/20"
                label="Fecha de Inicio"
                date={startDate}
            />
            
            <DateCard
                icon={<MapPin className="h-4 w-4" />}
                iconColor="text-blue-500"
                iconBg="from-blue-500/20 to-blue-600/20"
                label="Fecha Estimada de Fin"
                date={endDate}
            />
            
            {showGps && (
                <div className="p-3 rounded-lg bg-gradient-to-br from-cyan-500/10 to-teal-500/10 border border-cyan-500/20">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center flex-shrink-0">
                            <Navigation className="h-4 w-4 text-cyan-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-medium text-muted-foreground">Pago GPS por Cuota</p>
                            <p className="text-base font-bold text-cyan-600 dark:text-cyan-400">
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
        <div className="p-3 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 border border-border/50">
            <div className="flex items-center gap-3">
                <div className={cn(
                    "h-9 w-9 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                    iconBg
                )}>
                    <span className={iconColor}>{icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
                    <p className="text-sm font-semibold text-foreground">{formattedDate}</p>
                </div>
            </div>
        </div>
    )
}
