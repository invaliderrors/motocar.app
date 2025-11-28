import { useState, useEffect } from "react"
import { Store, StoreStatus } from "@/lib/types"
import { CreateStoreDto } from "@/lib/services/store.service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StoreFormDialogProps {
  open: boolean
  store: Store | null
  onClose: () => void
  onSubmit: (data: CreateStoreDto) => Promise<void>
}

const initialFormData: CreateStoreDto = {
  name: "",
  code: "",
  address: "",
  city: "",
  phone: "",
  nit: "",
  status: StoreStatus.ACTIVE,
}

export function StoreFormDialog({
  open,
  store,
  onClose,
  onSubmit,
}: StoreFormDialogProps) {
  const [formData, setFormData] = useState<CreateStoreDto>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (store) {
      setFormData({
        name: store.name,
        code: store.code,
        address: store.address,
        city: store.city,
        phone: store.phone || "",
        nit: store.nit || "",
        status: store.status,
      })
    } else {
      setFormData(initialFormData)
    }
  }, [store, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      // Error is handled by the parent component
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof CreateStoreDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {store ? "Editar punto" : "Crear Nuevo punto"}
          </DialogTitle>
          <DialogDescription>
            {store
              ? "Actualizar información del punto"
              : "Agregar un nuevo punto al sistema"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Código de punto</Label>
              <Input
                id="code"
                placeholder="ej., BOG-01"
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Nombre de punto</Label>
              <Input
                id="name"
                placeholder="ej., punto Bogotá 1"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nit">NIT</Label>
              <Input
                id="nit"
                placeholder="ej., 900123456-7"
                value={formData.nit}
                onChange={(e) => handleChange("nit", e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input
                  id="city"
                  placeholder="ej., Bogotá"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  placeholder="ej., +57 300 123 4567"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                placeholder="ej., Calle 123 #45-67"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  handleChange("status", value as StoreStatus)
                }
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={StoreStatus.ACTIVE}>Activa</SelectItem>
                  <SelectItem value={StoreStatus.INACTIVE}>Inactiva</SelectItem>
                  <SelectItem value={StoreStatus.SUSPENDED}>
                    Suspendida
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Guardando..."
                : store
                ? "Actualizar"
                : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
