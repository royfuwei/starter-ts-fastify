import { ServiceRegistry } from './types';

/**
 * 應用程式服務註冊器
 * 負責註冊應用程式層級的服務
 */
export class AppServiceRegistry implements ServiceRegistry {
  /**
   * 註冊所有應用程式服務
   */
  register(): void {
    this.registerCoreServices();
    this.registerUtilityServices();
    this.registerDomainServices();
  }

  /**
   * 註冊核心服務
   */
  private registerCoreServices(): void {
    // 這裡可以註冊核心服務，例如：
    // - 配置服務
    // - 日誌服務
    // - 快取服務等
    // 範例：註冊配置服務
    // defaultContainer.registerSingleton('ConfigService', ConfigService);
  }

  /**
   * 註冊工具服務
   */
  private registerUtilityServices(): void {
    // 這裡可以註冊工具類服務，例如：
    // - HTTP 客戶端
    // - 加密服務
    // - 驗證服務等
    // 範例：註冊 HTTP 客戶端
    // defaultContainer.registerSingleton('HttpClient', HttpClient);
  }

  /**
   * 註冊領域服務
   */
  private registerDomainServices(): void {
    // 這裡可以註冊領域服務，例如：
    // - 業務邏輯服務
    // - 資料存取服務
    // - 外部 API 服務等
    // 範例：註冊用戶服務
    // defaultContainer.registerSingleton('UserService', UserService);
  }
}

/**
 * 服務註冊器工廠
 */
export class ServiceRegistryFactory {
  private static registries: ServiceRegistry[] = [];

  /**
   * 註冊服務註冊器
   */
  static addRegistry(registry: ServiceRegistry): void {
    this.registries.push(registry);
  }

  /**
   * 執行所有註冊器
   */
  static registerAll(): void {
    this.registries.forEach((registry) => registry.register());
  }

  /**
   * 清除所有註冊器
   */
  static clear(): void {
    this.registries = [];
  }

  /**
   * 取得已註冊的註冊器數量
   */
  static getRegistryCount(): number {
    return this.registries.length;
  }
}

/**
 * 初始化應用程式服務註冊
 */
export function initializeAppServices(): void {
  const appRegistry = new AppServiceRegistry();
  ServiceRegistryFactory.addRegistry(appRegistry);
  ServiceRegistryFactory.registerAll();
}

/**
 * 預設的應用程式服務註冊器實例
 */
export const appServiceRegistry = new AppServiceRegistry();
