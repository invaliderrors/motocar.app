"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, Calendar } from "lucide-react"

export function CalendarLegend() {
  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border-2 border-blue-500 dark:border-blue-400" />
          <span className="text-sm text-muted-foreground">Día actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-100 dark:bg-green-950 border border-green-200 dark:border-green-800" />
          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
          <span className="text-sm text-muted-foreground">Pago a tiempo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 dark:bg-red-950 border border-red-200 dark:border-red-800" />
          <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
          <span className="text-sm text-muted-foreground">Pago tardío</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Haz clic en un día con pagos para ver detalles
          </span>
        </div>
      </div>
    </Card>
  )
}
