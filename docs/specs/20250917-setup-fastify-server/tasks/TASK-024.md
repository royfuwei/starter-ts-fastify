
# TASK-024: 用戶 API

## 任務概述
實現完整的用戶 API，包括用戶資料獲取端點、用戶資料更新端點、用戶列表端點和用戶刪除端點。

## 任務模式
**Code 模式** - 用於具體的用戶 API 實作

## 任務目標
- 實現用戶資料獲取端點
- 實現用戶資料更新端點
- 實現用戶列表端點
- 實現用戶刪除端點

## 具體實作步驟

### 1. 用戶資料獲取端點
- [ ] 實現獲取用戶資料 API：
  - `GET /api/v1/users/profile` - 獲取當前用戶資料端點
  - `GET /api/v1/users/:id` - 根據 ID 獲取用戶資料端點
  - `getUserProfileController` 獲取用戶資料控制器
  - `getUserProfileValidation` 獲取用戶資料驗證
  - `getUserProfileService` 獲取用戶資料服務
  - `getUserProfileResponse` 獲取用戶資料響應
- [ ] 實現獲取請求驗證：
  - `GetUserProfileRequestDto` 獲取用戶資料請求數據傳輸對象
  - `id` 用戶 ID 驗證（格式、存在性）
  - `fields` 返回字段驗證（數組、字段名稱）
  - `include` 包含關係驗證（數組、關係名稱）
- [ ] 實現獲取業務邏輯：
  - `getCurrentUserProfile()` 獲取當前用戶資料
  - `getUserById()` 根據 ID 獲取用戶資料
  - `validateUserAccess()` 驗證用戶訪問權限
  - `formatUserProfile()` 格式化用戶資料
  - `cacheUserProfile()` 快取用戶資料

### 2. 用戶資料更新端點
- [ ] 實現更新用戶資料 API：
  - `PUT /api/v1/users/profile` - 更新當前用戶資料端點
  - `PATCH /api/v1/users/profile` - 部分更新當前用戶資料端點
  - `updateUserProfileController` 更新用戶資料控制器
  - `updateUserProfileValidation` 更新用戶資料驗證
  - `updateUserProfileService` 更新用戶資料服務
  - `updateUserProfileResponse` 更新用戶資料響應
- [ ] 實現更新請求驗證：
  - `UpdateUserProfileRequestDto` 更新用戶資料請求數據傳輸對象
  - `firstName` 名字驗證（格式、長度）
  - `lastName` 姓氏驗證（格式、長度）
  - `phone` 電話驗證（格式）
  - `avatar` 頭像驗證（格式、大小）
  - `bio` 個人簡介驗證（長度）
- [ ] 實現更新業務邏輯：
  - `validateUpdateData()` 驗證更新數據
  - `checkDataUniqueness()` 檢查數據唯一性
  - `updateUserProfile()` 更新用戶資料
  - `invalidateUserCache()` 使用戶快取失效
  - `logUpdateActivity()` 記錄更新活動

### 3. 用戶列表端點
- [ ] 實現獲取用戶列表 API：
  - `GET /api/v1/users` - 獲取用戶列表端點
  - `getUsersController` 獲取用戶列表控制器
  - `getUsersValidation` 獲取用戶列表驗證
  - `getUsersService` 獲取用戶列表服務
  - `getUsersResponse` 獲取用戶列表響應
- [ ] 實現列表請求驗證：
  - `GetUsersRequestDto` 獲取用戶列表請求數據傳輸對象
  - `page` 頁碼驗證（數字、最小值）
  - `limit` 每頁數量驗證（數字、範圍）
  - `sortBy` 排序字段驗證（字符串、枚舉值）
  - `sortOrder` 排序順序驗證（字符串、枚舉值）
  - `search` 搜索關鍵字驗證（字符串）
  - `filters` 過濾條件驗證（對象）
- [ ] 實現列表業務邏輯：
  - `validatePaginationParams()` 驗證分頁參數
  - `applySearchFilters()` 應用搜索過濾器
  - `applySorting()` 應用排序
  - `getPaginatedUsers()` 獲取分頁用戶列表
  - `calculatePaginationMetadata()` 計算分頁元數據

### 4. 用戶刪除端點
- [ ] 實現刪除用戶 API：
  - `DELETE /api/v1/users/:id` - 刪除用戶端點
  - `deleteUserController` 刪除用戶控制器
  - `deleteUserValidation` 刪除用戶驗證
  - `deleteUserService` 刪除用戶服務
  - `deleteUserResponse` 刪除用戶響應
- [ ] 實現刪除請求驗證：
  - `DeleteUserRequestDto` 刪除用戶請求數據傳輸對象
  - `id` 用戶 ID 驗證（格式、存在性）
  - `reason` 刪除原因驗證（字符串、長度）
  - `confirm` 確認刪除驗證（布爾值）
- [ ] 實現刪除業務邏輯：
  - `validateDeletePermission()` 驗證刪除權限
  - `checkUserDependencies()` 檢查用戶依賴關係
  - `softDeleteUser()` 軟刪除用戶
  - `hardDeleteUser()` 硬刪除用戶
  - `notifyUserDeletion()` 通知用戶刪除
  - `cleanupUserData()` 清理用戶數據

## 預期交付物
- 用戶資料獲取端點實作
- 用戶資料更新端點實作
- 用戶列表端點實作
- 用戶刪除端點實作
- 用戶 API 文檔

##