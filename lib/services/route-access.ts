import { Role } from "@/hooks/useAuth"
import { getRequiredRole } from "./auth"

export const routeRoleMap: Record<string, Role> = {
    "/admin": "ADMIN",
    // Dashboard is now permission-based, not role-based
    "/flujo-caja": "ADMIN",
}

export function hasAccess(pathname: string, userRoles?: Role[]): boolean {
    const requiredRole = getRequiredRole(pathname)
    if (!requiredRole) return true
    return Array.isArray(userRoles) && userRoles.includes(requiredRole)
}
