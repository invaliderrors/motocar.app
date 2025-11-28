"use client"

/**
 * PERMISSION SYSTEM USAGE EXAMPLES
 * 
 * This file demonstrates how to use the permission system in your components.
 * You can copy these patterns into your actual components.
 */

import { PermissionGuard } from "@/components/common/PermissionGuard"
import { usePermissions } from "@/hooks/usePermissions"
import { useResourcePermissions } from "@/hooks/useResourcePermissions"
import { Action, Resource } from "@/lib/types/permissions"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2, Download } from "lucide-react"

/**
 * Example 1: Using PermissionGuard component
 * This is the easiest way to conditionally render UI elements
 */
export function Example1_PermissionGuardBasic() {
  return (
    <div className="space-y-4">
      {/* Show create button only if user has CREATE permission */}
      <PermissionGuard resource={Resource.USER} action={Action.CREATE}>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Crear Usuario
        </Button>
      </PermissionGuard>

      {/* Show with fallback message */}
      <PermissionGuard
        resource={Resource.REPORT}
        action={Action.VIEW}
        fallback={<p className="text-muted-foreground">No tienes permiso para ver reportes</p>}
      >
        <div>Contenido del reporte...</div>
      </PermissionGuard>
    </div>
  )
}

/**
 * Example 2: Multiple permissions with OR logic
 * User needs at least ONE of the specified permissions
 */
export function Example2_PermissionGuardOR() {
  return (
    <PermissionGuard
      permissions={[
        { resource: Resource.USER, action: Action.EDIT },
        { resource: Resource.USER, action: Action.DELETE },
      ]}
      fallback={<p>No tienes permiso para editar o eliminar usuarios</p>}
    >
      <div className="flex gap-2">
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Eliminar
        </Button>
      </div>
    </PermissionGuard>
  )
}

/**
 * Example 3: Multiple permissions with AND logic
 * User needs ALL of the specified permissions
 */
export function Example3_PermissionGuardAND() {
  return (
    <PermissionGuard
      permissions={[
        { resource: Resource.REPORT, action: Action.VIEW },
        { resource: Resource.REPORT, action: Action.EXPORT },
      ]}
      requireAll
      fallback={<p>Necesitas permisos de ver y exportar reportes</p>}
    >
      <Button>
        <Download className="mr-2 h-4 w-4" />
        Exportar Reporte
      </Button>
    </PermissionGuard>
  )
}

/**
 * Example 4: Using usePermissions hook directly
 * For more complex logic or conditional rendering
 */
export function Example4_UsePermissionsHook() {
  const { hasPermission, hasAnyPermission } = usePermissions()

  const canCreateUser = hasPermission(Resource.USER, Action.CREATE)
  const canEditUser = hasPermission(Resource.USER, Action.EDIT)
  const canDeleteUser = hasPermission(Resource.USER, Action.DELETE)

  const hasAnyUserPermission = hasAnyPermission([
    { resource: Resource.USER, action: Action.VIEW },
    { resource: Resource.USER, action: Action.CREATE },
    { resource: Resource.USER, action: Action.EDIT },
  ])

  return (
    <div className="space-y-4">
      {canCreateUser && (
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Crear Usuario
        </Button>
      )}

      <div className="flex gap-2">
        {canEditUser && (
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        )}
        {canDeleteUser && (
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        )}
      </div>

      {!hasAnyUserPermission && (
        <p className="text-muted-foreground">
          No tienes ningún permiso sobre usuarios
        </p>
      )}
    </div>
  )
}

/**
 * Example 5: Using useResourcePermissions hook
 * Provides convenient CRUD permission checks for a resource
 */
export function Example5_UseResourcePermissions() {
  const userPermissions = useResourcePermissions(Resource.USER)
  const reportPermissions = useResourcePermissions(Resource.REPORT)

  return (
    <div className="space-y-4">
      {/* Check individual permissions */}
      {userPermissions.canCreate && (
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Crear Usuario
        </Button>
      )}

      {/* Check if user has any write permission */}
      {userPermissions.canWrite && (
        <div className="flex gap-2">
          {userPermissions.canEdit && <Button variant="outline">Editar</Button>}
          {userPermissions.canDelete && <Button variant="destructive">Eliminar</Button>}
        </div>
      )}

      {/* Check if user is read-only */}
      {userPermissions.canReadOnly && (
        <p className="text-muted-foreground">Solo tienes permiso de lectura</p>
      )}

      {/* Check multiple resources */}
      {reportPermissions.canView && reportPermissions.canExport && (
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Exportar Reporte
        </Button>
      )}

      {/* Check if user has any access to the resource */}
      {!userPermissions.hasAnyAccess && (
        <p className="text-destructive">No tienes acceso a este recurso</p>
      )}
    </div>
  )
}

/**
 * Example 6: Protecting entire pages
 * Use in page components to restrict access
 */
export function Example6_ProtectedPage() {
  return (
    <PermissionGuard
      resource={Resource.DASHBOARD}
      action={Action.VIEW}
      fallback={
        <div className="flex h-full items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Acceso Denegado</h2>
            <p className="text-muted-foreground">
              No tienes permiso para ver el dashboard
            </p>
          </div>
        </div>
      }
      showLoading
    >
      <div>
        {/* Your page content here */}
        <h1>Dashboard</h1>
        {/* ... */}
      </div>
    </PermissionGuard>
  )
}

/**
 * Example 7: Dynamic action buttons in a table
 * Show different actions based on permissions
 */
export function Example7_TableActions({ userId }: { userId: string }) {
  const permissions = useResourcePermissions(Resource.USER)

  return (
    <div className="flex gap-2">
      {permissions.canEdit && (
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      )}
      {permissions.canDelete && (
        <Button variant="ghost" size="sm">
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
      {!permissions.canWrite && permissions.canView && (
        <span className="text-xs text-muted-foreground">Solo lectura</span>
      )}
    </div>
  )
}

/**
 * Example 8: Combining role and permission checks
 */
export function Example8_RoleAndPermissionCheck() {
  const { hasPermission } = usePermissions()
  const permissions = useResourcePermissions(Resource.USER)

  // You can still use the useAuth hook to check roles if needed
  // import { useAuth } from "@/hooks/useAuth"
  // const { user } = useAuth()
  // const isAdmin = user?.roles?.includes("ADMIN")

  return (
    <div className="space-y-4">
      {/* Admins always have access, or users with specific permission */}
      {permissions.canManage && (
        <Button variant="outline">Configuración Avanzada</Button>
      )}

      {/* Specific permission check */}
      {hasPermission(Resource.CASH_FLOW, Action.APPROVE) && (
        <Button>Aprobar Flujo de Caja</Button>
      )}
    </div>
  )
}
