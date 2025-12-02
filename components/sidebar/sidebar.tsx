"use client"

import type * as React from "react"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import { useStore } from "@/contexts/StoreContext"
import { usePathname, useRouter } from "next/navigation"
import { useNavigationStore } from "@/lib/nav"
import { useState, useEffect } from "react"
import {
    LayoutDashboard,
    User2,
    Bike,
    HandCoins,
    BadgeDollarSign,
    FileDown,
    LogOut,
    Banknote,
    Calculator,
    FileBarChart,
    Settings,
    HelpCircle,
    Users2Icon,
    Smartphone,
    BadgeCheck,
    Calendar,
    TrendingUp,
    Wallet,
    Building2,
    Newspaper,
    Sparkles,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarSeparator,
    useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { NavFinance } from "./finance"
import { NavMain } from "./nav"
import { NavOperations } from "./operations"
import { NavSecondary } from "./secondary"
import { NavUser } from "./user"
import { hasAccess } from "@/lib/services/route-access"
import { StoreSwitcher, StoreBadge } from "@/components/common/StoreSwitcher"

export function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
    const { user, logout } = useAuth()
    const { isAdmin, isEmployee, isAdminViewingAsEmployee, currentStore } = useStore()
    const pathname = usePathname()
    const router = useRouter()
    const { isPageLoaded, isNavigatingFromLogin, resetNavigation } = useNavigationStore()
    const [shouldRender, setShouldRender] = useState(false)
    const { open } = useSidebar()
    
    // Determine if we should show employee view
    const showEmployeeView = isEmployee || isAdminViewingAsEmployee
    const showAdminView = isAdmin && !isAdminViewingAsEmployee

    // Control sidebar rendering based on navigation state
    useEffect(() => {
        // Don't render on login page
        if (pathname.startsWith("/login")) {
            setShouldRender(false)
            return
        }

        // If we have a user, render immediately
        if (user) {
            setShouldRender(true)
            return
        }

        // If we're not navigating from login, render sidebar immediately
        if (!isNavigatingFromLogin && user) {
            setShouldRender(true)
            return
        }

        // If we're navigating from login, wait for the page to be fully loaded
        if (isNavigatingFromLogin && isPageLoaded && user) {
            setShouldRender(true)
            // Reset navigation state after rendering
            setTimeout(() => {
                resetNavigation()
            }, 100)
        }
    }, [isNavigatingFromLogin, isPageLoaded, user, resetNavigation, pathname])

    // Don't render if conditions aren't met
    if (!user || pathname.startsWith("/login")) {
        return null
    }

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    // Main navigation items - Only for employees
    const mainItems = [
        { path: "/dashboard", label: "Vista General", icon: LayoutDashboard },
        { path: "/usuarios", label: "Usuarios", icon: User2 },
        { path: "/vehiculos", label: "Vehículos", icon: Bike },
        { path: "/proveedores", label: "Proveedores", icon: BadgeCheck },
    ]

    // Finance items - Core financial operations - Only for employees
    const financeItems = [
        { path: "/contratos", label: "Contratos", icon: HandCoins },
        { path: "/cuotas", label: "Cuotas", icon: BadgeDollarSign },
        { path: "/egresos", label: "Egresos", icon: FileDown },
        { path: "/cierre-caja", label: "Cierre de Caja", icon: Wallet },
        { path: "/calendario-pagos", label: "Calendario", icon: Calendar },
    ]

    // Operations items - Analytics & Tools - Only for employees
    const operationsItems = [
        // { path: "/flujo-efectivo", label: "Flujo de Efectivo", icon: TrendingUp },
        // { path: "/calculadora", label: "Calculadora", icon: Calculator },
        { path: "/reportes", label: "Reportes", icon: FileBarChart },
        { path: "/novedades", label: "Novedades", icon: Newspaper },
    ]

    // // Secondary navigation items

    // const secondaryItems = [
    //     { path: "/config/whatsapp", label: "WhatsApp", icon: Smartphone },
    //     // { path: "/settings", label: "Configuración", icon: Settings },
    //     // { path: "/help", label: "Ayuda", icon: HelpCircle },
    // ]

    // Admin items (only shown for admins)
    const adminItems = [
        {
            path: "/admin/stores",
            label: "Puntos",
            icon: Building2,
        },
        {
            path: "/admin/usuarios",
            label: "Empleados",
            icon: Users2Icon,
        },
    ]

    return (
        <Sidebar collapsible="offcanvas" className={cn("border-r border-border/40", className)} {...props}>
            <SidebarHeader className="relative overflow-hidden border-b border-border/40">
                {/* Background decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative flex flex-col gap-4 py-6">
                    <div className="flex items-center justify-center">
                        <a href="/dashboard" className="group flex items-center justify-center transition-all duration-300 hover:scale-105">
                            {open ? (
                                <div className="relative h-20 w-56">
                                    <Image src="/motocar_logo.png" alt="MotoFácil Logo" fill className="object-contain drop-shadow-md" priority />
                                </div>
                            ) : (
                                <div className="relative h-12 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-2 shadow-sm border border-primary/10">
                                    <Image src="/motocar_logo.png" alt="MotoFácil Icon" fill className="object-contain" priority />
                                </div>
                            )}
                        </a>
                    </div>
                    
                    {/* Store Switcher for Admin or Store Badge for Employee */}
                    {open && (
                        <div className="px-3">
                            {isAdmin ? <StoreSwitcher /> : <StoreBadge />}
                        </div>
                    )}
                </div>
            </SidebarHeader>
            <SidebarContent className="px-3 py-4 space-y-2">
                {/* Admin with no store selected sees only admin items */}
                {showAdminView ? (
                    <>
                        <NavSecondary
                            items={adminItems}
                            pathname={pathname}
                            hasAccess={(path) => hasAccess(path, user?.roles || [])}
                            title="Administración"
                        />
                    </>
                ) : showEmployeeView ? (
                    /* Employees OR Admin with store selected see operational items */
                    <>
                        <NavMain 
                            items={mainItems} 
                            pathname={pathname} 
                            hasAccess={(path) => hasAccess(path, user?.roles || [])} 
                        />
                        
                        <div className="px-3 py-2">
                            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                        </div>
                        
                        <NavFinance 
                            items={financeItems} 
                            pathname={pathname} 
                            hasAccess={(path) => hasAccess(path, user?.roles || [])} 
                        />
                        
                        <div className="px-3 py-2">
                            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                        </div>
                        
                        <NavOperations
                            items={operationsItems}
                            pathname={pathname}
                            hasAccess={(path) => hasAccess(path, user?.roles || [])}
                        />
                    </>
                ) : null}

                {/* {secondaryItems.length > 0 && (
                    <>
                        <SidebarSeparator className="my-2" />
                        <NavSecondary
                            items={secondaryItems}
                            pathname={pathname}
                            hasAccess={(path) => hasAccess(path, user?.roles || [])}
                            title="Utilidades"
                        />
                    </>
                )}
                 */}
            </SidebarContent>
            <SidebarFooter className="relative overflow-hidden border-t border-border/40 p-3">
                {/* Background decorative elements */}
                <div className="absolute inset-0 bg-gradient-to-t from-muted/50 to-transparent" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                <div className="relative">
                    <NavUser user={user} onLogout={handleLogout} />
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
