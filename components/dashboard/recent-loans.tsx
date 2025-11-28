"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatCurrency } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CreditCard, Eye } from "lucide-react"
import Link from "next/link"
import { useDashboardContext } from "./dashboard-provider"
import { ScrollArea } from "@/components/ui/scroll-area"

export function RecentLoans() {
  const { data, loading } = useDashboardContext()
  const loans = data?.recentLoans || []

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
        return "bg-primary"
      case "COMPLETED":
        return "bg-green-500"
      case "DEFAULTED":
        return "bg-destructive"
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
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center p-3 border rounded-lg">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="ml-4 space-y-2 flex-1">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-[80px]" />
            </div>
            <div className="ml-auto text-right space-y-2">
              <Skeleton className="h-4 w-[80px] ml-auto" />
              <Skeleton className="h-4 w-[60px] ml-auto" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
  <ScrollArea className="h-[400px] pr-4">
    <div className="space-y-4">
      {loans.map((loan) => (
        <div key={loan.id} className="flex items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={`/abstract-geometric-shapes.png?height=40&width=40&query=${loan.userName}`}
              alt={loan.userName}
            />
            <AvatarFallback>{getInitials(loan.userName)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 flex-1">
            <p className="font-medium">{loan.userName}</p>
            <p className="text-sm text-muted-foreground">{loan.vehicleModel}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="font-medium">{formatCurrency(loan.amount)}</p>
            <Badge className={getStatusClass(loan.status)}>{getStatusText(loan.status)}</Badge>
          </div>
          <div className="ml-4 flex space-x-2">
            <Button variant="outline" size="icon" asChild>
              <Link href={`/prestamos/${loan.id}`}>
                <Eye className="h-4 w-4" />
                <span className="sr-only">Ver detalles</span>
              </Link>
            </Button>
            <Button variant="outline" size="icon" asChild>
              <Link href={`/cuotas/nueva?loanId=${loan.id}`}>
                <CreditCard className="h-4 w-4" />
                <span className="sr-only">Registrar pago</span>
              </Link>
            </Button>
          </div>
        </div>
      ))}
      <div className="flex justify-center pt-2">
        <Button variant="outline" asChild>
          <Link href="/prestamos">Ver todos los arrendamientos</Link>
        </Button>
      </div>
    </div>
  </ScrollArea>
  )
}
