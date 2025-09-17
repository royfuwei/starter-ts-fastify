/**
 * Demo Service 介面
 * 定義業務邏輯層的契約
 */

import { DemoDto } from '../../common/dto/demo/demo.dto';
import { CreateDemoDto } from '../../common/dto/demo/create-demo.dto';
import { UpdateDemoDto } from '../../common/dto/demo/update-demo.dto';

export interface IDemoService {
  /**
   * 取得所有 Demo 項目（支援篩選和搜尋）
   */
  findAll(filters?: { category?: string; search?: string }): Promise<DemoDto[]>;

  /**
   * 根據 ID 取得特定 Demo 項目
   */
  findById(id: string): Promise<DemoDto>;

  /**
   * 建立新的 Demo 項目（含業務邏輯驗證）
   */
  create(data: CreateDemoDto): Promise<DemoDto>;

  /**
   * 更新 Demo 項目（含業務邏輯驗證）
   */
  update(id: string, data: UpdateDemoDto): Promise<DemoDto>;

  /**
   * 刪除 Demo 項目（含業務邏輯驗證）
   */
  delete(id: string): Promise<void>;

  /**
   * 分頁查詢 Demo 項目
   */
  findWithPagination(
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
  }>;

  /**
   * 驗證 Demo 項目資料
   */
  validateDemoData(data: CreateDemoDto | UpdateDemoDto): Promise<void>;

  /**
   * 檢查 Demo 名稱是否重複
   */
  checkNameDuplicate(name: string, excludeId?: string): Promise<boolean>;
}
