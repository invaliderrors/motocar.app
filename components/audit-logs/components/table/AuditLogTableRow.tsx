"use client"

import { useState } from "react"
import { TableRow, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, User } from "lucide-react"
import type { AuditLog } from "@/lib/types/audit-log"
import { AUDIT_ACTION_LABELS, AUDIT_ACTION_COLORS, ENTITY_LABELS } from "@/lib/types/audit-log"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { AuditLogDetailDialog } from "../../AuditLogDetailDialog"

interface AuditLogTableRowProps {
  log: AuditLog
  index: number
}

export function AuditLogTableRow({ log, index }: AuditLogTableRowProps) {
  const [detailOpen, setDetailOpen] = useState(false)

  const formattedDate = format(new Date(log.createdAt), "dd MMM yyyy", { locale: es })
  const formattedTime = format(new Date(log.createdAt), "HH:mm:ss", { locale: es })

  const getActionColor = () => {
    const colors: Record<string, string> = {
      CREATE: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800",
      UPDATE: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
      DELETE: "bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800",
      ARCHIVE: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-800",
      RESTORE: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-400 dark:border-purple-800",
      VIEW_SENSITIVE: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800",
      EXPORT: "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-400 dark:border-cyan-800",
      LOGIN: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-400 dark:border-teal-800",
      LOGOUT: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-950 dark:text-slate-400 dark:border-slate-800",
      PERMISSION_CHANGE: "bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-950 dark:text-pink-400 dark:border-pink-800",
      SYSTEM: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400 dark:border-indigo-800",
    }
    return colors[log.action] || "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-400 dark:border-gray-800"
  }

  return (
    <>
      <TableRow className="hover:bg-muted/50 border-b">
        {/* Date/Time */}
        <TableCell className="font-mono text-sm">
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{formattedDate}</span>
            <span className="text-xs text-muted-foreground">{formattedTime}</span>
          </div>
        </TableCell>

        {/* User */}
        <TableCell>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{log.actor.name}</span>
              <span className="text-xs text-muted-foreground">{log.actor.email}</span>
            </div>
          </div>
        </TableCell>

        {/* Action */}
        <TableCell>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getActionColor()}`}>
            {AUDIT_ACTION_LABELS[log.action]}
          </span>
        </TableCell>

        {/* Entity */}
        <TableCell>
          <div className="flex flex-col">
            <span className="font-medium text-sm">
              {ENTITY_LABELS[log.entity] || log.entity}
            </span>
            <span className="text-xs text-muted-foreground font-mono">
              #{log.entityId.substring(0, 8)}...
            </span>
          </div>
        </TableCell>

        {/* Details */}
        <TableCell>
          <div className="flex flex-col gap-1">
            {log.metadata?.description && (
              <span className="text-sm text-muted-foreground truncate max-w-[300px]">{log.metadata.description}</span>
            )}
            {log.ipAddress && (
              <span className="text-xs font-mono text-muted-foreground">
                {log.ipAddress}
              </span>
            )}
          </div>
        </TableCell>

        {/* Actions */}
        <TableCell className="text-right">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDetailOpen(true)}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">Ver detalles</span>
          </Button>
        </TableCell>
      </TableRow>

      <AuditLogDetailDialog
        log={log}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </>
  )
}
