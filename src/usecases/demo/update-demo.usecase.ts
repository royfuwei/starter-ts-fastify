/**
 * 更新 Demo UseCase
 * 處理更新 Demo 項目的業務流程
 */

import { UseCase } from '../../common/decorators/service.decorator';
import { Inject } from '../../common/decorators/inject.decorator';
import { IDemoService } from '../../services/demo/demo.service.interface';
import { DemoDto } from '../../common/dto/demo/demo.dto';
import { UpdateDemoDto } from '../../common/dto/demo/update-demo.dto';
import { TYPES } from '../../common/container/types';

@UseCase(TYPES.UpdateDemoUseCase)
export class UpdateDemoUseCase {
  constructor(
    @Inject(TYPES.DemoService)
    private readonly demoService: IDemoService,
  ) {}

  /**
   * 執行更新 Demo 項目的業務流程
   */
  async execute(id: string, data: UpdateDemoDto): Promise<DemoDto> {
    try {
      // 記錄操作日誌
      console.log(`Updating demo item with ID: ${id}`, data);

      // 執行更新操作
      const updatedDemo = await this.demoService.update(id, data);

      // 記錄成功日誌
      console.log(`Demo item updated successfully: ${updatedDemo.name}`);

      return updatedDemo;
    } catch (error) {
      // 記錄錯誤日誌
      console.error(`Failed to update demo item with ID ${id}:`, error);
      throw error;
    }
  }
}
