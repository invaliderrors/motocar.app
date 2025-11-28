import type React from "react"
import { Banknote, Receipt, CreditCard, Wallet } from "lucide-react"
import { PaymentMethods } from "@/lib/types"

interface PaymentMethodIconProps {
    method: string
}

export const PaymentMethodIcon: React.FC<PaymentMethodIconProps> = ({ method }) => {
    switch (method) {
        case PaymentMethods.CASH:
            return <Banknote className="h-4 w-4 text-emerald-500" />
        case PaymentMethods.TRANSACTION:
            return <Receipt className="h-4 w-4 text-blue-500" />
        case PaymentMethods.CARD:
            return <CreditCard className="h-4 w-4 text-purple-500" />
        default:
            return <Wallet className="h-4 w-4 text-gray-500" />
    }
}
