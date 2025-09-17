# Fastify Server 系統設計

## 更新歷史
- 2025-09-16: 完成 Fastify 架構設計（基於 Koa 專案分析）

## 系統架構

### 整體架構
```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
├─────────────────────────────────────────────────────────────┤
│  Controllers  │  Routes  │  Middlewares  │  Plugins       │
├─────────────────────────────────────────────────────────────┤
│                    Business Layer                           │
├─────────────────────────────────────────────────────────────┤
│   Services    │  Models  │  Validators   │  DTOs          │
├─────────────────────────────────────────────────────────────┤
│                Infrastructure Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Database     │  Cache   │  External APIs │  File System  │
├─────────────────────────────────────────────────────────────┤
│                    Foundation Layer                         │
├─────────────────────────────────────────────────────────────┤
│  DI Container │  Config  │  Logger        │  Utilities     │
└─────────────────────────────────────────────────────────────┘
```

### 核心元件

#### 1. Fastify Server
- **責任**: HTTP 服務器核心
- **功能**: 請求處理、路由分發、中間件執行
- **配置**: 支援自定義配置和插件

#### 2. DI Container
- **責任**: 依賴注入管理
- **功能**: 服務註冊、解析、生命週期管理
- **實作**: 基於 TypeScript decorators

#### 3. OpenAPI Generator
- **責任**: API 文件自動生成
- **功能**: 從路由註解生成 OpenAPI 規範
- **輸出**: JSON/YAML 格式文件 + Swagger UI

#### 4. Configuration Manager
- **責任**: 應用配置管理
- **功能**: 環境變數處理、配置驗證
- **支援**: 多環境配置檔案

## 資料夾結構 (基於 Koa 參考專案)

```
src/
├── main.ts                    # 應用程式入口點
├── server.ts                  # 伺服器配置和啟動
├── fastifyApp.ts              # Fastify 應用程式初始化
├── openapi.ts                 # OpenAPI 文檔生成
├── configs.ts                 # 環境配置管理
├── common/                    # 共用模組
│   ├── decorators/           # API 裝飾器
│   │   ├── api.decorator.ts  # OpenAPI 裝飾器
│   │   └── index.ts
│   ├── dto/                  # 資料傳輸物件
│   │   ├── api.dto.ts        # 標準化 API 回應
│   │   ├── file.dto.ts       # 檔案處理 DTO
│   │   └── index.ts
│   ├── enums/               # 列舉定義
│   │   ├── errorCode.enum.ts # 錯誤代碼
│   │   └── index.ts
│   ├── exceptions/          # 例外處理
│   │   ├── base.exception.ts # 基礎例外類別
│   │   ├── http.exception.ts # HTTP 例外
│   │   └── index.ts
│   ├── interceptors/        # 攔截器
│   │   ├── error.interceptor.ts # 錯誤攔截器
│   │   └── index.ts
│   ├── middlewares/         # 中間件
│   │   ├── ResponseTimeMiddleware.ts
│   │   └── index.ts
│   └── types/               # 類型定義
│       ├── api.type.ts      # API 相關類型
│       ├── file.type.ts     # 檔案相關類型
│       ├── httpError.type.ts # HTTP 錯誤類型
│       └── index.ts
├── delivery/                 # 交付層 (Controller)
│   ├── controllers/         # REST API 控制器
│   │   ├── app.controller.ts
│   │   ├── file.controller.ts
│   │   ├── health.controller.ts
│   │   └── index.ts
│   └── index.ts
├── modules/                 # 業務模組
│   ├── app/                # 應用程式模組
│   │   ├── app.service.ts  # 服務實作
│   │   ├── app.usecase.ts  # 業務邏輯
│   │   ├── dto.ts          # 模組專用 DTO
│   │   ├── types.ts        # 模組類型定義
│   │   └── base.ts         # 基礎類別
│   ├── demo/               # 示範模組
│   │   └── demo.usecase.ts
│   └── health/             # 健康檢查模組
│       ├── health.usecase.ts
│       ├── dto.ts
│       └── types.ts
├── ioc/                    # 依賴注入配置
│   ├── ioc.register.app.ts # IoC 註冊管理
│   ├── iocAdapter.ts       # tsyringe 適配器
│   └── index.ts
├── helpers/                # 輔助工具
│   └── file/               # 檔案處理輔助
│       ├── fileUploadOptions.helper.ts
│       └── index.ts
└── utils/                  # 工具類別
    ├── demo/               # 示範工具
    │   ├── getDemoValue.ts
    │   ├── getDemoValue.spec.ts
    │   └── index.ts
    ├── ioc/                # IoC 工具
    │   ├── base.ts         # 基礎 IoC 註冊類別
    │   └── index.ts
    ├── time/               # 時間工具
    │   ├── delay.ts
    │   ├── duration.ts
    │   └── index.ts
    └── index.ts
```

## 主要模組設計

### 1. Server Module (`src/servers/`)
```typescript
// fastifyInstance.ts
export interface FastifyServerConfig {
  port: number;
  host: string;
  logger: boolean;
}

export class FastifyServer {
  private app: FastifyInstance;
  
  constructor(config: FastifyServerConfig) {
    this.app = fastify(config);
  }
  
  async start(): Promise<void> {
    // 啟動邏輯
  }
}
```

### 2. DI Container Module (tsyringe 基礎)
```typescript
// ioc/iocAdapter.ts
export class TsyringeAdapter implements IocAdapter {
  container: DependencyContainer;
  constructor() {
    this.container = container;
    this.init();
  }
  
  get<T>(someClass: ClassConstructor<T>, _action?: Action): T {
    return this.container.resolve<T>(someClass);
  }
}

// ioc/ioc.register.app.ts
export class IocRegistryApp extends BaseIocRegistry<DependencyContainer> {
  register(): void {
    this.container.registerSingleton<IAppService>(
      INJECT_SVC_APP_SERVICE,
      App2Service
    );
  }
}
```

### 3. Configuration Module
```typescript
// configs/index.ts
export interface AppConfig {
  server: ServerConfig;
  database?: DatabaseConfig;
  swagger: SwaggerConfig;
}

export function loadConfig(): AppConfig {
  // 配置載入邏輯
}
```

### 4. Plugin System
```typescript
// plugins/swagger.plugin.ts
export const swaggerPlugin: FastifyPlugin = async (fastify) => {
  await fastify.register(swagger, {
    swagger: {
      info: { title: 'API', version: '1.0.0' }
    }
  });
};
```

## 開發流程

### 1. 服務啟動流程
```
1. 載入環境配置
2. 初始化 DI 容器
3. 註冊核心服務
4. 建立 Fastify 實例
5. 註冊插件和中間件
6. 載入路由配置
7. 啟動 HTTP 服務器
```

### 2. 請求處理流程
```
Request → Middleware → Route → Controller → Service → Response
```

### 3. 依賴注入流程
```
1. 服務註冊 (@Injectable)
2. 依賴聲明 (@Inject)
3. 容器解析
4. 實例創建
5. 依賴注入
```

## 技術決策 (基於 Koa 參考專案分析)

### 1. 框架選擇: Fastify vs Koa
- **選擇**: Fastify (遷移自 Koa)
- **理由**:
  - 效能提升 2-3 倍
  - 內建 TypeScript 支援
  - 原生 JSON Schema 驗證
  - 豐富的插件生態系統
- **遷移考量**: 保持相同的分層架構

### 2. DI 實作方式
- **選擇**: tsyringe 4.x+
- **理由**: 與參考專案保持一致、成熟穩定、裝飾器支援完善
- **架構**: BaseIocRegistry → IocRegistryApp → TsyringeFastifyAdapter

### 3. 文件生成策略
- **選擇**: @fastify/swagger + class-validator-jsonschema
- **理由**:
  - Fastify 官方支援的 Swagger 插件
  - 整合 class-validator-jsonschema 自動生成 Schema
  - 支援自定義 API 裝飾器 (@ApiResDataSchema 等)

### 4. 路由控制器架構（自建）
- **選擇**: 自定義裝飾器系統
- **理由**:
  - routing-controllers 對 Fastify 支援有限
  - 完全控制裝飾器行為
  - 更好的 TypeScript 類型推斷
  - 無縫整合 tsyringe DI

### 5. 分層架構設計
- **選擇**: Controller → UseCase → Service 三層架構
- **理由**: 清楚的職責分離、易於測試、符合 DDD 原則
- **實作**: @injectable 裝飾器 + @inject 依賴注入

### 6. 配置管理方案
- **選擇**: dotenv-flow + configs.ts 模組
- **理由**: 支援多環境配置、從 package.json 讀取應用資訊

## Fastify 特定設計決策

### 1. 自建裝飾器系統
由於 Fastify 沒有類似 routing-controllers 的完整解決方案，我們將：
- 使用 `reflect-metadata` 建立自定義裝飾器
- 實作 `@Controller`, `@Get`, `@Post`, `@Body`, `@Param` 等裝飾器
- 整合 tsyringe 的依賴注入功能
- 支援路由自動掃描和註冊

### 2. 插件架構
利用 Fastify 的插件系統組織功能：
- **驗證插件**：整合 class-validator
- **Swagger 插件**：使用官方 @fastify/swagger
- **錯誤處理插件**：統一錯誤回應格式
- **日誌插件**：整合 pino logger

### 3. Schema 驅動開發
充分利用 Fastify 的 JSON Schema 功能：
- 自動從 DTO 類別生成 JSON Schema
- 利用 Schema 進行請求驗證和回應序列化
- 自動生成 OpenAPI 文檔

## 與 Koa 架構的主要差異

| 層面 | Koa 方案 | Fastify 方案 | 影響 |
|-----|---------|-------------|------|
| 路由管理 | routing-controllers | 自建裝飾器 + 內建路由 | 需要更多初始開發 |
| 中間件 | 洋蔥模型 | 插件 + Hooks | 更好的效能 |
| 驗證 | class-validator 中間件 | 內建 Schema + class-validator | 雙重驗證保障 |
| 文檔生成 | routing-controllers-openapi | @fastify/swagger | 更簡單的整合 |
| 錯誤處理 | try-catch 中間件 | Error Handler + Hooks | 自動錯誤捕捉 |
| 請求物件 | ctx (context) | request + reply | 更清晰的責任分離 |

## 實作計畫

### Phase 1: 基礎設施建立（優先級：高）
**目標**：建立核心框架和基本功能
- [ ] Fastify 實例和基本配置
- [ ] 自定義裝飾器系統實作
- [ ] 路由自動註冊機制
- [ ] tsyringe DI 容器整合
- [ ] 基本錯誤處理

### Phase 2: 核心功能開發（優先級：高）
**目標**：實作關鍵系統功能
- [ ] class-validator 整合
- [ ] Swagger/OpenAPI 設置
- [ ] 日誌系統（pino）
- [ ] 環境配置管理
- [ ] 健康檢查端點

### Phase 3: 業務模組實作（優先級：中）
**目標**：建立範例業務模組
- [ ] User 模組（完整 CRUD）
- [ ] 認證/授權範例
- [ ] 單元測試框架
- [ ] 整合測試設置
- [ ] API 測試範例

### Phase 4: 優化與部署（優先級：低）
**目標**：生產就緒
- [ ] 效能優化
- [ ] Docker 配置
- [ ] CI/CD 設置
- [ ] 監控整合
- [ ] 文檔完善

### 實作順序建議

1. **Day 1-2**: 完成 Phase 1 的所有項目
2. **Day 3-4**: 完成 Phase 2 的核心功能
3. **Day 5-6**: 實作 Phase 3 的業務模組和測試
4. **Day 7**: Phase 4 的優化和文檔工作

### 關鍵技術挑戰

1. **裝飾器系統開發**
   - 挑戰：需要從零開始建立
   - 解決：參考 NestJS 和 routing-controllers 的設計

2. **DI 容器整合**
   - 挑戰：tsyringe 與 Fastify 生命週期協調
   - 解決：在 Fastify 插件中初始化容器

3. **Schema 生成**
   - 挑戰：從 class-validator 裝飾器生成 JSON Schema
   - 解決：建立 metadata 轉換器

### 風險評估

| 風險 | 可能性 | 影響 | 緩解策略 |
|-----|-------|------|---------|
| 裝飾器系統複雜度 | 高 | 高 | 漸進式開發，先實作基本功能 |
| 效能不如預期 | 低 | 中 | 使用 Fastify 內建優化功能 |
| 套件相容性問題 | 中 | 中 | 預先測試關鍵套件組合 |

## 擴展性考量

### 1. 插件機制
- 支援自定義 Fastify 插件
- 提供插件註冊介面
- 支援插件間依賴管理

### 2. 服務擴展
- 支援服務模組化
- 提供基礎服務類別
- 支援異步服務初始化

### 3. 路由擴展
- 支援路由群組化
- 提供路由中間件
- 支援動態路由註冊

## 效能優化

### 1. 啟動優化
- 延遲載入非關鍵模組
- 並行初始化獨立服務
- 快取重複計算結果

### 2. 執行時優化
- 連接池管理
- 請求快取機制
- 資源回收策略

### 3. 記憶體優化
- 避免記憶體洩漏
- 合理的物件生命週期
- 適當的快取策略