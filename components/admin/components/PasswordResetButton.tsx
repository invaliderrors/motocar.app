import { Button } from "@/components/ui/button"
import { FormLabel } from "@/components/ui/form"
import { KeyRound } from "lucide-react"

interface PasswordResetButtonProps {
  onReset: () => void
}

export function PasswordResetButton({ onReset }: PasswordResetButtonProps) {
  return (
    <div className="space-y-2">
      <FormLabel className="text-gray-300">Contraseña</FormLabel>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onReset}
        className="flex items-center space-x-2 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        <KeyRound className="h-4 w-4" />
        Restablecer contraseña
      </Button>
    </div>
  )
}
