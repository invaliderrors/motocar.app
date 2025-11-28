"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useStore } from "@/contexts/StoreContext"
import { Loader2 } from "lucide-react"

export default function StoreDetailPage() {
  const router = useRouter()
  const params = useParams()
  const { currentStore, allStores, isLoading } = useStore()
  const storeId = params.id as string

  useEffect(() => {
    if (isLoading) return

    // Check if we're already viewing this store
    if (currentStore?.id === storeId) {
      // Already selected, redirect to dashboard
      router.push("/dashboard")
      return
    }

    // Check if store exists in available stores
    const store = allStores.find(s => s.id === storeId)
    
    if (!store) {
      // Store not found, redirect to dashboard
      router.push("/dashboard")
      return
    }

    // Store the selected store ID in localStorage and reload
    localStorage.setItem("selectedStoreId", storeId)
    window.location.href = "/dashboard"
  }, [storeId, currentStore, allStores, isLoading, router])

  // Show loading state while switching
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Cargando punto...</p>
      </div>
    </div>
  )
}
