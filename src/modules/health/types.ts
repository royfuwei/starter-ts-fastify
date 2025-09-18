/**
 * 健康檢查相關類型定義
 */

/**
 * 健康檢查狀態
 */
export type HealthStatus = 'ok' | 'error';

/**
 * 健康檢查資訊介面
 */
export interface HealthInfo {
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
  cpu?: {
    usage: number;
  };
}
