# TASK-007: Fastify 實例建立

## 任務概述
實現 Fastify 實例的建立和配置，包括基本設定、實例管理和伺服器啟動/關閉邏輯。

## 任務模式
**Code 模式** - 用於具體的 Fastify 實例實作

## 任務目標
- 實現 FastifyFactory 類別
- 配置 Fastify 基本設定
- 實現實例管理機制
- 建立伺服器啟動/關閉邏輯

## 具體實作步驟

### 1. FastifyFactory 類別實作
- [ ] 建立工廠類別基礎結構：
  - 定義 FastifyFactory 類別
  - 實現單例模式
  - 配置依賴注入
  - 實例化 Fastify 框架
- [ ] 實現實例創建方法：
  - `createInstance(): FastifyInstance` - 創建 Fastify 實例
  - `createInstanceWithConfig(config: object): FastifyInstance` - 帶配置創建實例
  - `createInstanceWithPlugins(plugins: Plugin[]): FastifyInstance` - 帶插件創建實例
  - `createInstanceWithAll(config: object, plugins: Plugin[]): FastifyInstance` - 完整配置創建實例
- [ ] 實現實例配置：
  - 設置伺服器端口和主機
  - 配置請求體限制
  - 設置超時時間
  - 配置日誌級別
  - 啟動 CORS 支持

### 2. Fastify 基本設定
- [ ] 配置伺服器基本設定：
  - `trustProxy`: 信任代理
  - `bodyLimit`: 請求體大小限制
  - `maxParamLength`: 最大參數長度
  - `querystringParser`: 查詢字符串解析器
  - `jsonBodyParser`: JSON 體解析器
- [ ] 配置日誌設定：
  - `logger`: 日誌實例
  - `logLevel`: 日誌級別
  - `logSerializers`: 日誌序列化器
  - `logLevel`: 日誌級別控制
- [ ] 配置安全設定：
  - `disableRequestLogging`: 禁用請求日誌
  - `exposeHeadRoutes`: 暴露 HEAD 路由
  - `pluginTimeout`: 插件超時時間
  - `caseSensitive`: 路由大小寫敏感

### 3. 實例管理機制
- [ ] 實現實例生命週期管理：
  - `getInstance(): FastifyInstance` - 獲取實例
  - `isInstanceCreated(): boolean` - 檢查實例是否存在
  - `resetInstance(): void` - 重置實例
  - `destroyInstance(): void` - 銷毀實例
- [ ] 實現實例狀態管理：
  - `isServerRunning(): boolean` - 檢查伺服器運行狀態
  - `getServerStatus(): ServerStatus` - 獲取伺服器狀態
  - `getInstanceInfo(): InstanceInfo` - 獲取實例信息
  - `getInstanceMetrics(): InstanceMetrics` - 獲取實例指標
- [ ] 實現實例池管理：
  - `createInstancePool(size: number): FastifyInstance[]` - 創建實例池
  - `getInstanceFromPool(): FastifyInstance` - 從池中獲取實例
  - `returnInstanceToPool(instance: FastifyInstance): void` - 返回實例到池
  - `destroyInstancePool(): void` - 銷毀實例池

### 4. 伺服器啟動/關閉邏輯
- [ ] 實現伺服器啟動：
  - `startServer(): Promise<void>` - 啟動伺服器
  - `startServerWithConfig(config: object): Promise<void>` - 帶配置啟動
  - `startServerGracefully(): Promise<void>` - 優雅啟動
  - `startServerWithHealthCheck(): Promise<void>` - 健康檢查啟動
- [ ] 實現伺服器關閉：
  - `stopServer(): Promise<void>` - 停止伺服器
  - `stopServerGracefully(): Promise<void>` - 優雅停止
  - `stopServerForcefully(): Promise<void>` - 強制停止
  - `stopServerWithTimeout(timeout: number): Promise<void>` - 超時停止
- [ ] 實現信號處理：
  - `setupSignalHandlers(): void` - 設置信號處理
  - `handleSIGINT(): void` - 處理 SIGINT 信號
  - `handleSIGTERM(): void` - 處理 SIGTERM 信號
  - `handleSIGHUP(): void` - 處理 SIGHUP 信號

## 預期交付物
- FastifyFactory 類別實作
- Fastify 基本配置
- 實例管理機制
- 伺服器啟動/關閉邏輯
- Fastify 實例文檔

## 測試要求
- [ ] Fastify 實例正常創建
- [ ] 基本設定配置正確
- [ ] 實例管理機制有效
- [ ] 伺服器啟動/關閉正常
- [ ] 信號處理機制完善
- [ ] 錯誤處理機制有效

## 相關文檔
- [Fastify 官方文檔](https://fastify.dev/docs/latest/)
- [Fastify 實例創建](https://fastify.dev/docs/latest/Reference/Server/)
- [Fastify 配置選項](https://fastify.dev/docs/latest/Reference/Server/#server-options)
- [Node.js 信號處理](https://nodejs.org/api/process.html#process_signal_events)

## 任務依賴
- **前置依賴**: TASK-006（基本工具函數）

## 優先級
**P0 必需任務**

## 預估工時
4-5 小時

## 負責人
後端開發者