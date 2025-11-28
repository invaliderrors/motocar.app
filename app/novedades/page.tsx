import { NewsTable } from "@/components/news/NewsTable"
import { PageHeader } from "@/components/common/PageHeader"
import { Newspaper, Bell } from "lucide-react"

export default function NewsPage() {
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
