import type React from "react"
import { Info } from "lucide-react"

interface EmptyStateProps {
    title: string
    description: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-full mb-4 shadow-sm">
                <Info className="h-12 w-12 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-md mt-2">{description}</p>
        </div>
    )
}
