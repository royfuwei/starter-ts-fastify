/**
 * module-alias/register is used to register the module alias in the project.
 * This is used to avoid the relative path hell in the project.
 * For example, instead of using `import DemoUtils from '../../../utils/demo.utils';`,
 * we can use `import DemoUtils from '@/utils/demo.utils';`.
 * The module alias is defined in the tsconfig.json file.
 *
 * For tsc build, we need to use the `tsc-alias` package to resolve the module alias.
 */
// import 'module-alias/register';
import 'reflect-metadata';
import { getDemoValue } from '@/utils';
import { configs } from '@/configs';
import { server } from './servers';
import demoRoutes from '@/routes/demoRoutes';

const main = async () => {
  const demoValue = getDemoValue();
  console.log(`APP_NAME: ${configs.name}`);
  console.log(`NODE_ENV: ${configs.env}`);
  console.log(`${demoValue}!!`);

  // 初始化伺服器
  const { fastifyInstance } = await server();

  // 註冊路由
  await fastifyInstance.register(demoRoutes);

  const host = process.env.HOST ?? 'localhost';
  const port = Number(process.env.PORT) || 3000;

  try {
    await fastifyInstance.listen({ host, port });
    console.log(`Server is running and routes are registered`);
    console.log(`Swagger UI available at http://localhost:${port}/docs`);
    console.log(`Demo endpoint available at http://localhost:${port}/demo`);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }

  // Keep the server running
  return new Promise<void>(() => {});
};

main().catch(console.error);
