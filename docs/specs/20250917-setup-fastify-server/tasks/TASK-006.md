# TASK-006: 基本工具函數

## 任務概述
實現通用的工具函數，包括常數定義、錯誤處理、數據格式化等功能。

## 任務模式
**Code 模式** - 用於具體的工具函數實作

## 任務目標
- 實現通用工具函數
- 建立常數定義
- 實現錯誤處理工具
- 建立數據格式化工具

## 具體實作步驟

### 1. 通用工具函數
- [ ] 實現日期時間工具：
  - `formatDate(date: Date, format: string): string` - 日期格式化
  - `parseDate(dateString: string): Date` - 日期解析
  - `isDateValid(dateString: string): boolean` - 日期驗證
  - `getDaysBetween(startDate: Date, endDate: Date): number` - 天數計算
- [ ] 實現數字工具：
  - `formatNumber(number: number, decimals: number): string` - 數字格式化
  - `parseNumber(numberString: string): number` - 數字解析
  - `isNumberValid(numberString: string): boolean` - 數字驗證
  - `calculatePercentage(value: number, total: number): number` - 百分比計算
- [ ] 實現字符串工具：
  - `isEmptyString(str: string): boolean` - 空字符串檢查
  - `truncateString(str: string, length: number): string` - 字符串截斷
  - `sanitizeString(str: string): string` - 字符串清理
  - `generateRandomString(length: number): string` - 隨機字符串生成
- [ ] 實現數組工具：
  - `uniqueArray<T>(array: T[]): T[]` - 數組去重
  - `chunkArray<T>(array: T[], size: number): T[][]` - 數组分塊
  - `flattenArray<T>(array: T[][]): T[]` - 數組展平
  - `groupBy<T>(array: T[], key: keyof T): Record<string, T[]>` - 分組

### 2. 常數定義
- [ ] 建立應用常數：
  - `APP_NAME`: 應用名稱
  - `APP_VERSION`: 應用版本
  - `APP_ENV`: 應用環境
  - `APP_PORT`: 應用端口
  - `APP_HOST`: 應用主機
- [ ] 建立數據庫常數：
  - `DB_MAX_CONNECTIONS`: 最大連接數
  - `DB_CONNECTION_TIMEOUT`: 連接超時
  - `DB_QUERY_TIMEOUT`: 查詢超時
  - `DB_POOL_MIN`: 最小連接池
  - `DB_POOL_MAX`: 最大連接池
- [ ] 建立安全常數：
  - `JWT_EXPIRES_IN`: JWT 過期時間
  - `JWT_REFRESH_EXPIRES_IN`: JWT 刷新過期時間
  - `BCRYPT_ROUNDS`: BCrypt 加密輪數
  - `PASSWORD_MIN_LENGTH`: 密碼最小長度
  - `PASSWORD_MAX_LENGTH`: 密碼最大長度
- [ ] 建立API常數：
  - `API_VERSION`: API 版本
  - `API_PREFIX`: API 前綴
  - `API_RATE_LIMIT`: API 速率限制
  - `API_TIMEOUT`: API 超時時間
  - `API_MAX_BODY_SIZE`: API 最大體大小

### 3. 錯誤處理工具
- [ ] 實現錯誤類別：
  - `AppError`: 基礎應用錯誤
  - `ValidationError`: 驗證錯誤
  - `AuthenticationError`: 認證錯誤
  - `AuthorizationError`: 授權錯誤
  - `DatabaseError`: 數據庫錯誤
  - `NotFoundError`: 資源未找到錯誤
- [ ] 實現錯誤處理函數：
  - `createError(message: string, code: string, statusCode: number): AppError` - 創建錯誤
  - `isAppError(error: any): boolean` - 檢查應用錯誤
  - `getErrorCode(error: AppError): string` - 獲取錯誤代碼
  - `getErrorMessage(error: AppError): string` - 獲取錯誤消息
  - `getErrorStatusCode(error: AppError): number` - 獲取錯誤狀態碼
- [ ] 實現錯誤日誌記錄：
  - `logError(error: Error, context?: object): void` - 錯誤日誌記錄
  - `logErrorStack(error: Error): void` - 錯誤堆棧記錄
  - `logErrorContext(error: Error, context: object): void` - 錯誤上下文記錄

### 4. 數據格式化工具
- [ ] 實現 JSON 格式化：
  - `formatJSON(data: any): string` - JSON 格式化
  - `parseJSON(jsonString: string): any` - JSON 解析
  - `validateJSON(jsonString: string): boolean` - JSON 驗證
  - `minifyJSON(jsonString: string): string` - JSON 壓縮
- [ ] 實現對象格式化：
  - `formatObject(obj: object, format: string): string` - 對象格式化
  - `flattenObject(obj: object): object` - 對象展平
  - `unflattenObject(obj: object): object` - 對象反展平
  - `pickObject(obj: object, keys: string[]): object` - 選擇對象屬性
- [ ] 實現數據轉換工具：
  - `camelToSnake(str: string): string` - 駝峰轉下劃線
  - `snakeToCamel(str: string): string` - 下劃線轉駝峰
  - `toTitleCase(str: string): string` - 標題大小寫
  - `toKebabCase(str: string): string` - 短橫線格式

## 預期交付物
- 通用工具函數庫
- 常數定義文件
- 錯誤處理工具類
- 數據格式化工具
- 工具函數文檔

## 測試要求
- [ ] 所有工具函數單元測試覆蓋率 > 90%
- [ ] 常數定義正確且完整
- [ ] 錯誤處理機制有效
- [ ] 數據格式化結果正確
- [ ] 工具函數性能優化
- [ ] 邊界情況處理完善

## 相關文檔
- [Lodash 工具函數文檔](https://lodash.com/docs/)
- [日期時間處理](https://date-fns.org/)
- [字符串處理最佳實踐](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)
- [錯誤處理模式](https://github.com/airbnb/javascript#errors)

## 任務依賴
- **前置依賴**: TASK-005（日誌系統）

## 優先級
**P1 重要任務**

## 預估工時
4-5 小時

## 負責人
後端開發者