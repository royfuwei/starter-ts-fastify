import { FastifyRequest } from 'fastify';
import { Controller, Get, Post, Put, Delete, Injectable } from '../../common/decorators';
import { Inject } from '../../common/decorators/inject.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiPath,
  ApiBody,
} from '../../common/decorators/swagger.decorator';
import {
  SuccessApiResponse,
  ErrorApiResponse,
  PaginatedApiResponse,
} from '../../common/dto/api-response.dto';
import { CreateDemoDto } from '../../common/dto/demo/create-demo.dto';
import { UpdateDemoDto } from '../../common/dto/demo/update-demo.dto';
import { DemoDto, DemoQueryDto } from '../../common/dto/demo/demo.dto';
import { CreateDemoUseCase } from '../../usecases/demo/create-demo.usecase';
import { GetDemoUseCase } from '../../usecases/demo/get-demo.usecase';
import { UpdateDemoUseCase } from '../../usecases/demo/update-demo.usecase';
import { DeleteDemoUseCase } from '../../usecases/demo/delete-demo.usecase';
import { TYPES } from '../../common/container/types';

/**
 * Demo 控制器
 * 展示完整的 OpenAPI 功能和 DI 容器整合
 */
@Injectable()
@Controller('/demo')
@ApiTags('Demo')
export class DemoController {
  constructor(
    @Inject(TYPES.CreateDemoUseCase)
    private readonly createDemoUseCase: CreateDemoUseCase,
    @Inject(TYPES.GetDemoUseCase)
    private readonly getDemoUseCase: GetDemoUseCase,
    @Inject(TYPES.UpdateDemoUseCase)
    private readonly updateDemoUseCase: UpdateDemoUseCase,
    @Inject(TYPES.DeleteDemoUseCase)
    private readonly deleteDemoUseCase: DeleteDemoUseCase,
  ) {}

  /**
   * 取得所有 Demo 項目（支援分頁和篩選）
   * GET /demo
   */
  @Get()
  @ApiOperation({
    summary: '取得所有 Demo 項目',
    description: '取得 Demo 項目列表，支援分頁、搜尋和篩選功能',
    tags: ['Demo'],
  })
  @ApiQuery({
    name: 'page',
    required: false,
    schema: { type: 'number', default: 1 },
    description: '頁碼',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    schema: { type: 'number', default: 10 },
    description: '每頁筆數',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    schema: { type: 'string' },
    description: '搜尋關鍵字',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    schema: { type: 'string' },
    description: '類別篩選',
  })
  @ApiOkResponse({
    description: '成功取得 Demo 項目列表',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Success' },
        timestamp: { type: 'string', format: 'date-time' },
        data: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/DemoDto',
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' },
            hasNext: { type: 'boolean' },
            hasPrev: { type: 'boolean' },
          },
        },
      },
    },
  })
  async findAll(request: FastifyRequest): Promise<PaginatedApiResponse<DemoDto>> {
    const { page = 1, limit = 10, search, category } = request.query as DemoQueryDto;

    try {
      const result = await this.getDemoUseCase.findWithPagination(page, limit, {
        search,
        category,
      });

      return new PaginatedApiResponse(
        result.items,
        result.page,
        result.limit,
        result.total,
        'Successfully retrieved demo items',
      );
    } catch (error) {
      console.error('Error in findAll:', error);
      throw error;
    }
  }

  /**
   * 根據 ID 取得特定 Demo 項目
   * GET /demo/:id
   */
  @Get('/:id')
  @ApiOperation({
    summary: '取得特定 Demo 項目',
    description: '根據 ID 取得特定的 Demo 項目',
    tags: ['Demo'],
  })
  @ApiPath({
    name: 'id',
    required: true,
    schema: { type: 'string', format: 'uuid' },
    description: 'Demo 項目的 UUID',
  })
  @ApiOkResponse({
    description: '成功取得 Demo 項目',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Success' },
        timestamp: { type: 'string', format: 'date-time' },
        data: { $ref: '#/components/schemas/DemoDto' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Demo 項目不存在',
  })
  async findOne(
    request: FastifyRequest,
  ): Promise<SuccessApiResponse<DemoDto> | ErrorApiResponse> {
    const { id } = request.params as { id: string };

    try {
      const demo = await this.getDemoUseCase.findById(id);
      return new SuccessApiResponse(demo, 'Successfully retrieved demo item');
    } catch (error) {
      console.error('Error in findOne:', error);
      return new ErrorApiResponse('Demo item not found', 'DEMO_NOT_FOUND');
    }
  }

  /**
   * 建立新的 Demo 項目
   * POST /demo
   */
  @Post()
  @ApiOperation({
    summary: '建立新的 Demo 項目',
    description: '建立一個新的 Demo 項目',
    tags: ['Demo'],
  })
  @ApiBody({
    description: '建立 Demo 項目的資料',
    required: true,
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 2, maxLength: 50 },
        description: { type: 'string', maxLength: 200 },
        category: { type: 'string' },
        email: { type: 'string', format: 'email' },
        priority: { type: 'number', minimum: 1, maximum: 10 },
        tags: { type: 'string' },
      },
      required: ['name', 'category', 'email'],
      example: {
        name: '新範例項目',
        description: '這是一個新的範例項目',
        category: 'web',
        email: 'new@example.com',
        priority: 7,
        tags: 'new,example',
      },
    },
  })
  @ApiCreatedResponse({
    description: '成功建立 Demo 項目',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Demo item created successfully' },
        timestamp: { type: 'string', format: 'date-time' },
        data: { $ref: '#/components/schemas/DemoDto' },
      },
    },
  })
  @ApiBadRequestResponse({
    description: '請求資料驗證失敗',
  })
  async create(
    request: FastifyRequest,
  ): Promise<SuccessApiResponse<DemoDto> | ErrorApiResponse> {
    const createData = request.body as CreateDemoDto;

    try {
      const newDemo = await this.createDemoUseCase.execute(createData);
      return new SuccessApiResponse(newDemo, 'Demo item created successfully');
    } catch (error) {
      console.error('Error in create:', error);
      return new ErrorApiResponse(
        error instanceof Error ? error.message : 'Failed to create demo item',
        'CREATE_FAILED',
      );
    }
  }

  /**
   * 更新特定的 Demo 項目
   * PUT /demo/:id
   */
  @Put('/:id')
  @ApiOperation({
    summary: '更新 Demo 項目',
    description: '根據 ID 更新特定的 Demo 項目',
    tags: ['Demo'],
  })
  @ApiPath({
    name: 'id',
    required: true,
    schema: { type: 'string', format: 'uuid' },
    description: 'Demo 項目的 UUID',
  })
  @ApiBody({
    description: '更新 Demo 項目的資料',
    required: true,
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', minLength: 2, maxLength: 50 },
        description: { type: 'string', maxLength: 200 },
        category: { type: 'string' },
        email: { type: 'string', format: 'email' },
        priority: { type: 'number', minimum: 1, maximum: 10 },
        tags: { type: 'string' },
      },
      example: {
        name: '更新的範例項目',
        description: '這是更新後的描述',
        priority: 9,
      },
    },
  })
  @ApiOkResponse({
    description: '成功更新 Demo 項目',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Demo item updated successfully' },
        timestamp: { type: 'string', format: 'date-time' },
        data: { $ref: '#/components/schemas/DemoDto' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Demo 項目不存在',
  })
  async update(
    request: FastifyRequest,
  ): Promise<SuccessApiResponse<DemoDto> | ErrorApiResponse> {
    const { id } = request.params as { id: string };
    const updateData = request.body as UpdateDemoDto;

    try {
      const updatedDemo = await this.updateDemoUseCase.execute(id, updateData);
      return new SuccessApiResponse(updatedDemo, 'Demo item updated successfully');
    } catch (error) {
      console.error('Error in update:', error);
      return new ErrorApiResponse(
        error instanceof Error ? error.message : 'Failed to update demo item',
        'UPDATE_FAILED',
      );
    }
  }

  /**
   * 刪除特定的 Demo 項目
   * DELETE /demo/:id
   */
  @Delete('/:id')
  @ApiOperation({
    summary: '刪除 Demo 項目',
    description: '根據 ID 刪除特定的 Demo 項目',
    tags: ['Demo'],
  })
  @ApiPath({
    name: 'id',
    required: true,
    schema: { type: 'string', format: 'uuid' },
    description: 'Demo 項目的 UUID',
  })
  @ApiOkResponse({
    description: '成功刪除 Demo 項目',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Demo item deleted successfully' },
        timestamp: { type: 'string', format: 'date-time' },
        data: { type: 'null' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Demo 項目不存在',
  })
  async delete(
    request: FastifyRequest,
  ): Promise<SuccessApiResponse<null> | ErrorApiResponse> {
    const { id } = request.params as { id: string };

    try {
      await this.deleteDemoUseCase.execute(id);
      return new SuccessApiResponse(null, 'Demo item deleted successfully');
    } catch (error) {
      console.error('Error in delete:', error);
      return new ErrorApiResponse(
        error instanceof Error ? error.message : 'Failed to delete demo item',
        'DELETE_FAILED',
      );
    }
  }
}
