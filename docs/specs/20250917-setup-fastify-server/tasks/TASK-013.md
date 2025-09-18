# TASK-013: Repository 模式

## 任務概述
實現 Repository 模式，包括通用 Repository 介面和具體的 Repository 類別實作。

## 任務模式
**Code 模式** - 用於具體的 Repository 模式實作

## 任務目標
- 實現 UserRepository 類別
- 實現 ProductRepository 類別
- 實現 OrderRepository 類別
- 建立通用 Repository 介面

## 具體實作步驟

### 1. 通用 Repository 介面
- [ ] 定義 Repository 介面：
  - `IRepository<T>` 通用介面
  - `IBaseRepository<T>` 基礎介面
  - `IRepository<T, ID>` 帶 ID 的介面
  - `IReadOnlyRepository<T>` 只讀介面
- [ ] 實現基本 CRUD 操作：
  - `save(entity: T): Promise<T>` - 保存實體
  - `findById(id: ID): Promise<T | null>` - 根據 ID 查找
  - `findAll(): Promise<T[]>` - 查找所有
  - `update(entity: T): Promise<T>` - 更新實體
  - `delete(id: ID): Promise<boolean>` - 刪除實體
  - `exists(id: ID): Promise<boolean>` - 檢查是否存在
- [ ] 實現查詢方法：
  - `find(options: FindOptions<T>): Promise<T[]>` - 條件查找
  - `findOne(options: FindOneOptions<T>): Promise<T | null>` - 查找單個
  - `count(options: FindOptions<T>): Promise<number>` - 計數
  - `exists(options: FindOptions<T>): Promise<boolean>` - 檢查存在

### 2. UserRepository 類別實作
- [ ] 實現 UserRepository 類別：
  - `UserRepository` 類別定義
  - 繼承 `BaseRepository<User>`
  - 實現用戶相關業務邏輯
  - 實現用戶查詢優化
- [ ] 實現用戶查詢方法：
  - `findByEmail(email: string): Promise<User | null>` - 根據郵箱查找
  - `findByUsername(username: string): Promise<User | null>` - 根據用戶名查找
  - `findByPhone(phone: string): Promise<User | null>` - 根據電話查找
  - `findActiveUsers(): Promise<User[]>` - 查找活躍用戶
  - `findInactiveUsers(): Promise<User[]>` - 查找非活躍用戶
- [ ] 實現用戶統計方法：
  - `countUsers(): Promise<number>` - 計算用戶數量
  - `countActiveUsers(): Promise<number>` - 計算活躍用戶數量
  - `countUsersByRole(role: string): Promise<number>` - 根據角色計算用戶數量
  - `countUsersByRegistrationDate(startDate: Date, endDate: Date): Promise<number>` - 根據註冊日期計算

### 3. ProductRepository 類別實作
- [ ] 實現 ProductRepository 類別：
  - `ProductRepository` 類別定義
  - 繼承 `BaseRepository<Product>`
  - 實現產品相關業務邏輯
  - 實現產品查詢優化
- [ ] 實現產品查詢方法：
  - `findByCategory(categoryId: string): Promise<Product[]>` - 根據分類查找
  - `findByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]>` - 根據價格範圍查找
  - `findAvailableProducts(): Promise<Product[]>` - 查找可用產品
  - `findFeaturedProducts(): Promise<Product[]>` - 查找特色產品
  - `searchProducts(keyword: string): Promise<Product[]>` - 搜索產品
- [ ] 實現產品統計方法：
  - `countProducts(): Promise<number>` - 計算產品數量
  - `countProductsByCategory(categoryId: string): Promise<number>` - 根據分類計算產品數量
  - `countAvailableProducts(): Promise<number>` - 計算可用產品數量
  - `getLowStockProducts(threshold: number): Promise<Product[]>` - 獲取低庫存產品

### 4. OrderRepository 類別實作
- [ ] 實現 OrderRepository 類別：
  - `OrderRepository` 類別定義
  - 繼承 `BaseRepository<Order>`
  - 實現訂單相關業務邏輯
  - 實現訂單查詢優化
- [ ] 實現訂單查詢方法：
  - `findByUserId(userId: string): Promise<Order[]>` - 根據用戶 ID 查找
  - `findByStatus(status: string): Promise<Order[]>` - 根據狀態查找
  - `findByDateRange(startDate: Date, endDate: Date): Promise<Order[]>` - 根據日期範圍查找
  - `findPendingOrders(): Promise<Order[]>` - 查找待處理訂單
  - `findCompletedOrders(): Promise<Order[]>` - 查找已完成訂單
- [ ] 實現訂單統計方法：
  - `countOrders(): Promise<number>` - 計算訂單數量
  - `countOrdersByStatus(status: string): Promise<number>` - 根據狀態計算訂單數量
  - `countOrdersByDateRange(startDate: Date, endDate: Date): Promise<number>` - 根據日期範圍計算
  - `getTotalRevenue(startDate: Date, endDate: Date): Promise<number>` - 獲取總收入

## 預期交付物
- 通用 Repository 介面定義
- UserRepository 類別實作
- ProductRepository 類別實作
- OrderRepository 類別實作
- Repository 模式文檔

## 測試要求
- [ ] 所有 Repository 類別單元測試覆蓋率 > 90%
- [ ] CRUD 操作正常工作
- [ ] 查詢方法結果正確
- [ ] 統計方法計算準確
- [ ] 性能優化有效
- [ ] 錯誤處理機制完善

## 相關文檔
- [Repository 模式](https://martinfowler.com/eaaCatalog/repository.html)
- [TypeORM Repository](https://typeorm.io/docs/repository-api)
- [設計模式：Repository](https://refactoring.guru/design-patterns/repository)
- [數據訪問層最佳實踐](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/infrastructure-persistence-layer-design)

## 任務依賴
- **前置依賴**: TASK-012（資料庫連接管理）

## 優先級
**P0 必需任務**

## 預估工時
5-6 小時

## 負責人
後端開發者