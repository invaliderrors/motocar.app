"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { HttpService } from "@/lib/http"
import type { Provider } from "@/lib/types"

export function useProviders() {
    const [providers, setProviders] = useState<Provider[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    const getAuthToken = () => {
        return document.cookie
            .split("; ")
            .find((c) => c.startsWith("authToken="))
            ?.split("=")[1]
    }

    const fetchProviders = async () => {
        try {
            setLoading(true)
            setError(null)
            const token = getAuthToken()
            // Add query parameter to include related data
            const response = await HttpService.get("/api/v1/providers?include=motorcycles,cashRegisters", {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            })

            // Handle different response structures
            const providerList = Array.isArray(response.data)
                ? response.data
                : Array.isArray(response.data?.data)
                    ? response.data.data
                    : []

            setProviders(providerList)
        } catch (err) {
            console.error("Error fetching providers:", err)
            setError("Failed to load providers")
            setProviders([])
            toast({
                variant: "destructive",
                title: "Error al cargar proveedores",
                description: "No se pudieron obtener los proveedores del servidor",
            })
        } finally {
            setLoading(false)
        }
    }

    const createProvider = async (name: string) => {
        try {
            const token = getAuthToken()
            const response = await HttpService.post(
                "/api/v1/providers",
                { name },
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                },
            )

            setProviders((prev) => [response.data, ...prev])
            toast({
                title: "Proveedor creado",
                description: "El proveedor ha sido creado correctamente",
            })
            return response.data
        } catch (error) {
            console.error("Error creating provider:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo crear el proveedor",
            })
            throw error
        }
    }

    const updateProvider = async (id: string, name: string) => {
        try {
            const token = getAuthToken()
            const response = await HttpService.put(
                `/api/v1/providers/${id}`,
                { name },
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    },
                },
            )

            setProviders((prev) => prev.map((provider) => (provider.id === id ? response.data : provider)))
            toast({
                title: "Proveedor actualizado",
                description: "El proveedor ha sido actualizado correctamente",
            })
            return response.data
        } catch (error) {
            console.error("Error updating provider:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo actualizar el proveedor",
            })
            throw error
        }
    }

    const deleteProvider = async (id: string) => {
        try {
            const token = getAuthToken()
            await HttpService.delete(`/api/v1/providers/${id}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            })

            setProviders((prev) => prev.filter((provider) => provider.id !== id))
            toast({
                title: "Proveedor eliminado",
                description: "El proveedor ha sido eliminado correctamente",
            })
        } catch (error) {
            console.error("Error deleting provider:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo eliminar el proveedor",
            })
            throw error
        }
    }

    useEffect(() => {
        fetchProviders()
    }, [])

    const getProviderById = (id: string) => {
        return providers.find((provider) => provider.id === id)
    }

    const getProviderName = (id: string) => {
        const provider = getProviderById(id)
        return provider?.name || "Unknown Provider"
    }

    const refreshProviders = () => {
        fetchProviders()
    }

    return {
        providers,
        loading,
        error,
        getProviderById,
        getProviderName,
        refreshProviders,
        createProvider,
        updateProvider,
        deleteProvider,
    }
}
