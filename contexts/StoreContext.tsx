"use client"

import { Store } from "@/lib/types"
import { useAuth } from "@/hooks/useAuth"
import { StoreService } from "@/lib/services/store.service"
import { useRouter } from "next/navigation"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface StoreContextType {
  currentStore: Store | null
  allStores: Store[]
  isAdmin: boolean
  isEmployee: boolean
  isAdminViewingAsEmployee: boolean // Admin selected a store
  canAccessStore: (storeId: string) => boolean
  switchStore: (storeId: string) => void // Admin only
  refreshStores: () => Promise<void>
  isLoading: boolean
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [currentStore, setCurrentStore] = useState<Store | null>(null)
  const [allStores, setAllStores] = useState<Store[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const isAdmin = !!(user?.role === "ADMIN" || user?.roles?.includes("ADMIN"))
  const isEmployee = !!(user?.role === "EMPLOYEE" || (user?.roles && !user?.roles?.includes("ADMIN")))
  
  // Admin is viewing as employee when they have selected a specific store
  const isAdminViewingAsEmployee = isAdmin && currentStore !== null

  // Fetch user's store or all stores if admin
  useEffect(() => {
    if (authLoading || !user) {
      setIsLoading(false)
      return
    }

    const fetchStoreData = async () => {
      try {
        setIsLoading(true)

        if (isAdmin) {
          // Admin: fetch all stores
          try {
            const stores = await StoreService.getAllStores()
            setAllStores(stores)
            
            // Restore previously selected store from localStorage
            const savedStoreId = localStorage.getItem("selectedStoreId")
            if (savedStoreId) {
              const savedStore = stores.find(s => s.id === savedStoreId)
              if (savedStore) {
                setCurrentStore(savedStore)
              }
            }
            // Don't set a default store - admin should see admin view by default
          } catch (error) {
            console.warn("Store API not available yet, using mock data for admin")
            // Set empty for now - backend not ready
            setAllStores([])
          }
        } else if (isEmployee && user.storeId) {
          // Employee: fetch only their store
          try {
            const store = await StoreService.getStore(user.storeId)
            setCurrentStore(store)
            setAllStores([store])
          } catch (error) {
            console.warn("Store API not available yet, using data from JWT for employee")
            // Use store info from JWT token if available
            if (user.storeName && user.storeCode) {
              const mockStore: any = {
                id: user.storeId,
                name: user.storeName,
                code: user.storeCode,
                address: "",
                city: "",
                phone: null,
                status: "ACTIVE" as any,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
              setCurrentStore(mockStore)
              setAllStores([mockStore])
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch store data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStoreData()
  }, [user, authLoading])

  const canAccessStore = (storeId: string): boolean => {
    if (!user) return false
    
    // Admin can access any store
    if (isAdmin) return true
    
    // Employee can only access their assigned store
    if (isEmployee) {
      return user.storeId === storeId
    }
    
    return false
  }

  const switchStore = (storeId: string) => {
    if (!isAdmin) {
      throw new Error("Only admins can switch stores")
    }

    const store = allStores.find(s => s.id === storeId)
    if (store) {
      setCurrentStore(store)
      // Store preference in localStorage
      localStorage.setItem("selectedStoreId", storeId)
      
      // Navigate to dashboard to show the selected store
      router.push("/dashboard")
    }
  }

  const refreshStores = async () => {
    if (!user) return

    try {
      if (isAdmin) {
        const stores = await StoreService.getAllStores()
        setAllStores(stores)
        
        // Update current store if it's in the list
        if (currentStore) {
          const updatedStore = stores.find((s: Store) => s.id === currentStore.id)
          if (updatedStore) {
            setCurrentStore(updatedStore)
          }
        }
      } else if (isEmployee && user.storeId) {
        const store = await StoreService.getStore(user.storeId)
        setCurrentStore(store)
        setAllStores([store])
      }
    } catch (error) {
      console.error("Failed to refresh stores:", error)
    }
  }

  return (
    <StoreContext.Provider
      value={{
        currentStore,
        allStores,
        isAdmin,
        isEmployee,
        isAdminViewingAsEmployee,
        canAccessStore,
        switchStore,
        refreshStores,
        isLoading,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
