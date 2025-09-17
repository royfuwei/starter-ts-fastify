# Koa 參考專案架構分析

## 專案概述

**專案名稱**: [`starter-ts-koa`](.ref/starter-ts-koa/package.json:2)  
**版本**: 0.0.0  
**描述**: A project created by starter-ts-koa

此專案是一個基於 Koa.js 的 TypeScript 後端框架，採用現代化的企業級架構模式，包含完整的 DI 容器、OpenAPI 文檔生成、模組化設計等特性。

## 主要技術棧

### 核心框架
- **Koa.js** - 輕量級的 Node.js Web 框架
- **TypeScript** - 靜態類型檢查
- **routing-controllers** - 基於裝飾器的路由控制器框架
- **tsyringe** - 依賴注入容器

### API 和文檔
- **routing-controllers-openapi** - 自動生成 OpenAPI 規範
- **koa2-swagger-ui** - Swagger UI 整合
- **class-validator** - 資料驗證
- **class-transformer** - 資料轉換

### 開發工具
- **esbuild** - 快速打包工具
- **vitest** - 測試框架
- **eslint** + **prettier** - 程式碼品質
- **husky** - Git hooks

## 專案結構分析

```
src/
├── main.ts                    # 應用程式入口點
├── server.ts                  # 伺服器配置和啟動
├── koaApp.ts                  # Koa 應用程式初始化
├── openapi.ts                 # OpenAPI 文檔生成
├── configs.ts                 # 環境配置管理
├── common/                    # 共用模組
│   ├── decorators/           # API 裝飾器
│   ├── dto/                  # 資料傳輸物件
│   ├── enums/               # 列舉定義
│   ├── exceptions/          # 例外處理
│   ├── interceptors/        # 攔截器
│   ├── middlewares/         # 中間件
│   └── types/               # 類型定義
├── delivery/                 # 交付層
│   └── controllers/         # REST API 控制器
├── modules/                 # 業務模組
│   ├── app/                # 應用程式模組
│   ├── demo/               # 示範模組
│   └── health/             # 健康檢查模組
├── ioc/                    # 依賴注入配置
├── helpers/                # 輔助工具
└── utils/                  # 工具類別
```

## 關鍵架構特性

### 1. 依賴注入系統 (tsyringe)

#### IoC 容器配置
[`IocRegistryApp`](.ref/starter-ts-koa/src/ioc/ioc.register.app.ts:9) 繼承自 [`BaseIocRegistry`](.ref/starter-ts-koa/src/utils/ioc/base.ts:1)：

```typescript
export class IocRegistryApp extends BaseIocRegistry<DependencyContainer> {
  register(): void {
    this.container.registerSingleton<IAppService>(INJECT_SVC_APP_SERVICE, App2Service);
  }
}
```

#### 適配器整合
[`TsyringeAdapter`](.ref/starter-ts-koa/src/ioc/iocAdapter.ts:5) 實作 routing-controllers 的 IoC 介面：

```typescript
export class TsyringeAdapter implements IocAdapter {
  get<T>(someClass: ClassConstructor<T>, _action?: Action): T {
    return this.container.resolve<T>(someClass);
  }
}
```

#### 依賴注入使用
在控制器中使用 `@inject` 裝飾器：

```typescript
@injectable()
export class AppController {
  constructor(
    @inject(AppUseCase)
    private readonly appUseCase: AppUseCase,
  ) {}
}
```

### 2. OpenAPI 自動生成

#### 核心實作
[`getSwaggerSpec`](.ref/starter-ts-koa/src/openapi.ts:17) 函數整合多個元件：

- **routing-controllers-openapi**: 從控制器生成 OpenAPI 規範
- **class-validator-jsonschema**: 從驗證裝飾器生成 JSON Schema
- **class-transformer**: 提供元資料支援

#### Swagger UI 整合
自動配置 Swagger UI：
- `/swagger.json` - OpenAPI 規範端點
- `/api-docs` - Swagger UI 介面
- `/` - 重導向到 API 文檔

#### 自定義裝飾器
提供豐富的 API 回應裝飾器：
- [`@ApiResDataSchema`](.ref/starter-ts-koa/src/common/decorators/api.decorator.ts:44) - 單一資料回應
- [`@ApiResDataListSchema`](.ref/starter-ts-koa/src/common/decorators/api.decorator.ts:98) - 陣列資料回應  
- [`@ApiResPaginatedSchema`](.ref/starter-ts-koa/src/common/decorators/api.decorator.ts:4) - 分頁資料回應

### 3. 伺服器啟動流程

#### 啟動順序
1. **main.ts**: 應用程式入口點
2. **server.ts**: 配置 DI 容器和路由
3. **koaApp.ts**: 初始化 Koa 應用程式
4. **openapi.ts**: 建立 API 文檔

#### 關鍵配置
```typescript
// server.ts
export function server() {
  new IocRegistryApp(container);           // 註冊 DI 容器
  useContainer(iocAdapter);                // 設定 routing-controllers 容器
  
  const routingControllerOptions: RoutingControllersOptions = {
    defaultErrorHandler: false,
    classTransformer: true,
    validation: true,
    controllers: [...controllers],
    middlewares: [...middlewares],
  };
  
  const app = initKoaApp(routingControllerOptions);
  return { app, httpServer };
}
```

### 4. 錯誤處理機制

#### 全域錯誤攔截
[`KoaLoggerHttpErrorMiddleware`](.ref/starter-ts-koa/src/common/interceptors/error.interceptor.ts:6) 提供統一的錯誤處理：

```typescript
export const KoaHttpErrorInterceptor = async (ctx: Koa.Context, next: Koa.Next) => {
  try {
    await next();
  } catch (error) {
    koaErrorHandler(error, ctx, logger);
  }
};
```

#### 標準化錯誤回應
所有錯誤都轉換為 [`ApiResError`](.ref/starter-ts-koa/src/common/dto/api.dto.ts:66) 格式：

```typescript
const body: ApiResError = {
  success: false,
  status: httpError.status,
  errorCode: httpError.errorCode,
  message: error.message,
  method: ctx.method,
  path: ctx.path,
  timestamp: new Date(),
};
```

### 5. 資料傳輸物件 (DTO) 系統

#### 標準化 API 回應
- [`ApiResDataDTO<T>`](.ref/starter-ts-koa/src/common/dto/api.dto.ts:19) - 一般資料回應
- [`ApiResPaginatedDTO<T>`](.ref/starter-ts-koa/src/common/dto/api.dto.ts:41) - 分頁資料回應
- [`ApiResErrorDTO`](.ref/starter-ts-koa/src/common/dto/api.dto.ts:66) - 錯誤回應

#### 驗證整合
使用 class-validator 裝飾器進行自動驗證：

```typescript
@JSONSchema({ description: '請求結果' })
@IsBoolean()
success: boolean;
```

## TypeScript 配置分析

### 主要配置特性
```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "target": "ES2021",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 關鍵設定
- **experimentalDecorators**: 啟用裝飾器支援
- **emitDecoratorMetadata**: 生成裝飾器元資料
- **paths**: 路徑別名配置

## 可借鑒的設計模式

### 1. 分層架構
- **Delivery Layer**: 控制器處理 HTTP 請求
- **Business Layer**: UseCase 處理業務邏輯  
- **Service Layer**: 服務類別處理具體實作

### 2. 模組化設計
每個功能模組包含：
- **Controller**: API 端點定義
- **UseCase**: 業務邏輯協調
- **Service**: 具體實作
- **DTO**: 資料傳輸物件
- **Types**: 類型定義

### 3. 配置管理
- 使用 **dotenv-flow** 支援多環境配置
- 從 **package.json** 讀取應用程式資訊
- 統一的配置物件導出

### 4. 開發工具整合
- **esbuild** 快速開發建置
- **vitest** 現代化測試
- **lint-staged** 提交前檢查
- **conventional commits** 標準化提交

## 遷移至 Fastify 的考量

### 相容性分析
1. **路由控制器**: routing-controllers 支援 Fastify
2. **DI 容器**: tsyringe 與框架無關
3. **OpenAPI**: 可使用 @fastify/swagger 或保持現有方案
4. **驗證**: class-validator 可直接使用

### 需要調整的部分
1. **中間件系統**: Koa vs Fastify 中間件不相容
2. **Context 物件**: 不同的請求/回應物件結構
3. **錯誤處理**: Fastify 有不同的錯誤處理機制
4. **插件系統**: Fastify 的插件架構需要重新設計

### 建議保留的設計
1. **依賴注入系統**: 完整保留 tsyringe 架構
2. **模組化結構**: 維持清晰的資料夾組織
3. **DTO 系統**: 保留標準化的資料傳輸物件
4. **配置管理**: 保留環境配置系統
5. **OpenAPI 整合**: 保持自動文檔生成能力

## 結論

參考專案展示了一個成熟的企業級 Node.js 後端架構，具有以下優勢：

1. **完整的 DI 系統**: 使用 tsyringe 實現鬆耦合
2. **自動化 API 文檔**: OpenAPI 整合提升開發效率
3. **標準化架構**: 分層設計和模組化組織
4. **豐富的開發工具**: 現代化的建置和測試工具

這些設計模式和架構概念都可以很好地遷移到 Fastify 專案中，為快速開發提供堅實基礎。