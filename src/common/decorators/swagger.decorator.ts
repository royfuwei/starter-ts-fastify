import 'reflect-metadata';

// Swagger 裝飾器的 metadata keys
export const SWAGGER_OPERATION_METADATA = 'swagger:operation';
export const SWAGGER_RESPONSE_METADATA = 'swagger:response';
export const SWAGGER_PARAMETER_METADATA = 'swagger:parameter';
export const SWAGGER_SCHEMA_METADATA = 'swagger:schema';

/**
 * OpenAPI 操作配置介面
 */
export interface SwaggerOperationOptions {
  summary?: string;
  description?: string;
  tags?: string[];
  operationId?: string;
  deprecated?: boolean;
  security?: Array<Record<string, string[]>>;
}

/**
 * OpenAPI 回應配置介面
 */
export interface SwaggerResponseOptions {
  statusCode: number | 'default';
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  headers?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  example?: any;
}

/**
 * OpenAPI 參數配置介面
 */
export interface SwaggerParameterOptions {
  name: string;
  in: 'query' | 'path' | 'header' | 'cookie';
  required?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema?: any;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  example?: any;
}

/**
 * OpenAPI 請求體配置介面
 */
export interface SwaggerRequestBodyOptions {
  description?: string;
  required?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema?: any;
}

/**
 * API 操作裝飾器
 * 用於設定 OpenAPI 操作的基本資訊
 */
export function ApiOperation(options: SwaggerOperationOptions) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const existingOperations =
      Reflect.getMetadata(SWAGGER_OPERATION_METADATA, target) || {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    existingOperations[propertyKey] = options;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Reflect.defineMetadata(SWAGGER_OPERATION_METADATA, existingOperations, target);
    return descriptor;
  };
}

/**
 * API 回應裝飾器
 * 用於設定 OpenAPI 操作的回應資訊
 */
export function ApiResponse(options: SwaggerResponseOptions) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const existingResponses =
      Reflect.getMetadata(SWAGGER_RESPONSE_METADATA, target) || {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!existingResponses[propertyKey]) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      existingResponses[propertyKey] = [];
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    existingResponses[propertyKey].push(options);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Reflect.defineMetadata(SWAGGER_RESPONSE_METADATA, existingResponses, target);
    return descriptor;
  };
}

/**
 * API 參數裝飾器
 * 用於設定 OpenAPI 操作的參數資訊
 */
export function ApiParam(options: SwaggerParameterOptions) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument
    const existingParams = Reflect.getMetadata(SWAGGER_PARAMETER_METADATA, target) || {};
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!existingParams[propertyKey]) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      existingParams[propertyKey] = [];
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    existingParams[propertyKey].push(options);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Reflect.defineMetadata(SWAGGER_PARAMETER_METADATA, existingParams, target);
    return descriptor;
  };
}

/**
 * API 標籤裝飾器
 * 用於為整個控制器設定 OpenAPI 標籤
 */
export function ApiTags(...tags: string[]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Reflect.defineMetadata('swagger:tags', tags, target);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return target;
  };
}

/**
 * API 請求體裝飾器
 * 用於設定 OpenAPI 操作的請求體資訊
 */
export function ApiBody(options: SwaggerRequestBodyOptions) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    Reflect.defineMetadata('swagger:body', options, target, propertyKey);
    return descriptor;
  };
}

/**
 * API 查詢參數裝飾器
 * 用於快速設定查詢參數
 */
export function ApiQuery(options: Omit<SwaggerParameterOptions, 'in'>) {
  return ApiParam({ ...options, in: 'query' });
}

/**
 * API 路徑參數裝飾器
 * 用於快速設定路徑參數
 */
export function ApiPath(options: Omit<SwaggerParameterOptions, 'in'>) {
  return ApiParam({ ...options, in: 'path' });
}

/**
 * API 頭部參數裝飾器
 * 用於快速設定頭部參數
 */
export function ApiHeader(options: Omit<SwaggerParameterOptions, 'in'>) {
  return ApiParam({ ...options, in: 'header' });
}

/**
 * API 成功回應裝飾器
 * 用於快速設定成功回應
 */
export function ApiOkResponse(options: Omit<SwaggerResponseOptions, 'statusCode'>) {
  return ApiResponse({ ...options, statusCode: 200 });
}

/**
 * API 建立回應裝飾器
 * 用於快速設定建立成功回應
 */
export function ApiCreatedResponse(options: Omit<SwaggerResponseOptions, 'statusCode'>) {
  return ApiResponse({ ...options, statusCode: 201 });
}

/**
 * API 錯誤回應裝飾器
 * 用於快速設定錯誤回應
 */
export function ApiBadRequestResponse(
  options: Omit<SwaggerResponseOptions, 'statusCode'>,
) {
  return ApiResponse({ ...options, statusCode: 400 });
}

/**
 * API 未授權回應裝飾器
 * 用於快速設定未授權回應
 */
export function ApiUnauthorizedResponse(
  options: Omit<SwaggerResponseOptions, 'statusCode'>,
) {
  return ApiResponse({ ...options, statusCode: 401 });
}

/**
 * API 禁止回應裝飾器
 * 用於快速設定禁止存取回應
 */
export function ApiForbiddenResponse(
  options: Omit<SwaggerResponseOptions, 'statusCode'>,
) {
  return ApiResponse({ ...options, statusCode: 403 });
}

/**
 * API 未找到回應裝飾器
 * 用於快速設定未找到回應
 */
export function ApiNotFoundResponse(options: Omit<SwaggerResponseOptions, 'statusCode'>) {
  return ApiResponse({ ...options, statusCode: 404 });
}

/**
 * API 內部伺服器錯誤回應裝飾器
 * 用於快速設定內部伺服器錯誤回應
 */
export function ApiInternalServerErrorResponse(
  options: Omit<SwaggerResponseOptions, 'statusCode'>,
) {
  return ApiResponse({ ...options, statusCode: 500 });
}

/**
 * 取得控制器的 Swagger metadata
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSwaggerMetadata(target: any) {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment
    tags: Reflect.getMetadata('swagger:tags', target) || [],
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    operations: Reflect.getMetadata(SWAGGER_OPERATION_METADATA, target.prototype) || {},
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    responses: Reflect.getMetadata(SWAGGER_RESPONSE_METADATA, target.prototype) || {},
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    parameters: Reflect.getMetadata(SWAGGER_PARAMETER_METADATA, target.prototype) || {},
  };
}
