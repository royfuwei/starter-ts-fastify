import { FastifyInstance } from 'fastify';
import { DemoController } from '@/controllers/demoController';

export default function demoRoutes(
  fastify: FastifyInstance,
  _options: Record<string, unknown>,
  done: (err?: Error) => void,
) {
  fastify.get(
    '/demo',
    {
      schema: {
        description: 'Get demo value from service',
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              timestamp: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
    },
    (request, reply) => DemoController.getDemoValue(request, reply),
  );

  done();
}
