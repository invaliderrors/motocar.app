import { PaymentMethod } from "@/lib/types"
import { CreditCard, Banknote, ArrowRightLeft, HelpCircle } from "lucide-react"

export const DEFAULT_ITEMS_PER_PAGE = 10

export const TRANSACTION_TYPES = {
    INCOME: "income",
    EXPENSE: "expense",
} as const

export const SORT_DIRECTIONS = {
    ASC: "asc",
    DESC: "desc",
} as const

export const PAYMENT_METHOD_ICONS = {
    [PaymentMethod.CASH]: {
        icon: Banknote,
        color: "text-green-600",
        label: "Efectivo",
    },
    [PaymentMethod.CARD]: {
        icon: CreditCard,
        color: "text-blue-600",
        label: "Tarjeta",
    },
    [PaymentMethod.TRANSACTION]: {
        icon: ArrowRightLeft,
        color: "text-purple-600",
        label: "Transferencia",
    },
    DEFAULT: {
        icon: HelpCircle,
        color: "text-gray-600",
        label: "Desconocido",
    },
} as const

export const TRANSACTION_TYPE_STYLES = {
    income: {
        textColor: "text-green-600 dark:text-green-400",
        iconColor: "text-green-600 dark:text-green-400",
        iconBg: "bg-green-100 dark:bg-green-900/30",
    },
    expense: {
        textColor: "text-red-600 dark:text-red-400",
        iconColor: "text-red-600 dark:text-red-400",
        iconBg: "bg-red-100 dark:bg-red-900/30",
    },
} as const

export const CATEGORY_DETAILS = {
    // Add your category details here
    default: {
        label: "General",
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
        icon: HelpCircle,
    },
} as const

export const PROVIDER_DETAILS = {
    // Add your provider details here
    default: {
        label: "General",
        color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
        icon: HelpCircle,
    },
} as const

export const API_ENDPOINTS = {
    AVAILABLE_PAYMENTS: "/api/v1/closing/available-payments",
}

export const FILTER_OPTIONS = {
    TYPE: [
        { value: "all", label: "Todos los movimientos" },
        { value: "income", label: "Solo ingresos" },
        { value: "expense", label: "Solo egresos" },
    ],
}


// Payment method mapping
export const PAYMENT_METHOD_LABELS = {
    CASH: "Efectivo",
    CARD: "Tarjeta",
    TRANSACTION: "Transferencia",
    DEFAULT: "Otro",
}
