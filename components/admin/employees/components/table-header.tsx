import { ArrowUp, ArrowDown } from "lucide-react"
import type { SortField, SortOrder } from "../employee-table"

interface TableHeaderProps {
  sortField: SortField
  sortOrder: SortOrder
  onSort: (field: SortField) => void
}

export function TableHeader({ sortField, sortOrder, onSort }: TableHeaderProps) {
  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortOrder === "asc" ? (
      <ArrowUp className="inline w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="inline w-4 h-4 ml-1" />
    )
  }

  return (
    <thead className="bg-muted/50">
      <tr>
        <th
          className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/80"
          onClick={() => onSort("name")}
        >
          Nombre <SortIcon field="name" />
        </th>
        <th
          className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/80"
          onClick={() => onSort("username")}
        >
          Usuario <SortIcon field="username" />
        </th>
        <th className="px-4 py-3 text-left text-sm font-medium">
          Contacto
        </th>
        <th
          className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/80"
          onClick={() => onSort("storeName")}
        >
          Punto <SortIcon field="storeName" />
        </th>
        <th
          className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/80"
          onClick={() => onSort("status")}
        >
          Estado <SortIcon field="status" />
        </th>
        <th className="px-4 py-3 text-left text-sm font-medium">
          Permisos
        </th>
        <th
          className="px-4 py-3 text-left text-sm font-medium cursor-pointer hover:bg-muted/80"
          onClick={() => onSort("createdAt")}
        >
          Fecha Registro <SortIcon field="createdAt" />
        </th>
        <th className="px-4 py-3 text-right text-sm font-medium">
          Acciones
        </th>
      </tr>
    </thead>
  )
}
