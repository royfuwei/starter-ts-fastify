/**
 * 基礎 API 回應 DTO
 */
export class ApiResponseDTO<T = unknown> {
  success: boolean;
  status: number;
  data?: T;
  message?: string;
  timestamp: Date;

  constructor(data?: T, message?: string, status: number = 200) {
    this.success = status >= 200 && status < 300;
    this.status = status;
    this.data = data;
    this.message = message;
    this.timestamp = new Date();
  }

  static success<T>(data?: T, message?: string): ApiResponseDTO<T> {
    return new ApiResponseDTO(data, message, 200);
  }

  static error(message: string, status: number = 500): ApiResponseDTO<null> {
    return new ApiResponseDTO<null>(null, message, status);
  }
}

/**
 * 健康檢查 DTO
 */
export class HealthInfoDTO {
  status: 'ok' | 'error';
  timestamp: Date;
  uptime: number;
  version: string;
  environment: string;

  constructor(
    status: 'ok' | 'error',
    uptime: number,
    version: string,
    environment: string,
  ) {
    this.status = status;
    this.timestamp = new Date();
    this.uptime = uptime;
    this.version = version;
    this.environment = environment;
  }
}
