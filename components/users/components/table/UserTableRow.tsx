"use client"

import { TableRow, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useResourcePermissions } from "@/hooks/useResourcePermissions"
import { Resource } from "@/lib/types/permissions"
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
    const userPermissions = useResourcePermissions(Resource.USER)

    return (
        <TableRow
            key={`user-row-${user.id}-${index}`}
            className="group border-border/50 hover:bg-gradient-to-r hover:from-primary/[0.02] hover:to-primary/[0.05] transition-all duration-200"
        >
            {/* Name */}
            <TableCell className="py-3.5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 flex items-center justify-center shadow-sm">
                        <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <span className="font-semibold text-foreground">{user.name}</span>
                        <div className="md:hidden text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Hash className="h-3 w-3" />
                            {user.identification}
                        </div>
                    </div>
                </div>
            </TableCell>
            
            {/* Identification */}
            <TableCell className="py-3.5 hidden md:table-cell">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-100 dark:from-indigo-950/40 dark:to-purple-900/30 border border-indigo-200 dark:border-indigo-800/50">
                    <span className="text-xs font-bold tracking-wider text-indigo-700 dark:text-indigo-400">
                        {user.identification}
                    </span>
                </div>
            </TableCell>
            
            {/* ID Issued At */}
            <TableCell className="py-3.5 hidden lg:table-cell">
                {user.idIssuedAt ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-50 to-purple-100 dark:from-violet-950/40 dark:to-purple-900/30 border border-violet-200 dark:border-violet-800/50">
                        <MapPin className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                        <span className="text-xs font-medium text-violet-700 dark:text-violet-400">{user.idIssuedAt}</span>
                    </div>
                ) : (
                    <span className="text-muted-foreground/50 text-sm">—</span>
                )}
            </TableCell>
            
            {/* Age */}
            <TableCell className="py-3.5 hidden md:table-cell">
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800/50">
                    <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm font-medium text-amber-700 dark:text-amber-400">{user.age} años</span>
                </div>
            </TableCell>
            
            {/* Phone */}
            <TableCell className="py-3.5 hidden md:table-cell">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-50 to-green-100 dark:from-emerald-950/40 dark:to-green-900/30 border border-emerald-200 dark:border-emerald-800/50">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">{user.phone}</span>
                </div>
            </TableCell>
            
            {/* Address */}
            <TableCell className="py-3.5 hidden lg:table-cell">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-50 to-sky-100 dark:from-cyan-950/40 dark:to-sky-900/30 border border-cyan-200 dark:border-cyan-800/50 max-w-[200px]">
                    <Home className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 flex-shrink-0" />
                    <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400 truncate">{user.address}</span>
                </div>
            </TableCell>
            
            {/* City */}
            <TableCell className="py-3.5 hidden lg:table-cell">
                {user.city ? (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-50 to-pink-100 dark:from-rose-950/40 dark:to-pink-900/30 border border-rose-200 dark:border-rose-800/50">
                        <MapPin className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        <span className="text-xs font-medium text-rose-700 dark:text-rose-400">{user.city}</span>
                    </div>
                ) : (
                    <span className="text-muted-foreground/50 text-sm">—</span>
                )}
            </TableCell>
            
            {/* Actions */}
            <TableCell className="py-3.5 text-right">
                {(userPermissions.canEdit || userPermissions.canDelete) && (
                    <div className="flex justify-end gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                        {userPermissions.canEdit && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div key={`edit-wrapper-${user.id}-${index}`}>
                                            <UserForm userId={user.id} userData={user} onCreated={onEdit}>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                                                >
                                                    <Edit className="h-3.5 w-3.5" />
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
                        )}
                        {userPermissions.canDelete && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete(user.id)}
                                            className="h-8 w-8 rounded-lg bg-destructive/5 text-destructive hover:bg-destructive hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                            <span className="sr-only">Eliminar</span>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Eliminar usuario</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                )}
            </TableCell>
        </TableRow>
    )
}
