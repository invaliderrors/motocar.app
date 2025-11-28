export const formatSpanishDate = (dateString: string) => {
    if (!dateString) return "—"

    const date = new Date(dateString)
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

    const day = date.getDate()
    const month = months[date.getMonth()]
    const year = date.getFullYear()

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
