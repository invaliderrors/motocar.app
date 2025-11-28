import { Button } from "@/components/ui/button"
import { FormLabel, FormDescription } from "@/components/ui/form"
import { Copy, Check } from "lucide-react"

interface PasswordDisplayProps {
  password: string
  copied: boolean
  onCopy: () => void
  onRegenerate: () => void
  label?: string
  description?: string
  showRegenerate?: boolean
  onCancel?: () => void
}

export function PasswordDisplay({
  password,
  copied,
  onCopy,
  onRegenerate,
  label = "Contraseña generada",
  description = "Guarda esta contraseña en un lugar seguro. No podrás verla de nuevo.",
  showRegenerate = true,
  onCancel,
}: PasswordDisplayProps) {
  if (!password) return null

  return (
    <div className="space-y-2">
      <FormLabel className="text-gray-300">{label}</FormLabel>
      <div className="flex items-center space-x-2">
        <div className="flex-1 bg-gray-700/50 border border-gray-600 rounded-md px-3 py-2 text-white font-mono text-sm">
          {password}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={onCopy}
          className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      {showRegenerate && (
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Generar nueva contraseña
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Cancelar
            </Button>
          )}
        </div>
      )}
      <FormDescription className="text-amber-400/80 text-sm">
        {description}
      </FormDescription>
    </div>
  )
}
