// Import the framework and instantiate it
import Fastify from 'fastify';
export const initFastifyInstance = async () => {
  const instance = Fastify({
    logger: true,
  });
  return instance;
};
