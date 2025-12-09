"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Plus, RefreshCw } from "lucide-react"
import { useState } from "react"
import { NewsForm } from "./NewsForm"
import { useResourcePermissions } from "@/hooks/useResourcePermissions"
import { Resource } from "@/lib/types/permissions"

interface NewsTableControlsProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    onRefresh?: () => void
}

export function NewsTableControls({
    searchTerm,
    onSearchChange,
    onRefresh,
}: NewsTableControlsProps) {
    const [formOpen, setFormOpen] = useState(false)
    const newsPermissions = useResourcePermissions(Resource.NEWS)

    return (
        <>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Buscar por título, descripción, cliente..."
                            className="pl-9 border-border focus:border-primary"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    {onRefresh && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onRefresh}
                            className="border-border hover:bg-muted"
                        >
                            <RefreshCw className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Actualizar</span>
                        </Button>
                    )}
                    {newsPermissions.canCreate && (
                        <Button
                            size="sm"
                            onClick={() => setFormOpen(true)}
                            className="bg-primary hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4 sm:mr-2" />
                            <span className="hidden sm:inline">Nueva Novedad</span>
                        </Button>
                    )}
                </div>
            </div>

            <NewsForm
                open={formOpen}
                onClose={() => setFormOpen(false)}
                onSuccess={() => {
                    setFormOpen(false)
                    onRefresh?.()
                }}
            />
        </>
    )
}
