"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RefreshCw, Store } from "lucide-react"
import { useStoreManagement } from "@/components/admin/stores/hooks/useStoreManagement"
import type { Employee } from "../../hooks/useEmployees"

interface ReassignStoreDialogProps {
  employee: Employee
  onClose: () => void
  onConfirm: (newStoreId: string) => void
}

export function ReassignStoreDialog({
  employee,
  onClose,
  onConfirm,
}: ReassignStoreDialogProps) {
  const { stores, isLoading } = useStoreManagement()
  const [selectedStoreId, setSelectedStoreId] = useState<string>("")

  const handleConfirm = () => {
    if (selectedStoreId) {
      onConfirm(selectedStoreId)
    }
  }

  const availableStores = stores.filter(store => store.id !== employee.storeId)

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            <DialogTitle>Reasignar empleado a punto</DialogTitle>
          </div>
          <DialogDescription>
            Selecciona el nuevo punto para el empleado{" "}
            <span className="font-semibold">{employee.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Punto actual</Label>
            <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
              <Store className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {employee.store?.name || "Sin asignar"}
              </span>
              {employee.store?.code && (
                <span className="text-sm text-muted-foreground">
                  ({employee.store.code})
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="store">Nuevo punto</Label>
            <Select
              value={selectedStoreId}
              onValueChange={setSelectedStoreId}
              disabled={isLoading}
            >
              <SelectTrigger id="store">
                <SelectValue placeholder="Selecciona un punto" />
              </SelectTrigger>
              <SelectContent>
                {availableStores.map((store) => (
                  <SelectItem key={store.id} value={store.id}>
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4" />
                      <span>{store.name}</span>
                      <span className="text-muted-foreground">
                        ({store.code})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedStoreId}>
            Reasignar empleado
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
