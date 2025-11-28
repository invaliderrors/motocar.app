import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ErrorStateProps {
  onRetry?: () => void
}

export function DashboardErrorState({ onRetry }: ErrorStateProps) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <AlertCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error al cargar los datos</h3>
        <p className="text-muted-foreground mb-6">
          No se pudieron cargar los datos del dashboard. Por favor, intenta de nuevo.
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reintentar
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
