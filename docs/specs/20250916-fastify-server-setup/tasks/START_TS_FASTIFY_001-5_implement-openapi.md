# START_TS_FASTIFY_001-5: 實作 OpenAPI 支援

## 任務概述

為 Fastify TypeScript 伺服器實作完整的 OpenAPI (Swagger) 支援，包含自動文檔生成、API 註解和範例控制器。

## 實作內容

### 1. 套件安裝

安裝了以下 OpenAPI 相關套件：
- `@fastify/swagger` - Fastify Swagger 插件
- `@fastify/swagger-ui` - Swagger UI 插件
- `class-validator-jsonschema` - 從 class-validator 生成 JSON Schema

```bash
pnpm add @fastify/swagger @fastify/swagger-ui class-validator-jsonschema
```

### 2. 核心檔案結構

建立了完整的 OpenAPI 支援架構：

```
src/
├── server/plugins/
│   └── swagger.plugin.ts          # Swagger 插件設定
├── common/
│   ├── decorators/
│   │   └── swagger.decorator.ts   # Swagger 裝飾器
│   ├── dto/
│   │   ├── api-response.dto.ts    # 標準化 API 回應 DTO
│   │   └── demo/                  # Demo 相關 DTO
│   │       ├── create-demo.dto.ts
│   │       ├── update-demo.dto.ts
│   │       └── demo.dto.ts
│   └── utils/
│       └── schema-builder.ts      # JSON Schema 建構器
└── controllers/
    └── demo/
        └── demo.controller.ts     # 範例控制器
```

### 3. 主要功能特色

#### 3.1 Swagger 插件 (`src/server/plugins/swagger.plugin.ts`)
- 支援 OpenAPI 3.0.0 規格
- 自動生成 API 文檔
- 配置 Swagger UI 界面
- 支援 API 金鑰和 JWT 驗證

#### 3.2 Swagger 裝飾器 (`src/common/decorators/swagger.decorator.ts`)
提供豐富的裝飾器：
- `@ApiTags()` - API 標籤分類
- `@ApiOperation()` - 操作描述
- `@ApiResponse()` - 回應定義
- `@ApiParam()`, `@ApiQuery()`, `@ApiHeader()` - 參數定義
- `@ApiBody()` - 請求體定義
- 快速回應裝飾器：`@ApiOkResponse()`, `@ApiCreatedResponse()`, `@ApiBadRequestResponse()` 等

#### 3.3 標準化 API 回應 (`src/common/dto/api-response.dto.ts`)
- `BaseApiResponse<T>` - 基底回應格式
- `SuccessApiResponse<T>` - 成功回應
- `ErrorApiResponse` - 錯誤回應
- `PaginatedApiResponse<T>` - 分頁回應
- 健康檢查專用回應 DTO

#### 3.4 JSON Schema 建構器 (`src/common/utils/schema-builder.ts`)
- 從 class-validator 自動生成 JSON Schema
- 支援標準 API 回應 Schema
- 支援分頁回應 Schema
- 支援錯誤回應 Schema

### 4. 範例實作

#### 4.1 健康檢查控制器更新
為 `HealthController` 加入完整的 Swagger 註解：
- 基本健康檢查 `GET /health`
- 詳細健康檢查 `GET /health/detailed`
- 就緒檢查 `GET /health/ready`
- 存活檢查 `GET /health/live`

#### 4.2 Demo 控制器 (`src/controllers/demo/demo.controller.ts`)
建立了完整的 CRUD 範例控制器：
- `GET /demo` - 取得所有項目（支援分頁、搜尋、篩選）
- `GET /demo/:id` - 取得特定項目
- `POST /demo` - 建立新項目
- `PUT /demo/:id` - 更新項目
- `DELETE /demo/:id` - 刪除項目

每個端點都包含：
- 完整的 Swagger 註解
- 參數驗證
- 回應 Schema 定義
- 錯誤處理

### 5. 配置整合

#### 5.1 應用程式整合
在 `src/server/app.ts` 中註冊 Swagger 插件：
```typescript
import { registerDefaultSwaggerPlugin } from './plugins/swagger.plugin';

// 在初始化插件時註冊
await registerDefaultSwaggerPlugin(this.app);
```

#### 5.2 控制器註冊
在 `src/server/server.ts` 中註冊新控制器：
```typescript
import { DemoController } from '../controllers/demo/demo.controller';

const app = new FastifyApp({
  controllers: [HealthController, DemoController],
});
```

## 使用方式

### 啟動伺服器
```bash
npm run dev
```

### 訪問 Swagger UI
伺服器啟動後，可透過以下路徑訪問：
- Swagger UI: `http://localhost:3000/documentation`
- OpenAPI JSON: `http://localhost:3000/documentation/json`

### API 端點
```
Health Check:
- GET  /health          - 基本健康檢查
- GET  /health/detailed - 詳細健康檢查
- GET  /health/ready    - 就緒檢查
- GET  /health/live     - 存活檢查

Demo API:
- GET    /demo          - 取得所有項目
- GET    /demo/:id      - 取得特定項目
- POST   /demo          - 建立新項目
- PUT    /demo/:id      - 更新項目
- DELETE /demo/:id      - 刪除項目
```

## 重點功能

### 1. 自動文檔生成
- 從 TypeScript 裝飾器自動生成 OpenAPI 規格
- 支援複雜的資料結構和驗證規則
- 包含完整的範例和描述

### 2. 型別安全
- 所有 DTO 都使用 class-validator 進行驗證
- TypeScript 型別檢查確保資料一致性
- 自動生成的 Schema 與實際型別同步

### 3. 標準化回應格式
- 統一的 API 回應結構
- 支援成功、錯誤和分頁回應
- 包含時間戳記和標準化錯誤碼

### 4. 豐富的範例
- 完整的 CRUD 操作示範
- 分頁、搜尋和篩選功能
- 參數驗證和錯誤處理

## 技術特點

1. **模組化設計** - 每個功能都封裝在獨立的模組中
2. **可擴展性** - 易於添加新的控制器和端點
3. **文檔完整** - 每個 API 都有詳細的說明和範例
4. **型別安全** - 充分利用 TypeScript 的型別系統
5. **標準化** - 遵循 OpenAPI 3.0 規範

## 實作完成日期
2025-09-16

## 相關文檔
- [Fastify Swagger 官方文檔](https://github.com/fastify/fastify-swagger)
- [OpenAPI 3.0 規範](https://swagger.io/specification/)
- [class-validator 文檔](https://github.com/typestack/class-validator)