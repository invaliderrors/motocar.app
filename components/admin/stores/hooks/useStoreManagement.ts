import { useState, useEffect, useCallback } from "react"
import { StoreService, CreateStoreDto, UpdateStoreDto } from "@/lib/services/store.service"
import { Store } from "@/lib/types"
import { useToast } from "@/hooks/useToast"

interface UseStoreManagementReturn {
  stores: Store[]
  isLoading: boolean
  loadError: string | null
  loadStores: () => Promise<void>
  createStore: (data: CreateStoreDto) => Promise<void>
  updateStore: (id: string, data: UpdateStoreDto) => Promise<void>
  deleteStore: (store: Store) => Promise<void>
}

export function useStoreManagement(): UseStoreManagementReturn {
  const { toast } = useToast()
  const [stores, setStores] = useState<Store[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  const loadStores = useCallback(async () => {
    try {
      setIsLoading(true)
      setLoadError(null)
      const data = await StoreService.getAllStores()
      setStores(data)
    } catch (error: any) {
      console.error("Error al cargar puntos:", error)
      const errorMessage = error?.response?.status === 404 
        ? "La API de gestión de puntos aún no está disponible. Podrás crear puntos cuando el backend esté listo."
        : "Error al cargar puntos. Es posible que la API del backend aún no esté lista."
      
      setLoadError(errorMessage)
      setStores([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const createStore = useCallback(async (data: CreateStoreDto) => {
    try {
      await StoreService.createStore(data)
      toast({
        title: "Éxito",
        description: "Punto creado correctamente",
      })
      await loadStores()
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al crear el punto",
        variant: "destructive",
      })
      throw error
    }
  }, [toast, loadStores])

  const updateStore = useCallback(async (id: string, data: UpdateStoreDto) => {
    try {
      await StoreService.updateStore(id, data)
      toast({
        title: "Éxito",
        description: "Punto actualizado correctamente",
      })
      await loadStores()
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar el punto",
        variant: "destructive",
      })
      throw error
    }
  }, [toast, loadStores])

  const deleteStore = useCallback(async (store: Store) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar ${store.name}?`)) {
      return
    }

    try {
      await StoreService.deleteStore(store.id)
      toast({
        title: "Éxito",
        description: "Punto eliminado correctamente",
      })
      await loadStores()
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar el punto",
        variant: "destructive",
      })
      throw error
    }
  }, [toast, loadStores])

  useEffect(() => {
    loadStores()
  }, [loadStores])

  return {
    stores,
    isLoading,
    loadError,
    loadStores,
    createStore,
    updateStore,
    deleteStore,
  }
}
