"use client"

import { TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Edit, Trash2, User, Phone, Home, Hash, Calendar, MapPin } from "lucide-react"
import type { User as UserType } from "@/lib/types"
import { UserForm } from "../../UserForm"

interface UserTableRowProps {
    user: UserType
    index: number
    onEdit: (user?: UserType) => void
    onDelete: (id: string) => void
}

export function UserTableRow({ user, index, onEdit, onDelete }: UserTableRowProps) {
    return (
        <TableRow
            key={`user-row-${user.id}-${index}`}
            className="hover:bg-muted/50"
        >
            <TableCell>
                <div className="font-medium flex items-center gap-1.5">
                    <User className="h-4 w-4 text-primary" />
                    {user.name}
                </div>
                <div className="md:hidden text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <Hash className="h-3 w-3" />
                    {user.identification}
                </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
                <Badge
                    variant="outline"
                    className="font-mono text-xs"
                >
                    {user.identification}
                </Badge>
            </TableCell>
            <TableCell className="hidden lg:table-cell">
                <div className="flex items-center gap-1.5 text-foreground">
                    <MapPin className="h-4 w-4 text-primary" />
                    {user.idIssuedAt || "—"}
                </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">{user.age}</span>
                </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-1.5 text-foreground">
                    <Phone className="h-4 w-4 text-primary" />
                    {user.phone}
                </div>
            </TableCell>
            <TableCell className="hidden lg:table-cell">
                <div className="flex items-center gap-1.5 text-foreground truncate max-w-[200px]">
                    <Home className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="truncate">{user.address}</span>
                </div>
            </TableCell>
            <TableCell className="hidden lg:table-cell">
                <div className="flex items-center gap-1.5 text-foreground truncate max-w-[150px]">
                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="truncate">{user.city || "—"}</span>
                </div>
            </TableCell>
            <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div key={`edit-wrapper-${user.id}-${index}`}>
                                    <UserForm userId={user.id} userData={user} onCreated={onEdit}>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="bg-primary/10 text-primary hover:bg-primary/20"
                                        >
                                            <Edit className="h-4 w-4" />
                                            <span className="sr-only">Editar</span>
                                        </Button>
                                    </UserForm>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Editar usuario</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onDelete(user.id)}
                                    className="bg-destructive/10 text-destructive hover:bg-destructive/20"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Eliminar</span>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Eliminar usuario</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </TableCell>
        </TableRow>
    )
}
