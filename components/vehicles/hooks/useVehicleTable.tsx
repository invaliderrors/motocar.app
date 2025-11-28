"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { HttpService } from "@/lib/http"
import type { Vehicle } from "@/lib/types"
import { VehicleType } from "@/lib/types"
import { useProviders } from "@/components/providers/hooks/useProviders"

interface VehiclesResponse {
    data: Vehicle[]
    pagination: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
}

export function useVehicleTable() {
    const { providers, getProviderName } = useProviders()
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [providerFilter, setProviderFilter] = useState<string>("all")
    const [vehicleTypeFilter, setVehicleTypeFilter] = useState<string>("all")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(15)
    const [totalItems, setTotalItems] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [refreshKey, setRefreshKey] = useState(0)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null)
    const { toast } = useToast()

    const getAuthToken = () => {
        return document.cookie
            .split("; ")
            .find((c) => c.startsWith("authToken="))
            ?.split("=")[1]
    }

    const fetchVehicles = async () => {
        try {
            setLoading(true)
            const token = getAuthToken()

            // Build query parameters
            const params = new URLSearchParams()
            params.append("page", currentPage.toString())
            params.append("limit", itemsPerPage.toString())

            if (searchTerm) {
                params.append("search", searchTerm)
            }

            if (providerFilter !== "all") {
                const provider = providers.find(p => p.name === providerFilter)
                if (provider) {
                    params.append("providerId", provider.id)
                }
            }

            if (vehicleTypeFilter !== "all") {
                params.append("vehicleType", vehicleTypeFilter)
            }

            const response = await HttpService.get<VehiclesResponse>(`/api/v1/vehicles?${params.toString()}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            })

            setVehicles(response.data.data)
            setTotalItems(response.data.pagination.total)
            setTotalPages(response.data.pagination.totalPages)
        } catch (error) {
            console.error("Error al obtener vehículos:", error)
            toast({
                variant: "destructive",
                title: "Error al cargar datos",
                description: "No se pudieron obtener los vehículos del servidor",
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVehicles()
    }, [refreshKey, currentPage, itemsPerPage, searchTerm, providerFilter, vehicleTypeFilter])

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, providerFilter, vehicleTypeFilter, itemsPerPage])

    const handleVehicleCreated = (updatedVehicle?: Vehicle) => {
        // Just refresh the data from the server
        refreshData()
    }

    const handleDelete = async (id: string) => {
        setVehicleToDelete(id)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!vehicleToDelete) return

        try {
            const token = getAuthToken()
            await HttpService.delete(`/api/v1/vehicles/${vehicleToDelete}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            })
            toast({
                title: "Vehículo eliminado",
                description: "El vehículo ha sido eliminado correctamente",
            })
            refreshData()
        } catch (error) {
            console.error("Error al eliminar vehículo:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo eliminar el vehículo",
            })
        } finally {
            setDeleteDialogOpen(false)
            setVehicleToDelete(null)
        }
    }

    const refreshData = () => {
        setRefreshKey((prev) => prev + 1)
    }

    const exportToCSV = () => {
        if (!vehicles || vehicles.length === 0) {
            toast({
                variant: "destructive",
                title: "No hay datos para exportar",
                description: "No hay vehículos disponibles para exportar",
            })
            return
        }

        const headers = ["Tipo", "Marca", "Modelo", "Placa", "Precio", "Color", "Cilindraje", "GPS", "Motor", "Chasis", "Proveedor"]
        const csvRows = [
            headers.join(","),
            ...vehicles.map((vehicle) =>
                [
                    getVehicleTypeLabel(vehicle.vehicleType),
                    vehicle.brand,
                    vehicle.model,
                    vehicle.plate,
                    vehicle.price || "",
                    vehicle.color || "",
                    vehicle.cc || "",
                    vehicle.gps || "",
                    vehicle.engine || "",
                    vehicle.chassis || "",
                    getProviderLabel(vehicle.provider?.name || ""),
                ].join(","),
            ),
        ]
        const csvContent = csvRows.join("\n")
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", "vehiculos.csv")
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const clearFilters = () => {
        setSearchTerm("")
        setProviderFilter("all")
        setVehicleTypeFilter("all")
    }

    const getVehicleTypeLabel = (type: VehicleType) => {
        const labels: Record<VehicleType, string> = {
            [VehicleType.MOTORCYCLE]: "Motocicleta",
            [VehicleType.MOTOCAR]: "Motocarro",
            [VehicleType.MOTOLOAD]: "Motocarguero",
            [VehicleType.OTHER]: "Otro",
        }
        return labels[type] || type
    }

    // Get unique providers and vehicle types for filters
    const uniqueProviders = Array.from(
        new Set(providers.map((p) => p.name).filter(Boolean)),
    ) as string[]

    const uniqueVehicleTypes = Object.values(VehicleType)

    const startIndex = (currentPage - 1) * itemsPerPage + 1
    const endIndex = Math.min(startIndex + (vehicles?.length || 0) - 1, totalItems)

    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        const maxVisiblePages = 5
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            pages.push(1)
            let startPage = Math.max(2, currentPage - 1)
            let endPage = Math.min(totalPages - 1, currentPage + 1)
            if (currentPage <= 3) endPage = Math.min(totalPages - 1, 4)
            else if (currentPage >= totalPages - 2) startPage = Math.max(2, totalPages - 3)
            if (startPage > 2) pages.push("ellipsis-start")
            for (let i = startPage; i <= endPage; i++) pages.push(i)
            if (endPage < totalPages - 1) pages.push("ellipsis-end")
            pages.push(totalPages)
        }
        return pages
    }

    const getProviderLabel = (providerName: string) => {
        // Simple mapping for display labels
        const providerLabels: Record<string, string> = {
            MOTOFACIL: "Moto Facil",
            OBRASOCIAL: "Obra Social",
            PORCENTAJETITO: "Tito",
        }

        return providerLabels[providerName] || providerName
    }

    return {
        // State
        vehicles,
        loading,
        searchTerm,
        setSearchTerm,
        providerFilter,
        setProviderFilter,
        vehicleTypeFilter,
        setVehicleTypeFilter,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        deleteDialogOpen,
        setDeleteDialogOpen,

        // Actions
        handleVehicleCreated,
        handleDelete,
        confirmDelete,
        refreshData,
        exportToCSV,
        clearFilters,
        getVehicleTypeLabel,

        // Computed values
        totalItems,
        totalPages,
        startIndex,
        endIndex,
        getPageNumbers,
        uniqueProviders,
        uniqueVehicleTypes,
        getProviderLabel,
        hasActiveFilters: searchTerm !== "" || providerFilter !== "all" || vehicleTypeFilter !== "all",
    }
}
