// Audit Log Types

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  TRANSFER = 'TRANSFER',
  REASSIGN = 'REASSIGN',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
  VIEW_SENSITIVE = 'VIEW_SENSITIVE',
  ARCHIVE = 'ARCHIVE',
  RESTORE = 'RESTORE',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
}

export interface AuditLog {
  id: string;
  storeId: string | null;
  store: {
    id: string;
    name: string;
    code: string;
  } | null;
  actor: {
    id: string;
    name: string;
    email: string;
  };
  actorId: string;
  actorRole: UserRole;
  action: AuditAction;
  entity: string;
  entityId: string;
  oldValues: Record<string, any> | null;
  newValues: Record<string, any> | null;
  metadata: Record<string, any> | null;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface AuditLogFilters {
  storeId?: string;
  actorId?: string;
  action?: AuditAction;
  entity?: string;
  entityId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedAuditLogs {
  data: AuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface AuditLogStatistics {
  totalLogs: number;
  actionBreakdown: {
    action: AuditAction;
    count: number;
  }[];
  entityBreakdown: {
    entity: string;
    count: number;
  }[];
  topActors: {
    actorId: string;
    actorName: string;
    count: number;
  }[];
  recentActivity: {
    date: string;
    count: number;
  }[];
}

// Labels and descriptions
export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  [AuditAction.CREATE]: 'Crear',
  [AuditAction.UPDATE]: 'Actualizar',
  [AuditAction.DELETE]: 'Eliminar',
  [AuditAction.TRANSFER]: 'Transferir',
  [AuditAction.REASSIGN]: 'Reasignar',
  [AuditAction.LOGIN]: 'Iniciar Sesión',
  [AuditAction.LOGOUT]: 'Cerrar Sesión',
  [AuditAction.EXPORT]: 'Exportar',
  [AuditAction.VIEW_SENSITIVE]: 'Ver Datos Sensibles',
  [AuditAction.ARCHIVE]: 'Archivar',
  [AuditAction.RESTORE]: 'Restaurar',
};

export const AUDIT_ACTION_COLORS: Record<AuditAction, string> = {
  [AuditAction.CREATE]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  [AuditAction.UPDATE]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  [AuditAction.DELETE]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  [AuditAction.TRANSFER]: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  [AuditAction.REASSIGN]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  [AuditAction.LOGIN]: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  [AuditAction.LOGOUT]: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
  [AuditAction.EXPORT]: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  [AuditAction.VIEW_SENSITIVE]: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  [AuditAction.ARCHIVE]: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  [AuditAction.RESTORE]: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
};

export const ENTITY_LABELS: Record<string, string> = {
  Loan: 'Préstamo',
  User: 'Usuario',
  Vehicle: 'Vehículo',
  Installment: 'Cuota',
  CashRegister: 'Caja',
  Expense: 'Egreso',
  Provider: 'Proveedor',
  Employee: 'Empleado',
  Store: 'Tienda',
  News: 'Novedad',
  Contract: 'Contrato',
  Report: 'Reporte',
};
