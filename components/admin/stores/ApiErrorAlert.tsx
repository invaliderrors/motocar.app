import { Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ApiErrorAlertProps {
  error: string
  onRetry: () => void
}

export function ApiErrorAlert({ error, onRetry }: ApiErrorAlertProps) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800 p-4 mb-6">
      <div className="flex items-start gap-3">
        <Building2 className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-amber-900 dark:text-amber-100">
            API del Backend No Disponible
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
            {error}
          </p>
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
            Puedes seguir usando esta interfaz - una vez que los endpoints del
            backend estén desplegados, podrás crear y gestionar puntos aquí.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-3"
          >
            Intentar Nuevamente
          </Button>
        </div>
      </div>
    </div>
  )
}
