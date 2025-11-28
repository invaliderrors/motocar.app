import { ProviderBadge } from "@/components/common/ProviderBadge"
import { AlertCircle } from "lucide-react"
import type React from "react"
import { Provider } from "@/lib/types";

interface ProviderDisplayProps {
    provider?: Provider
}

export const ProviderDisplay: React.FC<ProviderDisplayProps> = ({ provider }) => {
    if (!provider) {
        return (
            <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-md">
                <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5" />
                    No hay proveedor seleccionado. Seleccione transacciones para continuar.
                </p>
            </div>
        )
    }

    return (
        <div className="mt-2">
            <p className="text-xs text-muted-foreground mb-1">Proveedor seleccionado:</p>
            <ProviderBadge provider={provider} />
        </div>
    )
}