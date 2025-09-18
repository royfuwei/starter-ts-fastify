import { initFastifyInstance } from './fastifyInstance';

export async function server() {
  const fastifyInstance = await initFastifyInstance();
  return {
    fastifyInstance,
  };
}
