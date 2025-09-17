import 'reflect-metadata';
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import { DependencyContainer } from 'tsyringe';
import { config } from '../config/config';
import {
  getControllerMetadata,
  getRouteMetadata,
  RouteMetadata,
} from '../common/decorators';
import { registerDefaultSwaggerPlugin } from './plugins/swagger.plugin';
import { AppContainer } from '../common/container/container';

export interface FastifyAppOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  controllers?: any[];
}

/**
 * Fastify 應用程式類別
 * 負責初始化 Fastify 實例、註冊插件和路由
 */
export class FastifyApp {
  private app: FastifyInstance;
  private diContainer: DependencyContainer;

  constructor(options: FastifyAppOptions = {}) {
    this.app = fastify({
      logger: config.server.logger
        ? {
            transport: {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
              },
            },
          }
        : false,
    });

    this.diContainer = AppContainer.getInstance();

    // 不在 constructor 中註冊控制器和插件，改為在 initialize() 方法中處理
    this.controllers = options.controllers || [];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private controllers: any[];

  /**
   * 初始化應用程式（插件和控制器）
   */
  async initialize(): Promise<void> {
    // 首先註冊插件
    await this.initializePlugins();

    // 然後註冊控制器
    if (this.controllers.length > 0) {
      this.registerControllers(this.controllers);
    }
  }

  /**
   * 初始化插件
   */
  private async initializePlugins(): Promise<void> {
    // 註冊 Swagger 插件 (需要在其他插件之前註冊)
    await registerDefaultSwaggerPlugin(this.app);

    // 註冊 CORS
    await this.app.register(cors, {
      origin: true,
    });

    // 註冊 Helmet 安全插件
    await this.app.register(helmet);
  }

  /**
   * 註冊控制器
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private registerControllers(controllers: any[]): void {
    controllers.forEach((ControllerClass) => {
      this.registerController(ControllerClass);
    });
  }

  /**
   * 註冊單個控制器
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private registerController(ControllerClass: any): void {
    const controllerMetadata = getControllerMetadata(ControllerClass);
    const routes = getRouteMetadata(ControllerClass);

    if (!controllerMetadata) {
      this.app.log.warn(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Controller ${ControllerClass.name} is missing @Controller decorator`,
      );
      return;
    }

    // 從 DI 容器取得控制器實例
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let controllerInstance: any;
    try {
      // 嘗試從容器解析控制器，如果失敗則創建新實例
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
        controllerInstance = this.diContainer.resolve(ControllerClass);
      } catch {
        // 如果容器中沒有註冊，則手動創建實例並註冊
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        controllerInstance = new ControllerClass(
          // 手動解析依賴
          ...this.resolveDependencies(ControllerClass),
        );
      }
    } catch (error) {
      this.app.log.error(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        `Failed to resolve controller ${ControllerClass.name}: ${String(error)}`,
      );
      return;
    }

    // 註冊路由
    routes.forEach((route: RouteMetadata) => {
      const fullPath = this.buildFullPath(controllerMetadata.path, route.path);
      const handler = this.createRouteHandler(controllerInstance, route.propertyKey);

      // 根據 HTTP 方法註冊路由
      switch (route.method.toUpperCase()) {
        case 'GET':
          this.app.get(fullPath, handler);
          break;
        case 'POST':
          this.app.post(fullPath, handler);
          break;
        case 'PUT':
          this.app.put(fullPath, handler);
          break;
        case 'DELETE':
          this.app.delete(fullPath, handler);
          break;
        case 'PATCH':
          this.app.patch(fullPath, handler);
          break;
        default:
          this.app.log.warn(`Unsupported HTTP method: ${route.method}`);
      }

      this.app.log.info(`Registered route: ${route.method} ${fullPath}`);
    });
  }

  /**
   * 建立完整路由路徑
   */
  private buildFullPath(basePath: string, routePath: string): string {
    const cleanBasePath = basePath.startsWith('/') ? basePath : `/${basePath}`;
    const cleanRoutePath = routePath.startsWith('/') ? routePath : `/${routePath}`;

    if (routePath === '') {
      return cleanBasePath === '/' ? '/' : cleanBasePath;
    }

    return (cleanBasePath + cleanRoutePath).replace(/\/+/g, '/');
  }

  /**
   * 建立路由處理器
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private createRouteHandler(controllerInstance: any, methodName: string) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const result = await controllerInstance[methodName](request, reply);

        if (result !== undefined && !reply.sent) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return result;
        }
      } catch (error) {
        this.app.log.error(`Route handler error: ${String(error)}`);

        if (!reply.sent) {
          return reply.status(500).send({
            error: 'Internal Server Error',
            message: 'An unexpected error occurred',
          });
        }
      }
    };
  }

  /**
   * 解析控制器的依賴項（fallback 方法）
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-explicit-any
  private resolveDependencies(ControllerClass: any): any[] {
    // 這是一個 fallback 方法，當 DI 容器無法解析控制器時使用
    // 在正常情況下，所有控制器都應該已經在容器中註冊
    this.app.log.warn(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      `Using fallback dependency resolution for ${ControllerClass.name}. ` +
        `Consider registering this controller in the DI container.`,
    );

    // 返回空陣列，因為我們期望所有控制器都已在容器中註冊
    // 如果需要手動依賴解析，可以在這裡實現
    return [];
  }

  /**
   * 取得 Fastify 實例
   */
  getInstance(): FastifyInstance {
    return this.app;
  }

  /**
   * 啟動伺服器
   */
  async listen(): Promise<void> {
    try {
      // 在啟動之前先初始化
      await this.initialize();

      await this.app.listen({
        port: config.server.port,
        host: config.server.host,
      });

      this.app.log.info(
        `Server is running on http://${config.server.host}:${config.server.port}`,
      );
    } catch (error) {
      this.app.log.error(`Failed to start server: ${String(error)}`);
      process.exit(1);
    }
  }

  /**
   * 關閉伺服器
   */
  async close(): Promise<void> {
    await this.app.close();
  }
}
