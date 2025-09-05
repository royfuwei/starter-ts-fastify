import { initFastifyInstance } from './fastifyInstance';

export async function server() {
  const fastifyInstance = await initFastifyInstance();
  const host = process.env.HOST ?? 'localhost';
  const port = Number(process.env.PORT) || 3000;

  try {
    await fastifyInstance.listen({ host, port });
    fastifyInstance.log.info(`Server listening at http://${host}:${port}`);
  } catch (err) {
    fastifyInstance.log.error(err);
    process.exit(1);
  }
  return {
    fastifyInstance,
  };
}
