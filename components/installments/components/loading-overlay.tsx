import { RefreshCw } from "lucide-react"

interface LoadingOverlayProps {
    isVisible: boolean
    message?: string
}

export function LoadingOverlay({ isVisible, message = "Generando recibo..." }: LoadingOverlayProps) {
    if (!isVisible) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-dark-blue-900 p-8 rounded-lg shadow-xl text-center text-white border border-blue-500/30">
                <div className="mb-4">
                    <RefreshCw className="animate-spin h-8 w-8 mx-auto text-blue-400" />
                </div>
                <p className="text-blue-100 text-lg font-medium">{message}</p>
            </div>
        </div>
    )
}
