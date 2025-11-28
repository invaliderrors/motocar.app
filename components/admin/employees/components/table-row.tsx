import { Edit, Trash2, RefreshCw, CheckCircle, XCircle, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PermissionsBadge } from "@/components/admin/components/PermissionsBadge"
import type { Employee } from "../hooks/useEmployees"

interface TableRowProps {
  employee: Employee
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
  onReassign: (employee: Employee) => void
  onToggleStatus: (employee: Employee) => void
}

export function TableRow({
  employee,
  onEdit,
  onDelete,
  onReassign,
  onToggleStatus,
}: TableRowProps) {
  return (
    <tr className="border-b hover:bg-muted/50 transition-colors">
      <td className="px-4 py-3">
        <div className="font-medium">{employee.name}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-muted-foreground">{employee.username}</div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm">
          <div>{employee.phone}</div>
          {employee.email && (
            <div className="text-muted-foreground">{employee.email}</div>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        {employee.store ? (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
              <Store className="w-3 h-3 mr-1" />
              {employee.store.name}
            </Badge>
            <span className="text-xs text-muted-foreground">({employee.store.code})</span>
          </div>
        ) : (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
            Sin asignar
          </Badge>
        )}
      </td>
      <td className="px-4 py-3">
        <Badge
          variant={employee.status === "ACTIVE" ? "default" : "secondary"}
          className={
            employee.status === "ACTIVE"
              ? "bg-green-500/10 text-green-500 border-green-500/20"
              : "bg-gray-500/10 text-gray-500 border-gray-500/20"
          }
        >
          {employee.status === "ACTIVE" ? (
            <CheckCircle className="w-3 h-3 mr-1" />
          ) : (
            <XCircle className="w-3 h-3 mr-1" />
          )}
          {employee.status === "ACTIVE" ? "Activo" : "Inactivo"}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <PermissionsBadge permissions={employee.permissions} isAdmin={false} />
      </td>
      <td className="px-4 py-3">
        <div className="text-sm text-muted-foreground">
          {new Date(employee.createdAt).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onReassign(employee)}
            title="Reasignar punto"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleStatus(employee)}
            title={employee.status === "ACTIVE" ? "Desactivar" : "Activar"}
          >
            {employee.status === "ACTIVE" ? (
              <XCircle className="h-4 w-4 text-orange-500" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(employee)}
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(employee)}
            title="Eliminar"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </td>
    </tr>
  )
}
