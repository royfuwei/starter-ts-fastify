# TASK-014: 資料模型

## 任務概述
定義和實現完整的資料模型，包括 User、Product 和 Order 資料模型，以及資料驗證規則。

## 任務模式
**Code 模式** - 用於具體的資料模型實作

## 任務目標
- 定義 User 資料模型
- 定義 Product 資料模型
- 定義 Order 資料模型
- 實現資料驗證規則

## 具體實作步驟

### 1. User 資料模型
- [ ] 定義 User 實體：
  - `User` 類別定義
  - 繼承 BaseEntity
  - 實現用戶基本信息
  - 實現關係映射
- [ ] 定義 User 屬性：
  - `id: string` - 用戶 ID
  - `username: string` - 用戶名
  - `email: string` - 電子郵箱
  - `password: string` - 密碼
  - `firstName: string` - 名字
  - `lastName: string` - 姓氏
  - `phone: string` - 電話
  - `avatar: string` - 頭像
  - `role: UserRole` - 用戶角色
  - `status: UserStatus` - 用戶狀態
  - `lastLoginAt: Date` - 最後登錄時間
  - `createdAt: Date` - 創建時間
  - `updatedAt: Date` - 更新時間
- [ ] 實現 User 關係：
  - `orders: Order[]` - 訂單關係
  - `reviews: Review[]` - 評價關係
  - `addresses: Address[]` - 地址關係
  - `paymentMethods: PaymentMethod[]` - 支付方式關係

### 2. Product 資料模型
- [ ] 定義 Product 實體：
  - `Product` 類別定義
  - 繼承 BaseEntity
  - 實現產品基本信息
  - 實現關係映射
- [ ] 定義 Product 屬性：
  - `id: string` - 產品 ID
  - `name: string` - 產品名稱
  - `description: string` - 產品描述
  - `price: number` - 產品價格
  - `sku: string` - 產品 SKU
  - `barcode: string` - 條形碼
  - `category: Category` - 產品分類
  - `brand: Brand` - 產品品牌
  - `stock: number` - 庫存數量
  - `status: ProductStatus` - 產品狀態
  - `images: string[]` - 產品圖片
  - `tags: string[]` - 產品標籤
  - `weight: number` - 產品重量
  - `dimensions: Dimensions` - 產品尺寸
  - `createdAt: Date` - 創建時間
  - `updatedAt: Date` - 更新時間
- [ ] 實現 Product 關係：
  - `category: Category` - 分類關係
  - `brand: Brand` - 品牌關係
  - `orderItems: OrderItem[]` - 訂單項目關係
  - `reviews: Review[]` - 評價關係
  - `variants: ProductVariant[]` - 產品變體關係

### 3. Order 資料模型
- [ ] 定義 Order 實體：
  - `Order` 類別定義
  - 繼承 BaseEntity
  - 實現訂單基本信息
  - 實現關係映射
- [ ] 定義 Order 屬性：
  - `id: string` - 訂單 ID
  - `orderNumber: string` - 訂單號
  - `userId: string` - 用戶 ID
  - `status: OrderStatus` - 訂單狀態
  - `totalAmount: number` - 總金額
  - `subtotal: number` - 小計
  - `taxAmount: number` - 税金
  - `shippingAmount: number` - 運費
  - `discountAmount: number` - 折扣金額
  - `paymentMethod: string` - 支付方式
  - `paymentStatus: PaymentStatus` - 支付狀態
  - `shippingAddress: Address` - 配送地址
  - `billingAddress: Address` - 帳單地址
  - `notes: string` - 訂單備註
  - `createdAt: Date` - 創建時間
  - `updatedAt: Date` - 更新時間
- [ ] 實現 Order 關係：
  - `user: User` - 用戶關係
  - `orderItems: OrderItem[]` - 訂單項目關係
  - `payments: Payment[]` - 支付記錄關係
  - `shipping: Shipping[]` - 配送記錄關係
  - `reviews: Review[]` - 評價關係

### 4. 資料驗證規則
- [ ] 實現 User 驗證規則：
  - `username: string` - 用戶名驗證（長度、格式）
  - `email: string` - 郵箱驗證（格式、唯一性）
  - `password: string` - 密碼驗證（長度、複雜度）
  - `phone: string` - 電話驗證（格式）
  - `firstName: string` - 名字驗證（長度）
  - `lastName: string` - 姓氏驗證（長度）
- [ ] 實現 Product 驗證規則：
  - `name: string` - 產品名稱驗證（長度、唯一性）
  - `description: string` - 產品描述驗證（長度）
  - `price: number` - 價格驗證（數值範圍）
  - `sku: string` - SKU 驗證（格式、唯一性）
  - `stock: number` - 庫存驗證（數值範圍）
  - `images: string[]` - 圖片驗證（格式、數量）
- [ ] 實現 Order 驗證規則：
  - `orderNumber: string` - 訂單號驗證（格式、唯一性）
  - `totalAmount: number` - 總金額驗證（數值範圍）
  - `status: OrderStatus` - 狀態驗證（枚舉值）
  - `paymentMethod: string` - 支付方式驗證（枚舉值）
  - `paymentStatus: PaymentStatus` - 支付狀態驗證（枚舉值）
  - `shippingAddress: Address` - 配送地址驗證（完整性）

## 預期交付物
- User 資料模型定義
- Product 資料模型定義
- Order 資料模型定義
- 資料驗證規則實作
- 資料模型文檔

## 測試要求
- [ ] 所有資料模型單元測試覆蓋率 > 90%
- [ ] 資料驗證規則正確
- [ ] 關係映射正常工作
- [ ] 數據類型正確
- [ ] 約束條件有效
- [ ] 邊界情況處理完善

## 相關文檔
- [TypeORM 實體文檔](https://typeorm.io/docs/entities)
- [資料驗證](https://github.com/hapijs/joi)
- [數據模型設計](https://martinfowler.com/eaaCatalog/dataSource.html)
- [關係映射](https://typeorm.io/docs/relations)

## 任務依賴
- **前置依賴**: TASK-013（Repository 模式）

## 優先級
**P1 重要任務**

## 預估工時
4-5 小時

## 負責人
後端開發者