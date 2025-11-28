"use client"

import { Newspaper } from "lucide-react"
import { useStore } from "@/contexts/StoreContext"
import { NewsTable } from "@/components/news/NewsTable"

export default function NewsPage() {
    const { currentStore } = useStore()

    if (!currentStore) {
        return (
            <div className="container mx-auto p-6">
                <div className="text-center py-12">
                    <p className="text-muted-foreground">Selecciona un punto para continuar</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center gap-3">
                <Newspaper className="h-8 w-8 text-primary" />
                <div>
                    <h1 className="text-3xl font-bold">Novedades</h1>
                    <p className="text-muted-foreground">
                        Gestiona novedades generales y específicas de contratos
                    </p>
                </div>
            </div>

            <NewsTable />
        </div>
    )
}
