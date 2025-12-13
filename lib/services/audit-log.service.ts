import { HttpService } from '../http';
import type {
  AuditLog,
  AuditLogFilters,
  PaginatedAuditLogs,
  AuditLogStatistics,
} from '../types/audit-log';

export class AuditLogService {
  private static readonly BASE_URL = '/api/v1/audit-logs';

  /**
   * Get all audit logs with filters and pagination
   */
  static async getAll(filters: AuditLogFilters = {}): Promise<PaginatedAuditLogs> {
    const response = await HttpService.get<PaginatedAuditLogs>(this.BASE_URL, {
      params: filters,
    });
    return response.data;
  }

  /**
   * Get a single audit log by ID
   */
  static async getById(id: string): Promise<AuditLog> {
    const response = await HttpService.get<AuditLog>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  /**
   * Get audit logs for a specific entity
   */
  static async getByEntity(entity: string, entityId: string): Promise<AuditLog[]> {
    const response = await HttpService.get<AuditLog[]>(
      `${this.BASE_URL}/entity/${entity}/${entityId}`
    );
    return response.data;
  }

  /**
   * Get audit logs by actor (employee)
   */
  static async getByActor(actorId: string): Promise<AuditLog[]> {
    const response = await HttpService.get<AuditLog[]>(
      `${this.BASE_URL}/actor/${actorId}`
    );
    return response.data;
  }

  /**
   * Get statistics
   */
  static async getStatistics(filters?: {
    storeId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<AuditLogStatistics> {
    const response = await HttpService.get<AuditLogStatistics>(
      `${this.BASE_URL}/statistics`,
      { params: filters }
    );
    return response.data;
  }
}
