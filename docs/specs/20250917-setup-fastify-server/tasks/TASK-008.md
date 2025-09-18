# TASK-008: 中間件系統

## 任務概述
實現完整的 Fastify 中間件系統，包括請求日誌、錯誤處理、請求驗證、響應格式化和安全標頭中間件。

## 任務模式
**Code 模式** - 用於具體的中間件實作

## 任務目標
- 實現請求日誌中間件
- 實現錯誤處理中間件
- 實現請求驗證中間件
- 實現響應格式化中間件
- 實現安全標頭中間件

## 具體實作步驟

### 1. 請求日誌中間件
- [ ] 實現請求日誌記錄：
  - `requestLogger(): FastifyPlugin` - 請求日誌中間件
  - `logRequestStart(request: FastifyRequest): void` - 請求開始日誌
  - `logRequestEnd(request: FastifyRequest, reply: FastifyReply): void` - 請求結束日誌
  - `logRequestError(request: FastifyRequest, error: Error): void` - 請求錯誤日誌
- [ ] 實現請求追蹤：
  - `generateRequestId(): string` - 生成請求 ID
  - `setRequestContext(request: FastifyRequest, context: object): void` - 設置請求上下文
  - `getRequestContext(request: FastifyRequest): object` - 獲取請求上下文
  - `getRequestId(request: FastifyRequest): string` - 獲取請求 ID
- [ ] 實現性能監控：
  - `measureRequestTime(request: FastifyRequest, startTime: number): number` - 測量請求時間
  - `logRequestMetrics(request: FastifyRequest, metrics: RequestMetrics): void` - 記錄請求指標
  - `getRequestMetrics(request: FastifyRequest): RequestMetrics` - 獲取請求指標

### 2. 錯誤處理中間件
- [ ] 實現全局錯誤處理：
  - `errorHandler(): FastifyPlugin` - 錯誤處理中間件
  - `handleAppError(error: AppError, request: FastifyRequest, reply: FastifyReply): void` - 處理應用錯誤
  - `handleValidationError(error: ValidationError, request: FastifyRequest, reply: FastifyReply): void` - 處理驗證錯誤
  - `handleDatabaseError(error: DatabaseError, request: FastifyRequest, reply: FastifyReply): void` - 處理數據庫錯誤
- [ ] 實現錯誤響應格式化：
  - `formatErrorResponse(error: Error): ErrorResponse` - 格式化錯誤響應
  - `logErrorWithContext(error: Error, request: FastifyRequest): void` - 記錄錯誤上下文
  - `sendErrorResponse(reply: FastifyReply, error: Error): void` - 發送錯誤響應
- [ ] 實現錯誤恢復機制：
  - `isRecoverableError(error: Error): boolean` - 判斷錯誤是否可恢復
  - `recoverFromError(error: Error): Promise<void>` - 從錯誤中恢復
  - `shouldRetryRequest(error: Error): boolean` - 判斷是否重試請求

### 3. 請求驗證中間件
- [ ] 實現請求體驗證：
  - `requestBodyValidator(schema: object): FastifyPlugin` - 請求體驗證中間件
  - `validateRequestBody(request: FastifyRequest, schema: object): ValidationResult` - 驗證請求體
  - `sanitizeRequestBody(request: FastifyRequest): object` - 清理請求體
  - `transformRequestBody(request: FastifyRequest): object` - 轉換請求體
- [ ] 實現參數驗證：
  - `paramValidator(schema: object): FastifyPlugin` - 參數驗證中間件
  - `validateParams(request: FastifyRequest, schema: object): ValidationResult` - 驗證參數
  - `validateQuery(request: FastifyRequest, schema: object): ValidationResult` - 驗證查詢參數
  - `validateHeaders(request: FastifyRequest, schema: object): ValidationResult` - 驗證頭部
- [ ] 實現文件驗證：
  - `fileValidator(schema: object): FastifyPlugin` - 文件驗證中間件
  - `validateFile(file: any, schema: object): ValidationResult` - 驗證文件
  - `validateFileType(file: any, allowedTypes: string[]): boolean` - 驗證文件類型
  - `validateFileSize(file: any, maxSize: number): boolean` - 驗證文件大小

### 4. 響應格式化中間件
- [ ] 實現響應格式化：
  - `responseFormatter(): FastifyPlugin` - 響應格式化中間件
  - `formatSuccessResponse(data: any): SuccessResponse` - 格式化成功響應
  - `formatPaginatedResponse(data: any, pagination: Pagination): PaginatedResponse` - 格式化分頁響應
  - `formatErrorResponse(error: Error): ErrorResponse` - 格式化錯誤響應
- [ ] 實現響應轉換：
  - `transformResponse(data: any, transformer: Function): any` - 轉換響應數據
  - `serializeResponse(data: any): string` - 序列化響應
  - `compressResponse(data: any): string` - 壓縮響應
  - `cacheResponse(data: any, ttl: number): void` - 緩存響應
- [ ] 實現響應頭部設置：
  - `setResponseHeaders(reply: FastifyReply, headers: object): void` - 設置響應頭部
  - `setCacheHeaders(reply: FastifyReply, cacheConfig: CacheConfig): void` - 設置緩存頭部
  - `setSecurityHeaders(reply: FastifyReply): void` - 設置安全頭部
  - `setCorsHeaders(reply: FastifyReply): void` - 設置 CORS 頭部

### 5. 安全標頭中間件
- [ ] 實現安全標頭設置：
  - `securityHeaders(): FastifyPlugin` - 安全標頭中間件
  - `setHelmetHeaders(reply: FastifyReply): void` - 設置 Helmet 標頭
  - `setCSPHeaders(reply: FastifyReply): void` - 設置內容安全策略
  - `setXSSProtectionHeaders(reply: FastifyReply): void` - 設置 XSS 保護
- [ ] 實現速率限制：
  - `rateLimiter(options: RateLimiterOptions): FastifyPlugin` - 速率限制中間件
  - `checkRateLimit(request: FastifyRequest): RateLimitResult` - 檢查速率限制
  - `updateRateLimit(request: FastifyRequest): void` - 更新速率限制
  - `blockRateLimitedRequest(request: FastifyRequest, reply: FastifyReply): void` - 阻擋速率限制請求
- [ ] 實現 IP 白名單/黑名單：
  - `ipWhitelist(whitelist: string[]): FastifyPlugin` - IP 白名單中間件
  - `ipBlacklist(blacklist: string[]): FastifyPlugin` - IP 黑名單中間件
  - `checkIPWhitelist(request: FastifyRequest, whitelist: string[]): boolean` - 檢查 IP 白名單
  - `checkIPBlacklist(request: FastifyRequest, blacklist: string[]): boolean` - 檢查 IP 黑名單

## 預期交付物
- 請求日誌中間件
- 錯誤處理中間件
- 請求驗證中間件
- 響應格式化中間件
- 安全標頭中間件
- 中間件系統文檔

## 測試要求
- [ ] 所有中間件單元測試覆蓋率 > 90%
- [ ] 中間件組合測試正常
- [ ] 錯誤處理機制有效
- [ ] 安全標頭設置正確
- [ ] 性能影響最小化
- [ ] 邊界情況處理完善

## 相關文檔
- [Fastify 中間件文檔](https://fastify.dev/docs/latest/Reference/Middleware/)
- [Helmet 安全標頭](https://helmetjs.github.io/)
- [Joi 驗證庫](https://joi.dev/)
- [速率限制庫](https://github.com/nfriedly/express-rate-limit)

## 任務依賴
- **前置依賴**: TASK-007（Fastify 實例建立）

## 優先級
**P0 必需任務**

## 預估工時
5-6 小時

## 負責人
後端開發者