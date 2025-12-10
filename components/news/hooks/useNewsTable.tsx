"use client"

import { useState, useEffect, useMemo } from "react"
import { News } from "@/lib/types"
import { NewsService } from "@/lib/services/news.service"
import { useStore } from "@/contexts/StoreContext"
import { useToast } from "@/components/ui/use-toast"

export function useNewsTable() {
    const [news, setNews] = useState<News[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(15)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [newsToDelete, setNewsToDelete] = useState<string | null>(null)
    
    const { currentStore, triggerLoanRefresh } = useStore()
    const { toast } = useToast()

    const loadNews = async () => {
        if (!currentStore) return

        try {
            setLoading(true)
            const response = await NewsService.findAll({
                storeId: currentStore.id,
                page: 1,
                limit: 1000,
            })
            setNews(response.data || [])
        } catch (error) {
            console.error("Error loading news:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudieron cargar las novedades",
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadNews()
    }, [currentStore])

    // Filter news based on search term
    const filteredNews = useMemo(() => {
        if (!searchTerm) return news

        const term = searchTerm.toLowerCase()
        return news.filter((item) => {
            return (
                item.title.toLowerCase().includes(term) ||
                item.description.toLowerCase().includes(term) ||
                item.loan?.user?.name.toLowerCase().includes(term) ||
                item.loan?.vehicle?.plate.toLowerCase().includes(term)
            )
        })
    }, [news, searchTerm])

    // Pagination
    const totalItems = filteredNews.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems)
    const currentItems = filteredNews.slice(startIndex, endIndex)

    const handleDelete = (id: string) => {
        setNewsToDelete(id)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (!newsToDelete) return

        try {
            await NewsService.delete(newsToDelete)
            toast({
                title: "Novedad eliminada",
                description: "La novedad ha sido eliminada correctamente",
            })
            
            // Trigger loan table refresh to update coverage dates
            triggerLoanRefresh()
            
            loadNews()
        } catch (error) {
            console.error("Error deleting news:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo eliminar la novedad",
            })
        } finally {
            setDeleteDialogOpen(false)
            setNewsToDelete(null)
        }
    }

    const refreshData = () => {
        loadNews()
    }

    return {
        news: currentItems,
        loading,
        searchTerm,
        currentPage,
        itemsPerPage,
        deleteDialogOpen,
        totalItems,
        totalPages,
        startIndex,
        endIndex,
        setSearchTerm,
        setCurrentPage,
        setItemsPerPage,
        setDeleteDialogOpen,
        handleDelete,
        confirmDelete,
        refreshData,
    }
}
