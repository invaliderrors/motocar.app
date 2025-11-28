import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import type { Employee } from "../../hooks/useEmployees"

interface DeleteEmployeeDialogProps {
  employee: Employee
  onClose: () => void
  onConfirm: () => void
}

export function DeleteEmployeeDialog({
  employee,
  onClose,
  onConfirm,
}: DeleteEmployeeDialogProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle>Confirmar eliminación</DialogTitle>
          </div>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar al empleado{" "}
            <span className="font-semibold">{employee.name}</span>?
            <br />
            <br />
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Eliminar empleado
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
