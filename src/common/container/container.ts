/**
 * DI 容器初始化和配置
 * 使用 tsyringe 管理依賴注入
 */

import 'reflect-metadata';
import { container, DependencyContainer } from 'tsyringe';
import { TYPES } from './types';

// 導入類型定義
import type { CreateDemoUseCase } from '../../usecases/demo/create-demo.usecase';
import type { GetDemoUseCase } from '../../usecases/demo/get-demo.usecase';
import type { UpdateDemoUseCase } from '../../usecases/demo/update-demo.usecase';
import type { DeleteDemoUseCase } from '../../usecases/demo/delete-demo.usecase';
import type { DemoRepository } from '../../repositories/demo/demo.repository';
import type { DemoService } from '../../services/demo/demo.service';
import type { DemoController } from '../../controllers/demo/demo.controller';
import type { HealthController } from '../../controllers/health/health.controller';

/**
 * 應用程式 DI 容器實例
 */
export class AppContainer {
  private static instance: DependencyContainer;

  /**
   * 取得容器實例
   */
  static getInstance(): DependencyContainer {
    if (!AppContainer.instance) {
      AppContainer.instance = container.createChildContainer();
    }
    return AppContainer.instance;
  }

  /**
   * 初始化容器並註冊所有依賴
   */
  static async initialize(): Promise<void> {
    const containerInstance = AppContainer.getInstance();

    console.log('🔧 Initializing DI Container...');

    // 註冊 Repository 層
    await AppContainer.registerRepositories(containerInstance);

    // 註冊 Service 層
    await AppContainer.registerServices(containerInstance);

    // 註冊 UseCase 層
    await AppContainer.registerUseCases(containerInstance);

    // 註冊 Controller 層
    await AppContainer.registerControllers(containerInstance);

    console.log('✅ DI Container initialized successfully');
  }

  /**
   * 註冊 Repository 層依賴
   */
  private static async registerRepositories(
    container: DependencyContainer,
  ): Promise<void> {
    console.log('📦 Registering Repository dependencies...');

    // 導入並註冊 Repository
    const repoModule = (await import('../../repositories/demo/demo.repository.js')) as {
      DemoRepository: typeof DemoRepository;
    };
    container.registerSingleton(TYPES.DemoRepository, repoModule.DemoRepository);
  }

  /**
   * 註冊 Service 層依賴
   */
  private static async registerServices(container: DependencyContainer): Promise<void> {
    console.log('🔧 Registering Service dependencies...');

    // 導入並註冊 Service
    const serviceModule = (await import('../../services/demo/demo.service.js')) as {
      DemoService: typeof DemoService;
    };
    container.registerSingleton(TYPES.DemoService, serviceModule.DemoService);
  }

  /**
   * 註冊 UseCase 層依賴
   */
  private static async registerUseCases(container: DependencyContainer): Promise<void> {
    console.log('🎯 Registering UseCase dependencies...');

    // 導入並註冊 UseCase
    const [createModule, getModule, updateModule, deleteModule] = (await Promise.all([
      import('../../usecases/demo/create-demo.usecase.js'),
      import('../../usecases/demo/get-demo.usecase.js'),
      import('../../usecases/demo/update-demo.usecase.js'),
      import('../../usecases/demo/delete-demo.usecase.js'),
    ])) as [
      { CreateDemoUseCase: typeof CreateDemoUseCase },
      { GetDemoUseCase: typeof GetDemoUseCase },
      { UpdateDemoUseCase: typeof UpdateDemoUseCase },
      { DeleteDemoUseCase: typeof DeleteDemoUseCase },
    ];

    container.registerSingleton(TYPES.CreateDemoUseCase, createModule.CreateDemoUseCase);
    container.registerSingleton(TYPES.GetDemoUseCase, getModule.GetDemoUseCase);
    container.registerSingleton(TYPES.UpdateDemoUseCase, updateModule.UpdateDemoUseCase);
    container.registerSingleton(TYPES.DeleteDemoUseCase, deleteModule.DeleteDemoUseCase);
  }

  /**
   * 註冊 Controller 層依賴
   */
  private static async registerControllers(
    container: DependencyContainer,
  ): Promise<void> {
    console.log('🎮 Registering Controller dependencies...');

    // 導入並註冊 Controller
    const [demoControllerModule, healthControllerModule] = (await Promise.all([
      import('../../controllers/demo/demo.controller.js'),
      import('../../controllers/health/health.controller.js'),
    ])) as [
      { DemoController: typeof DemoController },
      { HealthController: typeof HealthController },
    ];

    container.registerSingleton('DemoController', demoControllerModule.DemoController);
    container.registerSingleton(
      'HealthController',
      healthControllerModule.HealthController,
    );
  }

  /**
   * 清理容器（用於測試）
   */
  static reset(): void {
    container.clearInstances();
    AppContainer.instance = container.createChildContainer();
  }

  /**
   * 從容器解析依賴
   */
  static resolve<T>(token: string | symbol): T {
    return AppContainer.getInstance().resolve<T>(token);
  }

  /**
   * 註冊單例依賴
   */
  static registerSingleton<T>(
    token: string | symbol,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: { new (..._args: any[]): T },
  ): void {
    AppContainer.getInstance().registerSingleton<T>(token, target);
  }

  /**
   * 註冊瞬時依賴
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static register<T>(token: string | symbol, target: { new (..._args: any[]): T }): void {
    AppContainer.getInstance().register<T>(token, target);
  }
}

// 導出容器實例供其他模組使用
export const appContainer = AppContainer.getInstance();
export { TYPES };
