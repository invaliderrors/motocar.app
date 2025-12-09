"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, ChevronDown, ChevronUp } from "lucide-react"
import {
  Resource,
  Action,
  PermissionsMap,
  RESOURCE_LABELS,
  ACTION_LABELS,
  ACTION_DESCRIPTIONS,
} from "@/lib/types/permissions"

interface PermissionsEditorProps {
  permissions: PermissionsMap
  onChange: (permissions: PermissionsMap) => void
  disabled?: boolean
}

export function PermissionsEditor({ permissions, onChange, disabled }: PermissionsEditorProps) {
  const [expandedResources, setExpandedResources] = useState<Set<Resource>>(new Set())

  const allResources = Object.values(Resource)
  const allActions = Object.values(Action)

  // Helper to get allowed actions for a resource
  // Dashboard and Reports are read-only (VIEW only)
  const getAllowedActions = (resource: Resource): Action[] => {
    if (resource === Resource.DASHBOARD || resource === Resource.REPORT) {
      return [Action.VIEW]
    }
    return [Action.CREATE, Action.EDIT, Action.DELETE]
  }

  const toggleResource = (resource: Resource) => {
    const newExpanded = new Set(expandedResources)
    if (newExpanded.has(resource)) {
      newExpanded.delete(resource)
    } else {
      newExpanded.add(resource)
    }
    setExpandedResources(newExpanded)
  }

  const toggleAction = (resource: Resource, action: Action) => {
    const currentActions = permissions[resource] || []
    let newActions: Action[]

    if (currentActions.includes(action)) {
      // Remove action
      newActions = currentActions.filter((a) => a !== action)
    } else {
      // Add action
      newActions = [...currentActions, action]
    }

    const newPermissions = { ...permissions }
    if (newActions.length === 0) {
      delete newPermissions[resource]
    } else {
      newPermissions[resource] = newActions
    }

    onChange(newPermissions)
  }

  const toggleAllActionsForResource = (resource: Resource, enable: boolean) => {
    const newPermissions = { ...permissions }
    if (enable) {
      // Only add allowed actions for this resource
      newPermissions[resource] = getAllowedActions(resource)
    } else {
      delete newPermissions[resource]
    }
    onChange(newPermissions)
  }

  const expandAll = () => {
    setExpandedResources(new Set(allResources))
  }

  const collapseAll = () => {
    setExpandedResources(new Set())
  }

  const hasAnyPermission = (resource: Resource) => {
    return permissions[resource] && permissions[resource].length > 0
  }

  const getPermissionCount = (resource: Resource) => {
    return permissions[resource]?.length || 0
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Permisos</CardTitle>
              <CardDescription className="mt-1">
                Configura los permisos específicos para este empleado
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={expandAll}
              disabled={disabled}
            >
              <ChevronDown className="h-4 w-4 mr-1" />
              Expandir
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={collapseAll}
              disabled={disabled}
            >
              <ChevronUp className="h-4 w-4 mr-1" />
              Contraer
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {allResources.map((resource) => {
          const isExpanded = expandedResources.has(resource)
          const permissionCount = getPermissionCount(resource)
          const hasPermissions = hasAnyPermission(resource)

          return (
            <Card key={resource} className={hasPermissions ? "border-primary/50" : ""}>
              <CardHeader className="p-4 cursor-pointer hover:bg-accent/50" onClick={() => toggleResource(resource)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronUp className="h-4 w-4" />
                    )}
                    <Label className="text-base font-medium cursor-pointer">
                      {RESOURCE_LABELS[resource]}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    {permissionCount > 0 && (
                      <Badge variant="default" className="text-xs">
                        {permissionCount} {permissionCount === 1 ? "permiso" : "permisos"}
                      </Badge>
                    )}
                    <Button
                      type="button"
                      variant={hasPermissions ? "destructive" : "outline"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleAllActionsForResource(resource, !hasPermissions)
                      }}
                      disabled={disabled}
                    >
                      {hasPermissions ? "Quitar todos" : "Dar todos"}
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="p-4 pt-0 grid grid-cols-2 gap-3">
                  {getAllowedActions(resource).map((action) => {
                    const isChecked = permissions[resource]?.includes(action) || false

                    return (
                      <div
                        key={`${resource}-${action}`}
                        className="flex items-start space-x-3 p-3 rounded-md border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <Checkbox
                          id={`${resource}-${action}`}
                          checked={isChecked}
                          onCheckedChange={() => toggleAction(resource, action)}
                          disabled={disabled}
                        />
                        <div className="flex-1 space-y-1">
                          <Label
                            htmlFor={`${resource}-${action}`}
                            className="text-sm font-medium leading-none cursor-pointer"
                          >
                            {ACTION_LABELS[action]}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {ACTION_DESCRIPTIONS[action]}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              )}
            </Card>
          )
        })}
      </CardContent>
    </Card>
  )
}
