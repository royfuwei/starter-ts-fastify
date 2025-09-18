/**
 * API 回應的基礎介面
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  status: number;
  data?: T;
  message?: string;
  timestamp: Date;
}

/**
 * API 錯誤回應介面
 */
export interface ApiErrorResponse {
  success: false;
  status: number;
  errorCode?: string;
  message: string;
  description?: string;
  method: string;
  path: string;
  timestamp: Date;
}

/**
 * 分頁查詢參數
 */
export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

/**
 * 分頁回應資料
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
