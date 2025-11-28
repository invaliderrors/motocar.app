"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { PermissionsMap, RESOURCE_LABELS } from "@/lib/types/permissions"
import { Shield, ShieldCheck, ShieldAlert } from "lucide-react"

interface PermissionsBadgeProps {
  permissions?: PermissionsMap
  isAdmin?: boolean
}

export function PermissionsBadge({ permissions, isAdmin }: PermissionsBadgeProps) {
  if (isAdmin) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className="bg-amber-500/80 hover:bg-amber-500/70 text-white cursor-help">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Acceso Total
            </Badge>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="font-semibold mb-1">Administrador</p>
            <p className="text-xs">Tiene acceso completo a todas las funciones del sistema</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (!permissions || Object.keys(permissions).length === 0) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="border-red-500/50 text-red-400 cursor-help">
              <ShieldAlert className="h-3 w-3 mr-1" />
              Sin Permisos
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Este usuario no tiene permisos configurados</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const resourceCount = Object.keys(permissions).length
  const totalActions = Object.values(permissions).reduce((sum, actions) => sum + actions.length, 0)

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge className="bg-blue-500/80 hover:bg-blue-500/70 text-white cursor-help">
            <Shield className="h-3 w-3 mr-1" />
            {resourceCount} Módulos
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-2">
            <p className="font-semibold">Permisos Configurados</p>
            <p className="text-xs text-muted-foreground">{totalActions} acciones en {resourceCount} módulos</p>
            <div className="space-y-1 text-xs">
              {Object.entries(permissions).slice(0, 5).map(([resource, actions]) => (
                <div key={resource} className="flex justify-between gap-2">
                  <span className="font-medium">{RESOURCE_LABELS[resource as keyof typeof RESOURCE_LABELS]}:</span>
                  <span className="text-muted-foreground">{actions.length} acciones</span>
                </div>
              ))}
              {Object.keys(permissions).length > 5 && (
                <p className="text-muted-foreground italic">Y {Object.keys(permissions).length - 5} más...</p>
              )}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
