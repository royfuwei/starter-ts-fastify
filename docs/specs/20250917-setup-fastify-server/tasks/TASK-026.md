# TASK-026: 訂單 API

## 任務概述
實現完整的訂單 API，包括訂單創建端點、訂單列表端點、訂單詳情端點、訂單更新端點和訂單狀態管理端點。

## 任務模式
**Code 模式** - 用於具體的訂單 API 實作

## 任務目標
- 實現訂單創建端點
- 實現訂單列表端點
- 實現訂單詳情端點
- 實現訂單更新端點
- 實現訂單狀態管理端點

## 具體實作步驟

### 1. 訂單創建端點
- [ ] 實現創建訂單 API：
  - `POST /api/v1/orders` - 創建訂單端點
  - `createOrderController` 創建訂單控制器
  - `createOrderValidation` 創建訂單驗證
  - `createOrderService` 創建訂單服務
  - `createOrderResponse` 創建訂單響應
- [ ] 實現創建請求驗證：
  - `CreateOrderRequestDto` 創建訂單請求數據傳輸對象
  - `userId` 用戶 ID 驗證（字符串、存在性）
  - `items` 訂單項目驗證（數組、必填）
  - `shippingAddress` 配送地址驗證（對象、必填）
  - `billingAddress` 帳單地址驗證（對象、必填）
  - `paymentMethod` 支付方式驗證（字符串、枚舉值）
  - `notes` 訂單備註驗證（字符串、長度）
- [ ] 實現創建業務邏輯：
  - `validateOrderData()` 驗證訂單數據
  - `checkUserExists()` 檢查用戶是否存在
  - `validateOrderItems()` 驗證訂單項目
  - `checkProductAvailability()` 檢查產品可用性
  - `calculateOrderTotal()` 計算訂單總額
  - `createOrder()` 創建訂單
  - `processOrderPayment()` 處理訂單支付
  - `sendOrderConfirmation()` 發送訂單確認

### 2. 訂單列表端點
- [ ] 實現獲取訂單列表 API：
  - `GET /api/v1/orders` - 獲取訂單列表端點
  - `GET /api/v1/users/:userId/orders` - 獲取用戶訂單列表端點
  - `getOrdersController` 獲取訂單列表控制器
  - `getOrdersValidation` 獲取訂單列表驗證
  - `getOrdersService` 獲取訂單列表服務
  - `getOrdersResponse` 獲取訂單列表響應
- [ ] 實現列表請求驗證：
  - `GetOrdersRequestDto` 獲取訂單列表請求數據傳輸對象
  - `page` 頁碼驗證（數字、最小值）
  - `limit` 每頁數量驗證（數字、範圍）
  - `sortBy` 排序字段驗證（字符串、枚舉值）
  - `sortOrder` 排序順序驗證（字符串、枚舉值）
  - `status` 訂單狀態驗證（字符串、枚舉值）
  - `dateRange` 日期範圍驗證（對象）
  - `userId` 用戶 ID 驗證（字符串）
  - `search` 搜索關鍵字驗證（字符串）
- [ ] 實現列表業務邏輯：
  - `validatePaginationParams()` 驗證分頁參數
  - `applyStatusFilters()` 應用狀態過濾器
  - `applyDateFilters()` 應用日期過濾器
  - `applyUserFilters()` 應用用戶過濾器
  - `applySorting()` 應用排序
  - `getPaginatedOrders()` 獲取分頁訂單列表
  - `calculatePaginationMetadata()` 計算分頁元數據

### 3. 訂單詳情端點
- [ ] 實現獲取訂單詳情 API：
  - `GET /api/v1/orders/:id` - 根據 ID 獲取訂單詳情端點
  - `getOrderByIdController` 獲取訂單詳情控制器
  - `getOrderByIdValidation` 獲取訂單詳情驗證
  - `getOrderByIdService` 獲取訂單詳情服務
  - `getOrderByIdResponse` 獲取訂單詳情響應
- [ ] 實現詳情請求驗證：
  - `GetOrderByIdRequestDto` 獲取訂單詳情請求數據傳輸對象
  - `id` 訂單 ID 驗證（格式、存在性）
  - `fields` 返回字段驗證（數組、字段名稱）
  - `include` 包含關係驗證（數組、關係名稱）
  - `includeItems` 包含項目驗證（布爾值）
  - `includePayments` 包含支付記錄驗證（布爾值）
  - `includeShipping` 包含配送記錄驗證（布爾值）
- [ ] 實現詳情業務邏輯：
  - `validateOrderId()` 驗證訂單 ID
  - `checkOrderVisibility()` 檢查訂單可見性
  - `getOrderDetails()` 獲取訂單詳情
  - `getOrderItems()` 獲取訂單項目
  - `getOrderPayments()` 獲取訂單支付記錄
  - `getOrderShipping()` 獲取訂單配送記錄
  - `formatOrderResponse()` 格式化訂單響應
  - `cacheOrderDetails()` 快取訂單詳情

### 4. 訂單更新端點
- [ ] 實現更新訂單 API：
  - `PUT /api/v1/orders/:id` - 完整更新訂單端點
  - `PATCH /api/v1/orders/:id` - 部分更新訂單端點
  - `updateOrderController` 更新訂單控制器
  - `updateOrderValidation` 更新訂單驗證
  - `updateOrderService` 更新訂單服務
  - `updateOrderResponse` 更新訂單響應
- [ ] 實現更新請求驗證：
  - `UpdateOrderRequestDto` 更新訂單請求數據傳輸對象
  - `id` 訂單 ID 驗證（格式、存在性）
  - `shippingAddress` 配送地址驗證（對象）
  - `billingAddress` 帳單地址驗證（對象）
  - `notes` 訂單備註驗證（字符串、長度）
  - `items` 訂單項目驗證（數組）
- [ ] 實現更新業務邏輯：
  - `validateUpdateData()` 驗證更新數據
  - `checkOrderOwnership()` 檢查訂單所有權
  - `checkOrderStatus()` 檢查訂單狀態
  - `validateOrderUpdates()` 驗證訂單更新
  - `updateOrder()` 更新訂單
  - `updateOrderItems()` 更新訂單項目
  - `invalidateOrderCache()` 使訂單快取失效
  - `notifyOrderUpdate()` 通知訂單更新

### 5. 訂單狀態管理端點
- [ ] 實現訂單狀態管理 API：
  - `POST /api/v1/orders/:id/process` - 處理訂單端點
  - `POST /api/v1/orders/:id/confirm` - 確認訂單端點
  - `POST /api/v1/orders/:id/ship` - 發貨訂單端點
  - `POST /api/v1/orders/:id/deliver` - 確認收貨端點
  - `POST /api/v1/orders/:id/cancel` - 取消訂單端點
  - `orderStatusController` 訂單狀態控制器
  - `orderStatusValidation` 訂單狀態驗證
  - `orderStatusService` 訂單狀態服務
  - `orderStatusResponse` 訂單狀態響應
- [ ] 實現狀態管理請求驗證：
  - `OrderStatusRequestDto` 訂單狀態請求數據傳輸對象
  - `id` 訂單 ID 驗證（格式、存在性）
  - `status` 訂單狀態驗證（字符串、枚舉值）
  - `reason` 狀態變更原因驗證（字符串、長度）
  - `shippingData` 配送數據驗證（對象）
  - `paymentData` 支付數據驗證（對象）
- [ ] 實現狀態管理業務邏輯：
  - `validateOrderStatusTransition()` 驗證訂單狀態轉換
  - `checkOrderPermission()` 檢查訂單權限
  - `processOrderStatusChange()` 處理訂單狀態變更
  - `updateOrderStatus()` 更新訂單狀態
  - `handleOrderWorkflow()` 處理訂單工作流
  - `notifyOrderStatusChange()` 通知訂單狀態變更
  - `recordOrderActivity()` 記錄訂單活動

## 預期交付物
- 訂單創建端點實作
- 訂單列表端點實作
- 訂單詳情端點實作
- 訂單更新端點實作
- 訂單狀態管理端點實作
- 訂單 API 文檔

## 測試要求
- [ ] 訂單創建端點單元測試覆蓋率 > 90%
- [ ] 訂單列表端點單元測試覆蓋率 > 90%
- [ ] 訂單詳情端點單元測試覆蓋率 > 90%
- [ ] 訂單更新端點單元測試覆蓋率 > 90%
- [ ] 訂單狀態管理端點單元測試覆蓋率 > 90%
- [ ] 整合測試覆蓋率 > 80%
- [ ] 端到端測試覆蓋率 > 70%
- [ ] 安全性測試通過
- [ ] 性能測試指標符合要求

## 相關文檔
- [REST API 設計指南](https://restfulapi.net/)
- [訂單管理 API 設計](https://docs.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/seedwork-domain-model-base-class)
- [Fastify 路由文檔](https://fastify.dev/docs/latest/Reference/Routes/)
- [API 文檔生成](https://swagger.io/docs/specification/2-0/describing-parameters/)

## 任務依賴
- **前置依賴**: TASK-025（產品 API）

## 優先級
**P2 一般任務**

## 預估工時
6-7 小時

## 負責人
後端開發者