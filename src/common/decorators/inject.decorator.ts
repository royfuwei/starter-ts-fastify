/**
 * DI 注入裝飾器
 * 簡化 tsyringe 的注入語法
 */

import { inject as tsyringeInject } from 'tsyringe';

/**
 * 簡化的注入裝飾器
 * @param token 注入的標識符
 */
export function Inject(token: string | symbol) {
  return tsyringeInject(token);
}

/**
 * 可選注入裝飾器
 * @param token 注入的標識符
 */
export function InjectOptional(token: string | symbol) {
  return tsyringeInject(token);
}

// 重新導出 tsyringe 的其他裝飾器
export { injectable, singleton, scoped, Lifecycle } from 'tsyringe';
