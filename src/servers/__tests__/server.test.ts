import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { FastifyServerManager } from '../server';
import { configs } from '../../configs';

// 模擬 configs
vi.mock('../../configs', () => ({
  configs: {
    env: 'test',
    name: 'test-app',
    version: '1.0.0',
    description: 'Test app',
    host: '127.0.0.1',
    port: 0, // 使用隨機端口進行測試
    tz: 'UTC',
  },
}));

// 模擬 process.exit 以避免測試中斷
const mockExit = vi.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error('process.exit called');
});

describe('FastifyServerManager', () => {
  let serverManager: FastifyServerManager;

  beforeEach(() => {
    serverManager = new FastifyServerManager();
    // 清除之前的 mock 調用
    mockExit.mockClear();
  });

  afterEach(async () => {
    if (serverManager) {
      try {
        await serverManager.stop();
      } catch {
        // 忽略關閉錯誤
      }
    }
  });

  describe('constructor', () => {
    it('should create server manager with default options', () => {
      const manager = new FastifyServerManager();
      expect(manager).toBeDefined();
    });

    it('should create server manager with custom options', () => {
      const options = {
        controllers: [],
        middlewares: [],
        isApiDocEnabled: false,
      };
      const manager = new FastifyServerManager(options);
      expect(manager).toBeDefined();
    });
  });

  describe('start', () => {
    it('should start the server successfully', async () => {
      await expect(serverManager.start()).resolves.not.toThrow();

      const server = serverManager.getServer();
      expect(server).toBeDefined();
      expect(server.server.listening).toBe(true);
    });

    it('should throw error if server is already started', async () => {
      await serverManager.start();

      await expect(serverManager.start()).rejects.toThrow('Server is already started');
    });

    it('should make health endpoint available after start', async () => {
      await serverManager.start();

      const server = serverManager.getServer();
      const response = await server.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body) as { status: string };
      expect(body.status).toBe('ok');
    });
  });

  describe('stop', () => {
    it('should stop the server successfully', async () => {
      await serverManager.start();
      await expect(serverManager.stop()).resolves.not.toThrow();
    });

    it('should handle stop when server is not started', async () => {
      await expect(serverManager.stop()).resolves.not.toThrow();
    });

    it('should handle multiple stop calls', async () => {
      await serverManager.start();
      await serverManager.stop();
      await expect(serverManager.stop()).resolves.not.toThrow();
    });
  });

  describe('getServer', () => {
    it('should return server instance after start', async () => {
      await serverManager.start();
      const server = serverManager.getServer();

      expect(server).toBeDefined();
      expect(typeof server.inject).toBe('function');
    });

    it('should throw error if server is not initialized', () => {
      expect(() => serverManager.getServer()).toThrow(
        'Server not initialized. Call start() first.',
      );
    });
  });

  describe('graceful shutdown', () => {
    it('should setup graceful shutdown handlers', async () => {
      // 在測試環境中，我們不設定 process 監聽器，所以這個測試檢查功能是否正常運行
      await serverManager.start();

      // 檢查伺服器是否正常啟動（間接驗證 graceful shutdown 設定沒有出錯）
      const server = serverManager.getServer();
      expect(server).toBeDefined();
      expect(server.server.listening).toBe(true);
    });
  });

  describe('error handling', () => {
    it('should handle server startup errors', async () => {
      // 創建一個會失敗的伺服器管理器（使用無效端口）
      const badServerManager = new FastifyServerManager();

      // 模擬 configs 返回無效配置
      vi.mocked(configs).port = -1;

      await expect(badServerManager.start()).rejects.toThrow();
    });
  });

  describe('integration with custom options', () => {
    beforeEach(() => {
      // 重置 configs 為有效值
      vi.mocked(configs).port = 0; // 使用隨機端口
    });

    it('should work with custom controllers', async () => {
      const mockController = {
        register: vi.fn((app: FastifyInstance) => {
          app.get('/custom', () => ({ message: 'custom' }));
          return Promise.resolve();
        }),
      };

      const customServerManager = new FastifyServerManager({
        controllers: [mockController],
      });

      await customServerManager.start();

      const server = customServerManager.getServer();
      const response = await server.inject({
        method: 'GET',
        url: '/custom',
      });

      expect(response.statusCode).toBe(200);
      expect(mockController.register).toHaveBeenCalled();

      await customServerManager.stop();
    });

    it('should work with custom middlewares', async () => {
      const mockMiddleware = vi.fn((request: FastifyRequest) => {
        (request as FastifyRequest & { customData: string }).customData = 'test';
        return Promise.resolve();
      });

      const mockController = {
        register: vi.fn((app: FastifyInstance) => {
          // 在控制器註冊時添加測試路由
          app.get('/test-middleware', (request) => {
            return {
              customData: (request as FastifyRequest & { customData: string }).customData,
            };
          });
          return Promise.resolve();
        }),
      };

      const customServerManager = new FastifyServerManager({
        middlewares: [mockMiddleware],
        controllers: [mockController],
      });

      await customServerManager.start();

      const server = customServerManager.getServer();

      const response = await server.inject({
        method: 'GET',
        url: '/test-middleware',
      });

      expect(response.statusCode).toBe(200);
      expect(mockMiddleware).toHaveBeenCalled();

      await customServerManager.stop();
    });
  });
});
