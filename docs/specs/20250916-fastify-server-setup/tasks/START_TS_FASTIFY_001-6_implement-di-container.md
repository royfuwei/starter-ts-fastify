# START_TS_FASTIFY_001-6: 實作 DI 容器整合

## 任務概述

根據參考專案的 tsyringe 使用方式，完整整合 DI 容器到 Fastify 伺服器，實作完整的三層架構（Repository、Service、UseCase）並展示依賴注入的使用。

## 實作內容

### 1. DI 容器設定

#### 1.1 類型定義 (`src/common/container/types.ts`)
- 定義了 Service、Repository、UseCase 層的依賴標識符
- 使用 Symbol.for() 確保唯一性
- 提供統一的 TYPES 導出

```typescript
export const SERVICE_TYPES = {
  DemoService: Symbol.for('DemoService'),
} as const;

export const REPOSITORY_TYPES = {
  DemoRepository: Symbol.for('DemoRepository'),
} as const;

export const USECASE_TYPES = {
  CreateDemoUseCase: Symbol.for('CreateDemoUseCase'),
  GetDemoUseCase: Symbol.for('GetDemoUseCase'),
  UpdateDemoUseCase: Symbol.for('UpdateDemoUseCase'),
  DeleteDemoUseCase: Symbol.for('DeleteDemoUseCase'),
} as const;
```

#### 1.2 容器初始化 (`src/common/container/container.ts`)
- 實作 AppContainer 類別管理 DI 容器
- 提供自動註冊各層依賴的功能
- 支援單例和瞬時依賴註冊

### 2. DI 裝飾器輔助工具

#### 2.1 注入裝飾器 (`src/common/decorators/inject.decorator.ts`)
- 簡化 tsyringe 的注入語法
- 重新導出常用的 tsyringe 裝飾器

#### 2.2 服務層裝飾器 (`src/common/decorators/service.decorator.ts`)
- `@Service()` - 標記 Service 層類別
- `@Repository()` - 標記 Repository 層類別
- `@UseCase()` - 標記 UseCase 層類別
- `@SingletonService()` - 標記單例服務

### 3. 三層架構實作

#### 3.1 Repository 層
**介面** (`src/repositories/demo/demo.repository.interface.ts`):
- 定義資料存取層的契約
- 包含 CRUD 操作和查詢方法

**實作** (`src/repositories/demo/demo.repository.ts`):
- 使用 `@Repository(TYPES.DemoRepository)` 裝飾器
- 實作記憶體模擬的資料存取
- 提供完整的 Demo 項目管理功能

#### 3.2 Service 層
**介面** (`src/services/demo/demo.service.interface.ts`):
- 定義業務邏輯層的契約
- 包含業務驗證和複雜查詢

**實作** (`src/services/demo/demo.service.ts`):
- 使用 `@Service(TYPES.DemoService)` 裝飾器
- 注入 Repository 依賴：`@Inject(TYPES.DemoRepository)`
- 實作業務邏輯驗證和資料處理

#### 3.3 UseCase 層
實作四個主要的 UseCase：

1. **CreateDemoUseCase** (`src/usecases/demo/create-demo.usecase.ts`)
   - 處理建立 Demo 項目的業務流程
   - 包含操作日誌記錄

2. **GetDemoUseCase** (`src/usecases/demo/get-demo.usecase.ts`)
   - 處理查詢 Demo 項目的業務流程
   - 支援分頁和篩選

3. **UpdateDemoUseCase** (`src/usecases/demo/update-demo.usecase.ts`)
   - 處理更新 Demo 項目的業務流程

4. **DeleteDemoUseCase** (`src/usecases/demo/delete-demo.usecase.ts`)
   - 處理刪除 Demo 項目的業務流程

### 4. 控制器整合

更新 `src/controllers/demo/demo.controller.ts`：
- 注入所有相關的 UseCase
- 使用 `@Inject()` 裝飾器進行依賴注入
- 將原本的直接資料操作改為透過 UseCase 處理

```typescript
constructor(
  @Inject(TYPES.CreateDemoUseCase)
  private readonly createDemoUseCase: CreateDemoUseCase,
  @Inject(TYPES.GetDemoUseCase)
  private readonly getDemoUseCase: GetDemoUseCase,
  @Inject(TYPES.UpdateDemoUseCase)
  private readonly updateDemoUseCase: UpdateDemoUseCase,
  @Inject(TYPES.DeleteDemoUseCase)
  private readonly deleteDemoUseCase: DeleteDemoUseCase
) {}
```

### 5. 應用程式啟動整合

#### 5.1 更新 main.ts
- 在伺服器啟動前初始化 DI 容器
- 確保所有依賴都已正確註冊

```typescript
// 初始化 DI 容器
await AppContainer.initialize();

// 啟動 Fastify 伺服器
app = await startServer();
```

#### 5.2 更新 server/app.ts
- 整合 AppContainer 到 Fastify 應用程式
- 確保控制器能正確從 DI 容器解析

## 資料流向說明

### 完整的三層架構資料流：

```
HTTP Request
    ↓
Controller (注入 UseCase)
    ↓
UseCase (注入 Service)
    ↓
Service (注入 Repository)
    ↓
Repository (資料存取)
    ↓
Response
```

### 依賴注入流程：

1. **應用程式啟動時**：
   - `AppContainer.initialize()` 註冊所有依賴
   - Repository → Service → UseCase → Controller 依序註冊

2. **請求處理時**：
   - Fastify 從 DI 容器解析 Controller
   - Controller 自動獲得注入的 UseCase 依賴
   - UseCase 自動獲得注入的 Service 依賴
   - Service 自動獲得注入的 Repository 依賴

## DI 容器使用範例

### 基本注入範例：

```typescript
@Service(TYPES.DemoService)
export class DemoService implements IDemoService {
  constructor(
    @Inject(TYPES.DemoRepository)
    private readonly demoRepository: IDemoRepository
  ) {}
}
```

### 手動解析範例：

```typescript
// 從容器手動解析依賴
const demoService = AppContainer.resolve<IDemoService>(TYPES.DemoService);
```

### 動態註冊範例：

```typescript
// 註冊新的依賴
AppContainer.registerSingleton(TYPES.NewService, NewServiceImpl);
```

## 測試結果

✅ **DI 容器初始化成功**
- 所有依賴層級都已正確註冊
- 容器啟動日誌顯示：
  ```
  🔧 Initializing DI Container...
  📦 Registering Repository dependencies...
  🔧 Registering Service dependencies...
  🎯 Registering UseCase dependencies...
  🎮 Registering Controller dependencies...
  ✅ DI Container initialized successfully
  ```

✅ **路由註冊成功**
- 所有 Demo API 端點都已正確註冊
- 控制器依賴注入正常運作

✅ **三層架構完整實作**
- Repository 層：資料存取抽象
- Service 層：業務邏輯處理
- UseCase 層：應用程式流程控制

## 技術特點

1. **完全的依賴反轉**：各層只依賴抽象介面，不依賴具體實作
2. **自動依賴解析**：透過裝飾器自動處理依賴注入
3. **單一職責**：每層都有明確的職責分工
4. **易於測試**：可輕鬆替換依賴進行單元測試
5. **擴展性強**：新增功能只需實作對應介面

## 後續改進建議

1. **錯誤處理優化**：統一的錯誤處理機制
2. **日誌系統整合**：結構化日誌記錄
3. **驗證中間件**：請求資料驗證
4. **快取層**：Service 層快取機制
5. **事務管理**：資料庫事務支援

## 結論

成功實作了完整的 DI 容器整合，建立了清晰的三層架構，並展示了依賴注入在 Fastify 應用程式中的實際應用。整個系統具有良好的可維護性、可測試性和擴展性。