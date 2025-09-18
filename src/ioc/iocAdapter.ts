import 'reflect-metadata';
import { container, DependencyContainer, InjectionToken } from 'tsyringe';
import { DIContainer, ServiceToken, ServiceLifetime } from './types';

/**
 * tsyringe DI 容器的適配器實作
 */
export class TsyringeAdapter implements DIContainer {
  private readonly _container: DependencyContainer;

  constructor(containerInstance?: DependencyContainer) {
    this._container = containerInstance || container;
  }

  /**
   * 從容器中取得服務實例
   */
  get<T>(token: ServiceToken<T>): T {
    return this._container.resolve(token as InjectionToken<T>);
  }

  /**
   * 解析類別實例
   */
  resolve<T>(target: new (...args: unknown[]) => T): T {
    return this._container.resolve(target);
  }

  /**
   * 註冊服務 (預設為 transient)
   */
  register(token: ServiceToken, implementation: unknown): void {
    this._container.register(token as InjectionToken, {
      useValue: implementation,
    });
  }

  /**
   * 註冊單例服務
   */
  registerSingleton(token: ServiceToken, implementation: unknown): void {
    if (typeof implementation === 'function') {
      this._container.registerSingleton(
        token as InjectionToken,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
        implementation as any,
      );
    } else {
      this._container.register(token as InjectionToken, {
        useValue: implementation,
      });
    }
  }

  /**
   * 註冊服務並指定生命週期
   */
  registerWithLifetime<T>(
    token: ServiceToken<T>,
    implementation: new (...args: unknown[]) => T,
    lifetime: ServiceLifetime,
  ): void {
    switch (lifetime) {
      case ServiceLifetime.SINGLETON:
        this._container.registerSingleton(token as InjectionToken<T>, implementation);
        break;
      case ServiceLifetime.TRANSIENT:
        this._container.register(token as InjectionToken<T>, {
          useClass: implementation,
        });
        break;
      case ServiceLifetime.SCOPED:
        // tsyringe 沒有直接支援 scoped，使用 singleton 作為替代
        this._container.registerSingleton(token as InjectionToken<T>, implementation);
        break;
      default:
        this._container.register(token as InjectionToken<T>, {
          useClass: implementation,
        });
    }
  }

  /**
   * 檢查服務是否已註冊
   */
  isRegistered(token: ServiceToken): boolean {
    try {
      this._container.resolve(token as InjectionToken);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * 清除容器中的所有註冊
   */
  clear(): void {
    this._container.clearInstances();
  }

  /**
   * 建立子容器
   */
  createChildContainer(): TsyringeAdapter {
    const childContainer = this._container.createChildContainer();
    return new TsyringeAdapter(childContainer);
  }

  /**
   * 取得底層的 tsyringe 容器實例
   */
  get nativeContainer(): DependencyContainer {
    return this._container;
  }
}

/**
 * 預設的 DI 容器實例
 */
export const defaultContainer = new TsyringeAdapter();
