import { TableCell, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  UserCog,
  Edit,
  Trash2,
  UserX,
  UserCheck,
  ShieldCheck,
} from "lucide-react"
import { Owner } from "@/lib/types"
import { RoleBadge } from "./RoleBadge"
import { StatusBadge } from "./StatusBadge"
import { PermissionsBadge } from "./PermissionsBadge"
import { formatDate, formatDateTime, getInitials } from "@/lib/utils/format"

interface UserTableRowProps {
  user: Owner
  onEdit: (user: Owner) => void
  onDelete: (user: Owner) => void
  onStatusChange: (userId: string, status: "ACTIVE" | "INACTIVE") => void
  onManagePermissions: (user: Owner) => void
}

export function UserTableRow({
  user,
  onEdit,
  onDelete,
  onStatusChange,
  onManagePermissions,
}: UserTableRowProps) {
  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <div className="flex items-center space-x-3">
          <Avatar className="border border-border">
            <AvatarImage
              src={`/abstract-geometric-shapes.png?height=40&width=40&query=${user.name}`}
              alt={user.name}
            />
            <AvatarFallback className="bg-muted text-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.username}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <RoleBadge role={user.role} />
      </TableCell>
      <TableCell>
        <StatusBadge status={user.status} />
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <PermissionsBadge
          permissions={user.permissions}
          isAdmin={user.role === "ADMIN"}
        />
      </TableCell>
      <TableCell className="hidden md:table-cell text-muted-foreground">
        {formatDateTime(user.lastLogin)}
      </TableCell>
      <TableCell className="hidden md:table-cell text-muted-foreground">
        {formatDate(user.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-muted"
            >
              <UserCog className="h-4 w-4" />
              <span className="sr-only">Acciones</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onManagePermissions(user)}
              className="cursor-pointer"
            >
              <ShieldCheck className="mr-2 h-4 w-4 text-blue-500" />
              Gestionar Permisos
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onEdit(user)}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            {user.status === "ACTIVE" ? (
              <DropdownMenuItem
                onClick={() => onStatusChange(user.id, "INACTIVE")}
                className="cursor-pointer"
              >
                <UserX className="mr-2 h-4 w-4" />
                Desactivar
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                onClick={() => onStatusChange(user.id, "ACTIVE")}
                className="cursor-pointer"
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Activar
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => onDelete(user)}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
