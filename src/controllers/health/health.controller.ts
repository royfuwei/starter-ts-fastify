import { Controller, Get, Injectable } from '../../common/decorators';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
} from '../../common/decorators/swagger.decorator';
import {
  HealthCheckResponse,
  DetailedHealthCheckResponse,
  ReadinessCheckResponse,
  LivenessCheckResponse,
} from '../../common/dto/api-response.dto';

/**
 * 健康檢查控制器
 * 提供系統健康狀態檢查端點
 */
@Injectable()
@Controller('/health')
@ApiTags('Health')
export class HealthController {
  /**
   * 基本健康檢查
   * GET /health
   */
  @Get()
  @ApiOperation({
    summary: '基本健康檢查',
    description: '檢查服務是否正常運行',
    tags: ['Health'],
  })
  @ApiOkResponse({
    description: '健康檢查成功回應',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', format: 'date-time' },
        uptime: { type: 'number', example: 123.456 },
        message: { type: 'string', example: 'Service is healthy' },
      },
    },
    example: {
      status: 'ok',
      timestamp: '2025-01-16T08:30:00.000Z',
      uptime: 123.456,
      message: 'Service is healthy',
    },
  })
  check(): HealthCheckResponse {
    return new HealthCheckResponse();
  }

  /**
   * 詳細健康檢查
   * GET /health/detailed
   */
  @Get('/detailed')
  @ApiOperation({
    summary: '詳細健康檢查',
    description: '檢查服務健康狀態並提供系統詳細資訊',
    tags: ['Health'],
  })
  @ApiOkResponse({
    description: '詳細健康檢查成功回應',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', format: 'date-time' },
        uptime: { type: 'number', example: 123.456 },
        message: {
          type: 'string',
          example: 'Service is healthy with detailed information',
        },
        system: {
          type: 'object',
          properties: {
            node_version: { type: 'string', example: 'v18.17.0' },
            platform: { type: 'string', example: 'darwin' },
            arch: { type: 'string', example: 'arm64' },
            memory: {
              type: 'object',
              properties: {
                rss: { type: 'string', example: '32MB' },
                heapTotal: { type: 'string', example: '16MB' },
                heapUsed: { type: 'string', example: '12MB' },
                external: { type: 'string', example: '1MB' },
              },
            },
          },
        },
      },
    },
  })
  detailedCheck(): DetailedHealthCheckResponse {
    return new DetailedHealthCheckResponse();
  }

  /**
   * 就緒檢查
   * GET /health/ready
   */
  @Get('/ready')
  @ApiOperation({
    summary: '就緒檢查',
    description: '檢查服務及其依賴項是否準備就緒',
    tags: ['Health'],
  })
  @ApiOkResponse({
    description: '就緒檢查成功回應',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ready' },
        timestamp: { type: 'string', format: 'date-time' },
        checks: {
          type: 'object',
          properties: {
            database: { type: 'string', example: 'ok' },
            external_services: { type: 'string', example: 'ok' },
          },
        },
      },
    },
    example: {
      status: 'ready',
      timestamp: '2025-01-16T08:30:00.000Z',
      checks: {
        database: 'ok',
        external_services: 'ok',
      },
    },
  })
  readiness(): ReadinessCheckResponse {
    return new ReadinessCheckResponse();
  }

  /**
   * 存活檢查
   * GET /health/live
   */
  @Get('/live')
  @ApiOperation({
    summary: '存活檢查',
    description: '檢查服務是否仍在運行',
    tags: ['Health'],
  })
  @ApiOkResponse({
    description: '存活檢查成功回應',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'alive' },
        timestamp: { type: 'string', format: 'date-time' },
      },
    },
    example: {
      status: 'alive',
      timestamp: '2025-01-16T08:30:00.000Z',
    },
  })
  liveness(): LivenessCheckResponse {
    return new LivenessCheckResponse();
  }
}
