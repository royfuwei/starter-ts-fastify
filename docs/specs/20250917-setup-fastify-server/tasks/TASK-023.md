# TASK-023: 認證 API

## 任務概述
實現完整的認證 API，包括註冊端點、登入端點、Token 刷新端點和登出端點。

## 任務模式
**Code 模式** - 用於具體的認證 API 實作

## 任務目標
- 實現註冊端點
- 實現登入端點
- 實現 Token 刷新端點
- 實現登出端點

## 具體實作步驟

### 1. 註冊端點
- [ ] 實現用戶註冊 API：
  - `POST /api/v1/auth/register` - 用戶註冊端點
  - `registerController` 註冊控制器
  - `registerValidation` 註冊驗證
  - `registerService` 註冊服務
  - `registerResponse` 註冊響應
- [ ] 實現註冊請求驗證：
  - `RegisterRequestDto` 註冊請求數據傳輸對象
  - `email` 郵箱驗證（格式、唯一性）
  - `password` 密碼驗證（長度、複雜度）
  - `username` 用戶名驗證（格式、唯一性）
  - `terms` 條款驗證（必須同意）
- [ ] 實現註冊業務邏輯：
  - `validateUserData()` 驗證用戶數據
  - `checkUserExists()` 檢查用戶是否存在
  - `createUser()` 創建用戶
  - `sendVerificationEmail()` 發送驗證郵件
  - `generateTokens()` 生成 Token

### 2. 登入端點
- [ ] 實現用戶登入 API：
  - `POST /api/v1/auth/login` - 用戶登入端點
  - `loginController` 登入控制器
  - `loginValidation` 登入驗證
  - `loginService` 登入服務
  - `loginResponse` 登入響應
- [ ] 實現登入請求驗證：
  - `LoginRequestDto` 登入請求數據傳輸對象
  - `email` 郵箱驗證（格式）
  - `password` 密碼驗證（格式）
  - `rememberMe` 記住我驗證（布爾值）
- [ ] 實現登入業務邏輯：
  - `validateCredentials()` 驗證憑證
  - `checkAccountStatus()` 檢查帳戶狀態
  - `recordLoginAttempt()` 記錄登入嘗試
  - `generateTokens()` 生成 Token
  - `createSession()` 創建會話

### 3. Token 刷新端點
- [ ] 實現 Token 刷新 API：
  - `POST /api/v1/auth/refresh` - Token 刷新端點
  - `refreshTokenController` Token 刷新控制器
  - `refreshTokenValidation` Token 刷新驗證
  - `refreshTokenService` Token 刷新服務
  - `refreshTokenResponse` Token 刷新響應
- [ ] 實現刷新請求驗證：
  - `RefreshTokenRequestDto` 刷新請求數據傳輸對象
  - `refreshToken` 刷新 Token 驗證（格式）
  - `tokenType` Token 類型驗證（枚舉值）
- [ ] 實現刷新業務邏輯：
  - `validateRefreshToken()` 驗證刷新 Token
  - `checkRefreshTokenValidity()` 檢查刷新 Token 有效性
  - `generateNewTokens()` 生成新 Token
  - `updateSession()` 更新會話
  - `invalidateOldTokens()` 使舊 Token 失效

### 4. 登出端點
- [ ] 實現用戶登出 API：
  - `POST /api/v1/auth/logout` - 用戶登出端點
  - `logoutController` 登出控制器
  - `logoutValidation` 登出驗證
  - `logoutService` 登出服務
  - `logoutResponse` 登出響應
- [ ] 實現登出請求驗證：
  - `LogoutRequestDto` 登出請求數據傳輸對象
  - `accessToken` 訪問 Token 驗證（格式）
  - `refreshToken` 刷新 Token 驗證（格式）
- [ ] 實現登出業務邏輯：
  - `validateAccessToken()` 驗證訪問 Token
  - `validateRefreshToken()` 驗證刷新 Token
  - `invalidateTokens()` 使 Token 失效
  - `destroySession()` 銷毀會話
  - `recordLogoutActivity()` 記錄登出活動

## 預期交付物
- 註冊端點實作
- 登入端點實作
- Token 刷新端點實作
- 登出端點實作
- 認證 API 文檔

## 測試要求
- [ ] 註冊端點單元測試覆蓋率 > 90%
- [ ] 登入端點單元測試覆蓋率 > 90%
- [ ] Token 刷新端點單元測試覆蓋率 > 90%
- [ ] 登出端點單元測試覆蓋率 > 90%
- [ ] 整合測試覆蓋率 > 80%
- [ ] 端到端測試覆蓋率 > 70%
- [ ] 安全性測試通過
- [ ] 性能測試指標符合要求

## 相關文檔
- [REST API 設計指南](https://restfulapi.net/)
- [JWT Bearer Token](https://auth0.com/docs/tokens/bearer-tokens)
- [API 安全最佳實踐](https://owasp.org/www-project-api-security/)
- [Fastify 路由文檔](https://fastify.dev/docs/latest/Reference/Routes/)

## 任務依賴
- **前置依賴**: TASK-022（訂單服務）

## 優先級
**P1 重要任務**

## 預估工時
4-5 小時

## 負責人
後端開發者