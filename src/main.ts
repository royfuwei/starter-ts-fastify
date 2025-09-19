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
import { FastifyServerManager } from './servers/server';

const main = async () => {
  const demoValue = getDemoValue();
  console.log(`APP_NAME: ${configs.name}`);
  console.log(`NODE_ENV: ${configs.env}`);
  console.log(`${demoValue}!!`);

  // 建立並啟動伺服器
  const serverManager = new FastifyServerManager({
    controllers: [],
    middlewares: [],
    isApiDocEnabled: true,
  });

  try {
    await serverManager.start();
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

main().catch(console.error);
