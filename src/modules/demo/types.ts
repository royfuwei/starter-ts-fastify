/**
 * 示例模組相關類型定義
 */

/**
 * 示例項目介面
 */
export interface DemoItem {
  id: string;
  title: string;
  description?: string;
  value: unknown;
  tags?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 建立示例項目的請求介面
 */
export interface CreateDemoItemRequest {
  title: string;
  description?: string;
  value: unknown;
  tags?: string[];
}

/**
 * 更新示例項目的請求介面
 */
export interface UpdateDemoItemRequest {
  title?: string;
  description?: string;
  value?: unknown;
  tags?: string[];
  isActive?: boolean;
}
