import { ProviderTable } from "@/components/providers/ProviderTable"
import { PageHeader } from "@/components/common/PageHeader"
import { Users, Building2 } from "lucide-react"

export default function ProvidersPage() {
    return (
        <div className="flex-1 w-full overflow-hidden flex flex-col">
            <PageHeader
                icon={Building2}
                title="Proveedores"
                subtitle="Gestión de proveedores y contactos"
                badgeIcon={Users}
                badgeLabel="Gestión"
                badgeColor="purple"
            />
            <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-background via-background to-muted/20">
                <ProviderTable />
            </div>
        </div>
    )
}