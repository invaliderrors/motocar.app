"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { User, Calendar, MapPin, Monitor, FileText, ArrowRight } from "lucide-react"
import type { AuditLog } from "@/lib/types/audit-log"
import { AUDIT_ACTION_LABELS, AUDIT_ACTION_COLORS, ENTITY_LABELS } from "@/lib/types/audit-log"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface AuditLogDetailDialogProps {
  log: AuditLog
  open: boolean
  onClose: () => void
}

export function AuditLogDetailDialog({ log, open, onClose }: AuditLogDetailDialogProps) {
  const formattedDate = format(new Date(log.createdAt), "dd 'de' MMMM yyyy, HH:mm:ss", {
    locale: es,
  })

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "N/A"
    if (typeof value === "boolean") return value ? "Sí" : "No"
    if (typeof value === "object") return JSON.stringify(value, null, 2)
    if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
      try {
        return format(new Date(value), "dd 'de' MMMM yyyy, HH:mm", { locale: es })
      } catch {
        return value
      }
    }
    return String(value)
  }

  const renderEntityData = () => {
    // Get entity data based on action type
    const entityData = log.action === "DELETE" ? log.oldValues : log.newValues
    
    if (!entityData || typeof entityData !== "object") return null

    // Filter out system fields and null values
    const filteredData = Object.entries(entityData).filter(([key, value]) => {
      const systemFields = ["id", "createdAt", "updatedAt", "deletedAt", "password", "passwordHash"]
      return !systemFields.includes(key) && value !== null && value !== undefined
    })

    if (filteredData.length === 0) return null

    return (
      <div className="mt-4 pt-4 border-t">
        <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
          Datos de la Entidad
        </h4>
        <div className="space-y-2">
          {filteredData.map(([key, value]) => (
            <div key={key} className="flex items-start justify-between p-2 rounded bg-muted/30">
              <span className="text-xs text-muted-foreground capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </span>
              <span className="text-xs font-medium text-right max-w-[60%] break-words">
                {formatValue(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const getActionColor = () => {
    const colors: Record<string, string> = {
      CREATE: "bg-emerald-100 text-emerald-700 border-emerald-200",
      UPDATE: "bg-blue-100 text-blue-700 border-blue-200",
      DELETE: "bg-red-100 text-red-700 border-red-200",
      ARCHIVE: "bg-orange-100 text-orange-700 border-orange-200",
      RESTORE: "bg-purple-100 text-purple-700 border-purple-200",
      VIEW_SENSITIVE: "bg-yellow-100 text-yellow-700 border-yellow-200",
      EXPORT: "bg-cyan-100 text-cyan-700 border-cyan-200",
      LOGIN: "bg-teal-100 text-teal-700 border-teal-200",
      LOGOUT: "bg-slate-100 text-slate-700 border-slate-200",
      PERMISSION_CHANGE: "bg-pink-100 text-pink-700 border-pink-200",
      SYSTEM: "bg-indigo-100 text-indigo-700 border-indigo-200",
    }
    return colors[log.action] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  const renderJsonDiff = () => {
    if (!log.oldValues && !log.newValues) {
      return <p className="text-sm text-muted-foreground">No hay cambios registrados</p>
    }

    if (log.oldValues && log.newValues) {
      // Show diff for updates
      const changedFields = Object.keys(log.newValues).filter(
        (key) => JSON.stringify(log.oldValues?.[key]) !== JSON.stringify(log.newValues?.[key])
      )

      if (changedFields.length === 0) {
        return <p className="text-sm text-muted-foreground">Sin cambios detectados</p>
      }

      return (
        <div className="space-y-4">
          {changedFields.map((field) => (
            <div key={field} className="p-4 rounded-xl border bg-gradient-to-r from-muted/30 to-muted/10 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">•</span>
                </div>
                <p className="text-sm font-bold text-foreground">{field}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 p-3 rounded-lg bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border-2 border-red-200 dark:border-red-800 shadow-sm">
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">Antes</p>
                  <p className="text-sm text-red-700 dark:text-red-300 font-mono break-all">
                    {JSON.stringify(log.oldValues?.[field])}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-2 border-green-200 dark:border-green-800 shadow-sm">
                  <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">Después</p>
                  <p className="text-sm text-green-700 dark:text-green-300 font-mono break-all">
                    {JSON.stringify(log.newValues?.[field])}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    // Show new values for creation
    if (log.newValues) {
      return (
        <div className="space-y-2">
          {Object.entries(log.newValues).map(([key, value]) => (
            <div
              key={key}
              className="flex items-start gap-2 p-2 rounded bg-muted/50 text-sm"
            >
              <span className="font-medium min-w-[120px]">{key}:</span>
              <span className="text-muted-foreground font-mono text-xs">
                {JSON.stringify(value)}
              </span>
            </div>
          ))}
        </div>
      )
    }

    // Show old values for deletion
    if (log.oldValues) {
      return (
        <div className="space-y-2">
          {Object.entries(log.oldValues).map(([key, value]) => (
            <div
              key={key}
              className="flex items-start gap-2 p-2 rounded bg-red-50 dark:bg-red-900/20 text-sm"
            >
              <span className="font-medium min-w-[120px]">{key}:</span>
              <span className="text-muted-foreground font-mono text-xs">
                {JSON.stringify(value)}
              </span>
            </div>
          ))}
        </div>
      )
    }

    return null
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalles del Registro
          </DialogTitle>
          <DialogDescription>
            Información completa de la acción realizada
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <div className="space-y-4">
            {/* Header Info */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getActionColor()}`}>
                {AUDIT_ACTION_LABELS[log.action]}
              </span>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </div>
            </div>

            <Separator />

            {/* Entity Info */}
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Entidad Afectada
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <span className="text-xs text-muted-foreground">Tipo</span>
                  <span className="font-semibold">{ENTITY_LABELS[log.entity] || log.entity}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <span className="text-xs text-muted-foreground">ID</span>
                  <span className="font-mono text-xs">{log.entityId}</span>
                </div>
                {log.metadata?.method && (
                  <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-xs text-muted-foreground">Método</span>
                    <span className="font-mono text-xs">{log.metadata.method}</span>
                  </div>
                )}
                {log.metadata?.url && (
                  <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-xs text-muted-foreground">Endpoint</span>
                    <span className="font-mono text-xs truncate max-w-[300px]">{log.metadata.url}</span>
                  </div>
                )}
              </div>

              {/* Entity Data */}
              {renderEntityData()}
            </div>

            <Separator />

            {/* Actor Info */}
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Usuario
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <span className="text-xs text-muted-foreground">Nombre</span>
                  <span className="font-semibold">{log.actor.name}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <span className="text-xs text-muted-foreground">Email</span>
                  <span className="text-sm">{log.actor.email}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                  <span className="text-xs text-muted-foreground">Rol</span>
                  <Badge variant="outline" className="text-xs">{log.actorRole}</Badge>
                </div>
                {log.store && (
                  <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-xs text-muted-foreground">Tienda</span>
                    <span className="text-sm">{log.store.name} ({log.store.code})</span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Technical Info */}
            <div className="rounded-lg border p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                Información Técnica
              </h3>
              <div className="space-y-2">
                {log.ipAddress && (
                  <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      IP
                    </span>
                    <span className="font-mono text-xs">{log.ipAddress}</span>
                  </div>
                )}
                {log.userAgent && (
                  <div className="p-2 rounded bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1">User Agent</p>
                    <span className="font-mono text-xs break-all text-muted-foreground">{log.userAgent}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Changes */}
            {(log.oldValues || log.newValues) && (
              <>
                <Separator />
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <ArrowRight className="h-4 w-4" />
                    Cambios
                  </h3>
                  {renderJsonDiff()}
                </div>
              </>
            )}

            {/* Metadata */}
            {log.metadata && Object.keys(log.metadata).length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm">Metadatos Adicionales</h3>
                  <div className="p-3 rounded-lg bg-muted/50 font-mono text-xs">
                    <pre>{JSON.stringify(log.metadata, null, 2)}</pre>
                  </div>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
