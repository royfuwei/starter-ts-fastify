import { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { config } from '../../config/config';

/**
 * Swagger 插件選項介面
 */
export interface SwaggerPluginOptions {
  title?: string;
  description?: string;
  version?: string;
  prefix?: string;
  documentationRoute?: string;
}

/**
 * 註冊 Swagger 插件
 * @param app Fastify 實例
 * @param options Swagger 插件選項
 */
export async function registerSwaggerPlugin(
  app: FastifyInstance,
  options: SwaggerPluginOptions = {},
): Promise<void> {
  const {
    title = 'Fastify API',
    description = 'Fastify API Documentation',
    version = '1.0.0',
    documentationRoute = '/api-docs',
  } = options;

  // 註冊 Swagger 插件
  await app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title,
        description,
        version,
      },
      servers: [
        {
          url: `http://${config.server.host}:${config.server.port}`,
          description: 'Development server',
        },
      ],
      components: {
        schemas: {},
        securitySchemes: {
          apiKey: {
            type: 'apiKey',
            name: 'apikey',
            in: 'header',
          },
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      tags: [
        { name: 'Health', description: 'Health check endpoints' },
        { name: 'Demo', description: 'Demo endpoints' },
      ],
    },
    hideUntagged: false,
  });

  // 註冊 Swagger UI 插件
  await app.register(swaggerUi, {
    routePrefix: documentationRoute,
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });

  app.log.info(`Swagger documentation available at: ${documentationRoute}`);
}

/**
 * 預設 Swagger 插件註冊函數
 * 使用預設配置註冊 Swagger 插件
 */
export async function registerDefaultSwaggerPlugin(app: FastifyInstance): Promise<void> {
  await registerSwaggerPlugin(app, {
    title: 'Starter TypeScript Fastify API',
    description: 'A TypeScript Fastify starter project with OpenAPI documentation',
    version: '1.0.0',
    documentationRoute: '/documentation',
  });
}
