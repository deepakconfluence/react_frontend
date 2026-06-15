export interface AuditLogEntry {
  id: string;
  userName: string;
  serviceName: string;
  methodName: string;
  executionTime: string;
  executionDuration: number;
  clientIpAddress?: string;
  exception?: string;
}
