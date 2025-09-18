/**
 * 應用程式模組相關類型定義
 */

/**
 * 應用程式資訊介面
 */
export interface AppInfo {
  name: string;
  version: string;
  description: string;
  environment: string;
  startTime: Date;
}

/**
 * 示例資料介面
 */
export interface DemoData {
  id: string;
  name: string;
  value: unknown;
  createdAt: Date;
  updatedAt: Date;
}
