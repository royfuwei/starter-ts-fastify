import 'reflect-metadata';
import { injectable, inject, singleton } from 'tsyringe';
import { ServiceToken } from './types';

/**
 * 標記類別為可注入的服務
 * 這是 tsyringe @injectable 的重新導出
 */
export const Injectable = injectable;

/**
 * 標記類別為單例服務
 * 這是 tsyringe @singleton 的重新導出
 */
export const Singleton = singleton;

/**
 * 注入依賴的裝飾器
 * 這是 tsyringe @inject 的重新導出
 */
export const Inject = inject;

/**
 * 自定義的服務裝飾器，用於標記服務類別
 */
export function Service(token?: ServiceToken): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (constructor: any) {
    // 應用 @injectable 裝飾器
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    injectable()(constructor);

    // 如果提供了 token，可以在這裡進行額外的處理
    if (token) {
      // 將 token 資訊存儲在 metadata 中
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      Reflect.defineMetadata('service:token', token, constructor);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return constructor;
  };
}

/**
 * 自定義的單例服務裝飾器
 */
export function SingletonService(token?: ServiceToken): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (constructor: any) {
    // 應用 @singleton 裝飾器
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    singleton()(constructor);

    // 如果提供了 token，存儲在 metadata 中
    if (token) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      Reflect.defineMetadata('service:token', token, constructor);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      Reflect.defineMetadata('service:lifetime', 'singleton', constructor);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return constructor;
  };
}

/**
 * 取得類別的服務 token
 */
export function getServiceToken(target: object): ServiceToken | undefined {
  return Reflect.getMetadata('service:token', target) as ServiceToken | undefined;
}

/**
 * 取得類別的服務生命週期
 */
export function getServiceLifetime(target: object): string | undefined {
  return Reflect.getMetadata('service:lifetime', target) as string | undefined;
}
