import { HealthStatus } from './types';

/**
 * 健康檢查回應 DTO
 */
export class HealthResponseDTO {
  status: HealthStatus;
  timestamp: Date;
  uptime: number;
  version: string;
  environment: string;
  memory?: {
    used: number;
    total: number;
    percentage: number;
  };

  constructor(
    status: HealthStatus,
    uptime: number,
    version: string,
    environment: string,
    memory?: { used: number; total: number; percentage: number },
  ) {
    this.status = status;
    this.timestamp = new Date();
    this.uptime = uptime;
    this.version = version;
    this.environment = environment;
    this.memory = memory;
  }
}
