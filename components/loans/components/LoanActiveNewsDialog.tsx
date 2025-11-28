"use client"

import { useState, useEffect, ReactNode } from "react"
import { News, NewsCategory } from "@/lib/types"
import { NewsService } from "@/lib/services/news.service"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Wrench,
    Settings,
    Car,
    Shield,
    Calendar,
    CalendarDays,
    Clock,
    FileText,
    AlertTriangle,
    Newspaper,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface LoanActiveNewsDialogProps {
    loanId: string
    vehicleInfo: string
    children: ReactNode
}

const NEWS_CATEGORY_CONFIG: Record<NewsCategory, { label: string; icon: typeof Wrench; color: string }> = {
    [NewsCategory.WORKSHOP]: { label: "Taller", icon: Wrench, color: "bg-orange-500" },
    [NewsCategory.MAINTENANCE]: { label: "Mantenimiento", icon: Settings, color: "bg-blue-500" },
    [NewsCategory.ACCIDENT]: { label: "Accidente", icon: Car, color: "bg-red-500" },
    [NewsCategory.THEFT]: { label: "Robo", icon: Shield, color: "bg-red-700" },
    [NewsCategory.DAY_OFF]: { label: "Día Libre", icon: Calendar, color: "bg-green-500" },
    [NewsCategory.HOLIDAY]: { label: "Festivo", icon: CalendarDays, color: "bg-green-600" },
    [NewsCategory.SYSTEM_MAINTENANCE]: { label: "Mtto. Sistema", icon: Settings, color: "bg-yellow-500" },
    [NewsCategory.OTHER]: { label: "Otro", icon: FileText, color: "bg-gray-500" },
}

export function LoanActiveNewsDialog({ loanId, vehicleInfo, children }: LoanActiveNewsDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [news, setNews] = useState<News[]>([])
    const [totalInstallmentsExcluded, setTotalInstallmentsExcluded] = useState(0)

    useEffect(() => {
        if (open) {
            loadActiveNews()
        }
    }, [open, loanId])

    const loadActiveNews = async () => {
        try {
            setLoading(true)
            const [activeNews, totalToSubtract] = await Promise.all([
                NewsService.getActiveLoanNews(loanId),
                NewsService.getTotalInstallmentsToSubtract(loanId),
            ])
            setNews(activeNews)
            setTotalInstallmentsExcluded(totalToSubtract)
        } catch (error) {
            console.error("Error loading active news:", error)
        } finally {
            setLoading(false)
        }
    }

    const formatDateRange = (startDate: string, endDate?: string | null) => {
        const start = format(new Date(startDate), "dd MMM yyyy", { locale: es })
        if (!endDate) return start
        const end = format(new Date(endDate), "dd MMM yyyy", { locale: es })
        return `${start} - ${end}`
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Newspaper className="h-5 w-5 text-amber-500" />
                        Novedades Activas
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        {vehicleInfo}
                    </p>
                </DialogHeader>

                {/* Summary */}
                {!loading && news.length > 0 && (
                    <div className="flex items-center gap-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            <span className="text-sm font-medium">
                                {news.length} {news.length === 1 ? "novedad activa" : "novedades activas"}
                            </span>
                        </div>
                        <Separator orientation="vertical" className="h-4" />
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-amber-500" />
                            <span className="text-sm">
                                <strong className="text-amber-500">{totalInstallmentsExcluded}</strong> cuotas excluidas
                            </span>
                        </div>
                    </div>
                )}

                <ScrollArea className="max-h-[50vh] pr-4">
                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="p-4 border rounded-lg space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="h-5 w-20" />
                                        <Skeleton className="h-5 w-32" />
                                    </div>
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            ))}
                        </div>
                    ) : news.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <Newspaper className="h-12 w-12 text-muted-foreground/30 mb-4" />
                            <p className="text-muted-foreground">
                                No hay novedades activas para este contrato
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {news.map((item) => {
                                const config = NEWS_CATEGORY_CONFIG[item.category]
                                const Icon = config.icon
                                
                                return (
                                    <div
                                        key={item.id}
                                        className="p-4 border rounded-lg space-y-3 hover:bg-muted/50 transition-colors"
                                    >
                                        {/* Header */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge className={`${config.color} text-white`}>
                                                    <Icon className="h-3 w-3 mr-1" />
                                                    {config.label}
                                                </Badge>
                                                <span className="font-medium">{item.title}</span>
                                            </div>
                                            {item.daysUnavailable && (
                                                <Badge variant="outline" className="text-amber-500 border-amber-500/50">
                                                    {item.daysUnavailable} días
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Description */}
                                        <p className="text-sm text-muted-foreground">
                                            {item.description}
                                        </p>

                                        {/* Notes */}
                                        {item.notes && (
                                            <div className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                                                <strong className="text-foreground">Notas:</strong> {item.notes}
                                            </div>
                                        )}

                                        {/* Footer */}
                                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                                            <div className="flex items-center gap-1">
                                                <CalendarDays className="h-3 w-3" />
                                                {formatDateRange(item.startDate, item.endDate)}
                                            </div>
                                            {item.installmentsToSubtract && item.installmentsToSubtract > 0 && (
                                                <div className="flex items-center gap-1 text-amber-500">
                                                    <Clock className="h-3 w-3" />
                                                    {item.installmentsToSubtract} cuotas excluidas
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}
