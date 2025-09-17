/**
 * Demo Repository 介面
 * 定義資料存取層的契約
 */

import { DemoDto } from '../../common/dto/demo/demo.dto';
import { CreateDemoDto } from '../../common/dto/demo/create-demo.dto';
import { UpdateDemoDto } from '../../common/dto/demo/update-demo.dto';

export interface IDemoRepository {
  /**
   * 取得所有 Demo 項目
   */
  findAll(): Promise<DemoDto[]>;

  /**
   * 根據 ID 取得特定 Demo 項目
   */
  findById(id: string): Promise<DemoDto | null>;

  /**
   * 根據類別篩選 Demo 項目
   */
  findByCategory(category: string): Promise<DemoDto[]>;

  /**
   * 搜尋 Demo 項目
   */
  search(keyword: string): Promise<DemoDto[]>;

  /**
   * 建立新的 Demo 項目
   */
  create(data: CreateDemoDto): Promise<DemoDto>;

  /**
   * 更新 Demo 項目
   */
  update(id: string, data: UpdateDemoDto): Promise<DemoDto | null>;

  /**
   * 刪除 Demo 項目
   */
  delete(id: string): Promise<boolean>;

  /**
   * 檢查 Demo 項目是否存在
   */
  exists(id: string): Promise<boolean>;

  /**
   * 取得總數量
   */
  count(): Promise<number>;

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
  }>;
}
