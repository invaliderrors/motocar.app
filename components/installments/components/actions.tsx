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
    // Get permissions for installments and receipts
    const installmentPermissions = useResourcePermissions(Resource.INSTALLMENT)
    const receiptPermissions = useResourcePermissions(Resource.RECEIPT)

    // Check if user has any permissions
    const hasAnyPermission = installmentPermissions.hasAnyAccess || receiptPermissions.hasAnyAccess

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-blue-300 hover:text-white hover:bg-dark-blue-800/70"
                >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Opciones</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="bg-dark-blue-800/80 backdrop-blur-md border-dark-blue-700 text-white z-50"
                sideOffset={5}
            >
                {/* View details - requires INSTALLMENT.VIEW */}
                {installmentPermissions.canView && onViewDetails && (
                    <DropdownMenuItem
                        onClick={() => onViewDetails(installment)}
                        className="flex items-center gap-2 focus:bg-dark-blue-700/90 cursor-pointer"
                    >
                        <Eye className="h-4 w-4 text-blue-400" />
                        Ver detalles
                    </DropdownMenuItem>
                )}

                {/* View attachment - requires INSTALLMENT.VIEW */}
                {installment.attachmentUrl && onViewAttachment && installmentPermissions.canView && (
                    <DropdownMenuItem
                        onClick={() => onViewAttachment(installment)}
                        className="flex items-center gap-2 focus:bg-dark-blue-700/90 cursor-pointer"
                    >
                        <Eye className="h-4 w-4 text-purple-400" />
                        Ver comprobante
                    </DropdownMenuItem>
                )}

                {/* Send WhatsApp - requires RECEIPT.VIEW or RECEIPT.CREATE */}
                {(receiptPermissions.canView || receiptPermissions.canCreate) && (
                    <DropdownMenuItem
                        onClick={() => onSendWhatsapp(installment)}
                        className="flex items-center gap-2 focus:bg-dark-blue-700/90 cursor-pointer"
                    >
                        <WhatsAppIcon className="h-4 w-4 text-green-400" />
                        Enviar por WhatsApp
                    </DropdownMenuItem>
                )}

                {/* Print receipt - requires RECEIPT.VIEW or RECEIPT.CREATE */}
                {(receiptPermissions.canView || receiptPermissions.canCreate) && (
                    <DropdownMenuItem
                        onClick={() => onPrint(installment)}
                        className="flex items-center gap-2 focus:bg-dark-blue-700/90 cursor-pointer"
                    >
                        <Printer className="h-4 w-4 text-blue-400" />
                        Imprimir recibo
                    </DropdownMenuItem>
                )}

                {/* Edit - requires INSTALLMENT.EDIT */}
                {installmentPermissions.canEdit && (
                    <DropdownMenuItem
                        onClick={() => onEdit(installment)}
                        className="flex items-center gap-2 focus:bg-dark-blue-700/90 cursor-pointer"
                    >
                        <Edit className="h-4 w-4 text-amber-400" />
                        Editar cuota
                    </DropdownMenuItem>
                )}

                {/* Delete - requires INSTALLMENT.DELETE */}
                {installmentPermissions.canDelete && (
                    <DropdownMenuItem
                        onClick={() => onDelete(installment)}
                        className="flex items-center gap-2 focus:bg-dark-blue-700/90 cursor-pointer text-red-400"
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
