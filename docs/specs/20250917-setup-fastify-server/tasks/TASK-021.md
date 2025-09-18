# TASK-021: 產品服務

## 任務概述
實現完整的產品服務，包括產品管理功能、產品查詢功能和產品服務測試。

## 任務模式
**Code 模式** - 用於具體的產品服務實作

## 任務目標
- 實現 ProductService 類別
- 實現產品管理功能
- 實現產品查詢功能
- 建立產品服務測試

## 具體實作步驟

### 1. ProductService 類別實作
- [ ] 建立產品服務基礎結構：
  - `ProductService` 類別定義
  - 依賴注入 ProductRepository
  - 依賴注入 CategoryRepository
  - 依賴注入 CacheService
  - 實現服務生命周期管理
- [ ] 實現產品服務構造函數：
  - `constructor(productRepository: IProductRepository, categoryRepository: ICategoryRepository, cacheService: ICacheService)`
  - 初始化服務依賴
  - 設置服務配置
  - 註冊服務事件
- [ ] 實現服務配置：
  - `configure(config: ProductServiceConfig): void` - 配置服務
  - `getConfig(): ProductServiceConfig` - 獲取配置
  - `validateConfig(): boolean` - 驗證配置
  - `resetConfig(): void` - 重置配置

### 2. 產品管理功能
- [ ] 實現產品 CRUD 操作：
  - `createProduct(productData: CreateProductDto): Promise<Product>` - 創建產品
  - `getProductById(productId: string): Promise<Product | null>` - 根據 ID 獲取產品
  - `getProductBySku(sku: string): Promise<Product | null>` - 根據 SKU 獲取產品
  - `updateProduct(productId: string, productData: UpdateProductDto): Promise<Product>` - 更新產品
  - `deleteProduct(productId: string): Promise<boolean>` - 刪除產品
  - `restoreProduct(productId: string): Promise<Product>` - 恢復產品
- [ ] 實現產品狀態管理：
  - `activateProduct(productId: string): Promise<Product>` - 激活產品
  - `deactivateProduct(productId: string): Promise<Product>` - 停用產品
  - `archiveProduct(productId: string): Promise<Product>` - 歸檔產品
  - `unarchiveProduct(productId: string): Promise<Product>` - 取消歸檔
  - `setProductFeatured(productId: string, featured: boolean): Promise<Product>` - 設置產品特色
- [ ] 實現產品庫存管理：
  - `updateProductStock(productId: string, quantity: number): Promise<Product>` - 更新庫存
  - `checkProductStock(productId: string): Promise<number>` - 檢查庫存
  - `reserveProductStock(productId: string, quantity: number): Promise<boolean>` - 預留庫存
  - `releaseProductStock(productId: string, quantity: number): Promise<boolean>` - 釋放庫存
  - `getProductStockHistory(productId: string): Promise<StockHistory[]>` - 獲取庫存歷史

### 3. 產品查詢功能
- [ ] 實現產品查詢：
  - `getProducts(options: GetProductsOptions): Promise<Product[]>` - 獲取產品列表
  - `searchProducts(query: SearchProductsQuery): Promise<Product[]>` - 搜索產品
  - `filterProducts(filters: ProductFilters): Promise<Product[]>` - 過濾產品
  - `countProducts(filters: ProductFilters): Promise<number>` - 計算產品數量
- [ ] 實現產品分類查詢：
  - `getProductsByCategory(categoryId: string): Promise<Product[]>` - 根據分類獲取產品
  - `getProductsByCategoryTree(categoryIds: string[]): Promise<Product[]>` - 根據分類樹獲取產品
  - `getFeaturedProducts(categoryId?: string): Promise<Product[]>` - 獲取特色產品
  - `getNewArrivals(categoryId?: string): Promise<Product[]>` - 獲取新到產品
- [ ] 實現產品推薦：
  - `getRecommendedProducts(userId: string): Promise<Product[]>` - 獲取推薦產品
  - `getRelatedProducts(productId: string): Promise<Product[]>` - 獲取相關產品
  - `getFrequentlyBoughtTogether(productId: string): Promise<Product[]>` - 獲取經常一起購買的產品
  - `getProductsByPriceRange(minPrice: number, maxPrice: number): Promise<Product[]>` - 根據價格範圍獲取產品

### 4. 產品服務測試
- [ ] 實現單元測試：
  - `ProductService` 類別單元測試
  - `createProduct` 方法測試
  - `getProductById` 方法測試
  - `updateProduct` 方法測試
  - `deleteProduct` 方法測試
- [ ] 實現整合測試：
  - `ProductService` 與 `ProductRepository` 整合測試
  - `ProductService` 與 `CategoryRepository` 整合測試
  - `ProductService` 與 `CacheService` 整合測試
  - `ProductService` 端到端測試
- [ ] 實現性能測試：
  - `ProductService` 性能基準測試
  - 並發產品操作測試
  - 大數據量處理測試
  - 響應時間測試
- [ ] 實現錯誤處理測試：
  - 異常情況處理測試
  - 邊界條件測試
  - 錯誤恢復測試
  - 日誌記錄測試

## 預期交付物
- ProductService 類別實作
- 產品管理功能
- 產品查詢功能
- 產品服務測試套件
- 產品服務文檔

## 測試要求
- [ ] 單元測試覆蓋率 > 90%
- [ ] 整合測試覆蓋率 > 80%
- [ ] 端到端測試覆蓋率 > 70%
- [ ] 性能測試指標符合要求
- [ ] 錯誤處理測試完善
- [ ] 自動化測試流程正常

## 相關文檔
- [服務層設計模式](https://martinfowler.com/eaaCatalog/serviceLayer.html)
- [產品管理最佳實踐](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/seedwork-domain-model-base-class)
- [測試驅動開發](https://martinfowler.com/bliki/TestDrivenDevelopment.html)
- [單元測試最佳實踐](https://github.com/jestjs/jest)

## 任務依賴
- **前置依賴**: TASK-020（用戶服務）

## 優先級
**P2 一般任務**

## 預估工時
4-5 小時

## 負責人
後端開發者