import 'reflect-metadata';

const CONTROLLER_METADATA = Symbol('controller_metadata');

export interface ControllerMetadata {
  path: string;
}

/**
 * Controller 裝飾器
 * 用於定義控制器的基礎路徑
 * @param path 控制器的基礎路徑
 */
export const Controller = (path: string = ''): ClassDecorator => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (_target: any) => {
    const metadata: ControllerMetadata = { path };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Reflect.defineMetadata(CONTROLLER_METADATA, metadata, _target);
  };
};

/**
 * 取得控制器元數據
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getControllerMetadata = (_target: any): ControllerMetadata | undefined => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Reflect.getMetadata(CONTROLLER_METADATA, _target) as
    | ControllerMetadata
    | undefined;
};
