import { container } from 'tsyringe';
import { FastifyReply, FastifyRequest } from 'fastify';

// 創建一個簡單的服務類別
class DemoService {
  getValue(): string {
    return 'Hello from Demo Service!';
  }
}

// 註冊服務到 DI 容器
container.registerSingleton<DemoService>(DemoService);

export class DemoController {
  static async getDemoValue(request: FastifyRequest, reply: FastifyReply) {
    // 從 DI 容器取得服務實例
    const demoService = container.resolve(DemoService);
    const value = demoService.getValue();

    return reply.send({
      message: value,
      timestamp: new Date().toISOString(),
    });
  }
}
