import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Owner } from "@/lib/types"

interface DeleteUserDialogProps {
  open: boolean
  user: Owner | null
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteUserDialog({
  open,
  user,
  onOpenChange,
  onConfirm,
}: DeleteUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-effect border-dark-blue-700 text-white">
        <DialogHeader>
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogDescription className="text-blue-200/70">
            ¿Estás seguro de que deseas eliminar al usuario {user?.name}? Esta
            acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-dark-blue-700 bg-dark-blue-800/30 text-blue-200 hover:bg-dark-blue-700/50 hover:text-white"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="bg-red-500/80 hover:bg-red-500 text-white"
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
