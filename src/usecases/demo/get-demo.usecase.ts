/**
 * 取得 Demo UseCase
 * 處理查詢 Demo 項目的業務流程
 */

import { UseCase } from '../../common/decorators/service.decorator';
import { Inject } from '../../common/decorators/inject.decorator';
import { IDemoService } from '../../services/demo/demo.service.interface';
import { DemoDto } from '../../common/dto/demo/demo.dto';
import { TYPES } from '../../common/container/types';

@UseCase(TYPES.GetDemoUseCase)
export class GetDemoUseCase {
  constructor(
    @Inject(TYPES.DemoService)
    private readonly demoService: IDemoService,
  ) {}

  /**
   * 取得所有 Demo 項目
   */
  async findAll(filters?: { category?: string; search?: string }): Promise<DemoDto[]> {
    try {
      console.log('Fetching all demo items with filters:', filters);

      const demos = await this.demoService.findAll(filters);

      console.log(`Found ${demos.length} demo items`);
      return demos;
    } catch (error) {
      console.error('Failed to fetch demo items:', error);
      throw error;
    }
  }

  /**
   * 根據 ID 取得特定 Demo 項目
   */
  async findById(id: string): Promise<DemoDto> {
    try {
      console.log(`Fetching demo item with ID: ${id}`);

      const demo = await this.demoService.findById(id);

      console.log(`Demo item found: ${demo.name}`);
      return demo;
    } catch (error) {
      console.error(`Failed to fetch demo item with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * 分頁查詢 Demo 項目
   */
  async findWithPagination(
    page: number,
    limit: number,
    filters?: {
      category?: string;
      search?: string;
    },
  ): Promise<{
    items: DemoDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    try {
      console.log(
        `Fetching demo items with pagination: page=${page}, limit=${limit}`,
        filters,
      );

      const result = await this.demoService.findWithPagination(page, limit, filters);

      console.log(`Found ${result.items.length} items out of ${result.total} total`);
      return result;
    } catch (error) {
      console.error('Failed to fetch demo items with pagination:', error);
      throw error;
    }
  }
}
