import { utcToZonedTime } from "date-fns-tz"

const COLOMBIA_TZ = "America/Bogota"

export const formatSpanishDate = (dateString: string) => {
    if (!dateString) return "—"

    // Convert to Colombian time before formatting
    const utcDate = new Date(dateString)
    const colombianDate = utcToZonedTime(utcDate, COLOMBIA_TZ)
    
    const months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ]

    const day = colombianDate.getDate()
    const month = months[colombianDate.getMonth()]
    const year = colombianDate.getFullYear()

    return `${day} de ${month} de ${year}`
}

export const getPaymentMethodIcon = (method: string) => {
    switch (method) {
        case "CASH":
            return "Banknote"
        case "CARD":
            return "CreditCard"
        case "TRANSACTION":
            return "FileText"
        default:
            return null
    }
}

export const getPaymentMethodLabel = (method: string) => {
    switch (method) {
        case "CASH":
            return "Efectivo"
        case "CARD":
            return "Tarjeta"
        case "TRANSACTION":
            return "Transferencia"
        default:
            return "Desconocido"
    }
}
