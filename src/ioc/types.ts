/**
 * 依賴注入相關類型定義
 */

/**
 * DI 容器介面
 */
export interface DIContainer {
  get<T>(token: string | symbol): T;
  resolve<T>(target: new (...args: unknown[]) => T): T;
  register(token: string | symbol, implementation: unknown): void;
  registerSingleton(token: string | symbol, implementation: unknown): void;
}

/**
 * 服務註冊器介面
 */
export interface ServiceRegistry {
  register(): void;
}

/**
 * 服務標識符類型
 */
export type ServiceToken<T = unknown> = string | symbol | (new (...args: unknown[]) => T);

/**
 * 服務生命週期
 */
export enum ServiceLifetime {
  SINGLETON = 'singleton',
  TRANSIENT = 'transient',
  SCOPED = 'scoped',
}
