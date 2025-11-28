import { Smartphone, Apple, Laptop, Monitor, Globe, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlatformIconProps {
    platform: string
    className?: string
    size?: number
}

// Map of platform identifiers to Lucide icons
const platformIcons: Record<string, LucideIcon> = {
    apple: Apple,
    smartphone: Smartphone,
    "smartphone-android": Smartphone, // Using Smartphone for Android too
    laptop: Laptop,
    monitor: Monitor,
    globe: Globe,
}

export function PlatformIcon({ platform, className, size = 18 }: PlatformIconProps) {
    // Get the icon component or default to Smartphone
    const IconComponent = platformIcons[platform] || Smartphone

    return (
        <div
            className={cn(
                "inline-flex items-center justify-center rounded-full p-1.5",
                platform === "apple"
                    ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                    : platform === "smartphone-android"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
                className,
            )}
        >
            <IconComponent size={size} />
        </div>
    )
}
