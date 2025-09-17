import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

/**
 * 標準 API 回應格式基底類別
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class BaseApiResponse<T = any> {
  /**
   * 回應是否成功
   */
  @IsBoolean()
  success: boolean;

  /**
   * 回應訊息
   */
  @IsString()
  message: string;

  /**
   * 回應資料
   */
  @IsOptional()
  data?: T;

  /**
   * 時間戳記
   */
  @IsString()
  timestamp: string;

  constructor(success: boolean, message: string, data?: T) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * 成功回應 DTO
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class SuccessApiResponse<T = any> extends BaseApiResponse<T> {
  constructor(data?: T, message: string = 'Success') {
    super(true, message, data);
  }
}

/**
 * 錯誤回應 DTO
 */
export class ErrorApiResponse extends BaseApiResponse<null> {
  /**
   * 錯誤代碼
   */
  @IsOptional()
  @IsString()
  errorCode?: string;

  /**
   * 錯誤詳細資訊
   */
  @IsOptional()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errorDetails?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, errorCode?: string, errorDetails?: any) {
    super(false, message, null);
    this.errorCode = errorCode;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.errorDetails = errorDetails;
  }
}

/**
 * 分頁資訊 DTO
 */
export class PaginationInfo {
  /**
   * 目前頁碼
   */
  @IsNumber()
  page: number;

  /**
   * 每頁筆數
   */
  @IsNumber()
  limit: number;

  /**
   * 總筆數
   */
  @IsNumber()
  total: number;

  /**
   * 總頁數
   */
  @IsNumber()
  totalPages: number;

  /**
   * 是否有下一頁
   */
  @IsBoolean()
  hasNext: boolean;

  /**
   * 是否有上一頁
   */
  @IsBoolean()
  hasPrev: boolean;

  constructor(page: number, limit: number, total: number) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.totalPages = Math.ceil(total / limit);
    this.hasNext = page < this.totalPages;
    this.hasPrev = page > 1;
  }
}

/**
 * 分頁回應 DTO
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class PaginatedApiResponse<T = any> extends BaseApiResponse<T[]> {
  /**
   * 分頁資訊
   */
  pagination: PaginationInfo;

  constructor(
    data: T[],
    page: number,
    limit: number,
    total: number,
    message: string = 'Success',
  ) {
    super(true, message, data);
    this.pagination = new PaginationInfo(page, limit, total);
  }
}

/**
 * 健康檢查回應 DTO
 */
export class HealthCheckResponse {
  /**
   * 服務狀態
   */
  @IsString()
  status: string;

  /**
   * 時間戳記
   */
  @IsString()
  timestamp: string;

  /**
   * 運行時間（秒）
   */
  @IsNumber()
  uptime: number;

  /**
   * 回應訊息
   */
  @IsString()
  message: string;

  constructor(status: string = 'ok', message: string = 'Service is healthy') {
    this.status = status;
    this.timestamp = new Date().toISOString();
    this.uptime = process.uptime();
    this.message = message;
  }
}

/**
 * 詳細健康檢查回應 DTO
 */
export class DetailedHealthCheckResponse extends HealthCheckResponse {
  /**
   * 系統資訊
   */
  system: {
    node_version: string;
    platform: string;
    arch: string;
    memory: {
      rss: string;
      heapTotal: string;
      heapUsed: string;
      external: string;
    };
  };

  constructor(
    status: string = 'ok',
    message: string = 'Service is healthy with detailed information',
  ) {
    super(status, message);
    const memoryUsage = process.memoryUsage();
    this.system = {
      node_version: process.version,
      platform: process.platform,
      arch: process.arch,
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
      },
    };
  }
}

/**
 * 就緒檢查回應 DTO
 */
export class ReadinessCheckResponse {
  /**
   * 服務狀態
   */
  @IsString()
  status: string;

  /**
   * 時間戳記
   */
  @IsString()
  timestamp: string;

  /**
   * 各項檢查結果
   */
  checks: {
    database: string;
    external_services: string;
  };

  constructor() {
    this.status = 'ready';
    this.timestamp = new Date().toISOString();
    this.checks = {
      database: 'ok', // 未來可以實作真正的數據庫檢查
      external_services: 'ok', // 未來可以實作外部服務檢查
    };
  }
}

/**
 * 存活檢查回應 DTO
 */
export class LivenessCheckResponse {
  /**
   * 服務狀態
   */
  @IsString()
  status: string;

  /**
   * 時間戳記
   */
  @IsString()
  timestamp: string;

  constructor() {
    this.status = 'alive';
    this.timestamp = new Date().toISOString();
  }
}
