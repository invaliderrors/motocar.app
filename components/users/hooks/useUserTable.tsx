"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { HttpService } from "@/lib/http"
import type { User as UserType } from "@/lib/types"

export function useUserTable() {
    const [users, setUsers] = useState<UserType[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(15)
    const [refreshKey, setRefreshKey] = useState(0)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<string | null>(null)
    const { toast } = useToast()

    const getAuthToken = () => {
        return document.cookie
            .split("; ")
            .find((c) => c.startsWith("authToken="))
            ?.split("=")[1]
    }

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const token = getAuthToken()
            const response = await HttpService.get<UserType[]>("/api/v1/users", {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            })
            setUsers(response.data)
        } catch (error) {
            console.error("Error al obtener usuarios:", error)
            toast({
                variant: "destructive",
                title: "Error al cargar usuarios",
                description: "No se pudieron obtener los usuarios del servidor",
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [refreshKey])

    const handleUserCreated = (newUser?: UserType) => {
        if (newUser) {
            setUsers((prev) => {
                const exists = prev.some((user) => user.id === newUser.id)
                return exists ? prev.map((u) => (u.id === newUser.id ? newUser : u)) : [newUser, ...prev]
            })
        } else {
            fetchUsers()
        }
    }

    const handleDelete = async (id: string) => {
        setUserToDelete(id)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!userToDelete) return

        try {
            const token = getAuthToken()
            await HttpService.delete(`/api/v1/users/${userToDelete}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            })
            setUsers((prev) => prev.filter((user) => user.id !== userToDelete))
            toast({
                title: "Usuario eliminado",
                description: "El usuario ha sido eliminado correctamente",
            })
        } catch (error) {
            console.error("Error al eliminar usuario:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo eliminar el usuario",
            })
        } finally {
            setDeleteDialogOpen(false)
            setUserToDelete(null)
        }
    }

    const refreshData = () => {
        setRefreshKey((prev) => prev + 1)
    }

    const exportToCSV = () => {
        const headers = [
            "Nombre",
            "Identificación",
            "Lugar de Expedición",
            "Edad",
            "Teléfono",
            "Dirección",
            "Ciudad",
            "Referente",
            "ID Referente",
            "Teléfono Referente",
        ]
        const csvRows = [
            headers.join(","),
            ...filteredUsers.map((user) =>
                [
                    user.name,
                    user.identification,
                    user.idIssuedAt || "",
                    user.age,
                    user.phone,
                    user.address,
                    user.city || "",
                    user.refName,
                    user.refID,
                    user.refPhone,
                ].join(","),
            ),
        ]
        const csvContent = csvRows.join("\n")
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", "usuarios.csv")
        link.style.visibility = "hidden"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Computed values
    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.identification.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (user.idIssuedAt && user.idIssuedAt.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.city && user.city.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    const totalItems = filteredUsers.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
    const currentItems = filteredUsers.slice(startIndex, endIndex)

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
        users: currentItems,
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
        handleUserCreated,
        handleDelete,
        confirmDelete,
        refreshData,
        exportToCSV,

        // Computed values
        totalItems,
        totalPages,
        startIndex,
        endIndex,
        getPageNumbers,
    }
}
