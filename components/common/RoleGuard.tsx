"use client"

import { useAuth } from "@/hooks/useAuth"
import { hasAccess } from "@/lib/services/route-access"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import type { ReactNode } from "react"

export function RoleGuard({ children }: { children: ReactNode }) {
    const { user, isLoading } = useAuth()
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && user && !hasAccess(pathname, user.roles)) {
            router.replace("/dashboard")
        }
    }, [isLoading, user, pathname, router])

    if (isLoading) return null

    if (!user || !hasAccess(pathname, user.roles)) return null

    return <>{children}</>
}
