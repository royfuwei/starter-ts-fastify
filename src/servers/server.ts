import { FastifyInstance } from 'fastify';
import { initFastifyApp, FastifyAppOptions } from '../fastifyApp';
import { configs } from '../configs';

export interface ServerManager {
  start(): Promise<void>;
  stop(): Promise<void>;
  getServer(): FastifyInstance;
}

export class FastifyServerManager implements ServerManager {
  private app: FastifyInstance | null = null;
  private isStarted = false;

  constructor(private options: FastifyAppOptions = {}) {}

  async start(): Promise<void> {
    if (this.isStarted) {
      throw new Error('Server is already started');
    }

    try {
      // 初始化 Fastify 應用程式
      this.app = await initFastifyApp(this.options);

      // 設定優雅關閉處理
      this.setupGracefulShutdown();

      // 啟動伺服器
      await this.app.listen({
        host: configs.host,
        port: configs.port,
      });

      this.isStarted = true;
      this.app.log.info(`🚀 Server listening at http://${configs.host}:${configs.port}`);
      this.app.log.info(`📝 Environment: ${configs.env}`);
    } catch (err) {
      if (this.app) {
        this.app.log.error(err);
      } else {
        console.error('Failed to start server:', err);
      }
      process.exit(1);
    }
  }

  async stop(): Promise<void> {
    if (!this.app || !this.isStarted) {
      return;
    }

    try {
      this.app.log.info('🛑 Shutting down server...');
      await this.app.close();
      this.isStarted = false;
      this.app.log.info('✅ Server shut down gracefully');
    } catch (err) {
      this.app.log.error('❌ Error during server shutdown:', err);
      throw err;
    }
  }

  getServer(): FastifyInstance {
    if (!this.app) {
      throw new Error('Server not initialized. Call start() first.');
    }
    return this.app;
  }

  private setupGracefulShutdown(): void {
    if (!this.app) return;

    const gracefulShutdown = (signal: string) => {
      this.app?.log.info(`📡 Received ${signal}, starting graceful shutdown...`);
      this.stop()
        .then(() => process.exit(0))
        .catch((err) => {
          this.app?.log.error('Failed to shutdown gracefully:', err);
          process.exit(1);
        });
    };

    // 只在非測試環境中設定 process 監聽器
    if (configs.env !== 'test') {
      // 監聽關閉信號
      process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
      process.on('SIGINT', () => gracefulShutdown('SIGINT'));

      // 處理未捕獲的例外
      process.on('uncaughtException', (err) => {
        this.app?.log.fatal('Uncaught Exception:', err);
        process.exit(1);
      });

      process.on('unhandledRejection', (reason, promise) => {
        this.app?.log.fatal('Unhandled Rejection at:', promise, 'reason:', reason);
        process.exit(1);
      });
    }
  }
}

// 向後相容的函數
export async function server(options: FastifyAppOptions = {}) {
  const serverManager = new FastifyServerManager(options);
  await serverManager.start();
  return {
    fastifyInstance: serverManager.getServer(),
    serverManager,
  };
}
