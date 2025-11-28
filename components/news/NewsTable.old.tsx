"use client"

import { News, NewsType, NewsCategory } from "@/lib/types"
import { Edit, Trash2, Calendar, User, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface NewsTableProps {
    news: News[]
    loading: boolean
    onEdit: (news: News) => void
    onDelete: (id: string) => void
}

const NEWS_TYPE_LABELS: Record<NewsType, string> = {
    [NewsType.LOAN_SPECIFIC]: "contrato Específico",
    [NewsType.STORE_WIDE]: "Todo el punto",
}

const NEWS_CATEGORY_LABELS: Record<NewsCategory, string> = {
    [NewsCategory.WORKSHOP]: "Taller",
    [NewsCategory.MAINTENANCE]: "Mantenimiento",
    [NewsCategory.ACCIDENT]: "Accidente",
    [NewsCategory.THEFT]: "Robo",
    [NewsCategory.DAY_OFF]: "Día Libre",
    [NewsCategory.HOLIDAY]: "Festivo",
    [NewsCategory.SYSTEM_MAINTENANCE]: "Mantenimiento del Sistema",
    [NewsCategory.OTHER]: "Otro",
}

const getCategoryColor = (category: NewsCategory) => {
    switch (category) {
        case NewsCategory.WORKSHOP:
        case NewsCategory.MAINTENANCE:
            return "bg-blue-500"
        case NewsCategory.ACCIDENT:
        case NewsCategory.THEFT:
            return "bg-red-500"
        case NewsCategory.DAY_OFF:
        case NewsCategory.HOLIDAY:
            return "bg-green-500"
        case NewsCategory.SYSTEM_MAINTENANCE:
            return "bg-yellow-500"
        default:
            return "bg-gray-500"
    }
}

export function NewsTable({ news, loading, onEdit, onDelete }: NewsTableProps) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Cargando novedades...</div>
            </div>
        )
    }

    if (news.length === 0) {
        return (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No hay novedades registradas</p>
            </div>
        )
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Título</TableHead>
                        <TableHead>contrato/Usuario</TableHead>
                        <TableHead>Fechas</TableHead>
                        <TableHead>Días/Cuotas</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {news.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <Badge variant={item.type === NewsType.LOAN_SPECIFIC ? "default" : "secondary"}>
                                    {item.type === NewsType.LOAN_SPECIFIC ? (
                                        <User className="h-3 w-3 mr-1" />
                                    ) : (
                                        <Building2 className="h-3 w-3 mr-1" />
                                    )}
                                    {NEWS_TYPE_LABELS[item.type]}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Badge className={getCategoryColor(item.category)}>
                                    {NEWS_CATEGORY_LABELS[item.category]}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div>
                                    <p className="font-medium">{item.title}</p>
                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                        {item.description}
                                    </p>
                                </div>
                            </TableCell>
                            <TableCell>
                                {item.loan ? (
                                    <div className="text-sm">
                                        <p className="font-medium">{item.loan.user.name}</p>
                                        <p className="text-muted-foreground">
                                            {item.loan.vehicle?.plate || "N/A"}
                                        </p>
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground text-sm">—</span>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="text-sm">
                                    <p>
                                        {format(new Date(item.startDate), "dd/MM/yyyy", { locale: es })}
                                    </p>
                                    {item.endDate && (
                                        <p className="text-muted-foreground">
                                            {format(new Date(item.endDate), "dd/MM/yyyy", { locale: es })}
                                        </p>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="text-sm">
                                    {item.daysUnavailable !== null && (
                                        <p>{item.daysUnavailable} días</p>
                                    )}
                                    {item.installmentsToSubtract !== null && (
                                        <p className="text-muted-foreground">
                                            {item.installmentsToSubtract} cuotas
                                        </p>
                                    )}
                                    {item.daysUnavailable === null && item.installmentsToSubtract === null && (
                                        <span className="text-muted-foreground">—</span>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={item.isActive ? "default" : "secondary"}>
                                    {item.isActive ? "Activa" : "Inactiva"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(item)}
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>¿Eliminar novedad?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta acción no se puede deshacer. La novedad será eliminada
                                                permanentemente.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => onDelete(item.id)}>
                                                Eliminar
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
