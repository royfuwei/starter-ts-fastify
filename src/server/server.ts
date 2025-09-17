import 'reflect-metadata';
import { FastifyApp } from './app';
import { HealthController } from '../controllers/health/health.controller';
import { DemoController } from '../controllers/demo/demo.controller';

/**
 * 伺服器啟動函數
 * 負責初始化應用程式並啟動伺服器
 */
export const startServer = async (): Promise<FastifyApp> => {
  // 初始化 Fastify 應用程式
  const app = new FastifyApp({
    controllers: [HealthController, DemoController],
  });

  // 啟動伺服器
  await app.listen();

  return app;
};

/**
 * 優雅地關閉伺服器
 */
export const shutdownServer = async (app: FastifyApp): Promise<void> => {
  console.log('Shutting down server...');
  await app.close();
  console.log('Server shutdown complete');
};
