import { cn } from "@/lib/utils"
import { Globe } from "lucide-react"
import type { CountryData } from "@/lib/countries"

interface CountryFlagProps {
    country: CountryData
    size?: "sm" | "md" | "lg"
    showName?: boolean
    className?: string
}

export function CountryFlag({ country, size = "md", showName = false, className }: CountryFlagProps) {
    const sizeClasses = {
        sm: "w-5 h-5",
        md: "w-6 h-6",
        lg: "w-8 h-8",
    }

    // Si es un país internacional o desconocido, mostrar un icono de globo
    if (country.code === "INTL" || country.flag === "globe") {
        return (
            <div className={cn("flex items-center", className)}>
                <div
                    className={cn(
                        "flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30",
                        sizeClasses[size],
                    )}
                >
                    <Globe className="w-3/5 h-3/5 text-blue-800 dark:text-blue-300" />
                </div>
                {showName && <span className="ml-2 text-sm font-medium">{country.name}</span>}
            </div>
        )
    }

    // URL base para las banderas SVG
    const flagUrl = `/placeholder.svg?height=48&width=48&query=flag of ${country.name}`

    return (
        <div className={cn("flex items-center", className)}>
            <div
                className={cn(
                    "overflow-hidden rounded-full border border-gray-200 dark:border-gray-700 bg-white",
                    sizeClasses[size],
                )}
            >
                <img
                    src={flagUrl || "/placeholder.svg"}
                    alt={`Bandera de ${country.name}`}
                    className="w-full h-full object-cover"
                />
            </div>
            {showName && <span className="ml-2 text-sm font-medium">{country.name}</span>}
        </div>
    )
}
