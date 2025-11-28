import { HttpService } from "@/lib/http"
import { PermissionsMap, Resource, Action, PermissionCheck } from "@/lib/types/permissions"

export class PermissionsService {
  private static readonly BASE_PATH = "/api/v1/permissions"

  /**
   * Get permissions for the current logged-in user
   */
  static async getMyPermissions(): Promise<PermissionsMap> {
    try {
      const response = await HttpService.get(`${this.BASE_PATH}/me`)
      return response.data.permissions || {}
    } catch (error) {
      console.error("Error fetching user permissions:", error)
      return {}
    }
  }

  /**
   * Get permissions for a specific owner (admin only)
   */
  static async getOwnerPermissions(ownerId: string): Promise<PermissionsMap> {
    try {
      const response = await HttpService.get(`${this.BASE_PATH}/owner/${ownerId}`)
      return response.data.permissions || {}
    } catch (error) {
      console.error("Error fetching owner permissions:", error)
      return {}
    }
  }

  /**
   * Get all available permissions (admin only)
   */
  static async getAllPermissions(): Promise<PermissionCheck[]> {
    const response = await HttpService.get(this.BASE_PATH)
    return response.data.permissions || []
  }

  /**
   * Get permissions grouped by resource (admin only)
   */
  static async getPermissionsGrouped(): Promise<Record<Resource, Action[]>> {
    const response = await HttpService.get(`${this.BASE_PATH}/grouped`)
    return response.data.permissions || {}
  }

  /**
   * Get default permissions for a role (admin only)
   */
  static async getDefaultPermissionsForRole(
    role: "ADMIN" | "MODERATOR" | "USER"
  ): Promise<PermissionsMap> {
    const response = await HttpService.get(`${this.BASE_PATH}/defaults/${role}`)
    return response.data.permissions || {}
  }

  /**
   * Set owner permissions (admin only)
   */
  static async setOwnerPermissions(
    ownerId: string,
    permissions: PermissionsMap,
    updatedBy: string
  ): Promise<any> {
    const response = await HttpService.post(`${this.BASE_PATH}/owner/${ownerId}/set`, {
      permissions,
      updatedBy,
    })
    return response.data
  }

  /**
   * Grant a single permission to an owner (admin only)
   */
  static async grantPermission(
    ownerId: string,
    resource: Resource,
    action: Action,
    grantedBy: string
  ): Promise<any> {
    const response = await HttpService.post(`${this.BASE_PATH}/owner/${ownerId}/grant`, {
      resource,
      action,
      grantedBy,
    })
    return response.data
  }

  /**
   * Revoke a single permission from an owner (admin only)
   */
  static async revokePermission(
    ownerId: string,
    resource: Resource,
    action: Action
  ): Promise<any> {
    const response = await HttpService.delete(`${this.BASE_PATH}/owner/${ownerId}/revoke`, {
      data: { resource, action },
    })
    return response.data
  }

  /**
   * Grant multiple actions for a resource to an owner (admin only)
   */
  static async grantResourcePermissions(
    ownerId: string,
    resource: Resource,
    actions: Action[],
    grantedBy: string
  ): Promise<any> {
    const response = await HttpService.post(
      `${this.BASE_PATH}/owner/${ownerId}/grant-resource`,
      {
        resource,
        actions,
        grantedBy,
      }
    )
    return response.data
  }

  /**
   * Apply default role permissions to an owner (admin only)
   */
  static async applyRolePermissions(
    ownerId: string,
    role: "ADMIN" | "MODERATOR" | "USER"
  ): Promise<any> {
    const response = await HttpService.post(`${this.BASE_PATH}/owner/${ownerId}/apply-role`, {
      role,
    })
    return response.data
  }

  /**
   * Clear all permissions for an owner (admin only)
   */
  static async clearOwnerPermissions(ownerId: string): Promise<any> {
    const response = await HttpService.delete(`${this.BASE_PATH}/owner/${ownerId}/clear`)
    return response.data
  }

  /**
   * Check if current user has a specific permission
   */
  static async checkMyPermission(resource: Resource, action: Action): Promise<boolean> {
    try {
      const response = await HttpService.post(`${this.BASE_PATH}/me/check`, {
        resource,
        action,
      })
      return response.data.hasPermission || false
    } catch (error) {
      console.error("Error checking permission:", error)
      return false
    }
  }

  /**
   * Check if an owner has a specific permission (admin only)
   */
  static async checkOwnerPermission(
    ownerId: string,
    resource: Resource,
    action: Action
  ): Promise<boolean> {
    try {
      const response = await HttpService.post(`${this.BASE_PATH}/owner/${ownerId}/check`, {
        resource,
        action,
      })
      return response.data.hasPermission || false
    } catch (error) {
      console.error("Error checking owner permission:", error)
      return false
    }
  }

  /**
   * Check if an owner has any of the specified permissions (admin only)
   */
  static async checkOwnerAnyPermission(
    ownerId: string,
    permissions: PermissionCheck[]
  ): Promise<boolean> {
    try {
      const response = await HttpService.post(`${this.BASE_PATH}/owner/${ownerId}/check-any`, {
        permissions,
      })
      return response.data.hasAnyPermission || false
    } catch (error) {
      console.error("Error checking owner any permission:", error)
      return false
    }
  }

  /**
   * Check if an owner has all of the specified permissions (admin only)
   */
  static async checkOwnerAllPermissions(
    ownerId: string,
    permissions: PermissionCheck[]
  ): Promise<boolean> {
    try {
      const response = await HttpService.post(`${this.BASE_PATH}/owner/${ownerId}/check-all`, {
        permissions,
      })
      return response.data.hasAllPermissions || false
    } catch (error) {
      console.error("Error checking owner all permissions:", error)
      return false
    }
  }
}
