// Permission system types matching backend

export enum Resource {
  CLOSING = 'CLOSING',
  INSTALLMENT = 'INSTALLMENT',
  VEHICLE = 'VEHICLE',
  USER = 'USER',
  LOAN = 'LOAN',
  EXPENSE = 'EXPENSE',
  OWNER = 'OWNER',
  PROVIDER = 'PROVIDER',
  CASH_FLOW = 'CASH_FLOW',
  REPORT = 'REPORT',
  DASHBOARD = 'DASHBOARD',
  CONTRACT = 'CONTRACT',
  RECEIPT = 'RECEIPT',
}

export enum Action {
  VIEW = 'VIEW',
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  APPROVE = 'APPROVE',
  EXPORT = 'EXPORT',
  MANAGE = 'MANAGE',
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
  [Resource.INSTALLMENT]: 'Cuotas',
  [Resource.VEHICLE]: 'Vehículos',
  [Resource.USER]: 'Usuarios',
  [Resource.LOAN]: 'contratos',
  [Resource.EXPENSE]: 'Egresos',
  [Resource.OWNER]: 'Administradores',
  [Resource.PROVIDER]: 'Proveedores',
  [Resource.CASH_FLOW]: 'Flujo de Caja',
  [Resource.REPORT]: 'Reportes',
  [Resource.DASHBOARD]: 'Dashboard',
  [Resource.CONTRACT]: 'Contratos',
  [Resource.RECEIPT]: 'Recibos',
};

export const ACTION_LABELS: Record<Action, string> = {
  [Action.VIEW]: 'Ver',
  [Action.CREATE]: 'Crear',
  [Action.EDIT]: 'Editar',
  [Action.DELETE]: 'Eliminar',
  [Action.APPROVE]: 'Aprobar',
  [Action.EXPORT]: 'Exportar',
  [Action.MANAGE]: 'Administrar',
};

export const ACTION_DESCRIPTIONS: Record<Action, string> = {
  [Action.VIEW]: 'Puede ver y consultar',
  [Action.CREATE]: 'Puede crear nuevos',
  [Action.EDIT]: 'Puede editar existentes',
  [Action.DELETE]: 'Puede eliminar',
  [Action.APPROVE]: 'Puede aprobar',
  [Action.EXPORT]: 'Puede exportar datos',
  [Action.MANAGE]: 'Control total',
};
