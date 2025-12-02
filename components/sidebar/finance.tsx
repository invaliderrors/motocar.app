"use client"
import Link from "next/link"
import { ChevronRight, Wallet, type LucideIcon } from "lucide-react"
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
import { cn } from "@/lib/utils"

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
        <SidebarGroup className="pb-2">
            <Collapsible open={isOpen || isAnyItemActive} onOpenChange={setIsOpen} className="w-full">
                <CollapsibleTrigger className="w-full group">
                    <SidebarGroupLabel className="flex cursor-pointer items-center justify-between px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 hover:text-foreground transition-colors">
                        <div className="flex items-center gap-2">
                            <Wallet className="h-3 w-3" />
                            <span>Finanzas</span>
                        </div>
                        <ChevronRight
                            className={cn(
                                "h-3.5 w-3.5 text-muted-foreground/50 transition-transform duration-300",
                                (isOpen || isAnyItemActive) && "rotate-90"
                            )}
                        />
                    </SidebarGroupLabel>
                </CollapsibleTrigger>
                <CollapsibleContent className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1 mt-1">
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
                                                        ? "bg-emerald-500 text-white" 
                                                        : "hover:bg-muted"
                                                )}
                                            >
                                                <Link href={item.path} className="flex items-center gap-3 px-3 py-2.5">
                                                    <div className={cn(
                                                        "flex items-center justify-center w-8 h-8 rounded-lg",
                                                        active 
                                                            ? "bg-white/20" 
                                                            : "bg-emerald-500/10"
                                                    )}>
                                                        <item.icon className={cn(
                                                            "h-4 w-4",
                                                            active ? "text-white" : "text-emerald-600 dark:text-emerald-400"
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
                </CollapsibleContent>
            </Collapsible>
        </SidebarGroup>
    )
}
