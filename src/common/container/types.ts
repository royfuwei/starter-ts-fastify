/**
 * DI 容器類型定義
 * 定義應用程式中的依賴注入標識符
 */

// Service 層依賴標識符
export const SERVICE_TYPES = {
  DemoService: Symbol.for('DemoService'),
} as const;

// Repository 層依賴標識符
export const REPOSITORY_TYPES = {
  DemoRepository: Symbol.for('DemoRepository'),
} as const;

// UseCase 層依賴標識符
export const USECASE_TYPES = {
  CreateDemoUseCase: Symbol.for('CreateDemoUseCase'),
  GetDemoUseCase: Symbol.for('GetDemoUseCase'),
  UpdateDemoUseCase: Symbol.for('UpdateDemoUseCase'),
  DeleteDemoUseCase: Symbol.for('DeleteDemoUseCase'),
} as const;

// 所有類型的聯合
export const TYPES = {
  ...SERVICE_TYPES,
  ...REPOSITORY_TYPES,
  ...USECASE_TYPES,
} as const;

// 型別導出
export type ServiceTypes = typeof SERVICE_TYPES;
export type RepositoryTypes = typeof REPOSITORY_TYPES;
export type UseCaseTypes = typeof USECASE_TYPES;
export type AllTypes = typeof TYPES;
