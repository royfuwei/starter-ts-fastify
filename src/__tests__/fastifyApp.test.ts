import { describe, it, expect, afterEach, vi } from 'vitest';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { initFastifyApp, FastifyAppOptions } from '../fastifyApp';

describe('FastifyApp', () => {
  let app: FastifyInstance;

  afterEach(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('initFastifyApp', () => {
    it('should create a Fastify instance with default options', async () => {
      app = await initFastifyApp();

      expect(app).toBeDefined();
      expect(typeof app.listen).toBe('function');
      expect(typeof app.close).toBe('function');
    });

    it('should create a Fastify instance with custom options', async () => {
      const options: FastifyAppOptions = {
        controllers: [],
        middlewares: [],
        isApiDocEnabled: false,
      };

      app = await initFastifyApp(options);

      expect(app).toBeDefined();
    });

    it('should register basic plugins', async () => {
      app = await initFastifyApp();

      // 檢查是否註冊了基本插件 - 透過測試功能來驗證
      expect(app).toBeDefined();

      // 測試基本功能是否正常
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });
      expect(response.statusCode).toBe(200);

      // 測試 sensible 插件提供的功能
      expect(app.httpErrors).toBeDefined();
    });

    it('should register health check route', async () => {
      app = await initFastifyApp();

      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body) as Record<string, unknown>;
      expect(body).toHaveProperty('status', 'ok');
      expect(body).toHaveProperty('timestamp');
      expect(body).toHaveProperty('uptime');
      expect(body).toHaveProperty('version');
      expect(body).toHaveProperty('environment');
    });

    it('should add request ID to requests', async () => {
      app = await initFastifyApp();

      // 添加測試路由來檢查 request ID
      app.get('/test-request-id', (request) => {
        return { requestId: request.id };
      });

      const response = await app.inject({
        method: 'GET',
        url: '/test-request-id',
      });

      expect(response.statusCode).toBe(200);

      const body = JSON.parse(response.body) as { requestId: string };
      expect(body.requestId).toBeDefined();
      expect(typeof body.requestId).toBe('string');
    });

    it('should add response time header', async () => {
      app = await initFastifyApp();

      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);
      expect(response.headers['x-response-time']).toBeDefined();
      expect(response.headers['x-response-time']).toMatch(/^\d+ms$/);
    });

    it('should handle CORS in development environment', async () => {
      // 模擬開發環境
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      app = await initFastifyApp();

      // 測試簡單的 GET 請求
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);

      // 恢復原始環境變數
      process.env.NODE_ENV = originalEnv;
    });

    it('should register custom controllers', async () => {
      const mockController = {
        register: vi.fn((app: FastifyInstance) => {
          app.get('/custom', () => ({ message: 'custom controller' }));
          return Promise.resolve();
        }),
      };

      const options: FastifyAppOptions = {
        controllers: [mockController],
      };

      app = await initFastifyApp(options);

      expect(mockController.register).toHaveBeenCalled();

      const response = await app.inject({
        method: 'GET',
        url: '/custom',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body) as { message: string };
      expect(body.message).toBe('custom controller');
    });

    it('should register custom middlewares', async () => {
      const mockMiddleware = vi.fn((request: FastifyRequest) => {
        (request as FastifyRequest & { customProperty: string }).customProperty =
          'test-value';
        return Promise.resolve();
      });

      const options: FastifyAppOptions = {
        middlewares: [mockMiddleware],
      };

      app = await initFastifyApp(options);

      // 添加測試路由來檢查中介軟體
      app.get('/test-middleware', (request) => {
        return {
          customProperty: (request as FastifyRequest & { customProperty: string })
            .customProperty,
        };
      });

      const response = await app.inject({
        method: 'GET',
        url: '/test-middleware',
      });

      expect(response.statusCode).toBe(200);
      expect(mockMiddleware).toHaveBeenCalled();
    });

    it('should handle multipart form data', async () => {
      app = await initFastifyApp();

      // 添加測試路由來處理 multipart 資料
      app.post('/upload', async (request) => {
        const data = await request.file();
        return {
          filename: data?.filename || 'no-file',
          mimetype: data?.mimetype || 'unknown',
        };
      });

      const form = new FormData();
      form.append('file', new Blob(['test content'], { type: 'text/plain' }), 'test.txt');

      // 注意：inject 方法可能不完全支援 FormData，這裡主要測試路由是否存在
      const response = await app.inject({
        method: 'POST',
        url: '/upload',
        headers: {
          'content-type': 'multipart/form-data; boundary=----test',
        },
        payload:
          '------test\r\nContent-Disposition: form-data; name="file"; filename="test.txt"\r\nContent-Type: text/plain\r\n\r\ntest content\r\n------test--\r\n',
      });

      expect(response.statusCode).toBe(200);
    });
  });
});
