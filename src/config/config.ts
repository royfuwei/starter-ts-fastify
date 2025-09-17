import dotenvFlow from 'dotenv-flow';

// 載入環境變數
const flowEnv = dotenvFlow.config({
  node_env: process.env.NODE_ENV,
  default_node_env: 'development',
}).parsed;

process.env = {
  ...process.env,
  ...flowEnv,
};

// 伺服器配置介面
export interface ServerConfig {
  port: number;
  host: string;
  logger: boolean;
}

// 應用配置介面
export interface AppConfig {
  name: string;
  env: string;
  server: ServerConfig;
}

// 載入配置
const loadConfig = (): AppConfig => {
  return {
    name: process.env.APP_NAME || 'starter-ts-fastify',
    env: process.env.NODE_ENV || 'development',
    server: {
      port: parseInt(process.env.PORT || '3000', 10),
      host: process.env.HOST || '0.0.0.0',
      logger: process.env.NODE_ENV !== 'test',
    },
  };
};

export const config = loadConfig();
