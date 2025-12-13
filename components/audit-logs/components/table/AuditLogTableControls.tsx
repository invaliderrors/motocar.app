"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, RefreshCw, Filter } from "lucide-react"
import type { AuditLogFilters } from "@/lib/types/audit-log"
import { AUDIT_ACTION_LABELS } from "@/lib/types/audit-log"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

interface TableControlsProps {
  filters: AuditLogFilters
  onFilterChange: (filters: Partial<AuditLogFilters>) => void
  onRefresh: () => void
  onExport: () => void
}

export function AuditLogTableControls({
  filters,
  onFilterChange,
  onRefresh,
  onExport,
}: TableControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-primary/70" />
        <Input
          type="search"
          placeholder="Buscar por entidad o ID..."
          className="pl-9"
          value={filters.entityId || ""}
          onChange={(e) => onFilterChange({ entityId: e.target.value || undefined })}
        />
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div>
                <Label>Acción</Label>
                <Select
                  value={filters.action || "all"}
                  onValueChange={(value) => onFilterChange({ action: value === "all" ? undefined : value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las acciones" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las acciones</SelectItem>
                    {Object.entries(AUDIT_ACTION_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Entidad</Label>
                <Input
                  placeholder="Ej: User, Vehicle, Loan..."
                  value={filters.entity || ""}
                  onChange={(e) => onFilterChange({ entity: e.target.value || undefined })}
                />
              </div>
              <div>
                <Label>Fecha Inicio</Label>
                <Input
                  type="date"
                  value={filters.startDate || ""}
                  onChange={(e) => onFilterChange({ startDate: e.target.value || undefined })}
                />
              </div>
              <div>
                <Label>Fecha Fin</Label>
                <Input
                  type="date"
                  value={filters.endDate || ""}
                  onChange={(e) => onFilterChange({ endDate: e.target.value || undefined })}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Select
          value={filters.limit?.toString() || "20"}
          onValueChange={(value) => onFilterChange({ limit: Number(value) })}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Mostrar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 por página</SelectItem>
            <SelectItem value="20">20 por página</SelectItem>
            <SelectItem value="50">50 por página</SelectItem>
            <SelectItem value="100">100 por página</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onExport}>
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
