import { defaultContainer } from './iocAdapter';
import { ServiceToken, ServiceLifetime } from './types';

/**
 * DI 相關的工具函數
 */

/**
 * 快速註冊服務的工具函數
 */
export function registerService<T>(
  token: ServiceToken<T>,
  implementation: new (...args: unknown[]) => T,
  lifetime: ServiceLifetime = ServiceLifetime.TRANSIENT,
): void {
  defaultContainer.registerWithLifetime(token, implementation, lifetime);
}

/**
 * 快速註冊單例服務的工具函數
 */
export function registerSingleton<T>(
  token: ServiceToken<T>,
  implementation: new (...args: unknown[]) => T,
): void {
  defaultContainer.registerSingleton(token, implementation);
}

/**
 * 快速註冊值的工具函數
 */
export function registerValue<T>(token: ServiceToken<T>, value: T): void {
  defaultContainer.register(token, value);
}

/**
 * 快速解析服務的工具函數
 */
export function resolve<T>(token: ServiceToken<T>): T {
  return defaultContainer.get<T>(token);
}

/**
 * 檢查服務是否已註冊
 */
export function isRegistered<T>(token: ServiceToken<T>): boolean {
  return defaultContainer.isRegistered(token);
}

/**
 * 建立服務 token 的工具函數
 */
export function createToken(description: string): symbol {
  return Symbol(description);
}

/**
 * 服務 token 常數
 */
export const TOKENS = {
  // 核心服務 tokens
  CONFIG_SERVICE: createToken('ConfigService'),
  LOGGER_SERVICE: createToken('LoggerService'),
  CACHE_SERVICE: createToken('CacheService'),

  // HTTP 相關 tokens
  HTTP_CLIENT: createToken('HttpClient'),

  // 資料庫相關 tokens
  DATABASE_CONNECTION: createToken('DatabaseConnection'),

  // 業務服務 tokens
  USER_SERVICE: createToken('UserService'),
  AUTH_SERVICE: createToken('AuthService'),
} as const;

/**
 * 批量註冊服務的工具函數
 */
export function registerServices(
  services: Array<{
    token: ServiceToken;
    implementation: new (...args: unknown[]) => unknown;
    lifetime?: ServiceLifetime;
  }>,
): void {
  services.forEach(({ token, implementation, lifetime = ServiceLifetime.TRANSIENT }) => {
    registerService(token, implementation, lifetime);
  });
}

/**
 * 清除所有服務註冊
 */
export function clearContainer(): void {
  defaultContainer.clear();
}

/**
 * 建立測試用的隔離容器
 */
export function createTestContainer() {
  return defaultContainer.createChildContainer();
}
