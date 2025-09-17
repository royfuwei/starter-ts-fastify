/**
 * 服務層裝飾器
 * 為不同層級提供特定的裝飾器
 */

import { injectable, singleton } from 'tsyringe';

/**
 * Service 層裝飾器
 * 標記類別為 Service 並自動註冊為可注入的依賴
 */
export function Service(token?: string | symbol) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (_target: any) {
    // 應用 injectable 裝飾器
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    injectable()(_target);

    // 添加 metadata 標記這是一個 Service
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Reflect.defineMetadata('service:type', 'service', _target);
    if (token) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      Reflect.defineMetadata('service:token', token, _target);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return _target;
  };
}

/**
 * Repository 層裝飾器
 * 標記類別為 Repository 並自動註冊為可注入的依賴
 */
export function Repository(token?: string | symbol) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (_target: any) {
    // 應用 injectable 裝飾器
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    injectable()(_target);

    // 添加 metadata 標記這是一個 Repository
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Reflect.defineMetadata('service:type', 'repository', _target);
    if (token) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      Reflect.defineMetadata('service:token', token, _target);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return _target;
  };
}

/**
 * UseCase 層裝飾器
 * 標記類別為 UseCase 並自動註冊為可注入的依賴
 */
export function UseCase(token?: string | symbol) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (_target: any) {
    // 應用 injectable 裝飾器
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    injectable()(_target);

    // 添加 metadata 標記這是一個 UseCase
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Reflect.defineMetadata('service:type', 'usecase', _target);
    if (token) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      Reflect.defineMetadata('service:token', token, _target);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return _target;
  };
}

/**
 * 單例服務裝飾器
 * 標記類別為單例模式的服務
 */
export function SingletonService(token?: string | symbol) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (_target: any) {
    // 應用 singleton 裝飾器
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    singleton()(_target);

    // 添加 metadata 標記這是一個 SingletonService
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Reflect.defineMetadata('service:type', 'singleton-service', _target);
    if (token) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      Reflect.defineMetadata('service:token', token, _target);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return _target;
  };
}

/**
 * 取得類別的服務類型
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getServiceType(_target: any): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Reflect.getMetadata('service:type', _target) as string | undefined;
}

/**
 * 取得類別的服務標識符
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getServiceToken(_target: any): string | symbol | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Reflect.getMetadata('service:token', _target) as string | symbol | undefined;
}
