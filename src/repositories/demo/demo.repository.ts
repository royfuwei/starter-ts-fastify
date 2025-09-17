/**
 * Demo Repository 實作
 * 提供 Demo 項目的資料存取功能（記憶體模擬實作）
 */

import { Repository } from '../../common/decorators/service.decorator';
import { IDemoRepository } from './demo.repository.interface';
import { DemoDto } from '../../common/dto/demo/demo.dto';
import { CreateDemoDto } from '../../common/dto/demo/create-demo.dto';
import { UpdateDemoDto } from '../../common/dto/demo/update-demo.dto';
import { TYPES } from '../../common/container/types';

@Repository(TYPES.DemoRepository)
export class DemoRepository implements IDemoRepository {
  // 模擬的記憶體資料存儲
  private demos: DemoDto[] = [
    new DemoDto({
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: '範例項目 1',
      description: '這是第一個範例項目',
      category: 'web',
      email: 'demo1@example.com',
      priority: 5,
      tags: 'fastify,typescript,demo',
      createdAt: '2025-01-16T08:00:00.000Z',
      updatedAt: '2025-01-16T08:00:00.000Z',
    }),
    new DemoDto({
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: '範例項目 2',
      description: '這是第二個範例項目',
      category: 'api',
      email: 'demo2@example.com',
      priority: 8,
      tags: 'swagger,openapi,demo',
      createdAt: '2025-01-16T08:30:00.000Z',
      updatedAt: '2025-01-16T08:30:00.000Z',
    }),
  ];

  /**
   * 取得所有 Demo 項目
   */
  findAll(): Promise<DemoDto[]> {
    return Promise.resolve([...this.demos]);
  }

  /**
   * 根據 ID 取得特定 Demo 項目
   */
  findById(id: string): Promise<DemoDto | null> {
    const demo = this.demos.find((item) => item.id === id);
    return Promise.resolve(demo || null);
  }

  /**
   * 根據類別篩選 Demo 項目
   */
  findByCategory(category: string): Promise<DemoDto[]> {
    return Promise.resolve(this.demos.filter((demo) => demo.category === category));
  }

  /**
   * 搜尋 Demo 項目
   */
  search(keyword: string): Promise<DemoDto[]> {
    const searchLower = keyword.toLowerCase();
    return Promise.resolve(
      this.demos.filter(
        (demo) =>
          demo.name.toLowerCase().includes(searchLower) ||
          (demo.description && demo.description.toLowerCase().includes(searchLower)) ||
          demo.tags?.toLowerCase().includes(searchLower),
      ),
    );
  }

  /**
   * 建立新的 Demo 項目
   */
  create(data: CreateDemoDto): Promise<DemoDto> {
    const newDemo = new DemoDto({
      id: this.generateUUID(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    this.demos.push(newDemo);
    return Promise.resolve(newDemo);
  }

  /**
   * 更新 Demo 項目
   */
  update(id: string, data: UpdateDemoDto): Promise<DemoDto | null> {
    const demoIndex = this.demos.findIndex((item) => item.id === id);

    if (demoIndex === -1) {
      return Promise.resolve(null);
    }

    // 更新項目
    this.demos[demoIndex] = new DemoDto({
      ...this.demos[demoIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    });

    return Promise.resolve(this.demos[demoIndex]);
  }

  /**
   * 刪除 Demo 項目
   */
  delete(id: string): Promise<boolean> {
    const demoIndex = this.demos.findIndex((item) => item.id === id);

    if (demoIndex === -1) {
      return Promise.resolve(false);
    }

    this.demos.splice(demoIndex, 1);
    return Promise.resolve(true);
  }

  /**
   * 檢查 Demo 項目是否存在
   */
  exists(id: string): Promise<boolean> {
    return Promise.resolve(this.demos.some((item) => item.id === id));
  }

  /**
   * 取得總數量
   */
  count(): Promise<number> {
    return Promise.resolve(this.demos.length);
  }

  /**
   * 分頁查詢
   */
  findWithPagination(
    page: number,
    limit: number,
  ): Promise<{
    items: DemoDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDemos = this.demos.slice(startIndex, endIndex);

    return Promise.resolve({
      items: paginatedDemos,
      total: this.demos.length,
      page,
      limit,
    });
  }

  /**
   * 生成簡單的 UUID（用於示範）
   */
  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
