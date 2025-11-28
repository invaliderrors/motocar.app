"use client"
import Link from "next/link"
import { MoreHorizontalIcon, FolderIcon, ShareIcon, type LucideIcon } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

type MenuItem = {
    name: string
    url: string
    icon: LucideIcon
}

type NavDocumentsProps = {
    items: MenuItem[]
    pathname: string
    hasAccess: (path: string) => boolean
}

export function NavDocuments({ items, pathname, hasAccess }: NavDocumentsProps) {
    const { isMobile } = useSidebar()

    const isActive = (path: string) => {
        if (path === "/dashboard") return pathname === path
        return pathname.startsWith(path)
    }

    return (
        <SidebarGroup className="pb-4 group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="px-2 text-xs font-medium">Documents</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items
                        .filter((item) => hasAccess(item.url))
                        .map((item) => (
                            <SidebarMenuItem key={item.name}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive(item.url)}
                                    tooltip={item.name}
                                    className="transition-all duration-200 hover:bg-accent/50"
                                >
                                    <Link href={item.url} className="flex items-center gap-2">
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.name}</span>
                                    </Link>
                                </SidebarMenuButton>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuAction showOnHover className="rounded-sm data-[state=open]:bg-accent">
                                            <MoreHorizontalIcon className="h-4 w-4" />
                                            <span className="sr-only">More</span>
                                        </SidebarMenuAction>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-48 rounded-md"
                                        side={isMobile ? "bottom" : "right"}
                                        align={isMobile ? "end" : "start"}
                                        sideOffset={8}
                                    >
                                        <DropdownMenuItem>
                                            <FolderIcon className="mr-2 h-4 w-4" />
                                            <span>Open in new tab</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <ShareIcon className="mr-2 h-4 w-4" />
                                            <span>Share with team</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </SidebarMenuItem>
                        ))}
                    <SidebarMenuItem>
                        <SidebarMenuButton className="text-muted-foreground transition-all duration-200 hover:bg-accent/50">
                            <MoreHorizontalIcon className="h-4 w-4" />
                            <span>More documents</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
