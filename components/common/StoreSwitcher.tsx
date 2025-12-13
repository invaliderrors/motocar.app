"use client"

import { useStore } from "@/contexts/StoreContext"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Building2, Check, Loader2, Store, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"

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
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">Cargando...</span>
      </div>
    )
  }

  // No stores available
  if (allStores.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">Sin locales</span>
      </div>
    )
  }

  const handleStoreChange = (storeId: string) => {
    if (storeId === "admin-view") {
      localStorage.removeItem("selectedStoreId")
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
      <SelectTrigger className="h-10 w-full rounded-lg border border-border/60 bg-background/50 hover:bg-muted/50 transition-colors focus:ring-1 focus:ring-primary/20">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <div className={cn(
            "flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
            currentStore 
              ? "bg-primary/10 text-primary" 
              : "bg-violet-500/10 text-violet-500"
          )}>
            {currentStore ? (
              <MapPin className="h-3.5 w-3.5" />
            ) : (
              <Building2 className="h-3.5 w-3.5" />
            )}
          </div>
          <div className="flex flex-col items-start min-w-0 flex-1">
            <span className="text-xs font-semibold leading-tight truncate w-full">
              {currentStore?.code || "Panel Admin"}
            </span>
            <span className="text-[10px] text-muted-foreground leading-tight truncate w-full">
              {currentStore?.name || "Todos los puntos"}
            </span>
          </div>
        </div>
      </SelectTrigger>
      <SelectContent 
        className="w-[240px] p-1 rounded-xl border-border/60 shadow-lg"
        align="start"
      >
        {/* Admin View Option */}
        <SelectItem
          value="admin-view"
          className={cn(
            "cursor-pointer rounded-lg px-2 py-2 mb-1 focus:bg-violet-500/10",
            !currentStore && "bg-violet-500/10"
          )}
        >
          <div className="flex items-center gap-2.5 w-full">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-violet-500/10 text-violet-500">
              <Building2 className="h-3.5 w-3.5" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-semibold">Panel Admin</span>
              <span className="text-[10px] text-muted-foreground">Gestión global</span>
            </div>
            {!currentStore && (
              <Check className="h-3.5 w-3.5 text-violet-500 shrink-0" />
            )}
          </div>
        </SelectItem>
        
        {allStores.length > 0 && (
          <>
            <div className="px-2 py-1">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Puntos ({allStores.length})
              </span>
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-0.5">
              {allStores.map((store) => (
                  <SelectItem
                    key={store.id}
                    value={store.id}
                    className={cn(
                      "cursor-pointer rounded-lg px-2 py-2 focus:bg-primary/10",
                      currentStore?.id === store.id && "bg-primary/10"
                    )}
                  >
                    <div className="flex items-center gap-2.5 w-full">
                      <div className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                        currentStore?.id === store.id 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-primary/10 text-primary"
                      )}>
                        <MapPin className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-xs font-semibold">{store.code}</span>
                        <span className="text-[10px] text-muted-foreground truncate">{store.name}</span>
                      </div>
                      {currentStore?.id === store.id && (
                        <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      )}
                    </div>
                  </SelectItem>
                ))}
            </div>
          </>
        )}
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
      <SelectTrigger className="h-9 w-full rounded-lg border border-border/60 bg-background/50 hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded",
            currentStore 
              ? "bg-primary/10 text-primary" 
              : "bg-violet-500/10 text-violet-500"
          )}>
            {currentStore ? (
              <MapPin className="h-3 w-3" />
            ) : (
              <Building2 className="h-3 w-3" />
            )}
          </div>
          <span className="text-xs font-semibold truncate">
            {currentStore?.code || "Admin"}
          </span>
        </div>
      </SelectTrigger>
      <SelectContent className="w-[200px] p-1 rounded-xl">
        <SelectItem
          value="admin-view"
          className={cn(
            "cursor-pointer rounded-lg px-2 py-1.5",
            !currentStore && "bg-violet-500/10"
          )}
        >
          <div className="flex items-center gap-2 w-full">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-violet-500/10 text-violet-500">
              <Building2 className="h-3 w-3" />
            </div>
            <span className="text-xs font-medium flex-1">Panel Admin</span>
            {!currentStore && <Check className="h-3 w-3 text-violet-500" />}
          </div>
        </SelectItem>
        
        {allStores.length > 0 && (
          <div className="max-h-[200px] overflow-y-auto mt-1 space-y-0.5">
            {allStores.map((store) => (
                <SelectItem
                  key={store.id}
                  value={store.id}
                  className={cn(
                    "cursor-pointer rounded-lg px-2 py-1.5",
                    currentStore?.id === store.id && "bg-primary/10"
                  )}
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded",
                      currentStore?.id === store.id 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-primary/10 text-primary"
                    )}>
                      <MapPin className="h-3 w-3" />
                    </div>
                    <span className="text-xs font-medium flex-1 truncate">{store.code}</span>
                    {currentStore?.id === store.id && (
                      <Check className="h-3 w-3 text-primary" />
                    )}
                  </div>
                </SelectItem>
              ))}
          </div>
        )}
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
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-primary/20 bg-primary/5">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <MapPin className="h-3.5 w-3.5" />
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-semibold leading-tight text-primary">{currentStore.code}</span>
        <span className="text-[10px] text-muted-foreground leading-tight truncate">{currentStore.name}</span>
      </div>
    </div>
  )
}
