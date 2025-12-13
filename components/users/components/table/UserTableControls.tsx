"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useResourcePermissions } from "@/hooks/useResourcePermissions"
import { Resource } from "@/lib/types/permissions"
import { Search, Plus } from "lucide-react"
import type { User as UserType } from "@/lib/types"
import { UserForm } from "../../UserForm"

interface TableControlsProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
    itemsPerPage: number
    setItemsPerPage: (items: number) => void
    setCurrentPage: (page: number) => void
    onUserCreated: (user?: UserType) => void
}

export function UserTableControls({
    searchTerm,
    setSearchTerm,
    itemsPerPage,
    setItemsPerPage,
    setCurrentPage,
    onUserCreated,
}: TableControlsProps) {
    const userPermissions = useResourcePermissions(Resource.USER)

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-primary/70" />
                <Input
                    type="search"
                    placeholder="Buscar por nombre, identificación, lugar o ciudad..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                        setItemsPerPage(Number(value))
                        setCurrentPage(1)
                    }}
                >
                    <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Mostrar" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5 por página</SelectItem>
                        <SelectItem value="10">10 por página</SelectItem>
                        <SelectItem value="20">20 por página</SelectItem>
                        <SelectItem value="50">50 por página</SelectItem>
                    </SelectContent>
                </Select>
                {userPermissions.canCreate && (
                    <UserForm onCreated={onUserCreated}>
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all">
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Usuario
                        </Button>
                    </UserForm>
                )}
            </div>
        </div>
    )
}
