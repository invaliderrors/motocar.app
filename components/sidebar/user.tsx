"use client"
import { BellIcon, CreditCardIcon, LogOutIcon, MoreVerticalIcon, UserCircleIcon } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

type NavUserProps = {
    user: {
        name: string
        username: string
        roles?: string[]
    }
    onLogout: () => void
}

export function NavUser({ user, onLogout }: NavUserProps) {
    const { isMobile } = useSidebar()

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="w-full data-[state=open]:bg-accent data-[state=open]:text-accent-foreground transition-all duration-200"
                        >
                            <Avatar className="h-8 w-8 border">
                                <AvatarImage src="/avatars/01.png" alt={user.username} />
                                <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user.username}</span>
                                <span className="truncate text-xs text-muted-foreground">Usuario</span>
                            </div>
                            <MoreVerticalIcon className="ml-auto size-4 opacity-70" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-md"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={8}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                                <Avatar className="h-8 w-8 border">
                                    <AvatarImage src="/avatars/01.png" alt={user.username} />
                                    <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user.username}</span>
                                    <span className="truncate text-xs text-muted-foreground">Usuario</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="gap-2">
                                <UserCircleIcon className="h-4 w-4" />
                                Mi cuenta
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                                <CreditCardIcon className="h-4 w-4" />
                                Facturación
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                                <BellIcon className="h-4 w-4" />
                                Notificaciones
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2" onClick={onLogout}>
                            <LogOutIcon className="h-4 w-4" />
                            Cerrar sesión
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
