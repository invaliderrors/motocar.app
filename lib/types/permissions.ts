// Permission system types matching backend

export enum Resource {
  CLOSING = 'CLOSING',           // Cierre de caja
  DASHBOARD = 'DASHBOARD',       // Dashboard
  EXPENSE = 'EXPENSE',           // Egresos
  INSTALLMENT = 'INSTALLMENT',   // Cuotas
  CONTRACT = 'CONTRACT',         // Contratos
  NEWS = 'NEWS',                 // Novedades
  PROVIDER = 'PROVIDER',         // Proveedores
  REPORT = 'REPORT',             // Reportes
}

export enum Action {
  VIEW = 'VIEW',     // For read-only modules like Dashboard and Reports
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
}

export type PermissionsMap = {
  [key in Resource]?: Action[];
};

export interface PermissionCheck {
  resource: Resource;
  action: Action;
}

// Labels for display
export const RESOURCE_LABELS: Record<Resource, string> = {
  [Resource.CLOSING]: 'Cierre de Caja',
  [Resource.DASHBOARD]: 'Dashboard',
  [Resource.EXPENSE]: 'Egresos',
  [Resource.INSTALLMENT]: 'Cuotas',
  [Resource.CONTRACT]: 'Contratos',
  [Resource.NEWS]: 'Novedades',
  [Resource.PROVIDER]: 'Proveedores',
  [Resource.REPORT]: 'Reportes',
};

export const ACTION_LABELS: Record<Action, string> = {
  [Action.VIEW]: 'Ver',
  [Action.CREATE]: 'Crear',
  [Action.EDIT]: 'Editar',
  [Action.DELETE]: 'Eliminar',
};

export const ACTION_DESCRIPTIONS: Record<Action, string> = {
  [Action.VIEW]: 'Puede ver y consultar (solo lectura)',
  [Action.CREATE]: 'Puede crear nuevos registros',
  [Action.EDIT]: 'Puede editar registros existentes',
  [Action.DELETE]: 'Puede eliminar registros',
};
