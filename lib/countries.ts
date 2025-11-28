// Datos de países y sus códigos telefónicos

export interface CountryData {
    code: string // Código ISO del país (2 letras)
    name: string // Nombre del país en español
    dialCode: string // Código telefónico (sin el +)
    flag: string // Código de bandera para SVG
    format: (number: string) => string // Función para formatear números
}

// Mapa de códigos telefónicos a información de países
export const countries: Record<string, CountryData> = {
    // Colombia
    "57": {
        code: "CO",
        name: "Colombia",
        dialCode: "57",
        flag: "co",
        format: (number: string) => {
            // Format: +57 (XXX) XXX XXXX
            const area = number.substring(0, 3)
            const first = number.substring(3, 6)
            const last = number.substring(6)
            return `+57 (${area}) ${first} ${last}`
        },
    },
    // Estados Unidos / Canadá
    "1": {
        code: "US",
        name: "Estados Unidos",
        dialCode: "1",
        flag: "us",
        format: (number: string) => {
            // Format: +1 (XXX) XXX-XXXX
            const area = number.substring(0, 3)
            const first = number.substring(3, 6)
            const last = number.substring(6)
            return `+1 (${area}) ${first}-${last}`
        },
    },
    // México
    "52": {
        code: "MX",
        name: "México",
        dialCode: "52",
        flag: "mx",
        format: (number: string) => {
            // Format: +52 (XX) XXXX XXXX
            const area = number.substring(0, 2)
            const first = number.substring(2, 6)
            const last = number.substring(6)
            return `+52 (${area}) ${first} ${last}`
        },
    },
    // España
    "34": {
        code: "ES",
        name: "España",
        dialCode: "34",
        flag: "es",
        format: (number: string) => {
            // Format: +34 XXX XXX XXX
            const first = number.substring(0, 3)
            const second = number.substring(3, 6)
            const third = number.substring(6)
            return `+34 ${first} ${second} ${third}`
        },
    },
    // Argentina
    "54": {
        code: "AR",
        name: "Argentina",
        dialCode: "54",
        flag: "ar",
        format: (number: string) => {
            // Format: +54 (XX) XXXX-XXXX
            const area = number.substring(0, 2)
            const first = number.substring(2, 6)
            const last = number.substring(6)
            return `+54 (${area}) ${first}-${last}`
        },
    },
    // Brasil
    "55": {
        code: "BR",
        name: "Brasil",
        dialCode: "55",
        flag: "br",
        format: (number: string) => {
            // Format: +55 (XX) XXXXX-XXXX
            const area = number.substring(0, 2)
            const first = number.substring(2, 7)
            const last = number.substring(7)
            return `+55 (${area}) ${first}-${last}`
        },
    },
    // Chile
    "56": {
        code: "CL",
        name: "Chile",
        dialCode: "56",
        flag: "cl",
        format: (number: string) => {
            // Format: +56 X XXXX XXXX
            const area = number.substring(0, 1)
            const first = number.substring(1, 5)
            const last = number.substring(5)
            return `+56 ${area} ${first} ${last}`
        },
    },
    // Perú
    "51": {
        code: "PE",
        name: "Perú",
        dialCode: "51",
        flag: "pe",
        format: (number: string) => {
            // Format: +51 XXX XXX XXX
            const first = number.substring(0, 3)
            const second = number.substring(3, 6)
            const third = number.substring(6)
            return `+51 ${first} ${second} ${third}`
        },
    },
    // Venezuela
    "58": {
        code: "VE",
        name: "Venezuela",
        dialCode: "58",
        flag: "ve",
        format: (number: string) => {
            // Format: +58 XXX XXX XXXX
            const first = number.substring(0, 3)
            const second = number.substring(3, 6)
            const third = number.substring(6)
            return `+58 ${first} ${second} ${third}`
        },
    },
    // Ecuador
    "593": {
        code: "EC",
        name: "Ecuador",
        dialCode: "593",
        flag: "ec",
        format: (number: string) => {
            // Format: +593 XX XXX XXXX
            const first = number.substring(0, 2)
            const second = number.substring(2, 5)
            const third = number.substring(5)
            return `+593 ${first} ${second} ${third}`
        },
    },
    // Bolivia
    "591": {
        code: "BO",
        name: "Bolivia",
        dialCode: "591",
        flag: "bo",
        format: (number: string) => {
            // Format: +591 X XXX XXXX
            const first = number.substring(0, 1)
            const second = number.substring(1, 4)
            const third = number.substring(4)
            return `+591 ${first} ${second} ${third}`
        },
    },
    // Paraguay
    "595": {
        code: "PY",
        name: "Paraguay",
        dialCode: "595",
        flag: "py",
        format: (number: string) => {
            // Format: +595 XX XXX XXX
            const first = number.substring(0, 2)
            const second = number.substring(2, 5)
            const third = number.substring(5)
            return `+595 ${first} ${second} ${third}`
        },
    },
    // Uruguay
    "598": {
        code: "UY",
        name: "Uruguay",
        dialCode: "598",
        flag: "uy",
        format: (number: string) => {
            // Format: +598 X XXX XXXX
            const first = number.substring(0, 1)
            const second = number.substring(1, 4)
            const third = number.substring(4)
            return `+598 ${first} ${second} ${third}`
        },
    },
    // Costa Rica
    "506": {
        code: "CR",
        name: "Costa Rica",
        dialCode: "506",
        flag: "cr",
        format: (number: string) => {
            // Format: +506 XXXX XXXX
            const first = number.substring(0, 4)
            const second = number.substring(4)
            return `+506 ${first} ${second}`
        },
    },
    // Panamá
    "507": {
        code: "PA",
        name: "Panamá",
        dialCode: "507",
        flag: "pa",
        format: (number: string) => {
            // Format: +507 XXX XXXX
            const first = number.substring(0, 3)
            const second = number.substring(3)
            return `+507 ${first} ${second}`
        },
    },
    // El Salvador
    "503": {
        code: "SV",
        name: "El Salvador",
        dialCode: "503",
        flag: "sv",
        format: (number: string) => {
            // Format: +503 XXXX XXXX
            const first = number.substring(0, 4)
            const second = number.substring(4)
            return `+503 ${first} ${second}`
        },
    },
    // Guatemala
    "502": {
        code: "GT",
        name: "Guatemala",
        dialCode: "502",
        flag: "gt",
        format: (number: string) => {
            // Format: +502 XXXX XXXX
            const first = number.substring(0, 4)
            const second = number.substring(4)
            return `+502 ${first} ${second}`
        },
    },
    // Honduras
    "504": {
        code: "HN",
        name: "Honduras",
        dialCode: "504",
        flag: "hn",
        format: (number: string) => {
            // Format: +504 XXXX XXXX
            const first = number.substring(0, 4)
            const second = number.substring(4)
            return `+504 ${first} ${second}`
        },
    },
    // Nicaragua
    "505": {
        code: "NI",
        name: "Nicaragua",
        dialCode: "505",
        flag: "ni",
        format: (number: string) => {
            // Format: +505 XXXX XXXX
            const first = number.substring(0, 4)
            const second = number.substring(4)
            return `+505 ${first} ${second}`
        },
    },
    // República Dominicana
    "1809": {
        code: "DO",
        name: "República Dominicana",
        dialCode: "1809",
        flag: "do",
        format: (number: string) => {
            // Format: +1 809 XXX XXXX
            const first = number.substring(0, 3)
            const second = number.substring(3)
            return `+1 809 ${first} ${second}`
        },
    },
    // Puerto Rico
    "1787": {
        code: "PR",
        name: "Puerto Rico",
        dialCode: "1787",
        flag: "pr",
        format: (number: string) => {
            // Format: +1 787 XXX XXXX
            const first = number.substring(0, 3)
            const second = number.substring(3)
            return `+1 787 ${first} ${second}`
        },
    },
    // Cuba
    "53": {
        code: "CU",
        name: "Cuba",
        dialCode: "53",
        flag: "cu",
        format: (number: string) => {
            // Format: +53 X XXXX XXXX
            const first = number.substring(0, 1)
            const second = number.substring(1, 5)
            const third = number.substring(5)
            return `+53 ${first} ${second} ${third}`
        },
    },
}

// Lista de códigos de países ordenados por longitud (para detectar correctamente)
export const countryCodes = Object.keys(countries).sort((a, b) => b.length - a.length)

/**
 * Detecta el país basado en el número de teléfono
 * @param phoneNumber Número de teléfono completo con código de país
 * @returns Información del país o un país por defecto
 */
export function detectCountry(phoneNumber: string): CountryData {
    if (!phoneNumber || phoneNumber.length < 5) {
        return {
            code: "INTL",
            name: "Internacional",
            dialCode: "",
            flag: "globe",
            format: (number: string) => number,
        }
    }

    // Buscar el código de país en el número
    for (const code of countryCodes) {
        if (phoneNumber.startsWith(code)) {
            return countries[code]
        }
    }

    // País por defecto si no se encuentra
    return {
        code: "INTL",
        name: "Internacional",
        dialCode: "",
        flag: "globe",
        format: (number: string) => {
            // Agrupar en bloques de 3 o 4 dígitos
            if (number.length <= 6) {
                return `+${number.substring(0, 3)} ${number.substring(3)}`
            } else {
                // Intentar formatear en grupos de 3
                return number.match(/.{1,3}/g)?.join(" ") || number
            }
        },
    }
}

/**
 * Formatea un número de teléfono con el formato del país
 * @param phoneNumber Número completo con código de país
 * @returns Número formateado e información del país
 */
export function formatPhoneNumber(phoneNumber: string): {
    formatted: string
    country: CountryData
} {
    if (!phoneNumber || phoneNumber.length < 5) {
        return {
            formatted: phoneNumber || "Desconocido",
            country: {
                code: "INTL",
                name: "Internacional",
                dialCode: "",
                flag: "globe",
                format: (number: string) => number,
            },
        }
    }

    const country = detectCountry(phoneNumber)
    const nationalNumber = phoneNumber.substring(country.dialCode.length)

    return {
        formatted: country.format(nationalNumber),
        country,
    }
}
