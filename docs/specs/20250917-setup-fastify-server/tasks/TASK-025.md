# TASK-025: 產品 API

## 任務概述
實現完整的產品 API，包括產品列表端點、產品詳情端點、產品創建端點、產品更新端點和產品刪除端點。

## 任務模式
**Code 模式** - 用於具體的產品 API 實作

## 任務目標
- 實現產品列表端點
- 實現產品詳情端點
- 實現產品創建端點
- 實現產品更新端點
- 實現產品刪除端點

## 具體實作步驟

### 1. 產品列表端點
- [ ] 實現獲取產品列表 API：
  - `GET /api/v1/products` - 獲取產品列表端點
  - `getProductsController` 獲取產品列表控制器
  - `getProductsValidation` 獲取產品列表驗證
  - `getProductsService` 獲取產品列表服務
  - `getProductsResponse` 獲取產品列表響應
- [ ] 實現列表請求驗證：
  - `GetProductsRequestDto` 獲取產品列表請求數據傳輸對象
  - `page` 頁碼驗證（數字、最小值）
  - `limit` 每頁數量驗證（數字、範圍）
  - `sortBy` 排序字段驗證（字符串、枚舉值）
  - `sortOrder` 排序順序驗證（字符串、枚舉值）
  - `search` 搜索關鍵字驗證（字符串）
  - `category` 分類 ID 驗證（字符串）
  - `priceRange` 價格範圍驗證（對象）
  - `inStock` 庫存狀態驗證（布爾值）
  - `featured` 特色產品驗證（布爾值）
- [ ] 實現列表業務邏輯：
  - `validatePaginationParams()` 驗證分頁參數
  - `applySearchFilters()` 應用搜索過濾器
  - `applyCategoryFilters()` 應用分類過濾器
  - `applyPriceFilters()` 應用價格過濾器
  - `applyStockFilters()` 應用庫存過濾器
  - `applySorting()` 應用排序
  - `getPaginatedProducts()` 獲取分頁產品列表
  - `calculatePaginationMetadata()` 計算分頁元數據

### 2. 產品詳情端點
- [ ] 實現獲取產品詳情 API：
  - `GET /api/v1/products/:id` - 根據 ID 獲取產品詳情端點
  - `getProductByIdController` 獲取產品詳情控制器
  - `getProductByIdValidation` 獲取產品詳情驗證
  - `getProductByIdService` 獲取產品詳情服務
  - `getProductByIdResponse` 獲取產品詳情響應
- [ ] 實現詳情請求驗證：
  - `GetProductByIdRequestDto` 獲取產品詳情請求數據傳輸對象
  - `id` 產品 ID 驗證（格式、存在性）
  - `fields` 返回字段驗證（數組、字段名稱）
  - `include` 包含關係驗證（數組、關係名稱）
  - `includeVariants` 包含變體驗證（布爾值）
  - `includeReviews` 包含評價驗證（布爾值）
- [ ] 實現詳情業務邏輯：
  - `validateProductId()` 驗證產品 ID
  - `checkProductVisibility()` 檢查產品可見性
  - `getProductDetails()` 獲取產品詳情
  - `getProductVariants()` 獲取產品變體
  - `getProductReviews()` 獲取產品評價
  - `formatProductResponse()` 格式化產品響應
  - `cacheProductDetails()` 快取產品詳情

### 3. 產品創建端點
- [ ] 實現創建產品 API：
  - `POST /api/v1/products` - 創建產品端點
  - `createProductController` 創建產品控制器
  - `createProductValidation` 創建產品驗證
  - `createProductService` 創建產品服務
  - `createProductResponse` 創建產品響應
- [ ] 實現創建請求驗證：
  - `CreateProductRequestDto` 創建產品請求數據傳輸對象
  - `name` 產品名稱驗證（字符串、長度、唯一性）
  - `description` 產品描述驗證（字符串、長度）
  - `price` 產品價格驗證（數字、最小值）
  - `sku` 產品 SKU 驗證（字符串、格式、唯一性）
  - `categoryId` 分類 ID 驗證（字符串、存在性）
  - `images` 產品圖片驗證（數組、格式、大小）
  - `stock` 庫存數量驗證（數字、最小值）
  - `tags` 產品標籤驗證（數組、字符串）
- [ ] 實現創建業務邏輯：
  - `validateProductData()` 驗證產品數據
  - `checkCategoryExists()` 檢查分類是否存在
  - `processProductImages()` 處理產品圖片
  - `createProduct()` 創建產品
  - `uploadProductImages()` 上傳產品圖片
  - `indexProductForSearch()` 索引產品用於搜索
  - `notifyProductCreation()` 通知產品創建

### 4. 產品更新端點
- [ ] 實現更新產品 API：
  - `PUT /api/v1/products/:id` - 完整更新產品端點
  - `PATCH /api/v1/products/:id` - 部分更新產品端點
  - `updateProductController` 更新產品控制器
  - `updateProductValidation` 更新產品驗證
  - `updateProductService` 更新產品服務
  - `updateProductResponse` 更新產品響應
- [ ] 實現更新請求驗證：
  - `UpdateProductRequestDto` 更新產品請求數據傳輸對象
  - `id` 產品 ID 驗證（格式、存在性）
  - `name` 產品名稱驗證（字符串、長度、唯一性）
  - `description` 產品描述驗證（字符串、長度）
  - `price` 產品價格驗證（數字、最小值）
  - `sku` 產品 SKU 驗證（字符串、格式、唯一性）
  - `categoryId` 分類 ID 驗證（字符串、存在性）
  - `images` 產品圖片驗證（數組、格式、大小）
  - `stock` 庫存數量驗證（數字、最小值）
  - `tags` 產品標籤驗證（數組、字符串）
- [ ] 實現更新業務邏輯：
  - `validateUpdateData()` 验证更新数据
  - `checkProductOwnership()` 檢查產品所有權
  - `checkDataUniqueness()` 檢查數據唯一性
  - `processUpdatedImages()` 處理更新圖片
  - `updateProduct()` 更新產品
  - `updateProductImages()` 更新產品圖片
  - `reindexProductForSearch()` 重新索引產品
  - `invalidateProductCache()` 使產品快取失效

### 5. 產品刪除端點
- [ ] 實現刪除產品 API：
  - `DELETE /api/v1/products/:id` - 刪除產品端點
  - `deleteProductController` 刪除產品控制器
  - `deleteProductValidation` 刪除產品驗證
  - `deleteProductService` 刪除產品服務
  - `deleteProductResponse` 刪除產品響應
- [ ] 實現刪除請求驗證：
  - `DeleteProductRequestDto` 刪除產品請求數據傳輸對象
  - `id` 產品 ID 驗證（格式、存在性）
  - `reason` 刪除原因驗證（字符串、長度）
  - `confirm` 確認刪除驗證（布爾值）
  - `force` 強制刪除驗證（布爾值）
- [ ] 實現刪除業務邏輯：
  - `validateDeletePermission()` 驗證刪除權限
  - `checkProductDependencies()` 檢查產品依賴關係
  - `checkOrderItems()` 檢查訂單項目
  - `softDeleteProduct()` 軟刪除產品
  - `hardDeleteProduct()` 硬刪除產品
  - `deleteProductImages()` 刪除產品圖片
  - `removeProductFromSearch()` 從搜索中移除產品
  - `notifyProductDeletion()` 通知產品刪除

## 預期交付物
- 產品列表端點實作
- 產品詳情端點實作
- 產品創建端點實作
- 產品更新端點實作
- 產品刪除端點實作
- 產品 API 文檔

## 測試要求
- [ ] 產品列表端點單元測試覆蓋率 > 90%
- [ ] 產品詳情端點單元測試覆蓋率 > 90%
- [ ] 產品創建端點單元測試覆蓋率 > 90%
- [ ] 產品更新端點單元測試覆蓋率 > 90%
- [ ] 產品刪除端點單元測試覆蓋率 > 90%
- [ ] 整合測試覆蓋率 > 80%
- [ ] 端到端測試覆蓋率 > 70%
- [ ] 安全性測試通過
- [ ] 性能測試指標符合要求

## 相關文檔
- [REST API 設計指南](https://restfulapi.net/)
- [產品管理 API 設計](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/seedwork-domain-model-base-class)
- [Fastify 路由文檔](https://fastify.dev/docs/latest/Reference/Routes/)
- [API 文檔生成](https://swagger.io/docs/specification/2-0/describing-parameters/)

## 任務依賴
- **前置依賴**: TASK-024（用戶 API）

## 優先級
**P2 一般任務**

## 預估工時
5-6 小時

## 負責人
後端開發者