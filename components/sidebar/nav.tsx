"use client"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

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
        <SidebarGroup className="pb-4">
            <SidebarGroupLabel className="px-2 text-xs font-medium">Principal</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items
                        .filter((item) => hasAccess(item.path))
                        .map((item) => (
                            <SidebarMenuItem key={item.path}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive(item.path)}
                                    tooltip={item.label}
                                    className="transition-all duration-200 hover:bg-accent/50"
                                >
                                    <Link href={item.path} className="flex items-center gap-2">
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
