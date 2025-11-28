import { Badge } from "@/components/ui/badge"
import { Calendar, AlertTriangle, CheckCircle2 } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { DateRange } from "react-day-picker"
import { CreditCard, FileText, Banknote } from "lucide-react"
import { getPaymentMethodIcon, getPaymentMethodLabel } from "../utils/format"

interface FilterSummaryProps {
    dateRange: DateRange | undefined
    paymentFilter: string | null
    statusFilter: boolean | null
    totalFiltered: number
    totalItems: number
}

export function FilterSummary({
    dateRange,
    paymentFilter,
    statusFilter,
    totalFiltered,
    totalItems,
}: FilterSummaryProps) {
    const getIcon = (method: string) => {
        const iconName = getPaymentMethodIcon(method)
        switch (iconName) {
            case "Banknote":
                return <Banknote className="mr-1 h-3 w-3 text-green-400" />
            case "CreditCard":
                return <CreditCard className="mr-1 h-3 w-3 text-blue-400" />
            case "FileText":
                return <FileText className="mr-1 h-3 w-3 text-purple-400" />
            default:
                return null
        }
    }

    return (
        <div className="flex justify-between items-center text-sm text-blue-300/70 pt-2">
            <div>
                {totalFiltered > 0 && (
                    <p>
                        Mostrando {totalFiltered} de {totalItems} cuotas
                    </p>
                )}
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
                {dateRange?.from && dateRange?.to && (
                    <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                        <Calendar className="mr-1 h-3 w-3 text-blue-400" />
                        {formatDate(dateRange.from, "dd/MM/yyyy")} - {formatDate(dateRange.to, "dd/MM/yyyy")}
                    </Badge>
                )}
                {paymentFilter && (
                    <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                        {getIcon(paymentFilter)}
                        {getPaymentMethodLabel(paymentFilter)}
                    </Badge>
                )}
                {statusFilter !== null && (
                    <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                        {statusFilter ? (
                            <>
                                <AlertTriangle className="mr-1 h-3 w-3 text-red-400" /> Atrasadas
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="mr-1 h-3 w-3 text-green-400" /> A tiempo
                            </>
                        )}
                    </Badge>
                )}
            </div>
        </div>
    )
}
