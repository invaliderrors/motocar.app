"use client"
import Link from "next/link"
import { Shield, type LucideIcon } from "lucide-react"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

type MenuItem = {
    path: string
    label: string
    icon: LucideIcon
}

type NavSecondaryProps = {
    items: MenuItem[]
    pathname: string
    hasAccess: (path: string) => boolean
    className?: string
    title?: string
}

export function NavSecondary({ items, pathname, hasAccess, className, title = "Utilidades" }: NavSecondaryProps) {
    const isActive = (path: string) => {
        if (path === "/dashboard") return pathname === path
        return pathname.startsWith(path)
    }

    return (
        <SidebarGroup className={cn("pb-2", className)}>
            <SidebarGroupLabel className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-2">
                <Shield className="h-3 w-3" />
                {title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                    {items
                        .filter((item) => hasAccess(item.path))
                        .map((item) => {
                            const active = isActive(item.path)
                            return (
                                <SidebarMenuItem key={item.path}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={active}
                                        tooltip={item.label}
                                        className={cn(
                                            "relative transition-colors duration-200 rounded-lg",
                                            active 
                                                ? "bg-amber-500 text-white" 
                                                : "hover:bg-muted"
                                        )}
                                    >
                                        <Link href={item.path} className="flex items-center gap-3 px-3 py-2.5">
                                            <div className={cn(
                                                "flex items-center justify-center w-8 h-8 rounded-lg",
                                                active 
                                                    ? "bg-white/20" 
                                                    : "bg-amber-500/10"
                                            )}>
                                                <item.icon className={cn(
                                                    "h-4 w-4",
                                                    active ? "text-white" : "text-amber-600 dark:text-amber-400"
                                                )} />
                                            </div>
                                            <span className={cn(
                                                "font-medium text-sm",
                                                active ? "text-white" : "text-foreground"
                                            )}>{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
