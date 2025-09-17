/**
 * 刪除 Demo UseCase
 * 處理刪除 Demo 項目的業務流程
 */

import { UseCase } from '../../common/decorators/service.decorator';
import { Inject } from '../../common/decorators/inject.decorator';
import { IDemoService } from '../../services/demo/demo.service.interface';
import { TYPES } from '../../common/container/types';

@UseCase(TYPES.DeleteDemoUseCase)
export class DeleteDemoUseCase {
  constructor(
    @Inject(TYPES.DemoService)
    private readonly demoService: IDemoService,
  ) {}

  /**
   * 執行刪除 Demo 項目的業務流程
   */
  async execute(id: string): Promise<void> {
    try {
      // 記錄操作日誌
      console.log(`Deleting demo item with ID: ${id}`);

      // 執行刪除操作
      await this.demoService.delete(id);

      // 記錄成功日誌
      console.log(`Demo item deleted successfully with ID: ${id}`);
    } catch (error) {
      // 記錄錯誤日誌
      console.error(`Failed to delete demo item with ID ${id}:`, error);
      throw error;
    }
  }
}
