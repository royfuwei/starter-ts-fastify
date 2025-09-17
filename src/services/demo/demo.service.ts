/**
 * Demo Service 實作
 * 提供 Demo 項目的業務邏輯處理
 */

import { Service } from '../../common/decorators/service.decorator';
import { Inject } from '../../common/decorators/inject.decorator';
import { IDemoService } from './demo.service.interface';
import { IDemoRepository } from '../../repositories/demo/demo.repository.interface';
import { DemoDto } from '../../common/dto/demo/demo.dto';
import { CreateDemoDto } from '../../common/dto/demo/create-demo.dto';
import { UpdateDemoDto } from '../../common/dto/demo/update-demo.dto';
import { TYPES } from '../../common/container/types';

@Service(TYPES.DemoService)
export class DemoService implements IDemoService {
  constructor(
    @Inject(TYPES.DemoRepository)
    private readonly demoRepository: IDemoRepository,
  ) {}

  /**
   * 取得所有 Demo 項目（支援篩選和搜尋）
   */
  async findAll(filters?: { category?: string; search?: string }): Promise<DemoDto[]> {
    let demos = await this.demoRepository.findAll();

    // 類別篩選
    if (filters?.category) {
      demos = await this.demoRepository.findByCategory(filters.category);
    }

    // 搜尋功能
    if (filters?.search) {
      demos = await this.demoRepository.search(filters.search);
    }

    return demos;
  }

  /**
   * 根據 ID 取得特定 Demo 項目
   */
  async findById(id: string): Promise<DemoDto> {
    const demo = await this.demoRepository.findById(id);

    if (!demo) {
      throw new Error(`Demo item with ID ${id} not found`);
    }

    return demo;
  }

  /**
   * 建立新的 Demo 項目（含業務邏輯驗證）
   */
  async create(data: CreateDemoDto): Promise<DemoDto> {
    // 業務邏輯驗證
    await this.validateDemoData(data);

    // 檢查名稱重複
    const isDuplicate = await this.checkNameDuplicate(data.name);
    if (isDuplicate) {
      throw new Error(`Demo item with name "${data.name}" already exists`);
    }

    return await this.demoRepository.create(data);
  }

  /**
   * 更新 Demo 項目（含業務邏輯驗證）
   */
  async update(id: string, data: UpdateDemoDto): Promise<DemoDto> {
    // 檢查項目是否存在
    const exists = await this.demoRepository.exists(id);
    if (!exists) {
      throw new Error(`Demo item with ID ${id} not found`);
    }

    // 業務邏輯驗證
    await this.validateDemoData(data);

    // 檢查名稱重複（排除自己）
    if (data.name) {
      const isDuplicate = await this.checkNameDuplicate(data.name, id);
      if (isDuplicate) {
        throw new Error(`Demo item with name "${data.name}" already exists`);
      }
    }

    const updatedDemo = await this.demoRepository.update(id, data);
    if (!updatedDemo) {
      throw new Error(`Failed to update demo item with ID ${id}`);
    }

    return updatedDemo;
  }

  /**
   * 刪除 Demo 項目（含業務邏輯驗證）
   */
  async delete(id: string): Promise<void> {
    // 檢查項目是否存在
    const exists = await this.demoRepository.exists(id);
    if (!exists) {
      throw new Error(`Demo item with ID ${id} not found`);
    }

    const success = await this.demoRepository.delete(id);
    if (!success) {
      throw new Error(`Failed to delete demo item with ID ${id}`);
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
    // 先取得篩選後的所有項目來計算總數
    const allItems = await this.findAll(filters);
    const total = allItems.length;

    // 計算分頁
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const items = allItems.slice(startIndex, endIndex);

    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return {
      items,
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev,
    };
  }

  /**
   * 驗證 Demo 項目資料
   */
  validateDemoData(data: CreateDemoDto | UpdateDemoDto): Promise<void> {
    // 基本驗證
    if (data.name && data.name.trim().length < 2) {
      throw new Error('Demo name must be at least 2 characters long');
    }

    if (data.name && data.name.length > 50) {
      throw new Error('Demo name must not exceed 50 characters');
    }

    if (data.description && data.description.length > 200) {
      throw new Error('Demo description must not exceed 200 characters');
    }

    if (data.priority && (data.priority < 1 || data.priority > 10)) {
      throw new Error('Demo priority must be between 1 and 10');
    }

    // Email 格式驗證
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Invalid email format');
      }
    }

    return Promise.resolve();
  }

  /**
   * 檢查 Demo 名稱是否重複
   */
  async checkNameDuplicate(name: string, excludeId?: string): Promise<boolean> {
    const allDemos = await this.demoRepository.findAll();

    return allDemos.some(
      (demo) => demo.name.toLowerCase() === name.toLowerCase() && demo.id !== excludeId,
    );
  }
}
