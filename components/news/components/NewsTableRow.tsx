"use client"

import { useState } from "react"
import { News, NewsType, NewsCategory } from "@/lib/types"
import { Edit, Trash2, User, Building2, Power } from "lucide-react"
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

interface NewsTableRowProps {
    news: News
    onDelete: (id: string) => void
    onRefresh: () => void
}

const NEWS_TYPE_LABELS: Record<NewsType, string> = {
    [NewsType.LOAN_SPECIFIC]: "Contrato",
    [NewsType.STORE_WIDE]: "Punto",
}

const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
    [NewsCategory.WORKSHOP]: "Taller",
    [NewsCategory.MAINTENANCE]: "Mantenimiento",
    [NewsCategory.ACCIDENT]: "Accidente",
    [NewsCategory.THEFT]: "Robo",
    [NewsCategory.DAY_OFF]: "Día Libre",
    [NewsCategory.HOLIDAY]: "Festivo",
    [NewsCategory.SYSTEM_MAINTENANCE]: "Mtto. Sistema",
    [NewsCategory.OTHER]: "Otro",
}

const getCategoryColor = (category: NewsCategory) => {
    switch (category) {
        case NewsCategory.WORKSHOP:
        case NewsCategory.MAINTENANCE:
            return "bg-blue-500 hover:bg-blue-600"
        case NewsCategory.ACCIDENT:
        case NewsCategory.THEFT:
            return "bg-red-500 hover:bg-red-600"
        case NewsCategory.DAY_OFF:
        case NewsCategory.HOLIDAY:
            return "bg-green-500 hover:bg-green-600"
        case NewsCategory.SYSTEM_MAINTENANCE:
            return "bg-yellow-500 hover:bg-yellow-600"
        default:
            return "bg-gray-500 hover:bg-gray-600"
    }
}

export function NewsTableRow({ news, onDelete, onRefresh }: NewsTableRowProps) {
    const [editOpen, setEditOpen] = useState(false)
    const [togglingStatus, setTogglingStatus] = useState(false)
    const { toast } = useToast()

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

    return (
        <>
            <TableRow className="border-border hover:bg-muted/50">
                <TableCell>
                    <Badge
                        variant={news.type === NewsType.LOAN_SPECIFIC ? "default" : "secondary"}
                        className="gap-1"
                    >
                        {news.type === NewsType.LOAN_SPECIFIC ? (
                            <User className="h-3 w-3" />
                        ) : (
                            <Building2 className="h-3 w-3" />
                        )}
                        {NEWS_TYPE_LABELS[news.type]}
                    </Badge>
                </TableCell>
                <TableCell>
                    <Badge className={`${getCategoryColor(news.category)} text-white`}>
                        {NEWS_CATEGORY_LABELS[news.category]}
                    </Badge>
                </TableCell>
                <TableCell>
                    <div>
                        <p className="font-medium text-foreground">{news.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                            {news.description}
                        </p>
                    </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    {news.loan ? (
                        <div className="text-sm">
                            <p className="font-medium text-foreground">{news.loan.user.name}</p>
                            <p className="text-muted-foreground">
                                {news.loan.vehicle?.plate || "N/A"}
                            </p>
                        </div>
                    ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                    )}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                    <div className="text-sm">
                        <p className="text-foreground">
                            {format(new Date(news.startDate), "dd/MM/yyyy", { locale: es })}
                        </p>
                        {news.endDate && (
                            <p className="text-muted-foreground">
                                {format(new Date(news.endDate), "dd/MM/yyyy", { locale: es })}
                            </p>
                        )}
                    </div>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                    <div className="text-sm">
                        {news.daysUnavailable !== null && news.daysUnavailable !== undefined && (
                            <p className="text-foreground">{news.daysUnavailable} días</p>
                        )}
                        {news.installmentsToSubtract !== null && news.installmentsToSubtract !== undefined && (
                            <p className="text-muted-foreground">
                                {news.installmentsToSubtract} cuotas
                            </p>
                        )}
                        {(news.daysUnavailable === null || news.daysUnavailable === undefined) &&
                            (news.installmentsToSubtract === null || news.installmentsToSubtract === undefined) && (
                                <span className="text-muted-foreground">—</span>
                            )}
                    </div>
                </TableCell>
                <TableCell>
                    <Badge variant={news.isActive ? "default" : "secondary"}>
                        {news.isActive ? "Activa" : "Inactiva"}
                    </Badge>
                </TableCell>
                <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleToggleStatus}
                                        disabled={togglingStatus}
                                        className={`h-8 w-8 p-0 hover:bg-muted ${news.isActive ? "text-green-500 hover:text-green-600" : "text-muted-foreground hover:text-foreground"}`}
                                    >
                                        <Power className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {news.isActive ? "Desactivar" : "Activar"}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setEditOpen(true)}
                                        className="h-8 w-8 p-0 hover:bg-muted"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Editar</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(news.id)}
                                        className="h-8 w-8 p-0 hover:bg-muted"
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Eliminar</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
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
