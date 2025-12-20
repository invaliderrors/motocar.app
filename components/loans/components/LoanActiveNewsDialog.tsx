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
    CheckCircle2,
    XCircle,
    CalendarX,
    Repeat,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface LoanNewsDialogProps {
    loanId: string
    vehicleInfo: string
    children?: ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

interface SkippedDatesResponse {
    dates: string[]
    news: Array<{ id: string; title: string; category: string; dates: string[]; isRecurring: boolean }>
}

const NEWS_CATEGORY_CONFIG: Record<NewsCategory, { label: string; icon: typeof Wrench; color: string }> = {
    [NewsCategory.WORKSHOP]: { label: "Taller", icon: Wrench, color: "bg-orange-500" },
    [NewsCategory.MAINTENANCE]: { label: "Mantenimiento", icon: Settings, color: "bg-blue-500" },
    [NewsCategory.ACCIDENT]: { label: "Accidente", icon: Car, color: "bg-red-500" },
    [NewsCategory.THEFT]: { label: "Robo", icon: Shield, color: "bg-red-700" },
    [NewsCategory.DAY_OFF]: { label: "Día Libre", icon: Calendar, color: "bg-green-500" },
    [NewsCategory.HOLIDAY]: { label: "Festivo", icon: CalendarDays, color: "bg-green-600" },
    [NewsCategory.SYSTEM_MAINTENANCE]: { label: "Mtto. Sistema", icon: Settings, color: "bg-yellow-500" },
    [NewsCategory.WEEKLY_SKIP]: { label: "Exclusión Semanal", icon: CalendarX, color: "bg-purple-500" },
    [NewsCategory.OTHER]: { label: "Otro", icon: FileText, color: "bg-gray-500" },
}

export function LoanActiveNewsDialog({ loanId, vehicleInfo, children, open: controlledOpen, onOpenChange }: LoanNewsDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [news, setNews] = useState<News[]>([])
    const [skippedDatesData, setSkippedDatesData] = useState<SkippedDatesResponse | null>(null)

    // Use controlled or internal state
    const isControlled = controlledOpen !== undefined
    const open = isControlled ? controlledOpen : internalOpen
    const setOpen = isControlled ? (onOpenChange || (() => {})) : setInternalOpen

    useEffect(() => {
        if (open) {
            loadAllNews()
            loadSkippedDates()
        }
    }, [open, loanId])

    const loadAllNews = async () => {
        try {
            setLoading(true)
            const allNews = await NewsService.getAllLoanNews(loanId)
            setNews(allNews)
        } catch (error) {
            console.error("Error loading news:", error)
        } finally {
            setLoading(false)
        }
    }

    const loadSkippedDates = async () => {
        try {
            const data = await NewsService.getSkippedDatesForLoan(loanId)
            setSkippedDatesData(data)
        } catch (error) {
            console.error("Error loading skipped dates:", error)
        }
    }

    const formatDateRange = (startDate: string, endDate?: string | null) => {
        const start = format(new Date(startDate), "dd MMM yyyy", { locale: es })
        if (!endDate) return start
        const end = format(new Date(endDate), "dd MMM yyyy", { locale: es })
        return `${start} - ${end}`
    }

    const formatSkippedDate = (dateStr: string) => {
        return format(new Date(dateStr), "EEE dd MMM yyyy", { locale: es })
    }

    // Check if a news item is currently active
    const isNewsCurrentlyActive = (item: News) => {
        if (!item.isActive) return false
        if (!item.endDate) return true
        return new Date(item.endDate) >= new Date()
    }

    // Calculate summary
    const activeNews = news.filter(isNewsCurrentlyActive)
    const totalInstallmentsExcluded = activeNews.reduce((sum, item) => sum + (item.installmentsToSubtract || 0), 0)
    const totalSkippedDates = skippedDatesData?.dates.length || 0

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {children && (
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
            )}
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Newspaper className="h-5 w-5 text-amber-500" />
                        Novedades del Contrato
                    </DialogTitle>
                    <p className="text-sm text-muted-foreground">
                        {vehicleInfo}
                    </p>
                </DialogHeader>

                {/* Summary */}
                {!loading && news.length > 0 && (
                    <div className="flex flex-wrap items-center gap-4 p-3 bg-muted/50 border rounded-lg">
                        <div className="flex items-center gap-2">
                            <Newspaper className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                                {news.length} {news.length === 1 ? "novedad total" : "novedades totales"}
                            </span>
                        </div>
                        <Separator orientation="vertical" className="h-4" />
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className="text-sm">
                                <strong className="text-green-500">{activeNews.length}</strong> activas
                            </span>
                        </div>
                        {totalSkippedDates > 0 && (
                            <>
                                <Separator orientation="vertical" className="h-4" />
                                <div className="flex items-center gap-2">
                                    <CalendarX className="h-4 w-4 text-red-500" />
                                    <span className="text-sm">
                                        <strong className="text-red-500">{totalSkippedDates}</strong> fechas excluidas
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Skipped Dates Section */}
                {skippedDatesData && skippedDatesData.dates.length > 0 && (
                    <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg space-y-3">
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                            <CalendarX className="h-5 w-5" />
                            <span className="font-semibold">Fechas Excluidas (No se cobran)</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {skippedDatesData.dates.slice(0, 20).map((date, idx) => (
                                <Badge key={idx} variant="outline" className="text-red-600 border-red-300 dark:border-red-700">
                                    {formatSkippedDate(date)}
                                </Badge>
                            ))}
                            {skippedDatesData.dates.length > 20 && (
                                <Badge variant="outline" className="text-muted-foreground">
                                    +{skippedDatesData.dates.length - 20} más
                                </Badge>
                            )}
                        </div>
                        {skippedDatesData.news.some(n => n.isRecurring) && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Repeat className="h-4 w-4" />
                                <span>Incluye fechas recurrentes (próximos 12 meses)</span>
                            </div>
                        )}
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
                                No hay novedades para este contrato
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {news.map((item) => {
                                const config = NEWS_CATEGORY_CONFIG[item.category]
                                const Icon = config.icon
                                const isActive = isNewsCurrentlyActive(item)
                                const newsSkippedDates = skippedDatesData?.news.find(n => n.id === item.id)?.dates || []
                                
                                return (
                                    <div
                                        key={item.id}
                                        className={`p-4 border rounded-lg space-y-3 hover:bg-muted/50 transition-colors ${!isActive ? "opacity-60" : ""}`}
                                    >
                                        {/* Header */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Badge className={`${config.color} text-white`}>
                                                    <Icon className="h-3 w-3 mr-1" />
                                                    {config.label}
                                                </Badge>
                                                <span className="font-medium">{item.title}</span>
                                                {isActive ? (
                                                    <Badge variant="outline" className="text-green-500 border-green-500/50">
                                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                                        Activa
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-muted-foreground border-muted-foreground/50">
                                                        <XCircle className="h-3 w-3 mr-1" />
                                                        Inactiva
                                                    </Badge>
                                                )}
                                                {item.isRecurring && (
                                                    <Badge variant="outline" className="text-blue-500 border-blue-500/50">
                                                        <Repeat className="h-3 w-3 mr-1" />
                                                        Recurrente
                                                    </Badge>
                                                )}
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

                                        {/* Skipped Dates for this news */}
                                        {newsSkippedDates.length > 0 && (
                                            <div className="bg-red-50 dark:bg-red-950/30 p-2 rounded border border-red-200 dark:border-red-900">
                                                <div className="flex items-center gap-2 mb-2 text-sm font-medium text-red-600 dark:text-red-400">
                                                    <CalendarX className="h-4 w-4" />
                                                    Fechas excluidas:
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {newsSkippedDates.slice(0, 10).map((date, idx) => (
                                                        <Badge key={idx} variant="secondary" className="text-xs">
                                                            {formatSkippedDate(date)}
                                                        </Badge>
                                                    ))}
                                                    {newsSkippedDates.length > 10 && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            +{newsSkippedDates.length - 10} más
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}

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
