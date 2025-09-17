# Fastify 架構設計文件

## 1. 架構總覽

基於 Koa 專案的分析，設計等效的 Fastify 架構，保持相同的分層設計理念：
- **Controller 層**：處理 HTTP 請求和回應
- **UseCase 層**：業務邏輯實作
- **Service 層**：外部服務整合
- **Repository 層**：資料存取
- **DI 容器**：tsyringe 依賴注入管理

## 2. Fastify 與 Koa 架構對應關係

### 2.1 核心框架對應

| Koa 元件 | Fastify 等效元件 | 說明 |
|---------|-----------------|------|
| koa | fastify | 核心框架 |
| @koa/router | Fastify 內建路由 | Fastify 原生支援路由 |
| koa-bodyparser | Fastify 內建 | Fastify 原生支援 body parsing |
| koa-helmet | @fastify/helmet | 安全性 headers |
| @koa/cors | @fastify/cors | CORS 支援 |

### 2.2 裝飾器系統對應

| Koa (routing-controllers) | Fastify 方案 | 說明 |
|--------------------------|--------------|------|
| @Controller | 自建 @Controller | 使用 reflect-metadata |
| @Get/@Post/@Put/@Delete | 自建路由裝飾器 | 使用 reflect-metadata |
| @Body/@Param/@Query | 自建參數裝飾器 | 整合 class-validator |
| @HttpCode | 自建 @HttpCode | 狀態碼設定 |
| @JSONSchema | 保持 class-validator-jsonschema | Schema 生成 |

### 2.3 OpenAPI 對應

| Koa 元件 | Fastify 元件 | 說明 |
|---------|-------------|------|
| routing-controllers-openapi | @fastify/swagger | OpenAPI 規範生成 |
| koa2-swagger-ui | @fastify/swagger-ui | Swagger UI 介面 |
| class-validator-jsonschema | 保持使用 | JSON Schema 生成 |

## 3. 技術選型理由

### 3.1 核心框架：Fastify
- **效能優勢**：比 Koa 更快的請求處理速度（約 2-3 倍）
- **內建功能**：原生支援 JSON Schema 驗證、序列化
- **插件生態**：豐富的官方和社區插件
- **TypeScript 支援**：一流的 TypeScript 支援
- **生產就緒**：內建日誌、錯誤處理、生命週期 hooks

### 3.2 DI 容器：tsyringe
- **保持一致**：與原 Koa 專案使用相同的 DI 解決方案
- **成熟穩定**：Microsoft 維護，社區廣泛使用
- **裝飾器支援**：完美整合裝飾器模式
- **簡單易用**：學習曲線低，配置簡單

### 3.3 驗證：class-validator + class-transformer
- **與 tsyringe 整合良好**
- **豐富的驗證規則**
- **支援自定義驗證**
- **DTO 模式實作**
- **與 Fastify JSON Schema 互補**

### 3.4 OpenAPI：@fastify/swagger + @fastify/swagger-ui
- **官方支援**：Fastify 團隊維護
- **自動生成**：從路由和 schema 自動生成文檔
- **JSON Schema 整合**：利用 Fastify 的 schema 功能
- **UI 整合**：內建 Swagger UI 支援

### 3.5 自建裝飾器系統
由於 Fastify 沒有類似 routing-controllers 的完整裝飾器框架，我們將：
- 使用 `reflect-metadata` 建立自定義裝飾器
- 參考 NestJS 的設計模式
- 整合 tsyringe 的 DI 功能
- 保持與原 Koa 專案相似的開發體驗

## 4. 資料夾結構規劃

```
src/
├── main.ts                     # 應用程式入口
├── configs.ts                  # 配置管理
├── container.ts                # DI 容器配置
│
├── servers/
│   ├── index.ts
│   ├── fastifyInstance.ts      # Fastify 實例創建
│   ├── server.ts               # 伺服器啟動邏輯
│   └── fastifyApp.ts           # Fastify 應用初始化
│
├── core/                       # 核心功能模組
│   ├── decorators/            # 自定義裝飾器
│   │   ├── controller.decorator.ts
│   │   ├── http-methods.decorator.ts
│   │   ├── parameters.decorator.ts
│   │   ├── validation.decorator.ts
│   │   └── api.decorator.ts    # OpenAPI 裝飾器
│   │
│   ├── metadata/              # 元數據管理
│   │   ├── metadata.keys.ts
│   │   ├── metadata.scanner.ts
│   │   └── metadata.storage.ts
│   │
│   ├── router/                # 路由註冊系統
│   │   ├── router.builder.ts
│   │   ├── router.register.ts
│   │   └── route.handler.ts
│   │
│   └── plugins/               # Fastify 插件
│       ├── swagger.plugin.ts
│       ├── validation.plugin.ts
│       ├── error-handler.plugin.ts
│       └── cors.plugin.ts
│
├── common/                     # 共用模組（保持與 Koa 一致）
│   ├── dto/                   # 資料傳輸物件
│   │   ├── api.dto.ts         # API 回應 DTO
│   │   └── pagination.dto.ts  # 分頁 DTO
│   │
│   ├── exceptions/            # 例外處理
│   │   ├── http.exception.ts
│   │   ├── validation.exception.ts
│   │   └── business.exception.ts
│   │
│   ├── interceptors/          # 攔截器
│   │   ├── error.interceptor.ts
│   │   └── logging.interceptor.ts
│   │
│   ├── middlewares/           # 中間件
│   │   ├── auth.middleware.ts
│   │   └── rate-limit.middleware.ts
│   │
│   └── types/                 # 類型定義
│       ├── api.type.ts
│       └── http.type.ts
│
├── delivery/                   # 交付層（Controllers）
│   └── controllers/
│       ├── health.controller.ts
│       ├── app.controller.ts
│       └── index.ts
│
├── modules/                    # 業務模組
│   ├── health/
│   │   ├── health.controller.ts
│   │   ├── health.usecase.ts
│   │   ├── health.dto.ts
│   │   └── health.types.ts
│   │
│   ├── app/
│   │   ├── app.controller.ts
│   │   ├── app.usecase.ts
│   │   ├── app.service.ts
│   │   ├── app.dto.ts
│   │   └── app.types.ts
│   │
│   └── user/                  # 範例模組
│       ├── user.controller.ts
│       ├── user.usecase.ts
│       ├── user.service.ts
│       ├── user.repository.ts
│       ├── user.dto.ts
│       └── user.entity.ts
│
├── ioc/                        # DI 容器配置（保持與 Koa 一致）
│   ├── ioc.register.app.ts
│   ├── iocAdapter.ts
│   └── index.ts
│
├── helpers/                    # 輔助工具
│   └── validation.helper.ts
│
└── utils/                      # 工具函數
    ├── logger.ts
    ├── validator.ts
    └── ...（保留原有）
```

## 5. 關鍵模組設計

### 5.1 Controller 裝飾器系統

```typescript
// core/decorators/controller.decorator.ts
import 'reflect-metadata';

const CONTROLLER_PREFIX = Symbol('controller:prefix');
const CONTROLLER_ROUTES = Symbol('controller:routes');

export function Controller(prefix: string): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(CONTROLLER_PREFIX, prefix, target);
    Reflect.defineMetadata('controller:target', target, target);
  };
}

// core/decorators/http-methods.decorator.ts
export function Get(path: string = ''): MethodDecorator {
  return createRouteDecorator('GET', path);
}

export function Post(path: string = ''): MethodDecorator {
  return createRouteDecorator('POST', path);
}

function createRouteDecorator(method: string, path: string): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    const routes = Reflect.getMetadata(CONTROLLER_ROUTES, target.constructor) || [];
    routes.push({
      method,
      path,
      handlerName: propertyKey,
      handler: descriptor.value
    });
    Reflect.defineMetadata(CONTROLLER_ROUTES, routes, target.constructor);
  };
}

// core/decorators/parameters.decorator.ts
export function Body(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const params = Reflect.getMetadata('route:params', target.constructor, propertyKey) || [];
    params.push({ index: parameterIndex, type: 'body' });
    Reflect.defineMetadata('route:params', params, target.constructor, propertyKey);
  };
}

export function Param(name: string): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const params = Reflect.getMetadata('route:params', target.constructor, propertyKey) || [];
    params.push({ index: parameterIndex, type: 'param', name });
    Reflect.defineMetadata('route:params', params, target.constructor, propertyKey);
  };
}
```

### 5.2 路由自動註冊系統

```typescript
// core/router/router.builder.ts
import { FastifyInstance } from 'fastify';
import { DependencyContainer } from 'tsyringe';

export class RouterBuilder {
  constructor(
    private fastify: FastifyInstance,
    private container: DependencyContainer
  ) {}

  public registerControllers(controllers: Constructor<any>[]): void {
    controllers.forEach(controller => {
      this.registerController(controller);
    });
  }

  private registerController(controller: Constructor<any>): void {
    const prefix = Reflect.getMetadata('controller:prefix', controller) || '';
    const routes = Reflect.getMetadata('controller:routes', controller) || [];
    const instance = this.container.resolve(controller);

    routes.forEach(route => {
      const fullPath = `${prefix}${route.path}`;
      this.registerRoute(fullPath, route.method, instance, route);
    });
  }

  private registerRoute(
    path: string,
    method: string,
    controllerInstance: any,
    route: RouteMetadata
  ): void {
    const handler = this.createRouteHandler(controllerInstance, route);
    
    this.fastify.route({
      method: method as any,
      url: path,
      handler,
      schema: this.buildRouteSchema(route)
    });
  }

  private createRouteHandler(instance: any, route: RouteMetadata) {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      const params = this.extractParameters(request, route);
      const result = await instance[route.handlerName](...params);
      return reply.send(result);
    };
  }
}
```

### 5.3 驗證整合

```typescript
// core/plugins/validation.plugin.ts
import { FastifyPluginAsync } from 'fastify';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const validationPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', async (request, reply) => {
    const route = request.routerPath;
    const validationMetadata = getValidationMetadata(route);
    
    if (validationMetadata?.body) {
      const dto = plainToClass(validationMetadata.body, request.body);
      const errors = await validate(dto);
      
      if (errors.length > 0) {
        return reply.status(400).send({
          success: false,
          errors: errors.map(e => ({
            property: e.property,
            constraints: e.constraints
          }))
        });
      }
      
      request.body = dto;
    }
  });
};
```

### 5.4 tsyringe 適配器

```typescript
// ioc/iocAdapter.ts
import { container, DependencyContainer } from 'tsyringe';

export class TsyringeFastifyAdapter {
  private container: DependencyContainer;

  constructor() {
    this.container = container;
  }

  public resolve<T>(token: any): T {
    return this.container.resolve<T>(token);
  }

  public register(token: any, provider: any): void {
    this.container.register(token, { useClass: provider });
  }

  public registerSingleton(token: any, provider: any): void {
    this.container.registerSingleton(token, provider);
  }
}

// ioc/ioc.register.app.ts
import { BaseIocRegistry } from '../utils/ioc/base';

export class IocRegistryApp extends BaseIocRegistry<DependencyContainer> {
  register(): void {
    // 註冊 UseCases
    this.container.register('HealthUseCase', { useClass: HealthUseCase });
    this.container.register('AppUseCase', { useClass: AppUseCase });
    
    // 註冊 Services
    this.container.registerSingleton('AppService', AppService);
    
    // 註冊 Repositories
    this.container.registerSingleton('UserRepository', UserRepository);
  }
}
```

## 6. DI 容器整合方案

### 6.1 容器初始化

```typescript
// container.ts
import 'reflect-metadata';
import { container } from 'tsyringe';
import { IocRegistryApp } from './ioc/ioc.register.app';

export function setupContainer(): DependencyContainer {
  // 初始化 IoC Registry
  const registry = new IocRegistryApp(container);
  registry.init();
  
  // 掃描並註冊所有 Controllers
  const controllers = scanControllers('./delivery/controllers');
  controllers.forEach(controller => {
    container.register(controller, { useClass: controller });
  });
  
  return container;
}

function scanControllers(path: string): Constructor<any>[] {
  // 實作控制器掃描邏輯
  return [];
}
```

### 6.2 Controller 整合

```typescript
// modules/user/user.controller.ts
import { injectable, inject } from 'tsyringe';
import { Controller, Get, Post, Body, Param } from '../../core/decorators';
import { Validate } from '../../core/decorators/validation.decorator';
import { ApiResDataSchema } from '../../common/decorators/api.decorator';

@injectable()
@Controller('/api/v1/users')
export class UserController {
  constructor(
    @inject('UserUseCase')
    private userUseCase: UserUseCase
  ) {}

  @Get('/:id')
  @ApiResDataSchema('取得使用者', UserResponseDto)
  async getUser(@Param('id') id: string): Promise<ApiResData<UserResponseDto>> {
    const user = await this.userUseCase.getUser(id);
    return {
      success: true,
      data: user
    };
  }

  @Post('/')
  @Validate(CreateUserDto)
  @ApiResDataSchema('建立使用者', UserResponseDto)
  async createUser(@Body() dto: CreateUserDto): Promise<ApiResData<UserResponseDto>> {
    const user = await this.userUseCase.createUser(dto);
    return {
      success: true,
      data: user
    };
  }
}
```

## 7. OpenAPI 整合方案

### 7.1 Swagger 插件配置

```typescript
// core/plugins/swagger.plugin.ts
import { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';

export async function setupSwagger(fastify: FastifyInstance): Promise<void> {
  // 生成 JSON Schemas
  const schemas = validationMetadatasToSchemas({
    refPointerPrefix: '#/components/schemas/',
  });

  await fastify.register(swagger, {
    swagger: {
      info: {
        title: 'Fastify API',
        description: 'API documentation',
        version: '1.0.0'
      },
      servers: [
        { url: 'http://localhost:3000' }
      ],
      components: {
        schemas,
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      tags: [
        { name: 'Health', description: '健康檢查' },
        { name: 'Users', description: '使用者管理' }
      ]
    }
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/api-docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    }
  });
}
```

### 7.2 路由 Schema 自動生成

```typescript
// core/router/schema.builder.ts
import { getMetadataArgsStorage } from 'routing-controllers';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';

export class SchemaBuilder {
  static buildRouteSchema(controller: any, method: string): FastifySchema {
    const metadata = getMetadataArgsStorage();
    const schemas = validationMetadatasToSchemas();
    
    return {
      tags: [controller.constructor.name.replace('Controller', '')],
      body: this.getBodySchema(controller, method, schemas),
      params: this.getParamsSchema(controller, method),
      response: this.getResponseSchema(controller, method, schemas)
    };
  }

  private static getResponseSchema(controller: any, method: string, schemas: any) {
    const responseMetadata = Reflect.getMetadata('api:response', controller, method);
    
    if (responseMetadata) {
      return {
        200: {
          description: responseMetadata.description,
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: schemas[responseMetadata.type.name]
          }
        }
      };
    }
    
    return {};
  }
}
```

## 8. 路由管理策略

### 8.1 模組化路由

每個業務模組擁有獨立的 Controller，通過裝飾器定義路由：

```typescript
@Controller('/api/v1/products')
export class ProductController {
  @Get('/')
  @ApiResDataListSchema('取得所有產品', ProductDto)
  async getProducts(): Promise<ApiResData<Product[]>> { }

  @Post('/')
  @Validate(CreateProductDto)
  @ApiResDataSchema('建立產品', ProductDto)
  async createProduct(@Body() dto: CreateProductDto): Promise<ApiResData<Product>> { }

  @Put('/:id')
  @Validate(UpdateProductDto)
  @ApiResDataSchema('更新產品', ProductDto)
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto
  ): Promise<ApiResData<Product>> { }

  @Delete('/:id')
  @ApiResDataSchema('刪除產品')
  async deleteProduct(@Param('id') id: string): Promise<ApiResData<void>> { }
}
```

### 8.2 路由版本管理

通過 prefix 實現 API 版本控制：

```typescript
// V1 Controller
@Controller('/api/v1/users')
export class UserV1Controller { }

// V2 Controller (新版本 API)
@Controller('/api/v2/users')
export class UserV2Controller { }
```

### 8.3 中間件整合

```typescript
// core/decorators/middleware.decorator.ts
export function UseMiddleware(...middlewares: FastifyMiddleware[]): ClassDecorator | MethodDecorator {
  return (target: any, propertyKey?: string) => {
    if (propertyKey) {
      // Method decorator
      Reflect.defineMetadata('route:middlewares', middlewares, target.constructor, propertyKey);
    } else {
      // Class decorator
      Reflect.defineMetadata('controller:middlewares', middlewares, target);
    }
  };
}

// 使用範例
@Controller('/admin')
@UseMiddleware(authMiddleware, adminMiddleware)
export class AdminController { 
  @Get('/users')
  @UseMiddleware(logMiddleware)
  async getUsers() { }
}
```

### 8.4 錯誤處理策略

```typescript
// common/interceptors/error.interceptor.ts
export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  const logger = request.server.log;
  
  if (error instanceof ValidationException) {
    return reply.status(400).send({
      success: false,
      errorCode: 'VALIDATION_ERROR',
      message: error.message,
      errors: error.errors,
      path: request.url,
      timestamp: new Date()
    });
  }
  
  if (error instanceof HttpException) {
    return reply.status(error.statusCode).send({
      success: false,
      errorCode: error.errorCode,
      message: error.message,
      path: request.url,
      timestamp: new Date()
    });
  }
  
  // 未知錯誤
  logger.error(error);
  return reply.status(500).send({
    success: false,
    errorCode: 'INTERNAL_SERVER_ERROR',
    message: 'Internal server error',
    path: request.url,
    timestamp: new Date()
  });
};
```

## 9. 實作順序建議

### Phase 1: 基礎設施（第1-2天）
1. ✅ 設置 Fastify 實例和基本配置
2. 🔄 實作自定義裝飾器系統
   - Controller 裝飾器
   - HTTP 方法裝飾器
   - 參數裝飾器
3. 🔄 建立路由自動註冊機制
4. ✅ 整合 tsyringe DI 容器

### Phase 2: 核心功能（第3-4天）
1. 🔄 實作驗證系統（class-validator 整合）
2. 🔄 設置錯誤處理機制
3. 🔄 整合 Swagger/OpenAPI
4. 🔄 建立日誌系統（pino）
5. ✅ 環境配置管理

### Phase 3: 業務模組（第5-6天）
1. 🔄 實作 Health Check 模組
2. 🔄 建立範例 User 模組（CRUD）
3. 🔄 撰寫單元測試
4. 🔄 撰寫整合測試

### Phase 4: 優化與文檔（第7天）
1. 🔄 效能優化
2. 🔄 完善 API 文檔
3. 🔄 撰寫開發指南
4. 🔄 程式碼審查和重構

## 10. 與 Koa 架構的主要差異

### 10.1 路由處理
- **Koa**: 需要額外的 @koa/router，使用中間件鏈
- **Fastify**: 內建高效能路由系統，直接註冊路由

### 10.2 中間件 vs 插件
- **Koa**: 基於中間件的洋蔥模型，順序執行
- **Fastify**: 基於插件和 hooks 的生命週期，更精確的控制

### 10.3 請求驗證
- **Koa**: 需要手動整合驗證中間件
- **Fastify**: 內建 JSON Schema 驗證，可與 class-validator 結合

### 10.4 效能特性
- **Koa**: 輕量但需要更多手動優化
- **Fastify**: 內建序列化優化、路由快取、schema 編譯

### 10.5 錯誤處理
- **Koa**: 通過中間件鏈處理，需要 try-catch
- **Fastify**: 使用 error handler 和 hooks，自動錯誤捕捉

### 10.6 請求/回應物件
- **Koa**: ctx 物件包含 request 和 response
- **Fastify**: 分離的 request 和 reply 物件

## 11. 注意事項與最佳實踐

### 11.1 開發注意事項
1. **裝飾器執行順序**：確保 `reflect-metadata` 在所有裝飾器之前引入
2. **循環依賴**：使用 `@inject()` 和 `delay()` 處理循環依賴
3. **非同步初始化**：所有插件註冊必須使用 `await`
4. **Schema 快取**：利用 Fastify 的 schema 快取提升效能
5. **生命週期管理**：正確處理 Fastify 的 hooks 順序

### 11.2 效能最佳實踐
1. **使用 JSON Schema**：充分利用 Fastify 的 schema 驗證
2. **避免阻塞操作**：使用非同步操作，避免阻塞事件循環
3. **連接池管理**：資料庫連接池適當配置
4. **快取策略**：實作適當的快取機制
5. **日誌級別**：生產環境使用適當的日誌級別

### 11.3 安全性考量
1. **輸入驗證**：所有輸入都應該經過驗證
2. **錯誤訊息**：避免暴露敏感資訊
3. **Rate Limiting**：實作速率限制
4. **CORS 配置**：正確配置 CORS
5. **安全標頭**：使用 @fastify/helmet

## 12. 遷移策略

### 12.1 從 Koa 到 Fastify 的遷移步驟
1. **保留的部分**：
   - tsyringe DI 容器配置
   - DTO 和驗證裝飾器
   - UseCase 和 Service 層邏輯
   - 配置管理系統

2. **需要調整的部分**：
   - Controller 裝飾器（自建）
   - 中間件改為插件/hooks
   - 錯誤處理機制
   - 路由註冊方式

3. **新增的功能**：
   - Fastify 插件系統
   - JSON Schema 整合
   - 內建效能優化

### 12.2 漸進式遷移
1. 先建立 Fastify 基礎設施
2. 遷移簡單的模組（如 Health）
3. 逐步遷移業務模組
4. 最後調整複雜的中間件和攔截器

## 13. 測試策略

### 13.1 單元測試
```typescript
// user.controller.spec.ts
describe('UserController', () => {
  let container: DependencyContainer;
  let controller: UserController;

  beforeEach(() => {
    container = createMockContainer();
    controller = container.resolve(UserController);
  });

  it('should get user by id', async () => {
    const result = await controller.getUser('123');
    expect(result.success).toBe(true);
    expect(result.data.id).toBe('123');
  });
});
```

### 13.2 整合測試
```typescript
// app.e2e-spec.ts
describe('App E2E', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  it('GET /api/v1/users/:id', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/users/123'
    });
    
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toMatchObject({
      success: true,
      data: { id: '123' }
    });
  });
});
```

## 14. 監控與維運

### 14.1 日誌策略
- 使用 pino 作為日誌系統
- 結構化日誌格式
- 不同環境不同日誌級別
- 整合 ELK Stack 或類似系統

### 14.2 健康檢查
- 基本健康檢查端點
- 依賴服務健康檢查
- 資料庫連接檢查
- 快取服務檢查

### 14.3 效能監控
- APM 工具整合
- 請求回應時間追蹤
- 錯誤率監控
- 資源使用監控

## 15. 結論

這個 Fastify 架構設計保持了原 Koa 專案的優點：
- ✅ 清晰的分層架構（Controller → UseCase → Service）
- ✅ 強大的 DI 容器支援（tsyringe）
- ✅ 完整的 OpenAPI 文檔
- ✅ 優雅的裝飾器語法
- ✅ 標準化的 DTO 和錯誤處理

同時獲得了 Fastify 的額外優勢：
- ⚡ 更好的效能表現（2-3倍提升）
- 🔧 內建的驗證和序列化
- 🔌 豐富的插件生態系統
- 📝 更完善的 TypeScript 支援
- 🚀 生產就緒的特性

這個設計為建立高效能、可維護的 TypeScript API 服務提供了堅實的基礎，同時保持了開發體驗的一致性，降低了團隊的學習成本。