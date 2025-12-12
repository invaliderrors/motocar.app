"use client"

import { usePermissions } from "./usePermissions"
import { Action, Resource } from "@/lib/types/permissions"

/**
 * Utility hook that provides common permission checks for CRUD operations
 * 
 * @example
 * const permissions = useResourcePermissions(Resource.USER)
 * 
 * // Check individual permissions
 * if (permissions.canCreate) {
 *   // Show create button
 * }
 * 
 * // Check if user can do any write operation
 * if (permissions.canWrite) {
 *   // Show edit/delete/create options
 * }
 */
export function useResourcePermissions(resource: Resource) {
  const { hasPermission, isLoading } = usePermissions()

  return {
    canView: hasPermission(resource, Action.VIEW),
    canCreate: hasPermission(resource, Action.CREATE),
    canEdit: hasPermission(resource, Action.EDIT),
    canDelete: hasPermission(resource, Action.DELETE),
    isLoading,
    
    // Convenience computed properties
    hasAnyAccess: 
      hasPermission(resource, Action.VIEW) ||
      hasPermission(resource, Action.CREATE) ||
      hasPermission(resource, Action.EDIT) ||
      hasPermission(resource, Action.DELETE),
  }
}
