"use client"

import { useState } from "react"
import { News, NewsType, NewsCategory } from "@/lib/types"
import { 
    Edit, 
    Trash2, 
    User, 
    Building2, 
    Power, 
    Calendar, 
    CalendarRange,
    Wrench,
    AlertTriangle,
    Car,
    Sun,
    PartyPopper,
    Settings,
    HelpCircle,
    Clock,
    Receipt,
    ArrowRight,
    CalendarDays,
    Repeat,
    CalendarCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TableCell, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { NewsForm } from "./NewsForm"
import { NewsService } from "@/lib/services/news.service"
import { useToast } from "@/components/ui/use-toast"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useResourcePermissions } from "@/hooks/useResourcePermissions"
import { Resource } from "@/lib/types/permissions"

// Helper to parse date string to local Date (avoids timezone shift)
function parseLocalDate(dateString: string): Date {
    const datePart = dateString.split('T')[0]
    const [year, month, day] = datePart.split('-').map(Number)
    return new Date(year, month - 1, day)
}

// Helper to determine date selection mode from news data
function getDateSelectionMode(news: News): "single" | "range" | "multiple" | "recurring" {
    // Check recurring first (has recurringDay set)
    if (news.isRecurring && news.recurringDay !== null && news.recurringDay !== undefined) {
        return "recurring"
    }
    
    // Check range (has different end date from start date)
    if (news.endDate && news.endDate.trim() !== "" && news.endDate !== news.startDate) {
        return "range"
    }
    
    // Check multiple dates (has more than 1 actual non-empty date)
    // NOTE: Single mode also uses skippedDates with 1 date, so we check for > 1
    const validSkippedDates = news.skippedDates?.filter(d => d && d.trim() !== "") || []
    if (validSkippedDates.length > 1) {
        return "multiple"
    }
    
    // Default to single (includes case where skippedDates has 0 or 1 date)
    return "single"
}

const DATE_MODE_CONFIG: Record<string, { label: string; icon: typeof Calendar; className: string }> = {
    single: {
        label: "Único",
        icon: CalendarCheck,
        className: "bg-teal-500/15 text-teal-600 border-teal-500/30 dark:bg-teal-500/20 dark:text-teal-400"
    },
    range: {
        label: "Rango",
        icon: CalendarRange,
        className: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-400"
    },
    multiple: {
        label: "Múltiple",
        icon: CalendarDays,
        className: "bg-pink-500/15 text-pink-600 border-pink-500/30 dark:bg-pink-500/20 dark:text-pink-400"
    },
    recurring: {
        label: "Recurrente",
        icon: Repeat,
        className: "bg-cyan-500/15 text-cyan-600 border-cyan-500/30 dark:bg-cyan-500/20 dark:text-cyan-400"
    },
}

interface NewsTableRowProps {
    news: News
    onDelete: (id: string) => void
    onRefresh: () => void
}

// Helper to get month names in Spanish
const MONTH_NAMES_SHORT = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

// Helper to calculate recurring occurrences for the current year
function calculateRecurringOccurrences(news: News): number {
    if (!news.isRecurring || news.recurringDay === null || news.recurringDay === undefined) {
        return 0
    }
    
    // If recurringMonths is empty, it means all 12 months
    const months = news.recurringMonths && news.recurringMonths.length > 0 
        ? news.recurringMonths 
        : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    
    return months.length
}

const NEWS_TYPE_CONFIG: Record<NewsType, { label: string; icon: typeof User; className: string }> = {
    [NewsType.LOAN_SPECIFIC]: { 
        label: "Contrato", 
        icon: User,
        className: "bg-violet-500/15 text-violet-600 border-violet-500/30 dark:bg-violet-500/20 dark:text-violet-400"
    },
    [NewsType.STORE_WIDE]: { 
        label: "Punto", 
        icon: Building2,
        className: "bg-sky-500/15 text-sky-600 border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-400"
    },
}

const NEWS_CATEGORY_CONFIG: Record<NewsCategory, { label: string; icon: typeof Wrench; className: string }> = {
    [NewsCategory.WORKSHOP]: { 
        label: "Taller", 
        icon: Wrench,
        className: "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400"
    },
    [NewsCategory.MAINTENANCE]: { 
        label: "Mantenimiento", 
        icon: Settings,
        className: "bg-indigo-500/15 text-indigo-600 border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-400"
    },
    [NewsCategory.ACCIDENT]: { 
        label: "Accidente", 
        icon: AlertTriangle,
        className: "bg-red-500/15 text-red-600 border-red-500/30 dark:bg-red-500/20 dark:text-red-400"
    },
    [NewsCategory.THEFT]: { 
        label: "Robo", 
        icon: Car,
        className: "bg-rose-500/15 text-rose-600 border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-400"
    },
    [NewsCategory.DAY_OFF]: { 
        label: "Día Libre", 
        icon: Sun,
        className: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-400"
    },
    [NewsCategory.HOLIDAY]: { 
        label: "Festivo", 
        icon: PartyPopper,
        className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400"
    },
    [NewsCategory.SYSTEM_MAINTENANCE]: { 
        label: "Mtto. Sistema", 
        icon: Settings,
        className: "bg-orange-500/15 text-orange-600 border-orange-500/30 dark:bg-orange-500/20 dark:text-orange-400"
    },
    [NewsCategory.WEEKLY_SKIP]: { 
        label: "Salto Semanal", 
        icon: Clock,
        className: "bg-purple-500/15 text-purple-600 border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-400"
    },
    [NewsCategory.OTHER]: { 
        label: "Otro", 
        icon: HelpCircle,
        className: "bg-slate-500/15 text-slate-600 border-slate-500/30 dark:bg-slate-500/20 dark:text-slate-400"
    },
}

export function NewsTableRow({ news, onDelete, onRefresh }: NewsTableRowProps) {
    const [editOpen, setEditOpen] = useState(false)
    const [togglingStatus, setTogglingStatus] = useState(false)
    const { toast } = useToast()
    const newsPermissions = useResourcePermissions(Resource.NEWS)

    const typeConfig = NEWS_TYPE_CONFIG[news.type]
    const categoryConfig = NEWS_CATEGORY_CONFIG[news.category]
    const dateMode = getDateSelectionMode(news)
    const dateModeConfig = DATE_MODE_CONFIG[dateMode]
    const TypeIcon = typeConfig.icon
    const CategoryIcon = categoryConfig.icon
    const DateModeIcon = dateModeConfig.icon

    const handleToggleStatus = async () => {
        try {
            setTogglingStatus(true)
            await NewsService.update(news.id, { isActive: !news.isActive })
            toast({
                title: news.isActive ? "Novedad desactivada" : "Novedad activada",
                description: `La novedad ha sido ${news.isActive ? "desactivada" : "activada"} correctamente`,
            })
            onRefresh()
        } catch (error) {
            console.error("Error toggling status:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo cambiar el estado de la novedad",
            })
        } finally {
            setTogglingStatus(false)
        }
    }

    const hasDateRange = news.endDate && news.endDate !== news.startDate

    return (
        <>
            <TableRow className={cn(
                "border-border transition-all duration-200",
                "hover:bg-muted/60 hover:shadow-sm",
                !news.isActive && "opacity-60"
            )}>
                {/* Type Badge */}
                <TableCell className="py-3">
                    <Badge
                        variant="outline"
                        className={cn(
                            "gap-1.5 px-2.5 py-1 font-medium transition-colors",
                            typeConfig.className
                        )}
                    >
                        <TypeIcon className="h-3.5 w-3.5" />
                        {typeConfig.label}
                    </Badge>
                </TableCell>

                {/* Category Badge */}
                <TableCell className="py-3">
                    <Badge
                        variant="outline"
                        className={cn(
                            "gap-1.5 px-2.5 py-1 font-medium transition-colors",
                            categoryConfig.className
                        )}
                    >
                        <CategoryIcon className="h-3.5 w-3.5" />
                        {categoryConfig.label}
                    </Badge>
                </TableCell>

                {/* Date Mode Badge */}
                <TableCell className="hidden sm:table-cell py-3">
                    <Badge
                        variant="outline"
                        className={cn(
                            "gap-1.5 px-2.5 py-1 font-medium transition-colors",
                            dateModeConfig.className
                        )}
                    >
                        <DateModeIcon className="h-3.5 w-3.5" />
                        {dateModeConfig.label}
                    </Badge>
                </TableCell>

                {/* Title & Description */}
                <TableCell className="py-3 max-w-[250px]">
                    <div className="space-y-0.5">
                        <p className="font-semibold text-foreground truncate">{news.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                            {news.description || "Sin descripción"}
                        </p>
                    </div>
                </TableCell>

                {/* Client / Vehicle */}
                <TableCell className="hidden md:table-cell py-3">
                    {news.loan ? (
                        <div className="flex items-center gap-2.5">
                            <div className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
                                <User className="h-4 w-4 text-violet-500" />
                            </div>
                            <div className="min-w-0">
                                <p className="font-medium text-foreground text-sm truncate">
                                    {news.loan.user.name}
                                </p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Car className="h-3 w-3" />
                                    {news.loan.vehicle?.plate || "N/A"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <Badge 
                            variant="outline" 
                            className="gap-1.5 px-3 py-1.5 font-medium bg-gradient-to-r from-sky-500/10 to-blue-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400 hover:from-sky-500/15 hover:to-blue-500/15 transition-colors"
                        >
                            <Building2 className="h-4 w-4" />
                            Todo el punto
                        </Badge>
                    )}
                </TableCell>

                {/* Dates */}
                <TableCell className="hidden lg:table-cell py-3">
                    {dateMode === "recurring" ? (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30">
                                <Repeat className="h-4 w-4 text-cyan-500" />
                            </div>
                            <div className="text-sm">
                                <p className="font-medium text-foreground">
                                    Día {news.recurringDay} de cada mes
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {news.recurringMonths && news.recurringMonths.length > 0 && news.recurringMonths.length < 12
                                        ? news.recurringMonths.map(m => MONTH_NAMES_SHORT[m - 1]).join(", ")
                                        : "Todos los meses"
                                    }
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "flex items-center justify-center h-8 w-8 rounded-lg",
                                hasDateRange 
                                    ? "bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30" 
                                    : "bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30"
                            )}>
                                {hasDateRange ? (
                                    <CalendarRange className="h-4 w-4 text-amber-500" />
                                ) : (
                                    <Calendar className="h-4 w-4 text-emerald-500" />
                                )}
                            </div>
                            <div className="text-sm">
                                {hasDateRange ? (
                                    <div className="flex items-center gap-1.5 text-foreground">
                                        <span className="font-medium">
                                            {format(parseLocalDate(news.startDate), "dd MMM", { locale: es })}
                                        </span>
                                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                        <span className="font-medium">
                                            {format(parseLocalDate(news.endDate!), "dd MMM", { locale: es })}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="font-medium text-foreground">
                                        {format(parseLocalDate(news.startDate), "dd 'de' MMMM", { locale: es })}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </TableCell>

                {/* Days / Installments */}
                <TableCell className="hidden xl:table-cell py-3">
                    {dateMode === "recurring" ? (
                        // For recurring news, show the number of occurrences per year
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20">
                                <Repeat className="h-3.5 w-3.5 text-cyan-500" />
                                <span className="text-sm font-medium text-foreground">
                                    {calculateRecurringOccurrences(news)}
                                </span>
                                <span className="text-xs text-muted-foreground">días/año</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20">
                                <Receipt className="h-3.5 w-3.5 text-purple-500" />
                                <span className="text-sm font-medium text-foreground">
                                    {calculateRecurringOccurrences(news)}
                                </span>
                                <span className="text-xs text-muted-foreground">cuotas/año</span>
                            </div>
                        </div>
                    ) : (news.daysUnavailable !== null && news.daysUnavailable !== undefined) ||
                     (news.installmentsToSubtract !== null && news.installmentsToSubtract !== undefined) ? (
                        <div className="flex items-center gap-3">
                            {news.daysUnavailable !== null && news.daysUnavailable !== undefined && (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-500/10 border border-slate-500/20">
                                    <Clock className="h-3.5 w-3.5 text-slate-500" />
                                    <span className="text-sm font-medium text-foreground">
                                        {news.daysUnavailable}
                                    </span>
                                    <span className="text-xs text-muted-foreground">días</span>
                                </div>
                            )}
                            {news.installmentsToSubtract !== null && news.installmentsToSubtract !== undefined && (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20">
                                    <Receipt className="h-3.5 w-3.5 text-purple-500" />
                                    <span className="text-sm font-medium text-foreground">
                                        {news.installmentsToSubtract}
                                    </span>
                                    <span className="text-xs text-muted-foreground">cuotas</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                    )}
                </TableCell>

                {/* Status */}
                <TableCell className="py-3">
                    <Badge 
                        variant="outline"
                        className={cn(
                            "gap-1.5 px-2.5 py-1 font-medium transition-all",
                            news.isActive 
                                ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400" 
                                : "bg-slate-500/15 text-slate-500 border-slate-500/30 dark:bg-slate-500/20 dark:text-slate-400"
                        )}
                    >
                        <span className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            news.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                        )} />
                        {news.isActive ? "Activa" : "Inactiva"}
                    </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right py-3">
                    {!newsPermissions.hasAnyAccess ? (
                        <p className="text-xs text-muted-foreground italic">Sin permisos disponibles</p>
                    ) : (
                        <div className="flex justify-end gap-0.5">
                            {newsPermissions.canEdit && (
                                <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleToggleStatus}
                                                disabled={togglingStatus}
                                                className={cn(
                                                    "h-8 w-8 p-0 rounded-lg transition-all",
                                                    news.isActive 
                                                        ? "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10" 
                                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                                )}
                                            >
                                                <Power className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom" className="text-xs">
                                            {news.isActive ? "Desactivar" : "Activar"}
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                            {newsPermissions.canEdit && (
                                <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setEditOpen(true)}
                                                className="h-8 w-8 p-0 rounded-lg text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 transition-all"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom" className="text-xs">Editar</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                            {newsPermissions.canDelete && (
                                <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onDelete(news.id)}
                                                className="h-8 w-8 p-0 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="bottom" className="text-xs">Eliminar</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}
                        </div>
                    )}
                </TableCell>
            </TableRow>

            <NewsForm
                open={editOpen}
                onClose={() => setEditOpen(false)}
                onSuccess={() => {
                    setEditOpen(false)
                    onRefresh()
                }}
                news={news}
            />
        </>
    )
}
