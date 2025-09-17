import 'reflect-metadata';

const ROUTE_METADATA = Symbol('route_metadata');

export interface RouteMetadata {
  method: string;
  path: string;
  propertyKey: string;
}

/**
 * HTTP 方法裝飾器基礎函數
 */
const createMethodDecorator = (method: string) => {
  return (path: string = ''): MethodDecorator => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (_target: any, propertyKey: string | symbol) => {
      const existingRoutes: RouteMetadata[] =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
        (Reflect.getMetadata(ROUTE_METADATA, _target.constructor) as RouteMetadata[]) ||
        [];

      const route: RouteMetadata = {
        method: method.toUpperCase(),
        path,
        propertyKey: String(propertyKey),
      };

      existingRoutes.push(route);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      Reflect.defineMetadata(ROUTE_METADATA, existingRoutes, _target.constructor);
    };
  };
};

/**
 * GET 方法裝飾器
 */
export const Get = createMethodDecorator('GET');

/**
 * POST 方法裝飾器
 */
export const Post = createMethodDecorator('POST');

/**
 * PUT 方法裝飾器
 */
export const Put = createMethodDecorator('PUT');

/**
 * DELETE 方法裝飾器
 */
export const Delete = createMethodDecorator('DELETE');

/**
 * PATCH 方法裝飾器
 */
export const Patch = createMethodDecorator('PATCH');

/**
 * 取得路由元數據
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRouteMetadata = (_target: any): RouteMetadata[] => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return (Reflect.getMetadata(ROUTE_METADATA, _target) as RouteMetadata[]) || [];
};
