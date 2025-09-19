import Fastify, {
  FastifyInstance,
  FastifyServerOptions,
  FastifyRequest,
  FastifyReply,
} from 'fastify';
import { configs } from './configs';

export interface Controller {
  register: (app: FastifyInstance) => Promise<void>;
}

export interface Middleware {
  (request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

export interface FastifyAppOptions {
  controllers?: Controller[];
  middlewares?: Middleware[];
  isApiDocEnabled?: boolean;
}

export interface FastifyAppInitializer {
  initFastifyApp(options?: FastifyAppOptions): Promise<FastifyInstance>;
}

/**
 * 初始化 Fastify 應用程式實例
 * @param options 應用程式選項
 * @returns Fastify 實例
 */
export async function initFastifyApp(
  options: FastifyAppOptions = {},
): Promise<FastifyInstance> {
  const { controllers = [], middlewares = [], isApiDocEnabled = true } = options;

  // Fastify 伺服器選項
  const fastifyOptions: FastifyServerOptions = {
    logger: {
      level: configs.env === 'production' ? 'info' : 'debug',
      transport:
        configs.env !== 'production'
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
              },
            }
          : undefined,
    },
  };

  // 建立 Fastify 實例
  const app = Fastify(fastifyOptions);

  // 註冊基本插件
  await registerBasicPlugins(app);

  // 註冊中介軟體
  registerMiddlewares(app, middlewares);

  // 註冊控制器
  await registerControllers(app, controllers);

  // 註冊 API 文件（如果啟用）
  if (isApiDocEnabled) {
    registerApiDocs(app);
  }

  return app;
}

/**
 * 註冊基本插件
 */
async function registerBasicPlugins(app: FastifyInstance): Promise<void> {
  // 註冊 CORS 插件
  await app.register(import('@fastify/cors'), {
    origin: (origin, callback) => {
      // 在開發環境或測試環境允許所有來源
      if (
        configs.env === 'development' ||
        configs.env === 'local' ||
        configs.env === 'test'
      ) {
        callback(null, true);
        return;
      }

      // 生產環境的 CORS 設定
      const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
  });

  // 註冊 multipart 支援（用於檔案上傳）
  await app.register(import('@fastify/multipart'), {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  });

  // 註冊 formbody 支援
  await app.register(import('@fastify/formbody'));

  // 註冊 sensible 插件（提供有用的工具和裝飾器）
  await app.register(import('@fastify/sensible'));
}

/**
 * 註冊中介軟體
 */
function registerMiddlewares(app: FastifyInstance, middlewares: Middleware[]): void {
  // 添加請求 ID
  app.addHook('onRequest', (request, reply, done) => {
    request.id = request.id || generateRequestId();
    done();
  });

  // 添加回應時間記錄
  app.addHook('onRequest', (request, reply, done) => {
    request.startTime = Date.now();
    done();
  });

  app.addHook('onSend', (request, reply, payload, done) => {
    const responseTime = Date.now() - (request.startTime || Date.now());
    reply.header('X-Response-Time', `${responseTime}ms`);
    done(null, payload);
  });

  // 註冊自定義中介軟體
  for (const middleware of middlewares) {
    if (typeof middleware === 'function') {
      app.addHook('preHandler', middleware);
    }
  }
}

/**
 * 註冊控制器
 */
async function registerControllers(
  app: FastifyInstance,
  controllers: Controller[],
): Promise<void> {
  // 基本健康檢查路由
  app.get('/health', () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: configs.version,
      environment: configs.env,
    };
  });

  // 註冊自定義控制器
  for (const controller of controllers) {
    if (controller && typeof controller.register === 'function') {
      await controller.register(app);
    }
  }
}

/**
 * 註冊 API 文件
 */
function registerApiDocs(app: FastifyInstance): void {
  // 這裡先預留位置，後續會在 OpenAPI 任務中實作
  app.log.info('API documentation will be implemented in OpenAPI task');
}

/**
 * 生成請求 ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// 擴展 FastifyRequest 類型以包含自定義屬性
declare module 'fastify' {
  interface FastifyRequest {
    startTime?: number;
  }
}
