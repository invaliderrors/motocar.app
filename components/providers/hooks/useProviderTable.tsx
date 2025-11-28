"use client"

import { useState } from "react"
import type { Provider } from "@/lib/types"
import { useProviders } from "./useProviders"


export function useProviderTable() {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [providerToDelete, setProviderToDelete] = useState<string | null>(null)

    const { providers, loading, refreshProviders, createProvider, updateProvider, deleteProvider } = useProviders()

    const handleProviderCreated = (newProvider?: Provider) => {
        if (newProvider) {
            // Provider is already added to the list by the hook
        } else {
            refreshProviders()
        }
    }

    const handleDelete = async (id: string) => {
        setProviderToDelete(id)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!providerToDelete) return

        try {
            await deleteProvider(providerToDelete)
        } catch (error) {
            console.error("Error al eliminar proveedor:", error)
        } finally {
            setDeleteDialogOpen(false)
            setProviderToDelete(null)
        }
    }

    const exportToCSV = () => {
        const headers = ["ID", "Nombre", "Fecha de Creación"]
        const csvRows = [
            headers.join(","),
            ...filteredProviders.map((provider) =>
                [provider.id, provider.name, new Date(provider.createdAt).toLocaleDateString()].join(","),
            ),
        ]
        const csvContent = csvRows.join("\n")
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", "proveedores.csv")
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Computed values
    const filteredProviders = providers.filter((provider) =>
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const totalItems = filteredProviders.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
    const currentItems = filteredProviders.slice(startIndex, endIndex)

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

    return {
        // State
        providers: currentItems,
        loading,
        searchTerm,
        setSearchTerm,
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        deleteDialogOpen,
        setDeleteDialogOpen,

        // Actions
        handleProviderCreated,
        handleDelete,
        confirmDelete,
        refreshProviders,
        exportToCSV,
        createProvider,
        updateProvider,

        // Computed values
        totalItems,
        totalPages,
        startIndex,
        endIndex,
        getPageNumbers,
    }
}
