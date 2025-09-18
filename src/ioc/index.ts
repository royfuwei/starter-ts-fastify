/**
 * IoC (Inversion of Control) 模組的主要匯出檔案
 */

// 類型定義
export * from './types';

// DI 容器適配器
export * from './iocAdapter';

// 服務註冊器
export * from './ioc.register.app';

// 裝飾器
export * from './decorators';

// 工具函數
export * from './utils';

// 重新匯出 tsyringe 的常用功能
export { container, delay, inject, injectable, singleton } from 'tsyringe';
export type { DependencyContainer, InjectionToken } from 'tsyringe';
