"use client"
import Link from "next/link"
import { ChevronRight, type LucideIcon } from "lucide-react"
import { useState } from "react"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

type MenuItem = {
    path: string
    label: string
    icon: LucideIcon
}

type NavFinanceProps = {
    items: MenuItem[]
    pathname: string
    hasAccess: (path: string) => boolean
}

export function NavFinance({ items, pathname, hasAccess }: NavFinanceProps) {
    const [isOpen, setIsOpen] = useState(true)

    const isActive = (path: string) => {
        if (path === "/dashboard") return pathname === path
        return pathname.startsWith(path)
    }

    const isAnyItemActive = items.some((item) => isActive(item.path))

    return (
        <SidebarGroup className="pb-4">
            <Collapsible open={isOpen || isAnyItemActive} onOpenChange={setIsOpen} className="w-full">
                <CollapsibleTrigger className="w-full">
                    <SidebarGroupLabel className="flex cursor-pointer items-center justify-between px-2 py-1 text-xs font-medium hover:text-foreground">
                        <span>Finanzas</span>
                        <ChevronRight
                            className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${isOpen || isAnyItemActive ? "rotate-90" : ""
                                }`}
                        />
                    </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent>
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
                </CollapsibleContent>
            </Collapsible>
        </SidebarGroup>
    )
}
