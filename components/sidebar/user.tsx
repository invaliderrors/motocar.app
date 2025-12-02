"use client"
import { BellIcon, CreditCardIcon, LogOutIcon, ChevronUp, UserCircleIcon, Sparkles } from "lucide-react"
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
    
    const getRoleLabel = (roles?: string[]) => {
        if (!roles || roles.length === 0) return "Usuario"
        if (roles.includes("admin")) return "Administrador"
        if (roles.includes("employee")) return "Empleado"
        return "Usuario"
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group w-full rounded-xl bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted hover:to-muted/50 data-[state=open]:from-primary/10 data-[state=open]:to-primary/5 border border-border/50 transition-all duration-300 hover:shadow-md"
                        >
                            <div className="relative">
                                <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-md">
                                    <AvatarImage src="/avatars/01.png" alt={user.username} />
                                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
                                        {user.username.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background" />
                            </div>
                            <div className="grid flex-1 text-left leading-tight">
                                <span className="truncate font-semibold text-sm">{user.username}</span>
                                <span className="truncate text-xs text-muted-foreground flex items-center gap-1">
                                    <Sparkles className="h-2.5 w-2.5" />
                                    {getRoleLabel(user.roles)}
                                </span>
                            </div>
                            <ChevronUp className="ml-auto h-4 w-4 text-muted-foreground/50 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl border-border/50 shadow-xl"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={8}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-3 px-3 py-3 bg-gradient-to-r from-muted/50 to-transparent rounded-t-xl">
                                <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-lg">
                                    <AvatarImage src="/avatars/01.png" alt={user.username} />
                                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-lg">
                                        {user.username.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left leading-tight">
                                    <span className="truncate font-semibold">{user.username}</span>
                                    <span className="truncate text-xs text-muted-foreground flex items-center gap-1">
                                        <Sparkles className="h-2.5 w-2.5" />
                                        {getRoleLabel(user.roles)}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup className="p-1">
                            <DropdownMenuItem className="gap-3 rounded-lg cursor-pointer">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10">
                                    <UserCircleIcon className="h-4 w-4 text-blue-500" />
                                </div>
                                <span>Mi cuenta</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-3 rounded-lg cursor-pointer">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-500/10">
                                    <CreditCardIcon className="h-4 w-4 text-emerald-500" />
                                </div>
                                <span>Facturación</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-3 rounded-lg cursor-pointer">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10">
                                    <BellIcon className="h-4 w-4 text-amber-500" />
                                </div>
                                <span>Notificaciones</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <div className="p-1">
                            <DropdownMenuItem 
                                className="gap-3 rounded-lg cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10" 
                                onClick={onLogout}
                            >
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-destructive/10">
                                    <LogOutIcon className="h-4 w-4" />
                                </div>
                                <span>Cerrar sesión</span>
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
