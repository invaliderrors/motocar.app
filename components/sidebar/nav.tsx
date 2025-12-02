"use client"
import Link from "next/link"
import { LayoutGrid, type LucideIcon } from "lucide-react"

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

type NavMainProps = {
    items: MenuItem[]
    pathname: string
    hasAccess: (path: string) => boolean
}

export function NavMain({ items, pathname, hasAccess }: NavMainProps) {
    const isActive = (path: string) => {
        if (path === "/dashboard") return pathname === path
        return pathname.startsWith(path)
    }

    return (
        <SidebarGroup className="pb-2">
            <SidebarGroupLabel className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 flex items-center gap-2">
                <LayoutGrid className="h-3 w-3" />
                Principal
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
                                            "relative group transition-all duration-200 rounded-lg",
                                            active 
                                                ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90" 
                                                : "hover:bg-muted/80"
                                        )}
                                    >
                                        <Link href={item.path} className="flex items-center gap-3 px-3 py-2.5">
                                            <div className={cn(
                                                "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                                                active 
                                                    ? "bg-primary-foreground/20" 
                                                    : "bg-muted group-hover:bg-primary/10"
                                            )}>
                                                <item.icon className={cn(
                                                    "h-4 w-4 transition-colors",
                                                    active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
                                                )} />
                                            </div>
                                            <span className={cn(
                                                "font-medium text-sm",
                                                active ? "text-primary-foreground" : "text-foreground"
                                            )}>{item.label}</span>
                                            {active && (
                                                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary-foreground/50" />
                                            )}
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
