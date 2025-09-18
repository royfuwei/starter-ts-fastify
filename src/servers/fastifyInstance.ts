// Import the framework and instantiate it
import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import { container } from 'tsyringe';

export const initFastifyInstance = async () => {
  const instance = Fastify({
    logger: true,
  });

  // Register Swagger plugin
  await instance.register(swagger, {
    openapi: {
      info: {
        title: 'Fastify API',
        version: '1.0.0',
      },
    },
  });

  // Register Swagger UI plugin
  await instance.register(swaggerUI, {
    routePrefix: '/docs',
    uiConfig: {
      deepLinking: false,
      docExpansion: 'full',
    },
  });

  // Register tsyringe container
  instance.decorate('container', container);

  return instance;
};
