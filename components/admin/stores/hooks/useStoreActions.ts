"use client"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Store } from "@/lib/types"

export function useStoreActions(refreshStores: () => void) {
    const [editingStore, setEditingStore] = useState<Store | null>(null)
    const [isEditFormOpen, setIsEditFormOpen] = useState(false)
    const [deleteConfirmation, setDeleteConfirmation] = useState<Store | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const { toast } = useToast()

    const handleEdit = (store: Store) => {
        setEditingStore(store)
        setIsEditFormOpen(true)
    }

    const handleDelete = (store: Store) => {
        setDeleteConfirmation(store)
    }

    const confirmDelete = async (onDeleteFn: (store: Store) => Promise<void>) => {
        if (!deleteConfirmation) return

        setIsDeleting(true)
        try {
            await onDeleteFn(deleteConfirmation)
            toast({
                title: "Punto eliminado",
                description: "El punto se ha eliminado correctamente",
                variant: "default",
            })
            refreshStores()
            setDeleteConfirmation(null)
        } catch (error) {
            console.error("Error al eliminar el punto:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo eliminar el punto",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    return {
        editingStore,
        setEditingStore,
        isEditFormOpen,
        setIsEditFormOpen,
        deleteConfirmation,
        setDeleteConfirmation,
        isDeleting,
        handleEdit,
        handleDelete,
        confirmDelete,
    }
}
