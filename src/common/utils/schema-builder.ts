import { validationMetadatasToSchemas } from 'class-validator-jsonschema';

/**
 * 類型定義
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyClass = new (...args: any[]) => any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonSchema = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClassTransformerMetadataStorage = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AdditionalConverters = Record<string, any>;

/**
 * JSON Schema 建構器工具類別
 * 用於從 class-validator 裝飾器生成 JSON Schema
 */
export class SchemaBuilder {
  private static instance: SchemaBuilder;
  private schemas: Record<string, JsonSchema> = {};

  private constructor() {}

  /**
   * 取得 SchemaBuilder 單例實例
   */
  static getInstance(): SchemaBuilder {
    if (!SchemaBuilder.instance) {
      SchemaBuilder.instance = new SchemaBuilder();
    }
    return SchemaBuilder.instance;
  }

  /**
   * 從 Class 生成 JSON Schema
   * @param targetClass 目標類別
   * @param options 選項
   */
  buildSchemaFromClass(
    targetClass: AnyClass,
    options: {
      refPointerPrefix?: string;
      classTransformerMetadataStorage?: ClassTransformerMetadataStorage;
      additionalConverters?: AdditionalConverters;
    } = {},
  ): JsonSchema {
    const className = targetClass.name;

    // 如果已經生成過，直接返回

    if (this.schemas[className]) {
      return this.schemas[className];
    }

    try {
      // 從 class-validator metadata 生成 schemas

      const schemas = validationMetadatasToSchemas({
        refPointerPrefix: options.refPointerPrefix || '#/components/schemas/',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        classTransformerMetadataStorage: options.classTransformerMetadataStorage,
        additionalConverters: options.additionalConverters || {},
      });

      // 儲存生成的 schema

      this.schemas[className] = schemas[className] || this.createBasicSchema(targetClass);

      return this.schemas[className];
    } catch (error) {
      console.warn(`Failed to generate schema for ${className}:`, error);
      return this.createBasicSchema(targetClass);
    }
  }

  /**
   * 建立基本 Schema（當自動生成失敗時使用）
   */
  private createBasicSchema(targetClass: AnyClass): JsonSchema {
    return {
      type: 'object',

      title: targetClass.name,
      properties: {},
      additionalProperties: true,
    };
  }

  /**
   * 生成多個類別的 Schemas
   * @param classes 類別陣列
   */
  buildSchemasFromClasses(classes: AnyClass[]): Record<string, JsonSchema> {
    const result: Record<string, JsonSchema> = {};

    classes.forEach((cls) => {
      const schema = this.buildSchemaFromClass(cls);

      result[cls.name] = schema;
    });

    return result;
  }

  /**
   * 取得已生成的 Schema
   * @param className 類別名稱
   */
  getSchema(className: string): JsonSchema | undefined {
    return this.schemas[className];
  }

  /**
   * 取得所有已生成的 Schemas
   */
  getAllSchemas(): Record<string, JsonSchema> {
    return { ...this.schemas };
  }

  /**
   * 清除所有快取的 Schemas
   */
  clearSchemas(): void {
    this.schemas = {};
  }

  /**
   * 生成標準 API 回應的 Schema
   */
  buildApiResponseSchema<_T = unknown>(
    dataSchema?: JsonSchema,
    options: {
      title?: string;
      description?: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      example?: any;
    } = {},
  ): JsonSchema {
    const baseSchema = {
      type: 'object',
      title: options.title || 'API Response',
      description: options.description || 'Standard API response format',
      properties: {
        success: {
          type: 'boolean',
          description: 'Indicates if the request was successful',
        },
        message: {
          type: 'string',
          description: 'Response message',
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
          description: 'Response timestamp in ISO format',
        },
      },
      required: ['success', 'message', 'timestamp'],
      additionalProperties: false,
    };

    if (dataSchema) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      (baseSchema.properties as any).data = {
        ...dataSchema,
        description: 'Response data',
      };
      baseSchema.required.push('data');
    }

    if (options.example) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      (baseSchema as any).example = options.example;
    }

    return baseSchema;
  }

  /**
   * 生成分頁 API 回應的 Schema
   */
  buildPaginatedApiResponseSchema(
    itemSchema: JsonSchema,
    options: { title?: string; description?: string } = {},
  ): JsonSchema {
    return {
      type: 'object',
      title: options.title || 'Paginated API Response',
      description: options.description || 'Paginated API response format',
      properties: {
        success: {
          type: 'boolean',
          description: 'Indicates if the request was successful',
        },
        message: {
          type: 'string',
          description: 'Response message',
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
          description: 'Response timestamp in ISO format',
        },
        data: {
          type: 'array',

          items: itemSchema,
          description: 'Array of response data items',
        },
        pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'number',
              description: 'Current page number',
            },
            limit: {
              type: 'number',
              description: 'Items per page',
            },
            total: {
              type: 'number',
              description: 'Total number of items',
            },
            totalPages: {
              type: 'number',
              description: 'Total number of pages',
            },
            hasNext: {
              type: 'boolean',
              description: 'Whether there is a next page',
            },
            hasPrev: {
              type: 'boolean',
              description: 'Whether there is a previous page',
            },
          },
          required: ['page', 'limit', 'total', 'totalPages', 'hasNext', 'hasPrev'],
          additionalProperties: false,
        },
      },
      required: ['success', 'message', 'timestamp', 'data', 'pagination'],
      additionalProperties: false,
    };
  }

  /**
   * 生成錯誤回應的 Schema
   */
  buildErrorResponseSchema(
    options: { title?: string; description?: string } = {},
  ): JsonSchema {
    return {
      type: 'object',
      title: options.title || 'Error Response',
      description: options.description || 'Standard error response format',
      properties: {
        success: {
          type: 'boolean',
          description: 'Always false for error responses',
          enum: [false],
        },
        message: {
          type: 'string',
          description: 'Error message',
        },
        timestamp: {
          type: 'string',
          format: 'date-time',
          description: 'Error timestamp in ISO format',
        },
        data: {
          type: 'null',
          description: 'Always null for error responses',
        },
        errorCode: {
          type: 'string',
          description: 'Error code (optional)',
        },
        errorDetails: {
          description: 'Additional error details (optional)',
        },
      },
      required: ['success', 'message', 'timestamp', 'data'],
      additionalProperties: false,
    };
  }
}

/**
 * 快速建立 Schema 的便利函數
 */
export const schemaBuilder = SchemaBuilder.getInstance();

/**
 * 快速從類別生成 Schema
 */
export function createSchemaFromClass(targetClass: AnyClass): JsonSchema {
  return schemaBuilder.buildSchemaFromClass(targetClass);
}

/**
 * 快速生成 API 回應 Schema
 */
export function createApiResponseSchema<_T = unknown>(
  dataSchema?: JsonSchema,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: { title?: string; description?: string; example?: any },
): JsonSchema {
  return schemaBuilder.buildApiResponseSchema(dataSchema, options);
}

/**
 * 快速生成分頁 API 回應 Schema
 */
export function createPaginatedApiResponseSchema(
  itemSchema: JsonSchema,
  options?: { title?: string; description?: string },
): JsonSchema {
  return schemaBuilder.buildPaginatedApiResponseSchema(itemSchema, options);
}

/**
 * 快速生成錯誤回應 Schema
 */
export function createErrorResponseSchema(options?: {
  title?: string;
  description?: string;
}): JsonSchema {
  return schemaBuilder.buildErrorResponseSchema(options);
}
