import type React from "react"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Wallet } from "lucide-react"

export const CashRegisterHeader: React.FC = () => {
    return (
        <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Detalle del Cierre de Caja
            </DialogTitle>
            <DialogDescription>Información detallada sobre las transacciones incluidas en este cierre</DialogDescription>
        </DialogHeader>
    )
}
