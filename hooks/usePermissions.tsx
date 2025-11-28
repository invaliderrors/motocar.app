"use client"

import { useAuth } from "@/hooks/useAuth"
import { Action, PermissionsMap, Resource } from "@/lib/types/permissions"
import { PermissionsService } from "@/lib/services/permissions.service"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type PermissionsContextType = {
  permissions: PermissionsMap
  hasPermission: (resource: Resource, action: Action) => boolean
  hasAnyPermission: (checks: Array<{ resource: Resource; action: Action }>) => boolean
  hasAllPermissions: (checks: Array<{ resource: Resource; action: Action }>) => boolean
  isLoading: boolean
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined)

export function PermissionsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [permissions, setPermissions] = useState<PermissionsMap>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPermissions = async () => {
      if (!user?.id) {
        setPermissions({})
        setIsLoading(false)
        return
      }

      // ADMIN role has all permissions by default
      if (user.roles?.includes("ADMIN")) {
        // Create a permissions map with all resources and all actions
        const allPermissions: PermissionsMap = {}
        Object.values(Resource).forEach((resource) => {
          allPermissions[resource] = Object.values(Action)
        })
        setPermissions(allPermissions)
        setIsLoading(false)
        return
      }

      // Load permissions from API for non-admin users
      try {
        const userPermissions = await PermissionsService.getMyPermissions()
        setPermissions(userPermissions)
      } catch (error) {
        console.error("Error loading permissions:", error)
        setPermissions({})
      } finally {
        setIsLoading(false)
      }
    }

    loadPermissions()
  }, [user])

  /**
   * Check if user has a specific permission
   */
  const hasPermission = (resource: Resource, action: Action): boolean => {
    // ADMIN always has permission
    if (user?.roles?.includes("ADMIN")) {
      return true
    }

    const resourcePermissions = permissions[resource]
    if (!resourcePermissions) return false

    return resourcePermissions.includes(action)
  }

  /**
   * Check if user has at least one of the specified permissions
   */
  const hasAnyPermission = (checks: Array<{ resource: Resource; action: Action }>): boolean => {
    if (user?.roles?.includes("ADMIN")) {
      return true
    }

    return checks.some((check) => hasPermission(check.resource, check.action))
  }

  /**
   * Check if user has all of the specified permissions
   */
  const hasAllPermissions = (checks: Array<{ resource: Resource; action: Action }>): boolean => {
    if (user?.roles?.includes("ADMIN")) {
      return true
    }

    return checks.every((check) => hasPermission(check.resource, check.action))
  }

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        isLoading,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  )
}

/**
 * Hook to access permissions context
 */
export function usePermissions(): PermissionsContextType {
  const context = useContext(PermissionsContext)
  if (!context) {
    throw new Error("usePermissions must be used within a PermissionsProvider")
  }
  return context
}
