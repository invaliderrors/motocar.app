"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Navigation, Wrench, Gavel, Loader2 } from "lucide-react"
import { VehicleStatus } from "@/lib/types"
import { HttpService } from "@/lib/http"

interface UpdateVehicleStatusDialogProps {
  vehicleId: string
  currentStatus: VehicleStatus
  vehicleInfo: string
  children: React.ReactNode
  onStatusUpdated?: () => void
}

const VEHICLE_STATUS_OPTIONS = [
  {
    value: VehicleStatus.IN_CIRCULATION,
    label: "En circulación",
    icon: Navigation,
    color: "text-green-600",
  },
  {
    value: VehicleStatus.IN_WORKSHOP,
    label: "En taller",
    icon: Wrench,
    color: "text-orange-600",
  },
  {
    value: VehicleStatus.SEIZED_BY_PROSECUTOR,
    label: "Incautado por Fiscalía",
    icon: Gavel,
    color: "text-red-600",
  },
]

export function UpdateVehicleStatusDialog({
  vehicleId,
  currentStatus,
  vehicleInfo,
  children,
  onStatusUpdated,
}: UpdateVehicleStatusDialogProps) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<VehicleStatus>(currentStatus)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (status === currentStatus) {
      toast({
        title: "Sin cambios",
        description: "El estado seleccionado es el mismo que el actual.",
        variant: "default",
      })
      return
    }

    try {
      setLoading(true)
      await HttpService.put(`/api/v1/vehicles/${vehicleId}`, { status })

      toast({
        title: "Estado actualizado",
        description: `El estado del vehículo ha sido actualizado exitosamente.`,
      })

      setOpen(false)
      if (onStatusUpdated) {
        onStatusUpdated()
      }
    } catch (error: any) {
      console.error("Error updating vehicle status:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "No se pudo actualizar el estado del vehículo.",
      })
    } finally {
      setLoading(false)
    }
  }

  const selectedOption = VEHICLE_STATUS_OPTIONS.find((opt) => opt.value === status)
  const SelectedIcon = selectedOption?.icon || Navigation

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Actualizar Estado del Vehículo</DialogTitle>
          <DialogDescription>
            Actualiza el estado actual del vehículo: <strong>{vehicleInfo}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status">Estado del Vehículo</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as VehicleStatus)}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue>
                  {selectedOption && (
                    <div className="flex items-center gap-2">
                      <SelectedIcon className={`h-4 w-4 ${selectedOption.color}`} />
                      <span>{selectedOption.label}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {VEHICLE_STATUS_OPTIONS.map((option) => {
                  const Icon = option.icon
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${option.color}`} />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Current status indicator */}
          <div className="rounded-lg bg-muted p-3">
            <p className="text-sm text-muted-foreground mb-1">Estado actual:</p>
            <div className="flex items-center gap-2">
              {VEHICLE_STATUS_OPTIONS.map((option) => {
                if (option.value === currentStatus) {
                  const Icon = option.icon
                  return (
                    <div key={option.value} className="flex items-center gap-2">
                      <Icon className={`h-4 w-4 ${option.color}`} />
                      <span className="font-medium">{option.label}</span>
                    </div>
                  )
                }
                return null
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading || status === currentStatus}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Actualizando...
              </>
            ) : (
              "Actualizar Estado"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
