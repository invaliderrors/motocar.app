"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatCurrency } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Archive, RotateCcw, Calendar } from "lucide-react"
import Link from "next/link"
import { useDashboardContext } from "./dashboard-provider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function ArchivedLoans() {
  const { data, loading } = useDashboardContext()
  const archivedLoans = data?.archivedLoans || []

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Activo"
      case "COMPLETED":
        return "Completado"
      case "DEFAULTED":
        return "Incumplido"
      default:
        return status
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "COMPLETED":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "DEFAULTED":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return ""
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center p-3 border rounded-lg">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="ml-3 space-y-2 flex-1">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>
    )
  }

  if (!archivedLoans || archivedLoans.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="rounded-full bg-muted p-4 mb-3">
          <Archive className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">No hay contratos archivados</p>
        <p className="text-xs text-muted-foreground mt-1">
          Los contratos archivados aparecerán aquí
        </p>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-3">
        {archivedLoans.map((loan) => (
          <div
            key={loan.id}
            className="flex items-start p-3 border rounded-lg hover:bg-muted/50 transition-colors relative"
          >
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className="text-xs bg-muted/50">
                <Archive className="h-3 w-3 mr-1" />
                Archivado
              </Badge>
            </div>

            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`/abstract-geometric-shapes.png?height=40&width=40&query=${loan.userName}`}
                alt={loan.userName}
              />
              <AvatarFallback className="text-xs">{getInitials(loan.userName)}</AvatarFallback>
            </Avatar>

            <div className="ml-3 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{loan.userName}</p>
                  <p className="text-xs text-muted-foreground truncate">{loan.vehicleModel}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={getStatusClass(loan.status)}>
                      {getStatusText(loan.status)}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center">
                      {loan.paidInstallments}/{loan.totalInstallments} cuotas
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">{formatCurrency(loan.amount)}</p>
                  {loan.archivedAt && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(loan.archivedAt), "dd MMM yyyy", { locale: es })}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                    <Link href={`/contratos/${loan.id}`}>
                      <Eye className="h-3.5 w-3.5" />
                      <span className="sr-only">Ver detalles</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="Restaurar arrendamiento"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span className="sr-only">Restaurar</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
