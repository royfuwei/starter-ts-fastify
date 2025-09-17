/**
 * Fastify 應用程式入口點
 * 負責啟動伺服器和處理程序生命週期
 */
import 'reflect-metadata';
import { startServer, shutdownServer } from './server/server';
import { config } from './config/config';
import { AppContainer } from './common/container/container';

const main = async () => {
  console.log(`Starting ${config.name}...`);
  console.log(`Environment: ${config.env}`);
  console.log(`Server will listen on: ${config.server.host}:${config.server.port}`);

  let app;
  try {
    // 初始化 DI 容器
    await AppContainer.initialize();

    // 啟動 Fastify 伺服器
    app = await startServer();

    console.log('🚀 Server started successfully!');
    console.log('📡 Available endpoints:');
    console.log(`   GET  http://${config.server.host}:${config.server.port}/health`);
    console.log(
      `   GET  http://${config.server.host}:${config.server.port}/health/detailed`,
    );
    console.log(
      `   GET  http://${config.server.host}:${config.server.port}/health/ready`,
    );
    console.log(`   GET  http://${config.server.host}:${config.server.port}/health/live`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }

  // 優雅關閉處理器
  const gracefulShutdown = async (signal: string) => {
    console.log(`\n📡 ${signal} received`);

    if (app) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await shutdownServer(app);
    }

    console.log('✅ Application shutdown complete');
    process.exit(0);
  };

  // 錯誤處理器
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorHandler = (error: any) => {
    console.error('❌ Uncaught Exception:', error);

    if (app) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      shutdownServer(app)
        .then(() => process.exit(1))
        .catch(() => process.exit(1));
    } else {
      process.exit(1);
    }
  };

  // 註冊程序事件處理器
  process.on('SIGTERM', () => void gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => void gracefulShutdown('SIGINT'));
  process.on('uncaughtException', errorHandler);
  process.on('unhandledRejection', errorHandler);
};

main().catch(console.error);
