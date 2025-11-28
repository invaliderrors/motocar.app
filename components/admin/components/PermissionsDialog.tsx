"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { HttpService } from "@/lib/http"
import {
  Resource,
  Action,
  PermissionsMap,
  RESOURCE_LABELS,
  ACTION_LABELS,
  ACTION_DESCRIPTIONS,
} from "@/lib/types/permissions"
import { Shield, Check, X, AlertCircle, Crown, Users, User } from "lucide-react"

interface PermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId: string
  userName: string
  currentRole: string
  onPermissionsUpdated: () => void
}

export function PermissionsDialog({
  open,
  onOpenChange,
  userId,
  userName,
  currentRole,
  onPermissionsUpdated,
}: PermissionsDialogProps) {
  const [permissions, setPermissions] = useState<PermissionsMap>({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (open && userId) {
      fetchPermissions()
    }
  }, [open, userId])

  const fetchPermissions = async () => {
    try {
      setLoading(true)
      const response = await HttpService.get(`/api/v1/permissions/owner/${userId}`)
      
      setPermissions(response.data.permissions || {})
      setIsAdmin(response.data.isAdmin || false)
    } catch (error) {
      console.error("Error fetching permissions:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudieron cargar los permisos del usuario",
      })
    } finally {
      setLoading(false)
    }
  }

  const hasPermission = (resource: Resource, action: Action): boolean => {
    return permissions[resource]?.includes(action) || false
  }

  const togglePermission = (resource: Resource, action: Action) => {
    if (isAdmin) {
      toast({
        title: "Usuario Administrador",
        description: "Los administradores tienen todos los permisos automáticamente",
      })
      return
    }

    setPermissions((prev) => {
      const current = prev[resource] || []
      const updated = current.includes(action)
        ? current.filter((a) => a !== action)
        : [...current, action]

      return {
        ...prev,
        [resource]: updated.length > 0 ? updated : undefined,
      }
    })
  }

  const toggleAllActionsForResource = (resource: Resource, enable: boolean) => {
    if (isAdmin) return

    if (enable) {
      setPermissions((prev) => ({
        ...prev,
        [resource]: Object.values(Action),
      }))
    } else {
      setPermissions((prev) => {
        const { [resource]: _, ...rest } = prev
        return rest
      })
    }
  }

  const applyRoleTemplate = async (role: 'ADMIN' | 'MODERATOR' | 'USER') => {
    try {
      setSaving(true)
      await HttpService.post(`/api/v1/permissions/owner/${userId}/apply-role`, { role })

      toast({
        title: "Plantilla aplicada",
        description: `Se han aplicado los permisos de ${role} correctamente`,
      })

      fetchPermissions()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "No se pudo aplicar la plantilla de permisos",
      })
    } finally {
      setSaving(false)
    }
  }

  const savePermissions = async () => {
    try {
      setSaving(true)
      
      // Clean up permissions object - remove undefined values and empty arrays
      const cleanedPermissions: PermissionsMap = {}
      Object.entries(permissions).forEach(([resource, actions]) => {
        if (actions && actions.length > 0) {
          cleanedPermissions[resource as Resource] = actions
        }
      })

      await HttpService.post(`/api/v1/permissions/owner/${userId}/set`, {
        permissions: cleanedPermissions,
        updatedBy: user?.id || "system",
      })

      toast({
        title: "Permisos actualizados",
        description: "Los permisos se han actualizado correctamente",
      })

      onPermissionsUpdated()
      onOpenChange(false)
    } catch (error: any) {
      console.error("Error saving permissions:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "No se pudieron guardar los permisos",
      })
    } finally {
      setSaving(false)
    }
  }

  const groupedResources = {
    operations: [Resource.CLOSING, Resource.INSTALLMENT, Resource.LOAN, Resource.EXPENSE],
    management: [Resource.VEHICLE, Resource.USER, Resource.OWNER, Resource.PROVIDER],
    reports: [Resource.CASH_FLOW, Resource.REPORT, Resource.DASHBOARD],
    documents: [Resource.CONTRACT, Resource.RECEIPT],
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] glass-effect border-dark-blue-700">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2 text-white">
            <Shield className="h-6 w-6 text-blue-400" />
            Gestionar Permisos
          </DialogTitle>
          <DialogDescription className="text-blue-200/70">
            Configura los permisos de acceso para <span className="font-semibold text-blue-300">{userName}</span>
          </DialogDescription>
        </DialogHeader>

        {isAdmin && (
          <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <Crown className="h-5 w-5 text-amber-400" />
            <p className="text-sm text-amber-200">
              Este usuario tiene el rol de <strong>Administrador</strong> y tiene acceso completo a todas las funciones del sistema.
            </p>
          </div>
        )}

        <div className="flex gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyRoleTemplate('ADMIN')}
            disabled={saving || isAdmin}
            className="border-dark-blue-700 bg-red-500/10 text-red-300 hover:bg-red-500/20"
          >
            <Crown className="h-4 w-4 mr-2" />
            Admin
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyRoleTemplate('MODERATOR')}
            disabled={saving || isAdmin}
            className="border-dark-blue-700 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
          >
            <Users className="h-4 w-4 mr-2" />
            Moderador
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => applyRoleTemplate('USER')}
            disabled={saving || isAdmin}
            className="border-dark-blue-700 bg-green-500/10 text-green-300 hover:bg-green-500/20"
          >
            <User className="h-4 w-4 mr-2" />
            Usuario
          </Button>
        </div>

        <Tabs defaultValue="operations" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-dark-blue-800/50">
            <TabsTrigger value="operations" className="data-[state=active]:bg-dark-blue-700">
              Operaciones
            </TabsTrigger>
            <TabsTrigger value="management" className="data-[state=active]:bg-dark-blue-700">
              Gestión
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-dark-blue-700">
              Reportes
            </TabsTrigger>
            <TabsTrigger value="documents" className="data-[state=active]:bg-dark-blue-700">
              Documentos
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] mt-4">
            {Object.entries(groupedResources).map(([groupKey, resources]) => (
              <TabsContent key={groupKey} value={groupKey} className="space-y-4">
                {resources.map((resource) => (
                  <div
                    key={resource}
                    className="p-4 bg-dark-blue-800/30 border border-dark-blue-700/50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-white">{RESOURCE_LABELS[resource]}</h4>
                        <Badge variant="outline" className="text-xs border-dark-blue-600 text-blue-300">
                          {resource}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAllActionsForResource(resource, true)}
                          disabled={isAdmin}
                          className="h-7 text-xs text-green-400 hover:text-green-300 hover:bg-green-500/10"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Todo
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAllActionsForResource(resource, false)}
                          disabled={isAdmin}
                          className="h-7 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Ninguno
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {Object.values(Action).map((action) => (
                        <div
                          key={action}
                          className="flex items-start space-x-3 p-2 hover:bg-dark-blue-700/30 rounded transition-colors"
                        >
                          <Checkbox
                            id={`${resource}-${action}`}
                            checked={hasPermission(resource, action) || isAdmin}
                            onCheckedChange={() => togglePermission(resource, action)}
                            disabled={isAdmin}
                            className="mt-1"
                          />
                          <label
                            htmlFor={`${resource}-${action}`}
                            className="text-sm flex-1 cursor-pointer"
                          >
                            <div className="font-medium text-blue-200">{ACTION_LABELS[action]}</div>
                            <div className="text-xs text-blue-300/60">{ACTION_DESCRIPTIONS[action]}</div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>
            ))}
          </ScrollArea>
        </Tabs>

        <Separator className="bg-dark-blue-700" />

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-blue-300/70">
            <AlertCircle className="h-4 w-4" />
            <span>Los cambios se aplicarán inmediatamente</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-dark-blue-700 bg-dark-blue-800/30 text-blue-200 hover:bg-dark-blue-700/50"
            >
              Cancelar
            </Button>
            <Button
              onClick={savePermissions}
              disabled={saving || isAdmin}
              className="bg-blue-600/80 hover:bg-blue-600 text-white"
            >
              {saving ? "Guardando..." : "Guardar Permisos"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
