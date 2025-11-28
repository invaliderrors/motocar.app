import { Calendar } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { formatDate } from "@/lib/utils"

interface DateRangeSummaryProps {
  dateRange: DateRange | undefined
}

export function DateRangeSummary({ dateRange }: DateRangeSummaryProps) {
  if (!dateRange?.from || !dateRange?.to) return null

  return (
    <div className="bg-dark-blue-800/50 border border-dark-blue-700/50 rounded-lg p-3 flex items-center gap-3">
      <div className="bg-dark-blue-700/50 p-2 rounded-full">
        <Calendar className="h-5 w-5 text-blue-300" />
      </div>
      <div>
        <p className="text-sm text-blue-300/70">Período seleccionado</p>
        <p className="text-blue-100">
          {formatDate(dateRange.from, "dd MMM")} - {formatDate(dateRange.to, "dd MMM yyyy")}
        </p>
      </div>
    </div>
  )
}
