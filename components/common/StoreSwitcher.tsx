"use client"

import { useStore } from "@/contexts/StoreContext"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Building2, Check, ChevronDown, Loader2, Store } from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { useRouter } from "next/navigation"

export function StoreSwitcher() {
  const { isAdmin, currentStore, allStores, switchStore, isLoading } = useStore()
  const router = useRouter()

  // Only show for admins
  if (!isAdmin) {
    return null
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border bg-card text-card-foreground shadow-sm">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        <span className="text-sm font-medium">Cargando locales...</span>
      </div>
    )
  }

  // No stores available
  if (allStores.length === 0) {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border bg-muted/50 text-muted-foreground">
        <Building2 className="h-4 w-4" />
        <span className="text-sm font-medium">No hay locales disponibles</span>
      </div>
    )
  }

  const handleStoreChange = (storeId: string) => {
    if (storeId === "admin-view") {
      // Clear selection - go back to admin view
      localStorage.removeItem("selectedStoreId")
      // Force reload to refresh sidebar and clear store context
      window.location.href = "/admin/dashboard"
    } else {
      switchStore(storeId)
    }
  }

  return (
    <Select
      value={currentStore?.id || "admin-view"}
      onValueChange={handleStoreChange}
    >
      <SelectTrigger className="h-11 w-full border-2 shadow-sm hover:border-primary/50 transition-colors">
        <div className="flex items-center gap-3 flex-1">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md",
            currentStore 
              ? "bg-primary text-primary-foreground" 
              : "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
          )}>
            {currentStore ? (
              <Store className="h-4 w-4" />
            ) : (
              <Building2 className="h-4 w-4" />
            )}
          </div>
          <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0">
            {currentStore ? (
              <>
                <span className="text-sm font-semibold leading-none">{currentStore.code}</span>
                <span className="text-xs text-muted-foreground truncate w-full">{currentStore.name}</span>
              </>
            ) : (
              <>
                <span className="text-sm font-semibold leading-none">Vista Admin</span>
                <span className="text-xs text-muted-foreground">Todos los Locales</span>
              </>
            )}
          </div>
        </div>
      </SelectTrigger>
      <SelectContent className="w-[280px]">
        <div className="px-2 py-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Selección de Local
          </p>
        </div>
        <Separator className="my-1" />
        <SelectItem
          value="admin-view"
          className={cn(
            "cursor-pointer py-3 px-3 my-1",
            !currentStore && "bg-accent"
          )}
        >
          <div className="flex items-center gap-3 w-full">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <Building2 className="h-4 w-4" />
            </div>
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <span className="font-semibold text-sm">Vista Admin</span>
              <span className="text-xs text-muted-foreground">Gestionar todos los locales</span>
            </div>
            {!currentStore && (
              <Check className="h-4 w-4 text-primary shrink-0" />
            )}
          </div>
        </SelectItem>
        
        {allStores.length > 0 && (
          <>
            <Separator className="my-1" />
            <div className="px-2 py-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Locales Disponibles ({allStores.length})
              </p>
            </div>
          </>
        )}
        
        {allStores.map((store) => (
          <SelectItem
            key={store.id}
            value={store.id}
            className={cn(
              "cursor-pointer py-3 px-3 my-1",
              currentStore?.id === store.id && "bg-accent"
            )}
          >
            <div className="flex items-center gap-3 w-full">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Store className="h-4 w-4" />
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="font-semibold text-sm">{store.code}</span>
                <span className="text-xs text-muted-foreground truncate">{store.name}</span>
              </div>
              {currentStore?.id === store.id && (
                <Check className="h-4 w-4 text-primary shrink-0" />
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// Compact version for mobile/sidebar
export function StoreSwitcherCompact() {
  const { isAdmin, currentStore, allStores, switchStore, isLoading } = useStore()
  const router = useRouter()

  if (!isAdmin || isLoading || allStores.length === 0) {
    return null
  }

  const handleStoreChange = (storeId: string) => {
    if (storeId === "admin-view") {
      localStorage.removeItem("selectedStoreId")
      // Force reload to refresh sidebar and clear store context
      window.location.href = "/admin/dashboard"
    } else {
      switchStore(storeId)
    }
  }

  return (
    <Select 
      value={currentStore?.id || "admin-view"} 
      onValueChange={handleStoreChange}
    >
      <SelectTrigger className="h-10 w-full border-2 hover:border-primary/50 transition-colors">
        <div className="flex items-center gap-2 flex-1">
          <div className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded",
            currentStore 
              ? "bg-primary text-primary-foreground" 
              : "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
          )}>
            {currentStore ? (
              <Store className="h-3 w-3" />
            ) : (
              <Building2 className="h-3 w-3" />
            )}
          </div>
          <div className="flex flex-col items-start gap-0.5 flex-1 min-w-0">
            <span className="text-xs font-semibold leading-none">
              {currentStore?.code || "Admin"}
            </span>
            <span className="text-[10px] text-muted-foreground leading-none truncate w-full">
              {currentStore?.name || "Todos los Locales"}
            </span>
          </div>
        </div>
      </SelectTrigger>
      <SelectContent className="w-[220px]">
        <SelectItem
          value="admin-view"
          className={cn(
            "cursor-pointer py-2.5",
            !currentStore && "bg-accent"
          )}
        >
          <div className="flex items-center gap-2 w-full">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <Building2 className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col gap-0.5 flex-1">
              <span className="font-semibold text-xs">Vista Admin</span>
              <span className="text-[10px] text-muted-foreground">Todos los Locales</span>
            </div>
            {!currentStore && <Check className="h-3.5 w-3.5 text-primary" />}
          </div>
        </SelectItem>
        
        {allStores.length > 0 && <Separator className="my-1" />}
        
        {allStores.map((store) => (
          <SelectItem
            key={store.id}
            value={store.id}
            className={cn(
              "cursor-pointer py-2.5",
              currentStore?.id === store.id && "bg-accent"
            )}
          >
            <div className="flex items-center gap-2 w-full">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary text-primary-foreground">
                <Store className="h-3.5 w-3.5" />
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="font-semibold text-xs">{store.code}</span>
                <span className="text-[10px] text-muted-foreground truncate">{store.name}</span>
              </div>
              {currentStore?.id === store.id && (
                <Check className="h-3.5 w-3.5 text-primary" />
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// Store badge - shows current store for employees
export function StoreBadge() {
  const { currentStore, isEmployee, isLoading } = useStore()

  if (isLoading || !currentStore || !isEmployee) {
    return null
  }

  return (
    <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg border-2 border-primary/20 bg-primary/5 shadow-sm">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Store className="h-4 w-4" />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-bold leading-none text-primary">{currentStore.code}</span>
        <span className="text-xs text-muted-foreground leading-none">{currentStore.name}</span>
      </div>
    </div>
  )
}
