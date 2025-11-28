"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { EmployeeService } from "@/lib/services/employee.service"
import { useToast } from "@/components/ui/use-toast"
import { useStoreManagement } from "@/components/admin/stores/hooks/useStoreManagement"
import { Store, UserPlus, User, Shield } from "lucide-react"
import { PermissionsEditor } from "./components/PermissionsEditor"
import { PermissionsMap } from "@/lib/types/permissions"
import type { Employee } from "./hooks/useEmployees"

interface EmployeeFormDialogProps {
  employee: Employee | null
  onClose: (success: boolean) => void
}

interface EmployeeFormData {
  username: string
  name: string
  phone: string
  email: string
  password: string
  storeId: string
  status: "ACTIVE" | "INACTIVE"
  permissions: PermissionsMap
}

export function EmployeeFormDialog({ employee, onClose }: EmployeeFormDialogProps) {
  const { toast } = useToast()
  const { stores, isLoading: loadingStores } = useStoreManagement()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [formData, setFormData] = useState<EmployeeFormData>({
    username: "",
    name: "",
    phone: "",
    email: "",
    password: "",
    storeId: "",
    status: "ACTIVE",
    permissions: {},
  })

  useEffect(() => {
    if (employee) {
      setFormData({
        username: employee.username,
        name: employee.name,
        phone: employee.phone || "",
        email: employee.email || "",
        password: "", // Don't pre-fill password on edit
        storeId: employee.storeId || "",
        status: employee.status,
        permissions: employee.permissions || {},
      })
    }
  }, [employee])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.username.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El nombre de usuario es requerido",
      })
      return
    }

    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El nombre es requerido",
      })
      return
    }

    if (!formData.phone.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El teléfono es requerido",
      })
      return
    }

    if (!employee && !formData.password.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "La contraseña es requerida para nuevos empleados",
      })
      return
    }

    if (!formData.storeId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes seleccionar un punto",
      })
      return
    }

    try {
      setLoading(true)

      if (employee) {
        // Update existing employee
        const updateData: any = {
          username: formData.username,
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          storeId: formData.storeId,
          status: formData.status,
          role: "EMPLOYEE",
          permissions: formData.permissions,
        }

        // Only include password if it's being changed
        if (formData.password) {
          updateData.password = formData.password
        }

        await EmployeeService.updateEmployee(employee.id, updateData)
        toast({
          title: "Empleado actualizado",
          description: "Los cambios se guardaron correctamente",
        })
      } else {
        // Create new employee
        const createData = {
          username: formData.username,
          name: formData.name,
          phone: formData.phone,
          email: formData.email || undefined,
          password: formData.password,
          storeId: formData.storeId,
          status: formData.status,
          role: "EMPLOYEE" as const,
          permissions: formData.permissions,
        }

        await EmployeeService.createEmployee(createData)
        toast({
          title: "Empleado creado",
          description: "El nuevo empleado fue creado exitosamente",
        })
      }

      onClose(true)
    } catch (error: any) {
      console.error("Error saving employee:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.response?.data?.message ||
          `Error al ${employee ? "actualizar" : "crear"} el empleado. Inténtalo de nuevo.`,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open onOpenChange={() => onClose(false)}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            <DialogTitle>
              {employee ? "Editar empleado" : "Nuevo empleado"}
            </DialogTitle>
          </div>
          <DialogDescription>
            {employee
              ? "Actualiza la información del empleado y sus permisos"
              : "Completa los datos para crear un nuevo empleado y asignar permisos"}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Información Básica
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Permisos
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[60vh] pr-4">
            <form onSubmit={handleSubmit} id="employee-form">
              <TabsContent value="basic" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="username">
              Nombre de usuario <span className="text-destructive">*</span>
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="usuario123"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              Nombre completo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Juan Pérez"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              Teléfono <span className="text-destructive">*</span>
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+1234567890"
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="empleado@ejemplo.com"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              Contraseña {!employee && <span className="text-destructive">*</span>}
              {employee && <span className="text-muted-foreground text-xs"> (dejar en blanco para no cambiar)</span>}
            </Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="••••••••"
              disabled={loading}
              required={!employee}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="store">
              Punto <span className="text-destructive">*</span>
            </Label>
            <Select
              value={formData.storeId}
              onValueChange={(value) =>
                setFormData({ ...formData, storeId: value })
              }
              disabled={loading || loadingStores}
            >
              <SelectTrigger id="store">
                <SelectValue placeholder="Selecciona un punto" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
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

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "ACTIVE" | "INACTIVE") =>
                setFormData({ ...formData, status: value })
              }
              disabled={loading}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Activo</SelectItem>
                <SelectItem value="INACTIVE">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
              </TabsContent>

              <TabsContent value="permissions" className="mt-4">
                <PermissionsEditor
                  permissions={formData.permissions}
                  onChange={(permissions) =>
                    setFormData({ ...formData, permissions })
                  }
                  disabled={loading}
                />
              </TabsContent>
            </form>
          </ScrollArea>
        </Tabs>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onClose(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" form="employee-form" disabled={loading}>
              {loading
                ? "Guardando..."
                : employee
                ? "Actualizar empleado"
                : "Crear empleado"}
            </Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
