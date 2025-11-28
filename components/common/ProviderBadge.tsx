import React from "react"
import { Badge } from "@/components/ui/badge"
import { Bike } from "lucide-react"
import { formatProviderName } from "@/lib/utils"
import { Provider } from "@/lib/types"

interface ProviderBadgeProps {
    provider: Provider 
}

function stringToColor(str: string) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    const color = Math.floor(
        Math.abs((Math.sin(hash) * 10000) % 1) * 16777215
    ).toString(16)
    return `#${color.padStart(6, "0")}`
}

export const ProviderBadge: React.FC<ProviderBadgeProps> = ({ provider }) => {
    const color = stringToColor(provider.name)
    const formatted = formatProviderName(provider.name)

    return (
        <Badge
            variant="outline"
            className="px-3 py-1 text-sm flex items-center justify-center gap-1"
            style={{
                backgroundColor: `${color}22`, // 13% opacidad
                color: color,
                borderColor: color,
            }}
            title={formatted}
        >
            <Bike className="h-4 w-4" />
            {formatted}
        </Badge>
    )
}
