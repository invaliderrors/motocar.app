"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Eye, Edit, Trash2, Printer, AlertCircle } from "lucide-react"
import { WhatsAppIcon } from "../icons/whatsapp"
import { Installment } from "@/lib/types"
import { useResourcePermissions } from "@/hooks/useResourcePermissions"
import { Resource } from "@/lib/types/permissions"

interface ActionsMenuProps {
    installment: Installment
    onViewDetails?: (installment: Installment) => void
    onViewAttachment?: (installment: Installment) => void
    onSendWhatsapp: (installment: Installment) => void
    onPrint: (installment: Installment) => void
    onEdit: (installment: Installment) => void
    onDelete: (installment: Installment) => void
}

export function ActionsMenu({
    installment,
    onViewDetails,
    onViewAttachment,
    onSendWhatsapp,
    onPrint,
    onEdit,
    onDelete,
}: ActionsMenuProps) {
    // Get permissions for installments
    const installmentPermissions = useResourcePermissions(Resource.INSTALLMENT)

    // Check if user has any permissions
    const hasAnyPermission = installmentPermissions.hasAnyAccess

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
                    disabled={!hasAnyPermission}
                >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Opciones</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="backdrop-blur-md z-50"
                sideOffset={5}
            >
                {/* View details - available if user has any permission */}
                {hasAnyPermission && onViewDetails && (
                    <DropdownMenuItem
                        onClick={() => onViewDetails(installment)}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        Ver detalles
                    </DropdownMenuItem>
                )}

                {/* View attachment - available if user has any permission */}
                {installment.attachmentUrl && onViewAttachment && hasAnyPermission && (
                    <DropdownMenuItem
                        onClick={() => onViewAttachment(installment)}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        Ver comprobante
                    </DropdownMenuItem>
                )}

                {/* Send WhatsApp - available if user has CREATE permission */}
                {installmentPermissions.canCreate && (
                    <DropdownMenuItem
                        onClick={() => onSendWhatsapp(installment)}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <WhatsAppIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                        Enviar por WhatsApp
                    </DropdownMenuItem>
                )}

                {/* Print receipt - available if user has CREATE permission */}
                {installmentPermissions.canCreate && (
                    <DropdownMenuItem
                        onClick={() => onPrint(installment)}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Printer className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        Imprimir recibo
                    </DropdownMenuItem>
                )}

                {/* Edit - requires INSTALLMENT.EDIT */}
                {installmentPermissions.canEdit && (
                    <DropdownMenuItem
                        onClick={() => onEdit(installment)}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <Edit className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        Editar cuota
                    </DropdownMenuItem>
                )}

                {/* Delete - requires INSTALLMENT.DELETE */}
                {installmentPermissions.canDelete && (
                    <DropdownMenuItem
                        onClick={() => onDelete(installment)}
                        className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                    >
                        <Trash2 className="h-4 w-4" />
                        Eliminar cuota
                    </DropdownMenuItem>
                )}

                {/* Show message if user has no permissions */}
                {!hasAnyPermission && (
                    <DropdownMenuItem disabled className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        Sin permisos disponibles
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
