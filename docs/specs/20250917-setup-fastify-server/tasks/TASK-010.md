# TASK-010: 錯誤處理機制

## 任務概述
實現完整的錯誤處理系統，包括 AppError 類別、錯誤分類系統、統一錯誤響應格式和錯誤日誌記錄。

## 任務模式
**Code 模式** - 用於具體的錯誤處理實作

## 任務目標
- 實現 AppError 類別
- 建立錯誤分類系統
- 實現統一錯誤響應格式
- 建立錯誤日誌記錄

## 具體實作步驟

### 1. AppError 類別實作
- [ ] 建立基礎 AppError 類別：
  - `AppError` 類別定義
  - 繼承 Error 類別
  - 實現基本屬性：message, code, statusCode, timestamp
  - 實現基本方法：toString(), toJSON()
- [ ] 實現 AppError 構造函數：
  - `constructor(message: string, code: string, statusCode: number)`
  - 支持自定義錯誤消息
  - 支持錯誤代碼設置
  - 支持狀態碼設置
  - 支持錯誤上下文設置
- [ ] 實現 AppError 方法：
  - `isAppError(error: any): boolean` - 判斷是否為 AppError
  - `getErrorCode(error: AppError): string` - 獲取錯誤代碼
  - `getErrorMessage(error: AppError): string` - 獲取錯誤消息
  - `getErrorStatusCode(error: AppError): number` - 獲取錯誤狀態碼
  - `getErrorContext(error: AppError): object` - 獲取錯誤上下文

### 2. 錯誤分類系統
- [ ] 定義錯誤類型：
  - `ValidationError`: 驗證錯誤
  - `AuthenticationError`: 認證錯誤
  - `AuthorizationError`: 授權錯誤
  - `DatabaseError`: 數據庫錯誤
  - `NotFoundError`: 資源未找到錯誤
  - `ConflictError`: 衝突錯誤
  - `InternalError`: 內部錯誤
- [ ] 實現錯誤類別繼承：
  - `class ValidationError extends AppError`
  - `class AuthenticationError extends AppError`
  - `class AuthorizationError extends AppError`
  - `class DatabaseError extends AppError`
  - `class NotFoundError extends AppError`
  - `class ConflictError extends AppError`
  - `class InternalError extends AppError`
- [ ] 實現錯誤工廠方法：
  - `createValidationError(message: string, field?: string): ValidationError`
  - `createAuthenticationError(message: string): AuthenticationError`
  - `createAuthorizationError(message: string): AuthorizationError`
  - `createDatabaseError(message: string): DatabaseError`
  - `createNotFoundError(message: string): NotFoundError`
  - `createConflictError(message: string): ConflictError`
  - `createInternalError(message: string): InternalError`

### 3. 統一錯誤響應格式
- [ ] 定義錯誤響應接口：
  - `ErrorResponse` 接口定義
  - 包含：success, error, code, message, timestamp, path, requestId
  - 支持錯誤詳情字段
  - 支持錯誤堆棧信息
- [ ] 實現錯誤響應格式化：
  - `formatErrorResponse(error: Error): ErrorResponse` - 格式化錯誤響應
  - `formatValidationError(error: ValidationError): ErrorResponse` - 格式化驗證錯誤響應
  - `formatAuthenticationError(error: AuthenticationError): ErrorResponse` - 格式化認證錯誤響應
  - `formatAuthorizationError(error: AuthorizationError): ErrorResponse` - 格式化授權錯誤響應
- [ ] 實現錯誤響應發送：
  - `sendErrorResponse(reply: FastifyReply, error: Error): void` - 發送錯誤響應
  - `sendValidationError(reply: FastifyReply, error: ValidationError): void` - 發送驗證錯誤響應
  - `sendAuthenticationError(reply: FastifyReply, error: AuthenticationError): void` - 發送認證錯誤響應
  - `sendAuthorizationError(reply: FastifyReply, error: AuthorizationError): void` - 發送授權錯誤響應

### 4. 錯誤日誌記錄
- [ ] 實現錯誤日誌記錄：
  - `logError(error: Error): void` - 記錄錯誤
  - `logErrorWithContext(error: Error, context: object): void` - 記錄錯誤上下文
  - `logErrorStack(error: Error): void` - 記錄錯誤堆棧
  - `logErrorRequest(error: Error, request: FastifyRequest): void` - 記錄錯誤請求信息
- [ ] 實現錯誤日誌格式化：
  - `formatErrorLog(error: Error): string` - 格式化錯誤日誌
  - `formatErrorContextLog(error: Error, context: object): string` - 格式化錯誤上下文日誌
  - `formatErrorStackLog(error: Error): string` - 格式化錯誤堆棧日誌
  - `formatErrorRequestLog(error: Error, request: FastifyRequest): string` - 格式化錯誤請求日誌
- [ ] 實現錯誤日誌級別控制：
  - `setErrorLogLevel(level: LogLevel): void` - 設置錯誤日誌級別
  - `shouldLogError(error: Error): boolean` - 判斷是否記錄錯誤
  - `shouldLogErrorStack(error: Error): boolean` - 判斷是否記錄錯誤堆棧
  - `shouldLogErrorContext(error: Error): boolean` - 判斷是否記錄錯誤上下文

## 預期交付物
- AppError 類別實作
- 錯誤分類系統
- 統一錯誤響應格式
- 錯誤日誌記錄機制
- 錯誤處理文檔

## 測試要求
- [ ] AppError 類別功能正常
- [ ] 錯誤分類系統有效
- [ ] 統一錯誤響應格式正確
- [ ] 錯誤日誌記錄完整
- [ ] 錯誤處理性能優化
- [ ] 邊界情況處理完善

## 相關文檔
- [Error 對象文檔](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- [Fastify 錯誤處理](https://fastify.dev/docs/latest/Reference/Errors/)
- [REST API 錯誤處理](https://restfulapi.net/http-status-codes/)
- [日誌記錄最佳實踐](https://github.com/winstonjs/winston)

## 任務依賴
- **前置依賴**: TASK-009（路由系統）

## 優先級
**P0 必需任務**

## 預估工時
4-5 小時

## 負責人
後端開發者