"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, RefreshCw, FileSpreadsheet } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Provider } from "@/lib/types"
import { ProviderForm } from "../form/ProviderForm"

interface ProviderTableControlsProps {
    searchTerm: string
    setSearchTerm: (term: string) => void
    itemsPerPage: number
    setItemsPerPage: (items: number) => void
    setCurrentPage: (page: number) => void
    onProviderCreated: (provider?: Provider) => void
    createProvider: (name: string) => Promise<Provider>
    updateProvider: (id: string, name: string) => Promise<Provider>
    onRefresh: () => void
    onExport: () => void
}

export function ProviderTableControls({
    searchTerm,
    setSearchTerm,
    itemsPerPage,
    setItemsPerPage,
    setCurrentPage,
    onProviderCreated,
    createProvider,
    updateProvider,
    onRefresh,
    onExport,
}: ProviderTableControlsProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Buscar por nombre..."
                    className="pl-9 border-border focus:border-primary"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={onRefresh}
                                className="border-border hover:bg-accent"
                            >
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Actualizar datos</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={onExport}
                                className="border-border hover:bg-accent"
                            >
                                <FileSpreadsheet className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Exportar a CSV</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                        setItemsPerPage(Number(value))
                        setCurrentPage(1)
                    }}
                >
                    <SelectTrigger className="w-[130px] border-border focus:border-primary">
                        <SelectValue placeholder="Mostrar" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="5">5 por página</SelectItem>
                        <SelectItem value="10">10 por página</SelectItem>
                        <SelectItem value="20">20 por página</SelectItem>
                        <SelectItem value="50">50 por página</SelectItem>
                    </SelectContent>
                </Select>
                <ProviderForm onCreated={onProviderCreated} createProvider={createProvider} updateProvider={updateProvider}>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md transition-all">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Proveedor
                    </Button>
                </ProviderForm>
            </div>
        </div>
    )
}
