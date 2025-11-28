// Phone number formatting utilities

type CountryInfo = {
    code: string
    flag: string
    format: (number: string) => string
}

// Map of country codes to formatting functions
const countryFormats: Record<string, CountryInfo> = {
    // Colombia
    "57": {
        code: "CO",
        flag: "🇨🇴",
        format: (number: string) => {
            // Format: +57 (XXX) XXX XXXX
            const area = number.substring(0, 3)
            const first = number.substring(3, 6)
            const last = number.substring(6)
            return `+57 (${area}) ${first} ${last}`
        },
    },
    // United States / Canada
    "1": {
        code: "US",
        flag: "🇺🇸",
        format: (number: string) => {
            // Format: +1 (XXX) XXX-XXXX
            const area = number.substring(0, 3)
            const first = number.substring(3, 6)
            const last = number.substring(6)
            return `+1 (${area}) ${first}-${last}`
        },
    },
    // Mexico
    "52": {
        code: "MX",
        flag: "🇲🇽",
        format: (number: string) => {
            // Format: +52 (XX) XXXX XXXX
            const area = number.substring(0, 2)
            const first = number.substring(2, 6)
            const last = number.substring(6)
            return `+52 (${area}) ${first} ${last}`
        },
    },
    // Spain
    "34": {
        code: "ES",
        flag: "🇪🇸",
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
        flag: "🇦🇷",
        format: (number: string) => {
            // Format: +54 (XX) XXXX-XXXX
            const area = number.substring(0, 2)
            const first = number.substring(2, 6)
            const last = number.substring(6)
            return `+54 (${area}) ${first}-${last}`
        },
    },
    // Brazil
    "55": {
        code: "BR",
        flag: "🇧🇷",
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
        flag: "🇨🇱",
        format: (number: string) => {
            // Format: +56 X XXXX XXXX
            const area = number.substring(0, 1)
            const first = number.substring(1, 5)
            const last = number.substring(5)
            return `+56 ${area} ${first} ${last}`
        },
    },
    // Peru
    "51": {
        code: "PE",
        flag: "🇵🇪",
        format: (number: string) => {
            // Format: +51 XXX XXX XXX
            const first = number.substring(0, 3)
            const second = number.substring(3, 6)
            const third = number.substring(6)
            return `+51 ${first} ${second} ${third}`
        },
    },
    // Default format for other countries
    default: {
        code: "INTL",
        flag: "🌍",
        format: (number: string) => {
            // Group in blocks of 3 or 4 digits
            if (number.length <= 6) {
                return `+${number.substring(0, 3)} ${number.substring(3)}`
            } else {
                // Try to format in groups of 3
                return number.match(/.{1,3}/g)?.join(" ") || number
            }
        },
    },
}

/**
 * Format a phone number with country code
 * @param phoneNumber Full phone number with country code (e.g. 573107552708)
 * @returns Formatted phone number with country flag
 */
export function formatPhoneNumber(phoneNumber: string): {
    formatted: string
    flag: string
    countryCode: string
} {
    if (!phoneNumber || phoneNumber.length < 5) {
        return {
            formatted: phoneNumber || "Desconocido",
            flag: "🌍",
            countryCode: "INTL",
        }
    }

    // Try to detect country code (1-3 digits)
    let countryCode = ""
    let nationalNumber = ""

    // Check for common country codes
    const commonCodes = ["1", "52", "54", "55", "56", "57", "34", "51"]

    for (const code of commonCodes) {
        if (phoneNumber.startsWith(code)) {
            countryCode = code
            nationalNumber = phoneNumber.substring(code.length)
            break
        }
    }

    // If no common code found, try to guess
    if (!countryCode) {
        // Assume first 1-3 digits are country code
        if (phoneNumber.length > 10) {
            countryCode = phoneNumber.substring(0, 2)
            nationalNumber = phoneNumber.substring(2)
        } else {
            // Default to international format
            countryCode = "default"
            nationalNumber = phoneNumber
        }
    }

    const country = countryFormats[countryCode] || countryFormats.default

    return {
        formatted: country.format(nationalNumber),
        flag: country.flag,
        countryCode: country.code,
    }
}

/**
 * Get platform information with appropriate icon class
 * @param platform Platform name from WhatsApp
 * @returns Formatted platform info with icon class
 */
export function getPlatformInfo(platform: string | undefined): {
    name: string
    icon: string
} {
    if (!platform) {
        return { name: "Desconocido", icon: "smartphone" }
    }

    const platformLower = platform.toLowerCase()

    if (platformLower.includes("iphone") || platformLower.includes("ios")) {
        return { name: "iPhone", icon: "apple" }
    } else if (platformLower.includes("android")) {
        return { name: "Android", icon: "smartphone-android" }
    } else if (platformLower.includes("windows")) {
        return { name: "Windows", icon: "monitor" }
    } else if (platformLower.includes("mac") || platformLower.includes("osx")) {
        return { name: "Mac", icon: "laptop" }
    } else if (platformLower.includes("web")) {
        return { name: "Web", icon: "globe" }
    } else {
        return { name: platform, icon: "smartphone" }
    }
}
