"use client"

import { TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function AuditLogTableHeaders() {
  return (
    <TableHeader>
      <TableRow className="bg-gradient-to-r from-muted/80 via-muted/60 to-muted/80 hover:from-muted hover:via-muted/80 hover:to-muted border-b-2 border-primary/20">
        <TableHead className="w-[180px] font-bold text-foreground">Fecha/Hora</TableHead>
        <TableHead className="w-[200px] font-bold text-foreground">Usuario</TableHead>
        <TableHead className="w-[120px] font-bold text-foreground">Acción</TableHead>
        <TableHead className="w-[150px] font-bold text-foreground">Entidad</TableHead>
        <TableHead className="font-bold text-foreground">Detalles</TableHead>
        <TableHead className="w-[100px] text-right font-bold text-foreground">Ver</TableHead>
      </TableRow>
    </TableHeader>
  )
}
