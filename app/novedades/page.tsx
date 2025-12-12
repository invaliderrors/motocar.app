"use client"

import { NewsTable } from "@/components/news/NewsTable"
import { PageHeader } from "@/components/common/PageHeader"
import { Newspaper, Bell, ShieldAlert } from "lucide-react"
import { useResourcePermissions } from "@/hooks/useResourcePermissions"
import { Resource } from "@/lib/types/permissions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function NewsPage() {
    const newsPermissions = useResourcePermissions(Resource.NEWS)

    // Wait for permissions to load before checking access
    if (newsPermissions.isLoading) {
        return null
    }

    if (!newsPermissions.canView) {
        return (
            <div className="flex-1 w-full overflow-hidden flex items-center justify-center p-6">
                <Alert variant="destructive" className="max-w-md">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>Acceso Denegado</AlertTitle>
                    <AlertDescription>
                        No tienes permisos para ver novedades.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="flex-1 w-full overflow-hidden flex flex-col">
            <PageHeader
                icon={Newspaper}
                title="Novedades"
                subtitle="Gestión de novedades de contratos"
                badgeIcon={Bell}
                badgeLabel="Gestión"
                badgeColor="amber"
            />
            <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background via-background to-muted/20">
                <NewsTable />
            </div>
        </div>
    )
}
