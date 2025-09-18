# TASK-002: 專案配置優化

## 任務概述
優化現有 Fastify Server 專案的配置文件和目錄結構，確保開發環境的完整性和一致性。

## 任務模式
**Code 模式** - 用於具體的專案配置和結構優化

## 任務目標
- 優化現有 package.json 配置
- 完善 TypeScript 配置文件
- 增強 ESLint 和 Prettier 設置
- 建立完整的目錄結構
- 設置開發工具鏈

## 具體實作步驟

### 1. package.json 優化
- [ ] 檢查並更新 package.json 基本信息：
  - name: fastify-server
  - version: 1.0.0
  - description: Fastify Server 專案
  - main: dist/index.js
  - scripts: 完善開發和建置腳本
- [ ] 添加必要的腳本：
  - dev: 開發模式運行
  - build: 生產環境建置
  - start: 生產環境啟動
  - test: 運行測試
  - lint: 代碼檢查
  - format: 代碼格式化
- [ ] 設置 license 和 repository 信息
- [ ] 配置 package.json 元數據

### 2. TypeScript 配置完善
- [ ] 檢查現有 `tsconfig.json` 配置
- [ ] 優化 TypeScript 選項：
  - target: ES2022
  - module: CommonJS
  - strict: true
  - outDir: dist
  - rootDir: src
  - esModuleInterop: true
  - skipLibCheck: true
- [ ] 建立多個 TypeScript 配置文件：
  - tsconfig.app.json（應用配置）
  - tsconfig.build.json（建置配置）
  - tsconfig.spec.json（測試配置）
- [ ] 確保類型定義完整

### 3. ESLint 和 Prettier 增強
- [ ] 檢查現有 ESLint 配置
- [ ] 優化 ESLint 規則：
  - TypeScript 規則
  - import 規則
  - 錯誤處理規則
  - Fastify 相關規則
- [ ] 檢查現有 Prettier 配置
- [ ] 優化 Prettier 格式化規則
- [ ] 建立 `.prettierignore` 文件
- [ ] 配置 ESLint 和 Prettier 整合

### 4. 目錄結構完善
- [ ] 檢查現有目錄結構
- [ ] 建立缺失的目錄：
  - `src/configs/` - 配置文件
  - `src/servers/` - 伺服器相關
  - `src/utils/` - 工具函數
  - `src/services/` - 業務服務
  - `src/repositories/` - 數據倉庫
  - `src/models/` - 數據模型
  - `src/middlewares/` - 中間件
  - `src/routes/` - 路由
  - `src/types/` - 類型定義
- [ ] 建立測試目錄：
  - `test/` - 測試文件
  - `test/unit/` - 單元測試
  - `test/integration/` - 整合測試
  - `test/e2e/` - 端到端測試
- [ ] 建立文檔目錄：
  - `docs/` - 文檔
  - `docs/api/` - API 文檔
  - `docs/deployment/` - 部署文檔

### 5. 配置文件模板
- [ ] 建立 `.env.example` 環境變數模板
- [ ] 更新 `.gitignore` 文件
- [ ] 建立 `.npmrc` 配置文件
- [ ] 建立 `.nvmrc` Node.js 版本文件
- [ ] 建立 `Dockerfile` 基礎模板

## 預期交付物
- 優化的專案配置文件
- 完整的目錄結構
- 配置文檔和使用指南
- 開發環境驗證腳本

## 測試要求
- [ ] npm install 正常執行
- [ ] TypeScript 編譯無錯誤
- [ ] ESLint 檢查通過
- [ ] Prettier 格式化正常
- [ ] 專案結構符合規範
- [ ] 所有配置文件正確

## 相關文檔
- [npm 官方文檔](https://docs.npmjs.com/)
- [TypeScript 配置指南](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
- [ESLint 配置指南](https://eslint.org/docs/latest/use/configure/)
- [Prettier 配置指南](https://prettier.io/docs/en/configuration.html)

## 任務依賴
- **前置依賴**: TASK-001（環境準備）

## 優先級
**P0 必需任務**

## 預估工時
2-3 小時

## 負責人
後端開發者