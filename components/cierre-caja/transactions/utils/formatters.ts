import { Providers, PaymentMethod } from "@/lib/types"
import { CATEGORY_DETAILS, PAYMENT_METHOD_LABELS, PROVIDER_DETAILS } from "../constants"

/**
 * Formats a provider name for display
 */
export const formatProviderName = (provider: string | undefined): string => {
    if (!provider) return "Desconocido"

    const providerKey = provider as Providers
    return (PROVIDER_DETAILS as Record<string, { label: string }>)[providerKey]?.label || provider
}

/**
 * Maps a payment method enum value to a display label
 */
export const mapPaymentMethodToLabel = (method: PaymentMethod | string): string => {
    return PAYMENT_METHOD_LABELS[method as keyof typeof PAYMENT_METHOD_LABELS] || PAYMENT_METHOD_LABELS.DEFAULT
}

/**
 * Maps a payment method label back to enum value
 */
export const mapPaymentLabelToMethod = (label: string): PaymentMethod => {
    if (label === "Efectivo") return PaymentMethod.CASH
    if (label === "Tarjeta") return PaymentMethod.CARD
    if (label === "Transferencia") return PaymentMethod.TRANSACTION
    return PaymentMethod.CASH // Default
}

/**
 * Gets the category label from a category key
 */
export const getCategoryLabel = (category: string): string => {
    return CATEGORY_DETAILS[category as keyof typeof CATEGORY_DETAILS]?.label || category
}

/**
 * Gets the category color class from a category key
 */
export const getCategoryColorClass = (category: string): string => {
    return (
        CATEGORY_DETAILS[category as keyof typeof CATEGORY_DETAILS]?.color ||
        "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
    )
}

/**
 * Formats a date to a time string (HH:MM)
 */
export const formatTimeFromDate = (date: Date | string): string => {
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    })
}

/**
 * Truncates a string with ellipsis
 */
export const truncateString = (str: string, maxLength: number): string => {
    if (str.length <= maxLength) return str
    return `${str.substring(0, maxLength)}...`
}
