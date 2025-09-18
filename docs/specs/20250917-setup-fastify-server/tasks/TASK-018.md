# TASK-018: 用戶認證

## 任務概述
實現完整的用戶認證系統，包括用戶註冊、用戶登入、密碼重置和第三方登入整合功能。

## 任務模式
**Code 模式** - 用於具體的用戶認證實作

## 任務目標
- 實現用戶註冊功能
- 實現用戶登入功能
- 實現密碼重置功能
- 實現第三方登入整合

## 具體實作步驟

### 1. 用戶註冊功能
- [ ] 實現註冊服務：
  - `UserService` 類別
  - `registerUser(userData: RegisterUserDto): Promise<User>` - 註冊用戶
  - `validateUserData(userData: RegisterUserDto): Promise<ValidationResult>` - 驗證用戶數據
  - `checkUserExists(email: string, username: string): Promise<boolean>` - 檢查用戶是否存在
  - `createUser(userData: RegisterUserDto): Promise<User>` - 創建用戶
- [ ] 實現註冊驗證：
  - `emailValidation(email: string): Promise<boolean>` - 郵箱驗證
  - `usernameValidation(username: string): Promise<boolean>` - 用戶名驗證
  - `passwordValidation(password: string): Promise<boolean>` - 密碼驗證
  - `termsValidation(accepted: boolean): Promise<boolean>` - 條款驗證
- [ ] 實現註冊流程：
  - `sendRegistrationEmail(email: string, token: string): Promise<void>` - 發送註冊郵件
  - `verifyRegistrationEmail(token: string): Promise<User>` - 驗證註冊郵件
  - `completeRegistration(userId: string): Promise<User>` - 完成註冊
  - `resendRegistrationEmail(email: string): Promise<void>` - 重發註冊郵件

### 2. 用戶登入功能
- [ ] 實現登入服務：
  - `loginUser(credentials: LoginCredentials): Promise<LoginResult>` - 用戶登入
  - `validateCredentials(email: string, password: string): Promise<User>` - 驗證憑證
  - `generateTokens(user: User): Promise<TokenPair>` - 生成Token
  - `updateLastLogin(user: User): Promise<void>` - 更新最後登錄
- [ ] 實現登入安全：
  - `checkLoginAttempts(email: string): Promise<boolean>` - 檢查登入嘗試
  - `recordLoginAttempt(email: string, success: boolean): Promise<void>` - 記錄登入嘗試
  - `lockAccount(email: string): Promise<void>` - 鎖定帳戶
  - `unlockAccount(email: string): Promise<void>` - 解鎖帳戶
- [ ] 實現登入會話：
  - `createSession(user: User): Promise<Session>` - 創建會話
  - `validateSession(sessionId: string): Promise<Session>` - 驗證會話
  - `refreshSession(sessionId: string): Promise<Session>` - 刷新會話
  - `destroySession(sessionId: string): Promise<void>` - 銷毀會話

### 3. 密碼重置功能
- [ ] 實現密碼重置服務：
  - `PasswordResetService` 類別
  - `requestPasswordReset(email: string): Promise<void>` - 請求密碼重置
  - `validatePasswordResetToken(token: string): Promise<User>` - 驗證密碼重置Token
  - `resetPassword(token: string, newPassword: string): Promise<User>` - 重置密碼
  - `changePassword(userId: string, currentPassword: string, newPassword: string): Promise<User>` - 修改密碼
- [ ] 實現密碼重置Token：
  - `generatePasswordResetToken(email: string): Promise<string>` - 生成密碼重置Token
  - `sendPasswordResetEmail(email: string, token: string): Promise<void>` - 發送密碼重置郵件
  - `validatePasswordResetToken(token: string): Promise<boolean>` - 驗證密碼重置Token
  - `invalidatePasswordResetToken(token: string): Promise<void>` - 使密碼重置Token失效
- [ ] 實現密碼安全：
  - `hashPassword(password: string): Promise<string>` - 密碼哈希
  - `verifyPassword(password: string, hash: string): Promise<boolean>` - 驗證密碼
  - `isPasswordStrong(password: string): Promise<boolean>` - 檢查密碼強度
  - `checkPasswordHistory(userId: string, password: string): Promise<boolean>` - 檢查密碼歷史

### 4. 第三方登入整合
- [ ] 實現第三方登入服務：
  - `SocialAuthService` 類別
  - `initiateSocialLogin(provider: string): Promise<AuthUrl>` - 發起第三方登入
  - `handleSocialCallback(provider: string, code: string, state: string): Promise<SocialAuthResult>` - 處理第三方回調
  - `linkSocialAccount(userId: string, provider: string, socialId: string): Promise<User>` - 綁定第三方帳戶
  - `unlinkSocialAccount(userId: string, provider: string): Promise<User>` - 解綁第三方帳戶
- [ ] 實現第三方登入提供商：
  - `SocialAuthProvider` 接口
  - `GoogleAuthProvider` - Google 登入
  - `FacebookAuthProvider` - Facebook 登入
  - `GitHubAuthProvider` - GitHub 登入
  - `TwitterAuthProvider` - Twitter 登入
- [ ] 實現第三方登入管理：
  - `getSocialAuthProviders(): SocialAuthProvider[]` - 獲取第三方登入提供商
  - `isSocialAuthEnabled(provider: string): boolean` - 檢查第三方登入是否啟用
  - `configureSocialAuth(provider: string, config: SocialAuthConfig): void` - 配置第三方登入
  - `getSocialAuthStats(): SocialAuthStats` - 獲取第三方登入統計

## 預期交付物
- 用戶註冊功能實作
- 用戶登入功能實作
- 密碼重置功能實作
- 第三方登入整合系統
- 用戶認證文檔

## 測試要求
- [ ] 用戶註冊流程正常工作
- [ ] 用戶登入機制有效
- [ ] 密碼重置功能完善
- [ ] 第三方登入整合正常
- [ ] 安全性測試通過
- [ ] 錯誤處理機制完善

## 相關文檔
- [OAuth 2.0 官方文檔](https://oauth.net/2.0/)
- [JWT Bearer Token](https://auth0.com/docs/tokens/bearer-tokens)
- [密碼哈希](https://github.com/kelektiv/node.bcrypt.js)
- [第三方登入](https://developers.google.com/identity/protocols/oauth2)

## 任務依賴
- **前置依賴**: TASK-017（JWT 管理）

## 優先級
**P1 重要任務**

## 預估工時
5-6 小時

## 負責人
後端開發者