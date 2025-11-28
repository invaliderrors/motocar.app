"use client"

import { usePermissions } from "@/hooks/usePermissions"
import { Action, Resource } from "@/lib/types/permissions"
import { type ReactNode } from "react"

interface PermissionGuardProps {
  children: ReactNode
  /** Single permission check */
  resource?: Resource
  action?: Action
  /** Multiple permission checks */
  permissions?: Array<{ resource: Resource; action: Action }>
  /** Require all permissions (AND logic) or any permission (OR logic) */
  requireAll?: boolean
  /** Content to show when user doesn't have permission */
  fallback?: ReactNode
  /** Show loading state while checking permissions */
  showLoading?: boolean
}

/**
 * Component that conditionally renders children based on user permissions
 * 
 * @example
 * // Simple single permission check
 * <PermissionGuard resource={Resource.USER} action={Action.CREATE}>
 *   <CreateUserButton />
 * </PermissionGuard>
 * 
 * @example
 * // Multiple permissions with OR logic (user needs at least one)
 * <PermissionGuard
 *   permissions={[
 *     { resource: Resource.USER, action: Action.EDIT },
 *     { resource: Resource.USER, action: Action.DELETE }
 *   ]}
 * >
 *   <UserActionsMenu />
 * </PermissionGuard>
 * 
 * @example
 * // Multiple permissions with AND logic (user needs all)
 * <PermissionGuard
 *   permissions={[
 *     { resource: Resource.REPORT, action: Action.VIEW },
 *     { resource: Resource.REPORT, action: Action.EXPORT }
 *   ]}
 *   requireAll
 * >
 *   <ExportReportButton />
 * </PermissionGuard>
 * 
 * @example
 * // With fallback content
 * <PermissionGuard
 *   resource={Resource.DASHBOARD}
 *   action={Action.VIEW}
 *   fallback={<p>No tienes permiso para ver el dashboard</p>}
 * >
 *   <Dashboard />
 * </PermissionGuard>
 */
export function PermissionGuard({
  children,
  resource,
  action,
  permissions,
  requireAll = false,
  fallback = null,
  showLoading = false,
}: PermissionGuardProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, isLoading } = usePermissions()

  // Show loading state if requested
  if (isLoading && showLoading) {
    return <div className="animate-pulse">Cargando...</div>
  }

  // If still loading but not showing loading state, don't render anything
  if (isLoading) {
    return null
  }

  // Check permissions
  let hasAccess = false

  if (resource && action) {
    // Single permission check
    hasAccess = hasPermission(resource, action)
  } else if (permissions && permissions.length > 0) {
    // Multiple permissions check
    hasAccess = requireAll ? hasAllPermissions(permissions) : hasAnyPermission(permissions)
  } else {
    // No permission specified, deny access by default
    console.warn("PermissionGuard: No permission criteria specified")
    hasAccess = false
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>
}
