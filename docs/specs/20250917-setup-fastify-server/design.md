# Fastify Server 系統設計文檔

## 文檔資訊

- **專案名稱**: Fastify Server 設置專案
- **文件版本**: v1.0.0
- **建立日期**: 2025-09-17
- **最後更新**: 2025-09-17
- **設計負責人**: 架構設計團隊

## 1. 設計概述

本設計文檔詳細說明了基於 TypeScript 和 Fastify 的現代化 Web 伺服器的系統架構、模組設計和技術選型。設計遵循高內聚、低耦合的原則，確保系統的可擴展性、可維護性和高性能。

## 2. 系統架構

### 2.1 整體架構圖

```
┌─────────────────────────────────────────────────────────────┐
│                    Fastify Server                            │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Core Layer    │  │   Service Layer │  │   Data Layer    │ │
│  │                 │  │                 │  │                 │ │
│  │  - Fastify App  │  │  - Business     │  │  - Database     │ │
│  │  - Middleware   │  │    Logic        │  │  - Cache        │ │
│  │  - Routes       │  │  - Services     │  │  - File System  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                    Infrastructure Layer                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Config Layer  │  │   Security      │  │   Monitoring    │ │
│  │                 │  │   Layer         │  │   Layer         │ │
│  │  - Environment  │  │  - Auth         │  │  - Logging      │ │
│  │  - Config       │  │  - CORS         │  │  - Metrics      │ │
│  │  - Validation   │  │  - Rate Limit   │  │  - Health Check │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 架構原則

#### 2.2.1 分層架構
- **表示層**: 處理 HTTP 請求和響應
- **業務邏輯層**: 實現核心業務功能
- **資料訪問層**: 管理資料庫和外部系統交互
- **基礎設施層**: 提供配置、安全和監控功能

#### 2.2.2 關注點分離
- 每個層專注於特定的職責
- 層之間通過定義良好的介面進行通信
- 減少模組間的耦合度

#### 2.2.3 依賴注入
- 使用依賴注入模式管理服務依賴
- 提高程式碼的可測試性和可維護性
- 支援運行時配置和替換

## 3. 技術選型

### 3.1 核心技術棧

#### 3.1.1 運行環境
- **Node.js**: 18+ LTS 版本
- **TypeScript**: 5.x 提供強型別支援
- **Fastify**: 4.x 高性能 Web 框架

#### 3.1.2 資料庫
- **PostgreSQL**: 主要關聯式資料庫
- **Redis**: 快取和會話存儲
- **MongoDB**: 文件資料庫（可選）

#### 3.1.3 工具鏈
- **esbuild**: 快速建置工具
- **Vitest**: 現代化測試框架
- **Jest**: 整合測試框架
- **ESLint**: 程式碼品質檢查
- **Prettier**: 程式碼格式化

### 3.2 外部依賴

#### 3.2.1 安全性
- **bcrypt**: 密碼加密
- **jsonwebtoken**: JWT Token 處理
- **helmet**: 安全標頭設置
- **cors**: CORS 處理

#### 3.2.2 資料處理
- **zod**: 請求/響應驗證
- **joi**: 資料驗證
- **class-validator**: 類別驗證器
- **class-transformer**: 資料轉換

#### 3.2.3 監控和日誌
- **winston**: 日誌記錄
- **morgan**: HTTP 請求日誌
- **prometheus**: 指標收集
- **grafana**: 監控面板

## 4. 模組設計

### 4.1 專案結構

```
src/
├── main.ts                 # 應用程式入口點
├── config/                 # 配置管理
│   ├── index.ts
│   ├── database.ts
│   └── app.ts
├── servers/                # 伺服器相關
│   ├── index.ts
│   ├── fastifyInstance.ts
│   └── server.ts
├── routes/                 # 路由定義
│   ├── index.ts
│   ├── health.ts
│   ├── auth.ts
│   └── api/
│       ├── users.ts
│       └── products.ts
├── services/               # 業務服務
│   ├── index.ts
│   ├── authService.ts
│   ├── userService.ts
│   └── productService.ts
├── repositories/           # 資料訪問層
│   ├── index.ts
│   ├── userRepository.ts
│   └── productRepository.ts
├── middleware/             # 中間件
│   ├── index.ts
│   ├── auth.ts
│   ├── validation.ts
│   ├── logging.ts
│   └── error.ts
├── utils/                  # 工具函數
│   ├── index.ts
│   ├── validators.ts
│   ├── formatters.ts
│   └── constants.ts
├── types/                  # 類型定義
│   ├── index.ts
│   ├── api.ts
│   ├── database.ts
│   └── common.ts
└── exceptions/             # 自定義異常
    ├── index.ts
    ├── AppError.ts
    └── ValidationError.ts
```

### 4.2 核心模組

#### 4.2.1 配置管理模組
```typescript
// src/config/index.ts
export interface AppConfig {
  port: number;
  host: string;
  environment: 'development' | 'test' | 'production';
  database: DatabaseConfig;
  redis: RedisConfig;
  jwt: JWTConfig;
}

export class ConfigManager {
  private static instance: ConfigManager;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public getConfig(): AppConfig {
    return this.config;
  }

  private loadConfig(): AppConfig {
    // 從環境變數和配置檔案載入配置
  }
}
```

#### 4.2.2 Fastify 實例模組
```typescript
// src/servers/fastifyInstance.ts
import fastify from 'fastify';
import { ConfigManager } from '../config';

export class FastifyFactory {
  private static instance: fastify.FastifyInstance;

  public static createInstance(): fastify.FastifyInstance {
    if (!FastifyFactory.instance) {
      const config = ConfigManager.getInstance().getConfig();
      FastifyFactory.instance = fastify({
        logger: config.environment !== 'test',
        trustProxy: true,
      });
    }
    return FastifyFactory.instance;
  }

  public static getInstance(): fastify.FastifyInstance {
    if (!FastifyFactory.instance) {
      throw new Error('Fastify instance not initialized');
    }
    return FastifyFactory.instance;
  }
}
```

#### 4.2.3 路由管理模組
```typescript
// src/routes/index.ts
import { FastifyInstance } from 'fastify';
import { healthRoutes } from './health';
import { authRoutes } from './auth';
import { apiRoutes } from './api';

export function registerRoutes(fastify: FastifyInstance): void {
  // 註冊健康檢查路由
  fastify.register(healthRoutes, { prefix: '/health' });
  
  // 註冊認證路由
  fastify.register(authRoutes, { prefix: '/auth' });
  
  // 註冊 API 路由
  fastify.register(apiRoutes, { prefix: '/api' });
}
```

#### 4.2.4 中間件模組
```typescript
// src/middleware/index.ts
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { authMiddleware } from './auth';
import { validationMiddleware } from './validation';
import { loggingMiddleware } from './logging';
import { errorMiddleware } from './error';

export const middlewares: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // 註冊日誌中間件
  fastify.addHook('onRequest', loggingMiddleware);
  
  // 註冊驗證中間件
  fastify.addHook('preValidation', validationMiddleware);
  
  // 註冊認證中間件
  fastify.addHook('preHandler', authMiddleware);
  
  // 註冊錯誤處理中間件
  fastify.setErrorHandler(errorMiddleware);
};
```

### 4.3 服務層設計

#### 4.3.1 服務介面定義
```typescript
// src/services/interfaces/IUserService.ts
export interface IUserService {
  createUser(userData: CreateUserDto): Promise<User>;
  getUserById(id: string): Promise<User>;
  updateUser(id: string, userData: UpdateUserDto): Promise<User>;
  deleteUser(id: string): Promise<void>;
  validateUserCredentials(email: string, password: string): Promise<User>;
}
```

#### 4.3.2 服務實作
```typescript
// src/services/userService.ts
import { IUserService } from './interfaces/IUserService';
import { UserRepository } from '../repositories/userRepository';
import { AppError } from '../exceptions/AppError';

export class UserService implements IUserService {
  constructor(private userRepository: UserRepository) {}

  public async createUser(userData: CreateUserDto): Promise<User> {
    // 業務邏輯實作
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError('User already exists', 409);
    }
    
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    
    return user;
  }

  // 其他方法實作...
}
```

### 4.4 資料訪問層設計

#### 4.4.1 資料庫連接管理
```typescript
// src/repositories/database.ts
import { Pool } from 'pg';
import { ConfigManager } from '../config';

export class DatabaseManager {
  private static instance: Pool;
  private static isInitialized = false;

  public static getInstance(): Pool {
    if (!DatabaseManager.instance) {
      const config = ConfigManager.getInstance().getConfig();
      DatabaseManager.instance = new Pool({
        host: config.database.host,
        port: config.database.port,
        database: config.database.name,
        user: config.database.user,
        password: config.database.password,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
    }
    return DatabaseManager.instance;
  }

  public static async initialize(): Promise<void> {
    if (!DatabaseManager.isInitialized) {
      const pool = DatabaseManager.getInstance();
      await pool.query('SELECT NOW()');
      DatabaseManager.isInitialized = true;
    }
  }

  public static async close(): Promise<void> {
    if (DatabaseManager.instance) {
      await DatabaseManager.instance.end();
      DatabaseManager.instance = null;
      DatabaseManager.isInitialized = false;
    }
  }
}
```

#### 4.4.2 Repository 模式
```typescript
// src/repositories/userRepository.ts
import { DatabaseManager } from './database';
import { User } from '../types/database';
import { AppError } from '../exceptions/AppError';

export class UserRepository {
  private pool = DatabaseManager.getInstance();

  public async create(userData: Partial<User>): Promise<User> {
    const query = `
      INSERT INTO users (email, password, name, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING *
    `;
    const values = [userData.email, userData.password, userData.name];
    
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  public async findById(id: string): Promise<User> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }
    
    return result.rows[0];
  }

  // 其他方法實作...
}
```

## 5. 資料庫設計

### 5.1 資料庫架構

#### 5.1.1 主要資料表
```sql
-- 用戶表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 產品表
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  category_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 訂單表
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 5.1.2 索引設計
```sql
-- 用戶表索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 產品表索引
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_price ON products(price);

-- 訂單表索引
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

### 5.2 快取設計

#### 5.2.1 Redis 快取策略
```typescript
// src/utils/cache.ts
import { createClient } from 'redis';
import { ConfigManager } from '../config';

export class CacheManager {
  private static instance: ReturnType<typeof createClient>;

  public static getInstance(): ReturnType<typeof createClient> {
    if (!CacheManager.instance) {
      const config = ConfigManager.getInstance().getConfig();
      CacheManager.instance = createClient({
        url: `redis://${config.redis.host}:${config.redis.port}`,
        password: config.redis.password,
      });
    }
    return CacheManager.instance;
  }

  public static async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    const client = CacheManager.getInstance();
    await client.connect();
    await client.setEx(key, ttl, JSON.stringify(value));
  }

  public static async get<T>(key: string): Promise<T | null> {
    const client = CacheManager.getInstance();
    await client.connect();
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  }

  public static async del(key: string): Promise<void> {
    const client = CacheManager.getInstance();
    await client.connect();
    await client.del(key);
  }
}
```

## 6. 安全性設計

### 6.1 認證與授權

#### 6.1.1 JWT Token 管理
```typescript
// src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import { ConfigManager } from '../config';

export class JWTManager {
  private static secretKey: string;

  public static initialize(): void {
    const config = ConfigManager.getInstance().getConfig();
    JWTManager.secretKey = config.jwt.secret;
  }

  public static generateToken(payload: any, expiresIn: string = '1h'): string {
    return jwt.sign(payload, JWTManager.secretKey, { expiresIn });
  }

  public static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWTManager.secretKey);
    } catch (error) {
      throw new AppError('Invalid token', 401);
    }
  }
}
```

#### 6.1.2 權限控制
```typescript
// src/middleware/auth.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { JWTManager } from '../utils/jwt';
import { AppError } from '../exceptions/AppError';

export const authMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Missing or invalid authorization header', 401);
    }

    const token = authHeader.substring(7);
    const decoded = JWTManager.verifyToken(token);
    
    // 將用戶資訊附加到請求物件
    request.user = decoded;
  } catch (error) {
    throw new AppError('Authentication failed', 401);
  }
};
```

### 6.2 資料安全

#### 6.2.1 輸入驗證
```typescript
// src/utils/validators.ts
import { z } from 'zod';

export const userRegistrationSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export function validateRequest<T>(schema: z.ZodSchema<T>, data: any): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map(err => err.message);
    throw new AppError(`Validation failed: ${errors.join(', ')}`, 400);
  }
  return result.data;
}
```

#### 6.2.2 安全標頭
```typescript
// src/middleware/security.ts
import { FastifyInstance } from 'fastify';

export function securityMiddleware(fastify: FastifyInstance): void {
  fastify.addHook('onRequest', (request, reply, done) => {
    reply.header('X-Content-Type-Options', 'nosniff');
    reply.header('X-Frame-Options', 'DENY');
    reply.header('X-XSS-Protection', '1; mode=block');
    reply.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    done();
  });
}
```

## 7. 監控和日誌設計

### 7.1 日誌系統

#### 7.1.1 日誌配置
```typescript
// src/utils/logger.ts
import winston from 'winston';
import { ConfigManager } from '../config';

export class Logger {
  private static instance: winston.Logger;

  public static getInstance(): winston.Logger {
    if (!Logger.instance) {
      const config = ConfigManager.getInstance().getConfig();
      
      Logger.instance = winston.createLogger({
        level: config.environment === 'production' ? 'info' : 'debug',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json()
        ),
        defaultMeta: { service: 'fastify-server' },
        transports: [
          new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
          new winston.transports.File({ filename: 'logs/combined.log' }),
        ],
      });

      if (config.environment !== 'production') {
        Logger.instance.add(new winston.transports.Console({
          format: winston.format.simple()
        }));
      }
    }
    return Logger.instance;
  }
}
```

#### 7.1.2 請求日誌
```typescript
// src/middleware/logging.ts
import { FastifyRequest, FastifyReply } from 'fastify';
import { Logger } from '../utils/logger';

export const loggingMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const logger = Logger.getInstance();
  
  const start = Date.now();
  
  reply.addHook('onSend', (request, reply, payload, done) => {
    const duration = Date.now() - start;
    
    logger.info('HTTP Request', {
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      duration,
      userAgent: request.headers['user-agent'],
      ip: request.ip,
    });
    
    done();
  });
};
```

### 7.2 監控指標

#### 7.2.1 性能監控
```typescript
// src/utils/metrics.ts
import client from 'prom-client';

export const register = new client.Registry();

// 自定義指標
export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

export const activeRequests = new client.Gauge({
  name: 'active_requests_total',
  help: 'Number of active requests',
});

export const databaseConnections = new client.Gauge({
  name: 'database_connections_total',
  help: 'Number of active database connections',
});
```

## 8. 部署設計

### 8.1 容器化部署

#### 8.1.1 Docker 配置
```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# 安裝依賴
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

# 構建應用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 建置應用
RUN pnpm build

# 生產環境
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nodejs

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

#### 8.1.2 Docker Compose 配置
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./logs:/app/logs

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 8.2 環境配置

#### 8.2.1 環境變數
```bash
# .env.example
NODE_ENV=development
PORT=3000
HOST=localhost

# 資料庫配置
DATABASE_URL=postgresql://user:password@localhost:5432/myapp
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=myapp
DATABASE_USER=user
DATABASE_PASSWORD=password

# Redis 配置
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT 配置
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=1h

# 日誌配置
LOG_LEVEL=info
LOG_FILE_PATH=./logs

# 監控配置
METRICS_ENABLED=true
METRICS_PORT=9090
```

## 9. 測試策略

### 9.1 測試架構

#### 9.1.1 測試結構
```
test/
├── unit/                    # 單元測試
│   ├── services/
│   ├── repositories/
│   └── utils/
├── integration/             # 整合測試
│   ├── routes/
│   ├── middleware/
│   └── services/
├── e2e/                     # 端到端測試
│   ├── api.spec.ts
│   └── workflows/
└── fixtures/                # 測試資料
    ├── database/
    └── responses/
```

#### 9.1.2 測試工具配置
```typescript
// test/setup.ts
import { ConfigManager } from '../src/config';
import { DatabaseManager } from '../src/repositories/database';
import { CacheManager } from '../src/utils/cache';

export async function setupTestEnvironment(): Promise<void> {
  // 設置測試配置
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/testdb';
  
  // 初始化配置
  ConfigManager.getInstance();
  
  // 初始化資料庫連接
  await DatabaseManager.initialize();
  
  // 初始化 Redis 連接
  await CacheManager.getInstance().connect();
}

export async function cleanupTestEnvironment(): Promise<void> {
  // 清理資料庫
  await DatabaseManager.close();
  
  // 清理 Redis
  await CacheManager.getInstance().quit();
}
```

### 9.2 測試覆蓋率

#### 9.2.1 單元測試示例
```typescript
// test/unit/services/userService.test.ts
import { UserService } from '../../src/services/userService';
import { UserRepository } from '../../src/repositories/userRepository';
import { AppError } from '../../src/exceptions/AppError';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService(userRepository);
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue({
        id: '1',
        email: userData.email,
        name: userData.name,
        created_at: new Date(),
        updated_at: new Date(),
      } as any);

      const result = await userService.createUser(userData);

      expect(result.email).toBe(userData.email);
      expect(result.name).toBe(userData.name);
      expect(userRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          email: userData.email,
          name: userData.name,
        })
      );
    });

    it('should throw error if user already exists', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      userRepository.findByEmail.mockResolvedValue({
        id: '1',
        email: userData.email,
        name: userData.name,
        created_at: new Date(),
        updated_at: new Date(),
      } as any);

      await expect(userService.createUser(userData)).rejects.toThrow(AppError);
    });
  });
});
```

## 10. 總結

本設計文檔詳細說明了 Fastify Server 的系統架構、模組設計和技術選型。設計採用了現代化的軟體工程實踐，包括：

- **分層架構**: 清晰的職責分離和關注點分離
- **模組化設計**: 高內聚、低耦合的模組設計
- **依賴注入**: 提高可測試性和可維護性
- **安全性設計**: 完整的認證、授權和資料安全機制
- **監控和日誌**: 全面的系統監控和日誌記錄
- **容器化部署**: 便於部署和擴展的容器化方案

此設計為專案的開發和維護提供了清晰的技術路徑，確保系統的高性能、可擴展性和可維護性。