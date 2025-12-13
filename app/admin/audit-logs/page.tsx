"use client"

import { FileSearch, ShieldCheck } from "lucide-react"
import { AuditLogTable } from "@/components/audit-logs/AuditLogTable"

export default function AuditLogsPage() {
  return (
    <div className="flex-1 w-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <FileSearch className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Registros de Auditoría</h1>
            <p className="text-muted-foreground mt-1">
              Historial completo de acciones realizadas en el sistema
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="h-4 w-4" />
          <span>Seguridad y Trazabilidad</span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="px-6 py-4 border-b">
        <div className="rounded-lg border bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 p-4">
          <div className="flex items-start gap-3">
            <FileSearch className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 text-sm">
                Sistema de Auditoría Activo
              </h3>
              <p className="text-xs text-blue-700 dark:text-blue-400">
                Todas las acciones importantes se registran automáticamente. Los registros incluyen quién realizó la acción, 
                cuándo, qué cambió y desde qué dispositivo. Esta información es inmutable y sirve para trazabilidad y cumplimiento.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-auto p-4 md:p-6 bg-gradient-to-br from-background via-background to-muted/20">
        <AuditLogTable />
      </div>
    </div>
  )
}
